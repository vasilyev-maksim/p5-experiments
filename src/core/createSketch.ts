/* eslint-disable @typescript-eslint/no-explicit-any */
import type { P5CanvasInstance } from "@p5-wrapper/react";
import type {
  ISketchProps,
  ISketchFactory,
  SketchEvent,
  ExportRequestEvent,
  PresetChangeEvent,
  IPreset,
} from "../models";
import { TrackedValue } from "./TrackedValue";
import { MemoizedValue } from "./MemoizedValue";
import { MemoizedAnimatedValue } from "./MemoizedAnimatedValue";
import { MemoizedAnimatedArray } from "./MemoizedAnimatedArray";
import { MemoizedAnimatedColors } from "./MemoizedAnimatedColor";
import { ENV } from "@/env";

type PropNames<Params extends string> = keyof ISketchProps<Params>;
type TrackedProps<Params extends string> = {
  [k in PropNames<Params>]: TrackedValue<ISketchProps<Params>[k]>;
};

export type CreateSketchArgs<Params extends string> = {
  setup?: (api: Api<Params>) => void;
  // Why a factory? it allows us define helper render functions in closure with `api` var available.
  draw: (api: Api<Params>) => () => void;
  onPropsChanged?: (api: Api<Params>) => void;
  onPresetChange?: (preset: IPreset) => void;
  in3D?: boolean;
};

type Api<Params extends string> = {
  p: P5CanvasInstance<ISketchProps<Params>>;
  getProp: <K extends PropNames<Params>>(
    propName: K,
  ) => ISketchProps<Params>[K];
  getTrackedProp: <K extends PropNames<Params>>(
    propName: K,
  ) => TrackedValue<ISketchProps<Params>[K]>;
  getTime: () => number;
  createMemo: <ArgsType extends any[], ValueType>(
    ...args: ConstructorParameters<typeof MemoizedValue<ArgsType, ValueType>>
  ) => MemoizedValue<ArgsType, ValueType>;
  createAnimatedValue: <ArgsType extends any[]>(
    ...args: ConstructorParameters<typeof MemoizedAnimatedValue<ArgsType>>
  ) => MemoizedAnimatedValue<ArgsType>;
  createAnimatedArray: <ArgsType extends any[]>(
    ...args: ConstructorParameters<typeof MemoizedAnimatedArray<ArgsType>>
  ) => MemoizedAnimatedArray<ArgsType>;
  createAnimatedColors: <ArgsType extends any[]>(
    ...args: ConstructorParameters<typeof MemoizedAnimatedColors<ArgsType>>
  ) => MemoizedAnimatedColors<ArgsType>;
};

