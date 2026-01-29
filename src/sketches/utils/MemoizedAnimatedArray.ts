/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatedArray } from "./AnimatedArray";
import { MemoizedArray } from "./MemoizedArray";
import type { ArrayOfTrackedValues } from "./TrackedArray";

export class MemoizedAnimatedArray<ArgsType extends any[]> {
  private readonly animatedArray: AnimatedArray;
  private readonly memoizedArray: MemoizedArray<ArgsType, number>;

  public constructor(
    animationDuration: number,
    fn: (...args: ArgsType) => number[],
    deps: ArrayOfTrackedValues<ArgsType>,
  ) {
    this.memoizedArray = new MemoizedArray(fn, deps, undefined);
    // intentionally no initial value provided as 2nd arg, because `memoizedValue` is not initialized yet
    this.animatedArray = new AnimatedArray(animationDuration);

    // TODO: написать AnimatedArray + полумать использовать композиция (вместо наследования) в классах
  }

  public recalc(time: number, force = false): this {
    this.memoizedArray.recalc(force);
    if (force || this.memoizedArray.hasChanged) {
      this.animatedArray.animateTo(this.memoizedArray.value, time, 0);
    }
    return this;
  }

  public get value() {
    return this.animatedArray.getCurrentValue();
  }

  public runAnimationStep(time: number) {
    this.animatedArray.runAnimationStep(time);
  }
}
