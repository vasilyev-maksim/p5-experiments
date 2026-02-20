/* eslint-disable @typescript-eslint/no-explicit-any */
import type p5 from "p5";
import { MemoizedAnimatedArray } from "./MemoizedAnimatedArray";
import { AnimatedValue } from "./AnimatedValue";
import type { TrackedTuple } from "./models";

export type MemoizedAnimatedColorsParams<ArgsType extends any[]> = {
  animationDuration: number;
  deps: TrackedTuple<ArgsType>;
  colorProvider: (...args: ArgsType) => string[];
  p: p5;
  timingFunction?: AnimatedValue["timingFunction"];
  timeProvider: () => number;
};

export class MemoizedAnimatedColors<ArgsType extends any[]> {
  private readonly memoizedAnimatedArray: MemoizedAnimatedArray<ArgsType>;
  private readonly p: p5;

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

  public getCurrentValue(currentTime: number): [p5.Color, p5.Color] {
    return this.convertNumbersToColors(
      this.memoizedAnimatedArray.getCurrentValue(currentTime),
    );
  }

  public getEndValue() {
    return this.convertNumbersToColors(
      this.memoizedAnimatedArray.getEndValue(),
    );
  }

  private convertNumbersToColors(numbers: number[]): [p5.Color, p5.Color] {
    const [r1, g1, b1, r2, g2, b2] = numbers;
    return [this.p.color(r1, g1, b1), this.p.color(r2, g2, b2)];
  }
}
