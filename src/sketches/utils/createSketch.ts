/* eslint-disable @typescript-eslint/no-explicit-any */
import type { P5CanvasInstance } from "@p5-wrapper/react";
import type { ISketchProps, ISketchFactory } from "../../models";
import { TrackedValue } from "./TrackedValue";
import { MemoizedValue } from "./MemoizedValue";
import type { MemoizedAnimatedValue } from "./MemoizedAnimatedValue";

type Props<Param extends string> = keyof ISketchProps<Param>;
type TrackedProps<Param extends string> = {
  [k in Props<Param>]: TrackedValue<ISketchProps<Param>[k]>;
};

type Api<
  Param extends string,
  Memos extends MemosConfig,
  Animations extends AnimationsConfig,
> = {
  p: P5CanvasInstance<ISketchProps<Param>>;
  getProp: <K extends Props<Param> | keyof Memos | keyof Animations>(
    propName: K,
  ) => K extends Props<Param>
    ? ISketchProps<Param>[K]
    : K extends keyof Memos
      ? Memos[K]
      : Animations[K];
  getTrackedProp: <K extends Props<Param> | keyof Memos | keyof Animations>(
    propName: K,
  ) => K extends Props<Param>
    ? TrackedValue<ISketchProps<Param>[K]>
    : K extends keyof Memos
      ? TrackedValue<Memos[K]>
      : TrackedValue<Animations[K]>;
  getTime: () => number;
};

type MemosConfig = Record<string, any>;
type AnimationsConfig = Record<string, any>;

type MemoizedDict<T extends MemosConfig> = {
  [k in keyof T]: MemoizedValue<any, T[k]>;
};
type AnimationsDict<T extends AnimationsConfig> = {
  [k in keyof T]: MemoizedAnimatedValue<any, T[k]>;
};

export type CreateSketchArgs<
  Param extends string,
  Memos extends MemosConfig,
  Animations extends AnimationsConfig,
> = {
  setup?: (api: Api<Param, Memos, Animations>) => void;
  // Why a factory? it allows us define helper render functions in closure with `api` var available.
  drawFactory: (api: Api<Param, Memos, Animations>) => () => void;
  onPropsChanged?: (api: Api<Param, Memos, Animations>) => void;
  memosFactory?: (api: Api<Param, Memos, Animations>) => MemoizedDict<Memos>;
  animationsFactory?: (
    api: Api<Param, Memos, Animations>,
  ) => AnimationsDict<Animations>;
};

export function createSketch<
  Param extends string,
  Memos extends MemosConfig = never,
  Animations extends AnimationsConfig = never,
>(
  // Why a factory? it allows us to use closures to create shared vars.
  // Note that `api` is not available in the topmost scope to avoid issues with p5 instance init order.
  argsFactory: () => CreateSketchArgs<Param, Memos, Animations>,
): ISketchFactory<Param> {
  return (initialProps) => (p) => {
    let time = 0,
      initialPropsUpdate = true,
      props: TrackedProps<Param>,
      draw: ReturnType<
        CreateSketchArgs<Param, Memos, Animations>["drawFactory"]
      >,
      memos: MemoizedDict<Memos> | undefined,
      animations: AnimationsDict<AnimationsConfig> | undefined;

    const api: Api<Param, Memos, Animations> = {
      p,
      getProp: (k) => {
        return api.getTrackedProp(k).value as any;
      },
      getTrackedProp: (k) => {
        if (animations && Object.hasOwn(animations, k)) {
          return animations![k] as any;
        } else if (memos && Object.hasOwn(memos, k)) {
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

    const _updateAnimations = () => {
      if (animations) {
        Object.values(animations).forEach((animation) => {
          animation.recalc(time);
        });
      }
    };

    const _runAnimations = () => {
      if (animations) {
        Object.values(animations).forEach((animation) => {
          animation.runAnimationStep(time);
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
      animations = args.animationsFactory?.(api);
      //init draw func with p5 instance (as part of `api`) guaranteed to be initialized properly
      draw = args.drawFactory(api);
    };

    p.draw = () => {
      _runAnimations();
      draw();
      time += api.getProp("timeDelta");
    };

    p.updateWithProps = (newRawProps) => {
      // updateWithProps's first call happens before `p.setup` call
      if (!initialPropsUpdate) {
        _updateTrackedProps(newRawProps);
        _updateMemos();
        _updateAnimations();

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
