/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatedValue } from "./AnimatedValue";
import { MemoizedValue } from "./MemoizedValue";
import type { ArrayOfTrackedValues } from "./TrackedArray";
import type { TrackedValueComparator } from "./TrackedValue";

export class MemoizedAnimatedValue<ArgsType extends any[]> {
  private readonly animatedValue: AnimatedValue;
  private readonly memoizedValue: MemoizedValue<ArgsType, number>;

  public constructor(
    animationDuration: number,
    fn: (...args: ArgsType) => number,
    deps: ArrayOfTrackedValues<ArgsType>,
    comparator?: TrackedValueComparator<number>,
  ) {
    this.memoizedValue = new MemoizedValue(fn, deps, comparator);
    // intentionally no initial value provided as 2nd arg, because `memoizedValue` is not initialized yet
    this.animatedValue = new AnimatedValue(animationDuration);
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
