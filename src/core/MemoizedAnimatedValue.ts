/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatedValue } from "./AnimatedValue";
import { MemoizedValue } from "./MemoizedValue";
import type { ArrayOfTrackedValues } from "./TrackedArray";
import type { TrackedValueComparator } from "./TrackedValue";

export class MemoizedAnimatedValue<ArgsType extends any[]> {
  public readonly animatedValue: AnimatedValue;
  public readonly memoizedValue: MemoizedValue<ArgsType, number>;

  public constructor(
    animationDuration: number,
    fn: (...args: ArgsType) => number,
    deps: ArrayOfTrackedValues<ArgsType>,
    comparator?: TrackedValueComparator<number>,
    timingFunction?: AnimatedValue["timingFunction"],
  ) {
    this.memoizedValue = new MemoizedValue(fn, deps, comparator);
    // intentionally no initial value provided as 2nd arg, because `memoizedValue` is not initialized yet
    this.animatedValue = new AnimatedValue(
      animationDuration,
      undefined,
      timingFunction,
    );
  }

  public recalc(time: number, force = false): this {
    this.memoizedValue.recalc(force);
    if (force || this.memoizedValue.hasChanged) {
      this.animatedValue.animateTo({
        value: this.memoizedValue.value,
        startTime: time,
      });
    }
    return this;
  }

  public get value() {
    return this.animatedValue.getCurrentValue();
  }

  public runAnimationStep(time: number) {
    this.animatedValue.runAnimationStep(time);
  }
}
