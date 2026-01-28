/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatedValue } from "./AnimatedValue";
import { MemoizedValue } from "./MemoizedValue";
import type { TrackedArray, TrackedValueComparator } from "./TrackedValue";

export class MemoizedAnimatedValue<
  ArgsType extends any[],
  ValueType extends number = number,
> {
  private readonly animatedValue: AnimatedValue;
  private readonly memoizedValue: MemoizedValue<ArgsType, ValueType>;

  public constructor(
    animationDuration: number,
    fn: (...args: ArgsType) => ValueType,
    deps: TrackedArray<ArgsType>,
    comparator?: TrackedValueComparator<ValueType>,
  ) {
    this.memoizedValue = new MemoizedValue(fn, deps, comparator);
    this.animatedValue = new AnimatedValue(
      animationDuration,
      this.memoizedValue.value,
    );
  }

  public recalc(time: number): this {
    this.memoizedValue.recalc();
    if (this.memoizedValue.hasChanged) {
      this.animatedValue.animateTo(this.memoizedValue.value, time);
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
