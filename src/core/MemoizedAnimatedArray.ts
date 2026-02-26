/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatedArray } from "./AnimatedArray";
import type { AnimatedValue } from "./AnimatedValue";
import { MemoizedValue } from "./MemoizedValue";
import type { TrackedArrayComparator, TrackedTuple } from "./models";

export type MemoizedAnimatedArrayParams<ArgsType extends any[]> = {
  animationDuration: number;
  deps: TrackedTuple<ArgsType>;
  fn: (...args: ArgsType) => number[];
  initialValueForItem?: number;
  timingFunction?: AnimatedValue["timingFunction"];
  timeProvider: () => number;
  comparator?: TrackedArrayComparator<number>;
};

export class MemoizedAnimatedArray<
  ArgsType extends any[],
> extends MemoizedValue<ArgsType, number[]> {
  private readonly timeProvider;
  private readonly animationDuration;
  private readonly timingFunction;
  private readonly initialValueForItem;
  public animatedArray?: AnimatedArray;

  public constructor({
    animationDuration,
    fn,
    deps,
    timingFunction,
    timeProvider,
    comparator,
    initialValueForItem,
  }: MemoizedAnimatedArrayParams<ArgsType>) {
    super({ fn, deps, comparator });

    this.timeProvider = timeProvider;
    this.timingFunction = timingFunction;
    this.animationDuration = animationDuration;
    this.initialValueForItem = initialValueForItem;
  }

  public override recalc() {
    super.recalc();

    if (this.hasChanged()) {
      if (!this.animatedArray) {
        this.animatedArray = new AnimatedArray({
          animationDuration: this.animationDuration,
          initialValues: this.getValue(),
          timingFunction: this.timingFunction,
          initialValueForItem: this.initialValueForItem,
        });
      } else {
        this.animatedArray.animateTo({
          currentTime: this.timeProvider(),
          values: this.getValue(),
        });
      }
    }
  }

  public getAnimatedArray(): AnimatedArray {
    if (this.animatedArray === undefined) {
      throw new Error("Trying to read uninitialized animated value");
    }
    return this.animatedArray;
  }
}
