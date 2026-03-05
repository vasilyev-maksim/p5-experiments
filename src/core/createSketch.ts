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
import { MemoizedValue, type MemoizedValueParams } from "./MemoizedValue";
import {
  MemoizedAnimatedValue,
  type MemoizedAnimatedValueParams,
} from "./MemoizedAnimatedValue";
import {
  MemoizedAnimatedArray,
  type MemoizedAnimatedArrayParams,
} from "./MemoizedAnimatedArray";
import {
  MemoizedAnimatedColors,
  type MemoizedAnimatedColorsParams,
} from "./MemoizedAnimatedColors";
import { ENV } from "@/env";
import type { ExportRequestEvent, SketchEvent } from "./events";
import type { EventBus } from "./EventBus";
import { TrackedArray } from "./TrackedArray";
import type p5 from "p5";
import type { ITrackedValueProvider, IValueProvider, TimeProvider } from "./models";

type TrackedParams<C extends IControls> = {
  [k in keyof IParams<C>]: TrackedValue<IParams<C>[k]>;
};

export type CreateSketchArgs<Controls extends IControls> = {
  setup?: (api: Api<Controls>) => void;
  // Why a factory? it allows us define helper render functions in closure with `api` var available.
  draw: (api: Api<Controls>) => () => void;
  onPresetChange?: (preset: IPreset<Controls>) => void;
  canvasSizeHandlerOverride?: (size: [number, number]) => void;
  id?: string;
};

