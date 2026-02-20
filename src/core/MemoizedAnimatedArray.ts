/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatedArray } from "./AnimatedArray";
import type { AnimatedValue } from "./AnimatedValue";
import { MemoizedArray } from "./MemoizedArray";
import type { TrackedTuple } from "./models";

export class MemoizedAnimatedArray<ArgsType extends any[]> {
  private readonly animatedArray: AnimatedArray;
  public readonly memoizedArray: MemoizedArray<ArgsType, number>;

  public constructor({
    animationDuration,
    deps,
    fn,
    initialValueForItem,
    timingFunction,
  }: {
    animationDuration: number;
    deps: TrackedTuple<ArgsType>;
    fn: (...args: ArgsType) => number[];
    initialValueForItem?: number;
    timingFunction?: AnimatedValue["timingFunction"];
  }) {
    this.memoizedArray = new MemoizedArray(fn, deps);
    this.animatedArray = new AnimatedArray(
      animationDuration,
      this.memoizedArray.value,
      initialValueForItem,
      timingFunction,
    );
  }

  public getCurrentValue(currentTime: number) {
    return this.animatedArray.getCurrentValue(currentTime);
  }

  public forceAnimationsToEnd(time: number) {
    this.animatedArray.forceToEnd(time);
  }
}