export function createSketch<Params extends string>(
  // Why a factory? it allows us to use closures to create shared vars.
  // Note that `api` is not available in the topmost scope to avoid issues with p5 instance init order.
  argsFactory: (api: Api<Params>) => CreateSketchArgs<Params>,
): ISketchFactory<Params> {
  return ({ initialProps }) =>
    (p) => {
      let time = 0,
        drawsCount = 0,
        initialPropsUpdate = true,
        props: TrackedProps<Params>,
        draw: ReturnType<CreateSketchArgs<Params>["draw"]>;

      const memos: MemoizedValue<any, any>[] = [];
      const animations: Array<
        | MemoizedAnimatedValue<any>
        | MemoizedAnimatedArray<any>
        | MemoizedAnimatedColors<any>
      > = [];

      const api: Api<Params> = {
        p,
        getTrackedProp: (k) => {
          return props[k];
        },
        getProp: (k) => {
          return api.getTrackedProp(k).value!;
        },
        getTime: () => time,
        createMemo: (...args) => {
          const memo = new MemoizedValue(...args);
          memos.push(memo);
          return memo;
        },
        createAnimatedValue: (...args) => {
          const animation = new MemoizedAnimatedValue(...args);
          animations.push(animation);
          return animation;
        },
        createAnimatedArray: (...args) => {
          const animation = new MemoizedAnimatedArray(...args);
          animations.push(animation);
          return animation;
        },
        createAnimatedColors: (...args) => {
          const animation = new MemoizedAnimatedColors(...args);
          animations.push(animation);
          return animation;
        },
      };

      // initialize tracked props immediately (even before setups), don't move this line
      updateTrackedProps(initialProps);

      const args = argsFactory(api);

      p.setup = () => {
        p.createCanvas(
          initialProps.canvasWidth,
          initialProps.canvasHeight,
          args.in3D ? p.WEBGL : p.P2D,
        );
        if (initialProps.randomSeed !== undefined){
          p.randomSeed(initialProps.randomSeed);
          p.noiseSeed(initialProps.randomSeed);
        }

        // set time using initial time shift (for pretty previews)
        time = api.getProp("timeShift") ?? 0;

        updateMemos();
        updateAnimations();

        args.setup?.(api);

        // initialize draw func passing p5 instance (`api.p`),
        // which is guaranteed to be initialized properly at this moment
        const argDraw = args.draw(api);
        draw = ENV.devTools
          ? () => {
              argDraw();
              drawDevTools();
            }
          : argDraw;

        if (api.getProp("playing") === false) {
          p.noLoop();
        }
      };

      p.draw = () => {
        runAnimations();
        draw();
        time += api.getProp("timeDelta");
        drawsCount++;
      };

      p.updateWithProps = (newRawProps) => {
        // updateWithProps's first call happens before `p.setup` call
        if (!initialPropsUpdate) {
          updateTrackedProps(newRawProps);
          updateMemos();
          updateAnimations();

          // respond to canvas size changes
          const canvasHeight = api.getTrackedProp("canvasHeight");
          const canvasWidth = api.getTrackedProp("canvasWidth");
          if (canvasHeight.hasChanged || canvasWidth.hasChanged) {
            // `p.resizeCanvas` calls `p.draw` automatically, so we disable it by passing `true` as last arg.
            // The reason is that `p.draw` implies time increase, which is unintentional, we just want to redraw.
            p.resizeCanvas(canvasWidth.value!, canvasHeight.value!, true);
          }

          // play/pause
          const playing = api.getProp("playing");
          if (playing) {
            p.loop();
          } else {
            p.noLoop();
          }

          const timeShift = api.getTrackedProp("timeShift");
          // for playback controls
          if (timeShift.hasChanged) {
            const delta = timeShift.value - (timeShift.prevValue ?? 0);
            time += delta;
          }

          // handle incoming event (export, preset change, etc.)
          const event = api.getTrackedProp("event");
          if (event.hasChanged) {
            reactToEvent(event.value);
          }

          // run user defined code after all important changes were applied (above)
          args.onPropsChanged?.(api);

          // manually redraw PAUSED sketch to see changed params take effect (if there are any)
          if (!playing) {
            draw();
          }
        } else {
          initialPropsUpdate = false;
        }
      };

      function updateTrackedProps(newRawProps: ISketchProps<Params>) {
        if (!props) {
          props = {} as any;
        }

        (Object.keys(newRawProps) as PropNames<Params>[]).forEach((key) => {
          if (props[key] === undefined) {
            props[key] = new TrackedValue(undefined) as any;
          }
          props[key].value = newRawProps[key];
        });
      }

      function updateMemos() {
        memos.forEach((memo) => {
          memo.recalc();
        });
      }

      function updateAnimations(force: boolean = false) {
        animations.forEach((animations) => {
          animations.recalc(drawsCount);
          if (force) {
            animations.forceAnimationsToEnd(time);
          }
        });
      }

      function runAnimations() {
        animations.forEach((animations) => {
          animations.runAnimationStep(drawsCount);
        });
      }

      function drawDevTools() {
        p.push();
        {
          p.fill("white");
          p.text(time, 10, 10, 20, 20);
          p.stroke("white");
          p.strokeWeight(1);
          p.noFill();

          p.translate(p.width / 2, p.height / 2);
          const size = Math.max(
            p.width - p.mouseX * 2,
            p.height - p.mouseY * 2,
          );
          const tl = [-size / 2, -size / 2] as const;
          p.rect(...tl, size, size);
          p.fill("white");

          p.textSize(20);
          p.strokeWeight(1);

          p.text(size, ...tl);
        }
        p.pop();
      }

      function reactToEvent(event: SketchEvent) {
        switch (event.type) {
          case "export":
            exportCanvas(event);
            return;
          case "presetChange":
            applyPreset(event);
            return;
        }
      }

      function exportCanvas({
        exportFileName,
        exportFileWidth,
        exportFileHeight,
      }: ExportRequestEvent) {
        // manually stop the draw loop
        p.noLoop();

        // draw the same frame but for wallpaper resolution
        p.resizeCanvas(exportFileWidth, exportFileHeight, true);
        // update related tracked props, memos and animations
        props["canvasWidth"].value = exportFileWidth;
        props["canvasHeight"].value = exportFileHeight;
        updateMemos();
        // all animations forcibly set to end values to see correct final result
        updateAnimations(true);
        draw();

        p.saveCanvas(exportFileName);

        const prevW = props["canvasWidth"].prevValue!,
          prevH = props["canvasHeight"].prevValue!;

        // revert to old values and draw what user saw initially
        p.resizeCanvas(prevW, prevH, true);
        props["canvasWidth"].value = prevW;
        props["canvasHeight"].value = prevH;
        updateMemos();
        updateAnimations(true);
        draw();

        if (props["playing"].value) {
          p.loop();
        }
      }

      function applyPreset(event: PresetChangeEvent) {
        time = event.preset?.startTime ?? time;
        args.onPresetChange?.(event.preset);
      }
    };
}
