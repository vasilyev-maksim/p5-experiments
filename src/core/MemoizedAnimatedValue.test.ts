import { describe, expect, test } from "vitest";
import { MemoizedAnimatedValue } from "./MemoizedAnimatedValue";
import { TrackedValue } from "./TrackedValue";
import { AnimatedValue } from "./AnimatedValue";

describe("MemoizedAnimatedValue", () => {
  test("calling .getAnimatedValue() without prior call of .recalc() will cause an exception", () => {
    const a = new TrackedValue<number>();
    const b = new TrackedValue<number>();
    const sut = new MemoizedAnimatedValue({
      fn: (a, b) => a + b,
      animationDuration: 10,
      deps: [a, b],
      timeProvider: () => 0,
      timingFunction: AnimatedValue.TIMING_FUNCTIONS.LINEAR,
    });

    expect(() => {
      sut.getAnimatedValue();
    }).toThrow();
  });

  test(".recalc() triggers animation", () => {
    const a = new TrackedValue<number>();
    const b = new TrackedValue<number>();
    let time = 0;
    const sut = new MemoizedAnimatedValue({
      fn: (a, b) => a + b,
      animationDuration: 1,
      deps: [a, b],
      timeProvider: () => time,
      timingFunction: AnimatedValue.TIMING_FUNCTIONS.LINEAR,
    });

    a.setValue(1);
    b.setValue(2);

    sut.recalc();

    const animatedValue = sut.getAnimatedValue();
    expect(animatedValue?.getCurrentValue(0)).toBe(3);
    expect(animatedValue?.getEndValue()).toBe(3);

    time = 1;

    a.setValue(2);
    b.setValue(3);

    sut.recalc();

    expect(animatedValue?.getCurrentValue(1)).toBe(3);
    expect(animatedValue?.getEndValue()).toBe(5);
  });

  test(".recalc() triggers animation ONLY if deps or calculated result has changed", () => {
    const a = new TrackedValue<number>();
    const b = new TrackedValue<number>();
    let time = 0;
    const sut = new MemoizedAnimatedValue({
      fn: (a, b) => a + b,
      animationDuration: 1,
      deps: [a, b],
      timeProvider: () => time,
      timingFunction: AnimatedValue.TIMING_FUNCTIONS.LINEAR,
    });

    a.setValue(1);
    b.setValue(2);

    sut.recalc();

    const animatedValue = sut.getAnimatedValue();
    expect(animatedValue?.getCurrentValue(0)).toBe(3);
    expect(animatedValue?.getEndValue()).toBe(3);

    sut.notChanged();

    time = 1;

    a.setValue(2);
    b.setValue(1);

    sut.recalc();

    expect(animatedValue?.getCurrentValue(1)).toBe(3);
    expect(animatedValue?.getEndValue()).toBe(3);
  });
});
