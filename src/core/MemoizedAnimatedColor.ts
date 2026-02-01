/* eslint-disable @typescript-eslint/no-explicit-any */
import type p5 from "p5";
import { MemoizedAnimatedArray } from "./MemoizedAnimatedArray";
import { AnimatedValue } from "./AnimatedValue";
import type { ArrayOfTrackedValues } from "./TrackedArray";

export class MemoizedAnimatedColors<ArgsType extends any[]> {
  private readonly memoizedAnimatedArray: MemoizedAnimatedArray<ArgsType>;

  public constructor(
    animationDuration: number,
    deps: ArrayOfTrackedValues<ArgsType>,
    colorProvider: (...args: ArgsType) => string[],
    private readonly p: p5,
    timingFunction: AnimatedValue["timingFunction"] = AnimatedValue
      .TIMING_FUNCTIONS.LINEAR,
  ) {
    this.memoizedAnimatedArray = new MemoizedAnimatedArray<ArgsType>(
      animationDuration,
      (...args) => {
        return colorProvider(...args).flatMap((colorStr) => {
          const color = p.color(colorStr);
          return [p.red(color), p.green(color), p.blue(color)];
        });
      },
      deps,
      undefined,
      timingFunction,
    );
  }

  public recalc(time: number): this {
    this.memoizedAnimatedArray.recalc(time);
    return this;
  }

  public get value(): [p5.Color, p5.Color] {
    const [r1, g1, b1, r2, g2, b2] = this.memoizedAnimatedArray.value;
    return [this.p.color(r1, g1, b1), this.p.color(r2, g2, b2)];
  }

  public runAnimationStep(time: number) {
    this.memoizedAnimatedArray.runAnimationStep(time);
  }

  public forceAnimationsToEnd(time: number) {
    this.memoizedAnimatedArray.forceAnimationsToEnd(time);
  }
}
