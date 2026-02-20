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
import {
  MemoizedAnimatedValue,
  type MemoizedAnimatedValueParams,
} from "./MemoizedAnimatedValue";
import { MemoizedAnimatedArray } from "./MemoizedAnimatedArray";
import { MemoizedAnimatedColors } from "./MemoizedAnimatedColor";
import { ENV } from "@/env";
import type { ExportRequestEvent, SketchEvent } from "./events";
import type { EventBus } from "./EventBus";
import { TrackedArray } from "./TrackedArray";
import type p5 from "p5";
import type { IValueProvider } from "./models";

type TrackedParams<C extends IControls> = {
  [k in keyof IParams<C>]: TrackedValue<IParams<C>[k]>;
};

export type CreateSketchArgs<Controls extends IControls> = {
  setup?: (api: Api<Controls>) => void;
  // Why a factory? it allows us define helper render functions in closure with `api` var available.
  draw: (api: Api<Controls>) => () => void;
  onPresetChange?: (preset: IPreset<Controls>) => void;
  canvasSizeHandlerOverride?: (size: TrackedValue<[number, number]>) => void;
  id?: string;
};

type Api<C extends IControls> = {
  p: P5CanvasInstance;
  getProp: <K extends ParamName<C>>(propName: K) => IParams<C>[K];
  getTrackedProp: <K extends ParamName<C>>(
    propName: K,
  ) => TrackedValue<IParams<C>[K]>;
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
    params: Omit<MemoizedAnimatedValueParams<ArgsType>, "timeProvider">,
  ) => IValueProvider<number>;
  createAnimatedArray: <ArgsType extends any[]>(
    ...args: ConstructorParameters<typeof MemoizedAnimatedArray<ArgsType>>
  ) => IValueProvider<number[]>;
  createAnimatedColors: <ArgsType extends any[]>(
    ...args: ConstructorParameters<typeof MemoizedAnimatedColors<ArgsType>>
  ) => IValueProvider<[p5.Color, p5.Color]>;
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
        draw: ReturnType<CreateSketchArgs<C>["draw"]>;

      const props = createTrackedProps(initData.params);
      const canvasWidth = new TrackedValue(initData.canvasWidth);
      const canvasHeight = new TrackedValue(initData.canvasHeight);
      const canvasSize = new MemoizedValue(
        (w, h): [number, number] => [w, h],
        [canvasWidth, canvasHeight],
        TrackedArray.defaultArrayComparator, // intentionally
      );

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
          // memos.push(memo);
          return memo;
        },
        createAnimatedValue: (params) => {
          const animation = new MemoizedAnimatedValue({
            ...params,
            timeProvider: () => time,
          });
          animations.push(animation);
          return {
            getValue: () => animation.getCurrentValue(time),
          };
        },
        createAnimatedArray: (...args) => {
          const animation = new MemoizedAnimatedArray(...args);
          animations.push(animation);
          return {
            getValue: () => animation.getCurrentValue(time),
          };
        },
        createAnimatedColors: (...args) => {
          const animation = new MemoizedAnimatedColors(...args);
          animations.push(animation);
          return {
            getValue: () => animation.getCurrentValue(time),
          };
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

        const args = argsFactory(api, id);

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

        canvasSize.onChanged.addCallback(([width, height]) => {
          p.resizeCanvas(
            width,
            height,
            args.canvasSizeHandlerOverride !== undefined,
          );
          args.canvasSizeHandlerOverride?.(canvasSize);
        });

        // events handling
        if (eventBus) {
          initEventBus(eventBus, args);
        }
      };

      p.draw = () => {
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
          });

          bus.on("playPauseEvent", (e) => {
            paused = e.paused;
          });
        }
      }

      function createTrackedProps(params: IParams<C>): TrackedParams<C> {
        return Object.fromEntries(
          Object.entries(params).map(([name, value]) => {
            const tracked = new TrackedValue(
              value,
              Array.isArray(value)
                ? TrackedArray.defaultArrayComparator
                : TrackedValue.defaultComparator,
            );
            return [name, tracked];
          }),
        ) as TrackedParams<C>;
      }

      function updateTrackedProps(newRawProps: IParams<C>) {
        (Object.keys(newRawProps) as ParamName<C>[]).forEach((key) => {
          props[key].value = newRawProps[key]!;
        });
      }

      function updateTrackedProp(
        name: ParamName<C>,
        value: IParams<C>[typeof name],
      ) {
        props[name].value = value;
      }

      function updateMemos(
        cb?: () => void,
        forceAnimationsToEnd: boolean = false,
      ) {
        cb?.();

        animations.forEach((animations) => {
          if (forceAnimationsToEnd) {
            animations.forceAnimationsToEnd(time);
          }
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
