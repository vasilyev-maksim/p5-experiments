/* eslint-disable @typescript-eslint/no-explicit-any */
import type p5 from "p5";
import { MemoizedAnimatedArray } from "./MemoizedAnimatedArray";
import { AnimatedValue } from "./AnimatedValue";
import type { TrackedTuple } from "./models";

export class MemoizedAnimatedColors<ArgsType extends any[]> {
  private readonly memoizedAnimatedArray: MemoizedAnimatedArray<ArgsType>;
  private readonly p: p5;

  public constructor({
    animationDuration,
    deps,
    colorProvider,
    p,
    timingFunction,
  }: {
    animationDuration: number;
    deps: TrackedTuple<ArgsType>;
    colorProvider: (...args: ArgsType) => string[];
    p: p5;
    timingFunction?: AnimatedValue["timingFunction"];
  }) {
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
    });
    this.p = p;
  }

  public getCurrentValue(currentTime: number): [p5.Color, p5.Color] {
    const [r1, g1, b1, r2, g2, b2] =
      this.memoizedAnimatedArray.getCurrentValue(currentTime);
    return [this.p.color(r1, g1, b1), this.p.color(r2, g2, b2)];
  }

  public forceAnimationsToEnd(time: number) {
    this.memoizedAnimatedArray.forceAnimationsToEnd(time);
  }
}
