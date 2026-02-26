import { describe, expect, test } from "vitest";
import { MemoizedAnimatedArray } from "./MemoizedAnimatedArray";
import { TrackedValue } from "./TrackedValue";
import { AnimatedValue } from "./AnimatedValue";
import type { TrackedArrayComparator } from "./models";

describe("MemoizedAnimatedArray", () => {
  test("calling .getAnimatedArray() without prior call of .recalc() will cause an exception", () => {
    const a = new TrackedValue<number>();
    const b = new TrackedValue<number>();
    const sut = new MemoizedAnimatedArray({
      fn: (a, b) => [a, b],
      animationDuration: 10,
      deps: [a, b],
      timeProvider: () => 0,
      timingFunction: AnimatedValue.TIMING_FUNCTIONS.LINEAR,
    });

    expect(() => {
      sut.getAnimatedArray();
    }).toThrow();
  });

  test(".recalc() triggers animation if calculated array changes contents", () => {
    const a = new TrackedValue<number>();
    const b = new TrackedValue<number>();
    let time = 0;
    const sut = new MemoizedAnimatedArray({
      fn: (a, b) => [a, b],
      animationDuration: 1,
      deps: [a, b],
      timeProvider: () => time,
      timingFunction: AnimatedValue.TIMING_FUNCTIONS.LINEAR,
    });

    a.setValue(1);
    b.setValue(2);

    sut.recalc();

    const animatedArray = sut.getAnimatedArray();
    expect(animatedArray?.getCurrentValue(0)).toEqual([1, 2]);
    expect(animatedArray?.getEndValue()).toEqual([1, 2]);

    time = 1;

    a.setValue(2);
    b.setValue(3);

    sut.recalc();

    expect(animatedArray?.getCurrentValue(1)).toEqual([1, 2]);
    expect(animatedArray?.getEndValue()).toEqual([2, 3]);
  });

  test(".recalc() triggers animation when calculated array's length has changed", () => {
    const size = new TrackedValue<number>();
    const fill = new TrackedValue<number>();
    let time = 0;
    const sut = new MemoizedAnimatedArray({
      fn: (size, fill) => Array(size).fill(fill),
      animationDuration: 1,
      deps: [size, fill],
      timeProvider: () => time,
      timingFunction: AnimatedValue.TIMING_FUNCTIONS.LINEAR,
      initialValueForItem: 0,
    });

    size.setValue(2);
    fill.setValue(1);

    sut.recalc();

    const animatedArray = sut.getAnimatedArray();
    expect(animatedArray?.getCurrentValue(0)).toEqual([1, 1]);
    expect(animatedArray?.getEndValue()).toEqual([1, 1]);

    sut.notChanged();

    time = 1;

    size.setValue(3);
    fill.setValue(2);

    sut.recalc();

    expect(animatedArray?.getCurrentValue(1)).toEqual([1, 1, 0]);
    expect(animatedArray?.getEndValue()).toEqual([2, 2, 2]);
  });

  test(".recalc() triggers animation ONLY if deps or calculated result has changed", () => {
    const a = new TrackedValue<number>();
    const b = new TrackedValue<number>();
    let time = 0;
    const lengthComparator: TrackedArrayComparator<number> =
      // same size arrays are considered equal
      (a, b) => (a ?? []).length === (b ?? []).length;
    const sut = new MemoizedAnimatedArray({
      fn: (a, b) => [a, b],
      animationDuration: 1,
      deps: [a, b],
      timeProvider: () => time,
      timingFunction: AnimatedValue.TIMING_FUNCTIONS.LINEAR,
      comparator: lengthComparator,
    });

    a.setValue(1);
    b.setValue(2);

    sut.recalc();

    const animatedArray = sut.getAnimatedArray();
    expect(animatedArray?.getCurrentValue(0)).toEqual([1, 2]);
    expect(animatedArray?.getEndValue()).toEqual([1, 2]);

    sut.notChanged();

    time = 1;

    a.setValue(3);
    b.setValue(4);

    sut.recalc();

    expect(animatedArray?.getCurrentValue(1)).toEqual([1, 2]);
    expect(animatedArray?.getEndValue()).toEqual([1, 2]);
  });
});
