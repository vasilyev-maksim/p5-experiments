/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatedValue } from "./AnimatedValue";
import { MemoizedValue } from "./MemoizedValue";
import type { TrackedTuple, TrackedValueComparator } from "./models";

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
> extends MemoizedValue<ArgsType, number> {
  private readonly timeProvider;
  private readonly animationDuration;
  private readonly timingFunction;
  private animatedValue?: AnimatedValue;

  public constructor({
    animationDuration,
    fn,
    deps,
    comparator,
    timingFunction,
    timeProvider,
  }: MemoizedAnimatedValueParams<ArgsType>) {
    super({ fn, deps, comparator });

    this.timeProvider = timeProvider;
    this.timingFunction = timingFunction;
    this.animationDuration = animationDuration;
  }

  public override recalc() {
    super.recalc();

    if (this.hasChanged()) {
      if (!this.animatedValue) {
        this.animatedValue = new AnimatedValue({
          animationDuration: this.animationDuration,
          initialValue: this.getValue(),
          timingFunction: this.timingFunction,
        });
      } else {
        this.animatedValue.animateTo({
          currentTime: this.timeProvider(),
          value: this.getValue(),
        });
      }
    }
  }

  public getAnimatedValue(): AnimatedValue {
    if (this.animatedValue === undefined) {
      throw new Error("Trying to read uninitialized animated value");
    }
    return this.animatedValue;
  }
}
