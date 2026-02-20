import { describe, expect, test, vi } from "vitest";
import { TrackedArray } from "./TrackedArray";
import type { TrackedArrayComparator } from "./models";

describe("TrackedArray", () => {
  test("default scenario", () => {
    const cb = vi.fn();
    const sut = new TrackedArray([1, 2, 3]);
    sut.onChanged.addCallback(cb);

    expect(
      cb,
      "doesn't call `onChange` callback during initialization",
    ).not.toHaveBeenCalled();
    expect(sut.value, "`value` is correct").toEqual([1, 2, 3]);
    expect(
      sut.prevValue,
      "`prevValue` is `undefined` after initialization",
    ).toBe(undefined);

    sut.value = [1, 2, 3];

    expect(
      cb,
      "doesn't call `onChange` callback since an array of same values is provided",
    ).toHaveBeenCalledTimes(0);
    expect(sut.value, "`value` is the same").toEqual([1, 2, 3]);
    expect(
      sut.prevValue,
      "`prevValue` is `undefined` since array content hasn't changed",
    ).toBe(undefined);

    sut.value = [1, 2, 4];

    expect(
      cb,
      "calls `onChange` callback since the last value in the array changed",
    ).toHaveBeenCalledTimes(1);
    expect(
      cb,
      "calls `onChange` callback passing new array",
    ).toHaveBeenLastCalledWith([1, 2, 4]);
    expect(sut.value, "`value` is correct").toEqual([1, 2, 4]);
    expect(sut.prevValue, "`prevValue` is correct").toEqual([1, 2, 3]);

    sut.value = [1, 2, 4, 5];

    expect(
      cb,
      "calls `onChange` callback since new array is one element bigger",
    ).toHaveBeenCalledTimes(2);
    expect(
      cb,
      "calls `onChange` callback passing new array",
    ).toHaveBeenLastCalledWith([1, 2, 4, 5]);
    expect(sut.value, "`value` is correct").toEqual([1, 2, 4, 5]);
    expect(sut.prevValue, "`prevValue` is correct").toEqual([1, 2, 4]);
  });

  test("using custom comparator", () => {
    const cb = vi.fn();
    const lengthComparator: TrackedArrayComparator<number> =
      // same size arrays are considered equal
      (a, b) => (a ?? []).length === (b ?? []).length;
    const sut = new TrackedArray<number>([1, 2, 3], lengthComparator);
    sut.onChanged.addCallback(cb);

    sut.value = [10, 11, 12];

    expect(
      cb,
      "doesn't call `onChange` callback since new array has the same length",
    ).toHaveBeenCalledTimes(0);
    expect(
      sut.value,
      "`value` remains the same since new array has the same length",
    ).toEqual([1, 2, 3]);
    expect(
      sut.prevValue,
      "`prevValue` is `undefined` since new array has the same length",
    ).toBe(undefined);

    sut.value = [20, 21, 22, 23];

    expect(
      cb,
      "calls `onChange` callback since new array is one element bigger",
    ).toHaveBeenCalledTimes(1);
    expect(cb, "calls `onChange` passing new bigger array").toBeCalledWith([
      20, 21, 22, 23,
    ]);
    expect(sut.value, "`value` is new bigger array").toEqual([20, 21, 22, 23]);
    expect(
      sut.prevValue,
      "`prevValue` is prev value since new array is one element bigger",
    ).toEqual([1, 2, 3]);
  });
});
