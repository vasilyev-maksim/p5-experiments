/* eslint-disable @typescript-eslint/no-explicit-any */
import type { P5CanvasInstance } from "@p5-wrapper/react";
import type { ISketchProps, ISketchFactory } from "../../models";
import { TrackedValue } from "../../utils/TrackedValue";
import { MemoizedValue } from "../../utils/MemoizedValue";

type Props<Param extends string> = keyof ISketchProps<Param>;
type TrackedProps<Param extends string> = {
  [k in Props<Param>]: TrackedValue<ISketchProps<Param>[k]>;
};

type Api<Param extends string, Memos extends MemosConfig> = {
  p: P5CanvasInstance<ISketchProps<Param>>;
  getProp: <K extends Props<Param> | keyof Memos>(
    propName: K,
  ) => K extends Props<Param> ? ISketchProps<Param>[K] : Memos[K];
  getTrackedProp: <K extends Props<Param> | keyof Memos>(
    propName: K,
  ) => K extends Props<Param>
    ? TrackedValue<ISketchProps<Param>[K]>
    : TrackedValue<Memos[K]>;
  getTime: () => number;
  // getMemo: <K extends keyof Memos>(memoKey: K) => Memos[K] | undefined;
};

type MemosConfig = Record<string, any>;

type MemoizedDict<T extends MemosConfig> = {
  [k in keyof T]: MemoizedValue<any, T[k]>;
};

export type CreateSketchArgs<
  Param extends string,
  Memos extends MemosConfig,
> = {
  setup?: (api: Api<Param, Memos>) => void;
  // Why a factory? it allows us define helper render functions in closure with `api` available.
  drawFactory: (api: Api<Param, Memos>) => () => void;
  onPropsChanged?: (api: Api<Param, Memos>) => void;
  memosFactory?: (api: Api<Param, Memos>) => MemoizedDict<Memos>;
};

export function createSketch<
  Param extends string,
  Memos extends MemosConfig = never,
>(
  // Why a factory? it allows us to use closures to create shared vars.
  // Note that `api` is not available in the topmost scope to avoid issues with p5 instance init order.
  argsFactory: () => CreateSketchArgs<Param, Memos>,
): ISketchFactory<Param> {
  return (initialProps) => (p) => {
    let time = 0,
      initialPropsUpdate = true,
      props: TrackedProps<Param>,
      draw: ReturnType<CreateSketchArgs<Param, Memos>["drawFactory"]>,
      memos: MemoizedDict<Memos> | undefined;

    const api: Api<Param, Memos> = {
      p,
      getProp: (k) => {
        return api.getTrackedProp(k).value as any;
      },
      getTrackedProp: (k) => {
        if (memos && Object.hasOwn(memos, k)) {
          return memos![k] as any;
        } else {
          return props[k as Props<Param>];
        }
      },
      getTime: () => time,
    };
    const args = argsFactory();

    const _updateTrackedProps = (newRawProps: ISketchProps<Param>) => {
      if (!props) {
        props = {} as any;
      }

      (Object.keys(newRawProps) as Props<Param>[]).forEach((key) => {
        if (props[key] === undefined) {
          props[key] = new TrackedValue(newRawProps[key] as any) as any;
        } else {
          props[key].value = newRawProps[key];
        }
      });
    };

    const _updateMemos = () => {
      if (memos) {
        Object.values(memos).forEach((memo) => {
          memo.recalc();
        });
      }
    };

    _updateTrackedProps(initialProps); // initialize trackable props immediately, don't move this line

    p.setup = () => {
      p.createCanvas(initialProps.canvasWidth, initialProps.canvasHeight);
      p.randomSeed(initialProps.randomSeed);
      p.noiseSeed(initialProps.randomSeed);

      // set time using initial time shift (for pretty previews)
      time = api.getProp("timeShift") ?? 0;

      if (api.getProp("playing")) {
        p.loop();
      } else {
        p.noLoop();
      }

      args.setup?.(api);
      memos = args.memosFactory?.(api);

      // init draw func with p5 instance (as part of `api`) guaranteed to be initialized properly
      draw = args.drawFactory(api);
    };

    p.draw = () => {
      draw();
      time += api.getProp("timeDelta");
    };

    p.updateWithProps = (newRawProps) => {
      // updateWithProps's first call happens before `p.setup` call
      if (!initialPropsUpdate) {
        _updateTrackedProps(newRawProps);
        _updateMemos();

        args.onPropsChanged?.(api);

        const playing = api.getProp("playing");
        const timeShift = api.getTrackedProp("timeShift");

        // for playback controls
        if (timeShift.hasChanged && timeShift.value !== undefined) {
          const delta = timeShift.value - (timeShift.prevValue ?? 0);
          time += delta;
        }

        // respond to canvas size changes
        const canvasHeight = api.getTrackedProp("canvasHeight");
        const canvasWidth = api.getTrackedProp("canvasWidth");

        if (canvasHeight.hasChanged || canvasWidth.hasChanged) {
          // `p.resizeCanvas` calls `p.draw` automatically, so we disable it by passing `true` as last arg.
          // The reason is that `p.draw` implies time increase, which is unintentional, we just want to redraw.
          p.resizeCanvas(canvasWidth.value!, canvasHeight.value!, true);
        }

        // play/pause
        if (playing) {
          p.loop();
        } else {
          p.noLoop();
        }

        // we need to redraw PAUSED sketch to see new params applied
        if (!playing) {
          draw();
        }
      } else {
        initialPropsUpdate = false;
      }
    };
  };
}
