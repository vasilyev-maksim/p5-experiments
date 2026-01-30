/* eslint-disable @typescript-eslint/no-explicit-any */
import type p5 from "p5";
import type { IColorControl } from "../../models";
import type { TrackedValue } from "./TrackedValue";
import { MemoizedAnimatedArray } from "./MemoizedAnimatedArray";

export class MemoizedAnimatedColor {
  private readonly memoizedAnimatedArray: MemoizedAnimatedArray<[number]>;

  public constructor(
    animationDuration: number,
    color: TrackedValue<number>,
    colors: IColorControl["colors"],
    private readonly p: p5,
  ) {
    this.memoizedAnimatedArray = new MemoizedAnimatedArray(
      animationDuration,
      (x) => {
        const [colorAStr, colorBStr] = colors[x];
        const colorA = p.color(colorAStr);
        const colorB = p.color(colorBStr);

        return [
          p.red(colorA),
          p.green(colorA),
          p.blue(colorA),
          p.red(colorB),
          p.green(colorB),
          p.blue(colorB),
        ];
      },
      [color],
    );
  }

  public recalc(time: number, force = false): this {
    this.memoizedAnimatedArray.recalc(time, force);
    return this;
  }

  public get value(): [p5.Color, p5.Color] {
    const [r1, g1, b1, r2, g2, b2] = this.memoizedAnimatedArray.value;
    return [this.p.color(r1, g1, b1), this.p.color(r2, g2, b2)];
  }

  public runAnimationStep(time: number) {
    this.memoizedAnimatedArray.runAnimationStep(time);
  }
}