type Api<C extends IControls> = {
  p: P5CanvasInstance;
  getParam: <K extends ParamName<C>>(propName: K) => IParams<C>[K];
  getTrackedParam: <K extends ParamName<C>>(
    propName: K,
  ) => TrackedValue<IParams<C>[K]>;
  getTime: TimeProvider;
  getCanvasSize: () => {
    canvasWidth: number;
    canvasHeight: number;
    trackedCanvasWidth: TrackedValue<number>;
    trackedCanvasHeight: TrackedValue<number>;
  };
  createMemo: <ArgsType extends any[], ValueType>(
    params: MemoizedValueParams<ArgsType, ValueType>,
  ) => IValueProvider<ValueType> & ITrackedValueProvider<ValueType>;
  createAnimatedValue: <ArgsType extends any[]>(
    params: Omit<MemoizedAnimatedValueParams<ArgsType>, "timeProvider">,
  ) => IValueProvider<number>;
  createAnimatedArray: <ArgsType extends any[]>(
    params: Omit<MemoizedAnimatedArrayParams<ArgsType>, "timeProvider">,
  ) => IValueProvider<number[]>;
  createAnimatedColors: <ArgsType extends any[]>(
    params: Omit<MemoizedAnimatedColorsParams<ArgsType>, "timeProvider">,
  ) => IValueProvider<p5.Color[]>;
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
        draw: ReturnType<CreateSketchArgs<C>["draw"]>,
        isExporting = false;

      const params = createTrackedParams(initData.params),
        canvasWidth = new TrackedValue<number>(),
        canvasHeight = new TrackedValue<number>(),
        memos: MemoizedValue<any, any>[] = [];

      canvasHeight.setValue(initData.canvasHeight);
      canvasWidth.setValue(initData.canvasWidth);

      const api: Api<C> = {
        p,
        getCanvasSize: () => {
          return {
            canvasWidth: canvasWidth.getValue(),
            trackedCanvasWidth: canvasWidth,
            canvasHeight: canvasHeight.getValue(),
            trackedCanvasHeight: canvasHeight,
          };
        },
        getTrackedParam: (k) => {
          return params[k];
        },
        getParam: (k) => {
          return api.getTrackedParam(k).getValue();
        },
        getTime: () => time,
        createMemo: (params) => {
          const memo = new MemoizedValue(params);
          memos.push(memo);

          return {
            getValue: () => memo.getValue(),
            getTrackedValue: () => memo,
          };
        },
        createAnimatedValue: (params) => {
          const animation = new MemoizedAnimatedValue({
            ...params,
            timeProvider: () => p.frameCount,
          });
          memos.push(animation);

          return {
            getValue: () =>
              // while exporting we wan't all animations to run instantly
              isExporting
                ? animation.getAnimatedValue().getEndValue()
                : animation.getAnimatedValue().getCurrentValue(p.frameCount),
          };
        },
        createAnimatedArray: (params) => {
          const animation = new MemoizedAnimatedArray({
            ...params,
            timeProvider: () => p.frameCount,
          });
          memos.push(animation);

          return {
            getValue: () =>
              // while exporting we wan't all animations to run instantly
              isExporting
                ? animation.getAnimatedArray().getEndValue()
                : animation.getAnimatedArray().getCurrentValue(p.frameCount),
          };
        },
        createAnimatedColors: (params) => {
          const animation = new MemoizedAnimatedColors({
            ...params,
            timeProvider: () => p.frameCount,
          });
          memos.push(animation);

          return {
            getValue: () =>
              // while exporting we wan't all animations to run instantly
              isExporting
                ? animation.getEndValue()
                : animation.getCurrentValue(p.frameCount),
          };
        },
      };

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
        recalcMemos();

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
          bus.on("modeChange", (e) => {
            if (e.mode === "animated") {
              p.loop();
            } else {
              p.noLoop();
            }
          });

          bus.on("playPauseEvent", (e) => {
            paused = e.paused;
          });

          bus.on("timeDeltaChange", (e) => {
            timeDelta = e.timeDelta;
          });

          bus.on("timeTravelEvent", (e) => {
            time += e.timeShift;
          });

          bus.on("paramChange", (e) => {
            updateTrackedParam(e.paramName, e.paramValue);
          });

          bus.on("paramsChange", (e) => {
            updateTrackedParams(e.params);
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

            updateTrackedParams(preset.params);
            args.onPresetChange?.(preset);
          });

          bus.on(
            "canvasSizeChangeEvent",
            ({ canvasHeight: h, canvasWidth: w }) => {
              setParams(() => {
                canvasHeight.setValue(h);
                canvasWidth.setValue(w);
              });

              p.resizeCanvas(
                w,
                h,
                args.canvasSizeHandlerOverride !== undefined,
              );
              args.canvasSizeHandlerOverride?.([w, h]);
            },
          );

          bus.on("export", (e) => {
            exportCanvas(e);
          });
        }
      }

      function recalcMemos() {
        memos.forEach((memo) => memo.recalc());
      }

      function notChangedEverything() {
        canvasHeight.notChanged();
        canvasWidth.notChanged();
        Object.values(params).forEach((prop: TrackedValue<any>) =>
          prop.notChanged(),
        );
        memos.forEach((memo) => memo.notChanged());
      }

      function setParams(cb: () => void) {
        notChangedEverything();
        cb();
        recalcMemos();
      }

      function createTrackedParams(params: IParams<C>): TrackedParams<C> {
        return Object.fromEntries(
          Object.entries(params).map(([name, value]) => {
            const tracked = new TrackedValue<any>(
              Array.isArray(value)
                ? TrackedArray.defaultArrayComparator
                : TrackedValue.defaultComparator,
            );
            tracked.setValue(value);
            return [name, tracked];
          }),
        ) as TrackedParams<C>;
      }

      function updateTrackedParams(newRawParams: IParams<C>) {
        setParams(() => {
          (Object.keys(newRawParams) as ParamName<C>[]).forEach((key) => {
            params[key].setValue(newRawParams[key]!);
          });
        });
      }

      function updateTrackedParam(
        name: ParamName<C>,
        value: IParams<C>[typeof name],
      ) {
        setParams(() => {
          params[name].setValue(value);
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
        const prevW = canvasWidth.getValue(),
          prevH = canvasHeight.getValue();
        // manually stop the draw loop for export
        p.noLoop();

        // draw the same frame but for wallpaper resolution
        p.resizeCanvas(exportFileWidth, exportFileHeight, true);
        setParams(() => {
          canvasWidth.setValue(exportFileWidth);
          canvasHeight.setValue(exportFileHeight);
        });
        isExporting = true;
        p.redraw();

        p.saveCanvas(exportFileName);

        // revert to old values and draw what user saw initially

        p.resizeCanvas(prevW, prevH, true);
        setParams(() => {
          canvasWidth.setValue(prevW);
          canvasHeight.setValue(prevH);
        });
        p.redraw();
        isExporting = false;

        if (wasLooping) {
          p.loop();
        }
      }
    };
}
