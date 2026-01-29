/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatedValue } from "./AnimatedValue";
import { MemoizedArray } from "./MemoizedArray";
import type { ArrayOfTrackedValues } from "./TrackedArray";

export class MemoizedAnimatedArray<ArgsType extends any[]> {
  private readonly animatedValue: AnimatedValue;
  private readonly memoizedArray: MemoizedArray<ArgsType, number>;

  public constructor(
    animationDuration: number,
    fn: (...args: ArgsType) => number[],
    deps: ArrayOfTrackedValues<ArgsType>,
  ) {
    this.memoizedArray = new MemoizedArray(fn, deps);
    // intentionally no initial value provided as 2nd arg, because `memoizedValue` is not initialized yet
    this.animatedValue = new AnimatedValue(animationDuration);

    // написать AnimatedArray + полумать использовать композиция (вместо наследования) в классах
  }

  public recalc(time: number, force = false): this {
    this.memoizedArray.recalc(force);
    if (force || this.memoizedArray.hasChanged) {
      this.animatedValue.animateTo(this.memoizedArray.value, time);
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
