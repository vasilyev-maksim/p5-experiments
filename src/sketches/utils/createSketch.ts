/* eslint-disable @typescript-eslint/no-explicit-any */
import type { P5CanvasInstance } from "@p5-wrapper/react";
import type { ISketchProps, ISketchFactory } from "../../models";
import { TrackedValue } from "./TrackedValue";
import { MemoizedValue } from "./MemoizedValue";
import { MemoizedAnimatedValue } from "./MemoizedAnimatedValue";

type PropNames<Params extends string> = keyof ISketchProps<Params>;
type TrackedProps<Params extends string> = {
  [k in PropNames<Params>]: TrackedValue<ISketchProps<Params>[k]>;
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
  createAnimation: <ArgsType extends any[], ValueType extends number>(
    ...args: ConstructorParameters<
      typeof MemoizedAnimatedValue<ArgsType, ValueType>
    >
  ) => MemoizedAnimatedValue<ArgsType, ValueType>;
};

export type CreateSketchArgs<Params extends string> = {
  setup?: (api: Api<Params>) => void;
  // Why a factory? it allows us define helper render functions in closure with `api` var available.
  drawFactory: (api: Api<Params>) => () => void;
  onPropsChanged?: (api: Api<Params>) => void;
};

export function createSketch<Params extends string>(
  // Why a factory? it allows us to use closures to create shared vars.
  // Note that `api` is not available in the topmost scope to avoid issues with p5 instance init order.
  argsFactory: (api: Api<Params>) => CreateSketchArgs<Params>,
): ISketchFactory<Params> {
  return (initialProps) => (p) => {
    let time = 0,
      initialPropsUpdate = true,
      props: TrackedProps<Params>,
      draw: ReturnType<CreateSketchArgs<Params>["drawFactory"]>;

    const memos: MemoizedValue<any, any>[] = [];
    const animations: MemoizedAnimatedValue<any, any>[] = [];

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
      createAnimation: (...args) => {
        const animation = new MemoizedAnimatedValue(...args);
        animations.push(animation);
        return animation;
      },
    };

    function updateTrackedProps(newRawProps: ISketchProps<Params>) {
      if (!props) {
        props = {} as any;
      }

      (Object.keys(newRawProps) as PropNames<Params>[]).forEach((key) => {
        if (props[key] === undefined) {
          props[key] = new TrackedValue(newRawProps[key] as any) as any;
        } else {
          props[key].value = newRawProps[key];
        }
      });
    }

    function updateMemos(force: boolean = false) {
      memos.forEach((memo) => {
        memo.recalc(force);
      });
    }

    function updateAnimations(force: boolean = false) {
      animations.forEach((animations) => {
        animations.recalc(time, force);
      });
    }

    function runAnimations() {
      animations.forEach((animations) => {
        animations.runAnimationStep(time);
      });
    }

    // initialize tracked props immediately (even before setups), don't move this line
    updateTrackedProps(initialProps);

    const args = argsFactory(api);

    p.setup = () => {
      p.createCanvas(initialProps.canvasWidth, initialProps.canvasHeight);
      p.randomSeed(initialProps.randomSeed);
      p.noiseSeed(initialProps.randomSeed);

      // set time using initial time shift (for pretty previews)
      time = api.getProp("timeShift") ?? 0;

      // [potential bug] hope `args.setup` won't need initialized memos any time soon lol
      // Context: in pillars sketch we calculate memo based on p5's random seed,
      // so memos can't be initialized before `p.randomSeed(...)` in setup,
      // that's why the line below is there and `force` arg = true
      updateMemos(true);
      updateAnimations(true);

      args.setup?.(api);

      // initialize draw func passing p5 instance (`api.p`),
      // which is guaranteed to be initialized properly at this moment
      draw = args.drawFactory(api);

      if (api.getProp("playing") === false) {
        p.noLoop();
      }
    };

    p.draw = () => {
      draw();
      time += api.getProp("timeDelta");
      runAnimations();
    };

    p.updateWithProps = (newRawProps) => {
      // updateWithProps's first call happens before `p.setup` call
      if (!initialPropsUpdate) {
        updateTrackedProps(newRawProps);
        updateMemos();
        updateAnimations();

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
          p.resizeCanvas(canvasWidth.value, canvasHeight.value, true);
        }

        // play/pause
        if (playing) {
          p.loop();
        } else {
          p.noLoop();
        }

        // we need to manually redraw PAUSED sketch to see new params applied
        if (!playing) {
          draw();
        }
      } else {
        initialPropsUpdate = false;
      }
    };
  };
}
