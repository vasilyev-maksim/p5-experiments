/* eslint-disable @typescript-eslint/no-explicit-any */
import type { P5CanvasInstance } from "@p5-wrapper/react";
import type {
  ISketchProps,
  ISketchFactory,
  SketchEvent,
  ExportRequestEvent,
  PresetChangeEvent,
  IPreset,
  IControls,
} from "../models";
import { TrackedValue } from "./TrackedValue";
import { MemoizedValue } from "./MemoizedValue";
import { MemoizedAnimatedValue } from "./MemoizedAnimatedValue";
import { MemoizedAnimatedArray } from "./MemoizedAnimatedArray";
import { MemoizedAnimatedColors } from "./MemoizedAnimatedColor";
import { ENV } from "@/env";

type PropNames<Controls extends IControls> = keyof ISketchProps<Controls>;
type TrackedProps<Controls extends IControls> = {
  [k in PropNames<Controls>]: TrackedValue<ISketchProps<Controls>[k]>;
};

export type CreateSketchArgs<Controls extends IControls> = {
  setup?: (api: Api<Controls>) => void;
  // Why a factory? it allows us define helper render functions in closure with `api` var available.
  draw: (api: Api<Controls>) => () => void;
  onPropsChange?: (api: Api<Controls>) => void;
  onPresetChange?: (preset: IPreset<Controls>) => void;
  canvasSizeHandlerOverride?: (
    width: TrackedValue<ISketchProps<Controls>["canvasWidth"]>,
    height: TrackedValue<ISketchProps<Controls>["canvasHeight"]>,
  ) => void;
  in3D?: boolean;
  id?: string;
};

type Api<Controls extends IControls> = {
  p: P5CanvasInstance<ISketchProps<Controls>>;
  getProp: <K extends PropNames<Controls>>(
    propName: K,
  ) => ISketchProps<Controls>[K];
  getTrackedProp: <K extends PropNames<Controls>>(
    propName: K,
  ) => TrackedValue<ISketchProps<Controls>[K]>;
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

export function createSketch<Controls extends IControls>(
  // Why a factory? It allows us to use closures to create shared vars.
  argsFactory: (api: Api<Controls>, id?: string) => CreateSketchArgs<Controls>,
): ISketchFactory<Controls> {
  return ({ initialProps, id }) =>
    (p) => {
      let time = 0,
        initialPropsUpdate = true,
        props: TrackedProps<Controls>,
        draw: ReturnType<CreateSketchArgs<Controls>["draw"]>;

      const memos: MemoizedValue<any, any>[] = [];
      const animations: Array<
        | MemoizedAnimatedValue<any>
        | MemoizedAnimatedArray<any>
        | MemoizedAnimatedColors<any>
      > = [];

      const api: Api<Controls> = {
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

      const args = argsFactory(api, id);

      p.setup = () => {
        p.createCanvas(
          initialProps.canvasWidth,
          initialProps.canvasHeight,
          args.in3D ? p.WEBGL : p.P2D,
        );
        if (initialProps.randomSeed !== undefined) {
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
              p.push();
              argDraw();
              p.pop();
              drawDevTools();
            }
          : argDraw;

        if (api.getProp("mode") === "static") {
          p.noLoop();
        }
      };

      p.draw = () => {
        runAnimations();
        draw();
        if (api.getProp("paused") === false) {
          time += api.getProp("timeDelta");
        }
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
            p.resizeCanvas(
              canvasWidth.value!,
              canvasHeight.value!,
              args.canvasSizeHandlerOverride !== undefined,
            );
            args.canvasSizeHandlerOverride?.(canvasWidth, canvasHeight);
          }

          if (api.getProp("mode") === "animated") {
            p.loop();
          } else {
            p.noLoop();
          }

          // for playback controls
          const timeShift = api.getTrackedProp("timeShift");
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
          args.onPropsChange?.(api);
        } else {
          initialPropsUpdate = false;
        }
      };

      function updateTrackedProps(newRawProps: ISketchProps<Controls>) {
        if (!props) {
          props = {} as any;
        }

        (Object.keys(newRawProps) as PropNames<Controls>[]).forEach((key) => {
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
          // to keep animations (related to params change) running even when sketch is paused,
          // we use `p.frameCount` instead of `time`
          animations.recalc(p.frameCount);
          if (force) {
            animations.forceAnimationsToEnd(time);
          }
        });
      }

      function runAnimations() {
        animations.forEach((animations) => {
          // to keep animations (related to params change) running even when sketch is paused,
          // we use `p.frameCount` instead of `time`
          animations.runAnimationStep(p.frameCount);
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
        (props.canvasWidth.value as number) = exportFileWidth;
        (props.canvasHeight.value as number) = exportFileHeight;
        updateMemos();
        // all animations forcibly set to end values to see correct final result
        updateAnimations(true);
        p.redraw();

        p.saveCanvas(exportFileName);

        const prevW = props["canvasWidth"].prevValue!,
          prevH = props["canvasHeight"].prevValue!;

        // revert to old values and draw what user saw initially
        p.resizeCanvas(prevW, prevH, true);
        props["canvasWidth"].value = prevW;
        props["canvasHeight"].value = prevH;
        updateMemos();
        updateAnimations(true);
        p.redraw();

        if (
          props["mode"].value === "animated" &&
          props["paused"].value === false
        ) {
          p.loop();
        }
      }

      function applyPreset(event: PresetChangeEvent) {
        // TODO: по сути я тут могу читать занечения параметров и не надо их передавать через пропсы, так будет единый канал общения с createSketch.
        time = event.preset?.startTime ?? time;
        if (event.preset.randomSeed !== undefined) {
          p.randomSeed(event.preset.randomSeed);
        }
        args.onPresetChange?.(event.preset);
      }
    };
}
