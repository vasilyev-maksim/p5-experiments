/* eslint-disable @typescript-eslint/no-explicit-any */
import type p5 from "p5";
import { MemoizedAnimatedArray } from "./MemoizedAnimatedArray";
import { AnimatedValue } from "./AnimatedValue";
import type { TrackedTuple } from "./models";
import { chunkArray } from "@/utils/misc";

export type p5Subset = Pick<p5, 'red' | 'green' | 'blue' | 'color'>;

export type MemoizedAnimatedColorsParams<ArgsType extends any[]> = {
  animationDuration: number;
  deps: TrackedTuple<ArgsType>;
  colorProvider: (...args: ArgsType) => string[];
  p: p5Subset;
  timingFunction?: AnimatedValue["timingFunction"];
  timeProvider: () => number;
};

export class MemoizedAnimatedColors<ArgsType extends any[]> {
  private readonly memoizedAnimatedArray: MemoizedAnimatedArray<ArgsType>;
  private readonly p: p5Subset;

  public constructor({
    animationDuration,
    deps,
    colorProvider,
    p,
    timingFunction,
    timeProvider,
  }: MemoizedAnimatedColorsParams<ArgsType>) {
    this.memoizedAnimatedArray = new MemoizedAnimatedArray<ArgsType>({
      animationDuration,
      fn: (...args) => {
        return colorProvider(...args).flatMap((colorStr) => {
          const color = p.color(colorStr);
          return [p.red(color), p.green(color), p.blue(color)];
        });
      },
      deps,
      timingFunction: timingFunction ?? AnimatedValue.TIMING_FUNCTIONS.LINEAR,
      timeProvider,
    });
    this.p = p;
  }

  public getCurrentValue(currentTime: number): p5.Color[] {
    return this.convertNumbersToColors(
      this.memoizedAnimatedArray.getCurrentValue(currentTime),
    );
  }

  public getEndValue() {
    return this.convertNumbersToColors(
      this.memoizedAnimatedArray.getEndValue(),
    );
  }

  private convertNumbersToColors(numbers: number[]): p5.Color[] {
    return chunkArray(numbers, 3).map(([r, g, b]) => this.p.color(r, g, b));
  }
}
