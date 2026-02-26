import { describe, expect, test } from "vitest";
import { AnimatedArray } from "./AnimatedArray";
import { AnimatedValue } from "./AnimatedValue";

describe("AnimatedArray", () => {
  test("default scenario", () => {
    const sut = new AnimatedArray({
      animationDuration: 2,
      initialValues: [0, 0, 0],
      initialValueForItem: 0,
      timingFunction: AnimatedValue.TIMING_FUNCTIONS.LINEAR,
    });

    expect(sut.getCurrentValue(0)).toEqual([0, 0, 0]);

    sut.animateTo({
      currentTime: 0,
      values: [10, 10, 10],
      animationDuration: 10,
    });

    expect(sut.getCurrentValue(0)).toEqual([0, 0, 0]);
    expect(sut.getCurrentValue(1)).toEqual([1, 1, 1]);
    expect(sut.getCurrentValue(2)).toEqual([2, 2, 2]);

    sut.animateTo({
      currentTime: 2,
      values: [10, 10, 10],
      animationDuration: 2,
    });

    expect(sut.getCurrentValue(2)).toEqual([2, 2, 2]);
    expect(sut.getCurrentValue(3)).toEqual([6, 6, 6]);
    expect(sut.getCurrentValue(4)).toEqual([10, 10, 10]);
    // doesn't extrapolate, stays at end value
    expect(sut.getCurrentValue(5)).toEqual([10, 10, 10]);

    // remove last element

    sut.animateTo({
      currentTime: 5,
      values: [10, 10],
      animationDuration: 2,
    });

    expect(sut.getCurrentValue(5)).toEqual([10, 10, 10]);
    expect(sut.getCurrentValue(6)).toEqual([10, 10, 5]);
    expect(sut.getCurrentValue(7)).toEqual([10, 10]);

    // remove last element again and change the first one

    sut.animateTo({
      currentTime: 7,
      values: [40],
      animationDuration: 5,
    });

    expect(sut.getCurrentValue(7)).toEqual([10, 10]);
    expect(sut.getCurrentValue(8)).toEqual([16, 8]);
    expect(sut.getCurrentValue(9)).toEqual([22, 6]);
    expect(sut.getCurrentValue(10)).toEqual([28, 4]);
    expect(sut.getCurrentValue(11)).toEqual([34, 2]);
    expect(sut.getCurrentValue(12)).toEqual([40]);

    // add new elements

    sut.animateTo({
      currentTime: 12,
      values: [10, 10, 10],
      animationDuration: 5,
    });

    expect(sut.getCurrentValue(12)).toEqual([40, 0, 0]);
    expect(sut.getCurrentValue(13)).toEqual([34, 2, 2]);
    expect(sut.getCurrentValue(14)).toEqual([28, 4, 4]);
    expect(sut.getCurrentValue(15)).toEqual([22, 6, 6]);
    expect(sut.getCurrentValue(16)).toEqual([16, 8, 8]);
    expect(sut.getCurrentValue(17)).toEqual([10, 10, 10]);

    // remove all elements in 0 time
    sut.animateTo({
      currentTime: 17,
      values: [],
      animationDuration: 0,
    });

    expect(sut.getCurrentValue(17)).toEqual([]);
  });

  test("custom timing function", () => {
    const sut = new AnimatedArray({
      animationDuration: 2,
      initialValues: [0, 0, 0],
      initialValueForItem: 0,
      timingFunction: (x) => x ** 2,
    });

    expect(sut.getCurrentValue(0)).toEqual([0, 0, 0]);

    sut.animateTo({
      currentTime: 0,
      values: [100, 100, 100],
      animationDuration: 10,
    });

    expect(sut.getCurrentValue(1).map((x) => Math.round(x))).toEqual([1, 1, 1]);
    expect(sut.getCurrentValue(2).map((x) => Math.round(x))).toEqual([4, 4, 4]);
    expect(sut.getCurrentValue(3).map((x) => Math.round(x))).toEqual([9, 9, 9]);
    expect(sut.getCurrentValue(4).map((x) => Math.round(x))).toEqual([
      16, 16, 16,
    ]);
    expect(sut.getCurrentValue(9).map((x) => Math.round(x))).toEqual([
      81, 81, 81,
    ]);
    expect(sut.getCurrentValue(10).map((x) => Math.round(x))).toEqual([
      100, 100, 100,
    ]);
    expect(sut.getCurrentValue(11).map((x) => Math.round(x))).toEqual([
      100, 100, 100,
    ]);
  });
});
