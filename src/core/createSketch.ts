/* eslint-disable @typescript-eslint/no-explicit-any */
import type { P5CanvasInstance } from "@p5-wrapper/react";
import type {
  ISketchFactory,
  IPreset,
  IControls,
  IParams,
  ParamName,
} from "../models";
import { TrackedValue } from "./TrackedValue";
import { MemoizedValue } from "./MemoizedValue";
import { MemoizedAnimatedValue } from "./MemoizedAnimatedValue";
import { MemoizedAnimatedArray } from "./MemoizedAnimatedArray";
import { MemoizedAnimatedColors } from "./MemoizedAnimatedColor";
import { ENV } from "@/env";
import type { ExportRequestEvent, SketchEvent } from "./events";
import type { EventBus } from "./EventBus";

export type CreateSketchArgs<Controls extends IControls> = {
  setup?: (api: Api<Controls>) => void;
  // Why a factory? it allows us define helper render functions in closure with `api` var available.
  draw: (api: Api<Controls>) => () => void;
  onPresetChange?: (preset: IPreset<Controls>) => void;
  canvasSizeHandlerOverride?: (
    width: TrackedValue<number>,
    height: TrackedValue<number>,
  ) => void;
  id?: string;
};

type Api<Controls extends IControls> = {
  p: P5CanvasInstance;
  getProp: <K extends ParamName<Controls>>(propName: K) => IParams<Controls>[K];
  getTrackedProp: <K extends ParamName<Controls>>(
    propName: K,
  ) => TrackedValue<IParams<Controls>[K]>;
  getTime: () => number;
  getCanvasSize: () => {
    canvasWidth: number;
    canvasHeight: number;
    trackedCanvasWidth: TrackedValue<number>;
    trackedCanvasHeight: TrackedValue<number>;
  };
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

export function createSketch<C extends IControls>(
  // Why a factory? It allows us to use closures to create shared vars.
  argsFactory: (api: Api<C>, id?: string) => CreateSketchArgs<C>,
  { in3D }: { in3D: boolean } = { in3D: false },
): ISketchFactory<C> {
  return ({ initData, id, eventBus }) =>
    (p) => {
      let time = 0,
        paused = initData.paused,
        timeDelta = initData.timeDelta ?? 1,
        props: {
          [k in keyof IParams<C>]: TrackedValue<IParams<C>[k]>;
        },
        draw: ReturnType<CreateSketchArgs<C>["draw"]>;

      const memos: MemoizedValue<any, any>[] = [];
      const canvasWidth = new TrackedValue(initData.canvasWidth);
      const canvasHeight = new TrackedValue(initData.canvasHeight);
      const animations: Array<
        | MemoizedAnimatedValue<any>
        | MemoizedAnimatedArray<any>
        | MemoizedAnimatedColors<any>
      > = [];

      const api: Api<C> = {
        p,
        getCanvasSize: () => {
          return {
            canvasWidth: canvasWidth.value,
            trackedCanvasWidth: canvasWidth,
            canvasHeight: canvasHeight.value,
            trackedCanvasHeight: canvasHeight,
          };
        },
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
      // TODO: try to move this line inside p.setup

      p.setup = () => {
        p.createCanvas(
          initData.canvasWidth,
          initData.canvasHeight,
          in3D ? p.WEBGL : p.P2D,
        );

        if (initData.randomSeed !== undefined) {
          p.randomSeed(initData.randomSeed);
          p.noiseSeed(initData.randomSeed);
        }

        if (initData.mode === "static") {
          p.noLoop();
        }

        // set start time for pretty preview images
        time = initData.startTime ?? 0;

        updateTrackedProps(initData.params);

        const args = argsFactory(api, id);

        updateMemos();

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

        // events handling
        if (eventBus) {
          initEventBus(eventBus, args);
        }
      };

      p.draw = () => {
        runAnimations();
        draw();
        if (paused === false) {
          time += timeDelta;
        }
      };

      function initEventBus(
        bus: EventBus<SketchEvent<C>>,
        args: CreateSketchArgs<C>,
      ) {
        if (bus) {
          bus.on("export", (e) => {
            exportCanvas(e);
          });

          bus.on("applyPreset", ({ preset }) => {
            if (preset.startTime !== undefined) {
              time = preset.startTime;
            }

            if (preset.randomSeed !== undefined) {
              p.randomSeed(preset.randomSeed);
            }

            if (preset.timeDelta !== undefined) {
              timeDelta = preset.timeDelta;
            }

            updateMemos(() => updateTrackedProps(preset.params));
            args.onPresetChange?.(preset);
          });

          bus.on("paramChange", (e) => {
            updateMemos(() => updateTrackedProp(e.paramName, e.paramValue));
          });

          bus.on("paramsChange", (e) => {
            updateMemos(() => updateTrackedProps(e.params));
          });

          bus.on("modeChange", (e) => {
            if (e.mode === "animated") {
              p.loop();
            } else {
              p.noLoop();
            }
          });

          bus.on("timeDeltaChange", (e) => {
            timeDelta = e.timeDelta;
          });

          bus.on("timeTravelEvent", (e) => {
            time += e.timeShift;
          });

          bus.on("canvasSizeChangeEvent", (e) => {
            updateMemos(() => {
              canvasHeight.value = e.canvasHeight;
              canvasWidth.value = e.canvasWidth;
            });

            if (canvasHeight.hasChanged || canvasWidth.hasChanged) {
              p.resizeCanvas(
                canvasWidth.value!,
                canvasHeight.value!,
                args.canvasSizeHandlerOverride !== undefined,
              );
              args.canvasSizeHandlerOverride?.(canvasWidth, canvasHeight);
            }
          });

          bus.on("playPauseEvent", (e) => {
            paused = e.paused;
          });
        }
      }

      function updateTrackedProps(newRawProps: IParams<C>) {
        // TODO: get rid of init part
        if (!props) {
          props = {} as any;
        }

        // TODO: get rid of init part
        (Object.keys(newRawProps) as ParamName<C>[]).forEach((key) => {
          if (props[key] === undefined) {
            props[key] = new TrackedValue(undefined) as any;
          }
          props[key].value = newRawProps[key]!;
        });
      }

      function updateTrackedProp(
        name: ParamName<C>,
        value: IParams<C>[typeof name],
      ) {
        // TODO: get rid of init part
        if (props[name] === undefined) {
          props[name] = new TrackedValue(undefined) as any;
        }
        props[name].value = value;
      }

      function updateMemos(
        cb?: () => void,
        forceAnimationsToEnd: boolean = false,
      ) {
        cb?.();

        memos.forEach((memo) => {
          memo.recalc();
        });

        animations.forEach((animations) => {
          // to keep animations (related to params change) running even when sketch is paused,
          // we use `p.frameCount` instead of `time`
          animations.recalc(p.frameCount);
          if (forceAnimationsToEnd) {
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

      function exportCanvas({
        exportFileName,
        exportFileWidth,
        exportFileHeight,
      }: ExportRequestEvent) {
        const wasLooping = p.isLooping();
        // manually stop the draw loop
        p.noLoop();

        // draw the same frame but for wallpaper resolution
        p.resizeCanvas(exportFileWidth, exportFileHeight, true);
        // update related tracked props, memos and animations
        updateMemos(() => {
          canvasWidth.value = exportFileWidth;
          canvasHeight.value = exportFileHeight;
          // all animations forcibly set to end values to see correct final result
        }, true);
        p.redraw();

        p.saveCanvas(exportFileName);

        const prevW = canvasWidth.prevValue!,
          prevH = canvasHeight.prevValue!;

        // revert to old values and draw what user saw initially
        p.resizeCanvas(prevW, prevH, true);
        updateMemos(() => {
          canvasWidth.value = prevW;
          canvasHeight.value = prevH;
        }, true);
        p.redraw();

        if (wasLooping) {
          p.loop();
        }
      }
    };
}
