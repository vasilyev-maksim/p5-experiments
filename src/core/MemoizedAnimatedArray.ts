/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatedArray } from "./AnimatedArray";
import type { AnimatedValue } from "./AnimatedValue";
import { MemoizedArray } from "./MemoizedArray";
import type { ArrayOfTrackedValues } from "./TrackedArray";

export class MemoizedAnimatedArray<ArgsType extends any[]> {
  private readonly animatedArray: AnimatedArray;
  private readonly memoizedArray: MemoizedArray<ArgsType, number>;

  public constructor(
    animationDuration: number,
    fn: (...args: ArgsType) => number[],
    deps: ArrayOfTrackedValues<ArgsType>,
    initialValueForItem?: number,
    timingFunction?: AnimatedValue["timingFunction"],
  ) {
    this.memoizedArray = new MemoizedArray(fn, deps, undefined);
    // intentionally no initial value provided as 2nd arg, because `memoizedValue` is not initialized yet
    this.animatedArray = new AnimatedArray(
      animationDuration,
      undefined,
      initialValueForItem,
      timingFunction,
    );

    // TODO: написать AnimatedArray + полумать использовать композиция (вместо наследования) в классах
  }

  public recalc(time: number): this {
    this.memoizedArray.recalc();
    if (this.memoizedArray.hasChanged) {
      this.animatedArray.animateTo({
        values: this.memoizedArray.value,
        startTime: time,
      });
    }
    return this;
  }

  public get value() {
    return this.animatedArray.getCurrentValue();
  }

  public runAnimationStep(time: number) {
    this.animatedArray.runAnimationStep(time);
  }

  public forceAnimationsToEnd(time: number) {
    this.animatedArray.forceToEnd(time);
  }
}
