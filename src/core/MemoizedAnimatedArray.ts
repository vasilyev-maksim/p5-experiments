/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatedArray } from "./AnimatedArray";
import type { AnimatedValue } from "./AnimatedValue";
import { MemoizedArray } from "./MemoizedArray";
import type { TrackedTuple } from "./models";

export type MemoizedAnimatedArrayParams<ArgsType extends any[]> = {
  animationDuration: number;
  deps: TrackedTuple<ArgsType>;
  fn: (...args: ArgsType) => number[];
  initialValueForItem?: number;
  timingFunction?: AnimatedValue["timingFunction"];
  timeProvider: () => number;
};

export class MemoizedAnimatedArray<ArgsType extends any[]> {
  public readonly animatedArray: AnimatedArray;
  public readonly memoizedArray: MemoizedArray<ArgsType, number>;

  public constructor({
    animationDuration,
    deps,
    fn,
    initialValueForItem,
    timingFunction,
    timeProvider,
  }: MemoizedAnimatedArrayParams<ArgsType>) {
    this.memoizedArray = new MemoizedArray({ fn, deps });
    this.animatedArray = new AnimatedArray(
      animationDuration,
      this.memoizedArray.value,
      initialValueForItem,
      timingFunction,
    );

    this.memoizedArray.onChanged.addCallback((values) => {
      this.animatedArray.animateTo({
        currentTime: timeProvider(),
        values,
      });
    });
  }

  public getCurrentValue(currentTime: number) {
    return this.animatedArray.getCurrentValue(currentTime);
  }

  public getEndValue() {
    return this.animatedArray.getEndValue();
  }
}
