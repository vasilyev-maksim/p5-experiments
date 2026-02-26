/* eslint-disable @typescript-eslint/no-explicit-any */
import type p5 from "p5";
import { MemoizedAnimatedArray } from "./MemoizedAnimatedArray";
import { AnimatedValue } from "./AnimatedValue";
import type { TrackedArrayComparator, TrackedTuple } from "./models";
import { chunkArray } from "@/utils/misc";

export type p5Subset = Pick<p5, "red" | "green" | "blue" | "color">;

export type MemoizedAnimatedColorsParams<ArgsType extends any[]> = {
  animationDuration: number;
  deps: TrackedTuple<ArgsType>;
  colorProvider: (...args: ArgsType) => string[];
  p: p5Subset;
  timingFunction?: AnimatedValue["timingFunction"];
  timeProvider: () => number;
  comparator?: TrackedArrayComparator<number>;
};

export class MemoizedAnimatedColors<
  ArgsType extends any[],
> extends MemoizedAnimatedArray<ArgsType> {
  private readonly p: p5Subset;

  public constructor({
    animationDuration,
    deps,
    colorProvider,
    p,
    timingFunction,
    timeProvider,
    comparator,
  }: MemoizedAnimatedColorsParams<ArgsType>) {
    super({
      animationDuration,
      deps,
      timingFunction: timingFunction ?? AnimatedValue.TIMING_FUNCTIONS.LINEAR,
      timeProvider,
      fn: (...args) => {
        return colorProvider(...args).flatMap((colorStr) => {
          const color = p.color(colorStr);
          return [p.red(color), p.green(color), p.blue(color)];
        });
      },
      comparator,
    });
    this.p = p;
  }

  public getCurrentValue(currentTime: number): p5.Color[] {
    return this.convertNumbersToColors(
      this.getAnimatedArray().getCurrentValue(currentTime),
    );
  }

  public getEndValue() {
    return this.convertNumbersToColors(this.getAnimatedArray().getEndValue());
  }

  private convertNumbersToColors(numbers: number[]): p5.Color[] {
    return chunkArray(numbers, 3).map(([r, g, b]) => this.p.color(r, g, b));
  }
}
