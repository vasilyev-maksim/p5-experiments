/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatedValue } from "./AnimatedValue";
import { MemoizedValue } from "./MemoizedValue";
import type {
  IAnimatedValue,
  TrackedTuple,
  TrackedValueComparator,
} from "./models";

export type MemoizedAnimatedValueParams<ArgsType extends any[]> = {
  animationDuration: number;
  fn: (...args: ArgsType) => number;
  deps: TrackedTuple<ArgsType>;
  comparator?: TrackedValueComparator<number>;
  timingFunction?: AnimatedValue["timingFunction"];
  timeProvider: () => number;
  id?: string;
};

export class MemoizedAnimatedValue<
  ArgsType extends any[],
> implements IAnimatedValue<number> {
  public readonly animatedValue: AnimatedValue;
  public readonly memoizedValue: MemoizedValue<ArgsType, number>;

  public constructor({
    animationDuration,
    fn,
    deps,
    comparator,
    timingFunction,
    timeProvider,
  }: MemoizedAnimatedValueParams<ArgsType>) {
    this.memoizedValue = new MemoizedValue({ fn, deps, comparator });

    this.animatedValue = new AnimatedValue({
      animationDuration,
      initialValue: this.memoizedValue.value,
      timingFunction,
    });

    this.memoizedValue.onChanged.addCallback((value) => {
      this.animatedValue.animateTo({
        currentTime: timeProvider(),
        value,
      });
    });
  }

  public getCurrentValue(currentTime: number) {
    return this.animatedValue.getCurrentValue(currentTime);
  }

  public getEndValue() {
    return this.animatedValue.getEndValue();
  }
}
