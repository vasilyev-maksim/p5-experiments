import { describe, expect, test, vi } from "vitest";
import { TrackedValue } from "./TrackedValue";
import { MemoizedArray } from "./MemoizedArray";
import type { TrackedArrayComparator } from "./models";
import { range } from "@/utils/misc";

describe("MemoizedArray", () => {
  test("default scenario", () => {
    const cb = vi.fn();
    const a = new TrackedValue(1);
    const b = new TrackedValue(2);
    const sut = new MemoizedArray({ fn: (a, b) => [a, b], deps: [a, b] });
    sut.onChanged.addCallback(cb);

    expect(
      cb,
      "doesn't call `onChange` callback during initialization",
    ).not.toHaveBeenCalled();
    expect(sut.value).toEqual([1, 2]);
    expect(sut.prevValue).toEqual(undefined);

    a.value = 3;

    expect(
      cb,
      "calls `onChange` callback for the first time since `a` dep changed",
    ).toHaveBeenCalledTimes(1);
    expect(
      cb,
      "calls `onChange` callback passing new `a`",
    ).toHaveBeenLastCalledWith([3, 2]);
    expect(sut.value, "`value` is correct").toEqual([3, 2]);
    expect(sut.prevValue).toEqual([1, 2]);

    b.value = 4;

    expect(
      cb,
      "calls `onChange` callback for the first time since `b` dep changed",
    ).toHaveBeenCalledTimes(2);
    expect(
      cb,
      "calls `onChange` callback passing new `b`",
    ).toHaveBeenLastCalledWith([3, 4]);
    expect(sut.value, "`value` is correct").toEqual([3, 4]);
    expect(sut.prevValue).toEqual([3, 2]);

    b.value = 4;

    expect(
      cb,
      "doesn't call `onChange` callback for the same `b`",
    ).toHaveBeenCalledTimes(2);
    expect(sut.value, "`value` remains the same").toEqual([3, 4]);
    expect(sut.prevValue).toEqual([3, 2]);

    sut.value = [6, 7];

    expect(
      cb,
      "calls `onChange` callback with array directly set as `sut.value`",
    ).toHaveBeenCalledTimes(3);
    expect(
      cb,
      "calls `onChange` callback passing new array",
    ).toHaveBeenLastCalledWith([6, 7]);
    expect(sut.value, "`value` is correct").toEqual([6, 7]);
    expect(sut.prevValue).toEqual([3, 4]);

    sut.value = [6, 7];

    expect(
      cb,
      "doesn't call `onChange` callback for the same array set directly as `sut.value`",
    ).toHaveBeenCalledTimes(3);
    expect(sut.value, "`value` remains the same").toEqual([6, 7]);
    expect(sut.prevValue).toEqual([3, 4]);
  });

  test("using custom comparator", () => {
    const cb = vi.fn();
    const lengthComparator: TrackedArrayComparator<number> =
      // same size arrays are considered equal
      (a, b) => (a ?? []).length === (b ?? []).length;
    const len = new TrackedValue(2);
    const val = new TrackedValue(1);
    const sut = new MemoizedArray({
      fn: (len, val) => range(len).map(() => val),
      deps: [len, val],
      comparator: lengthComparator,
    });
    sut.onChanged.addCallback(cb);

    // set value of MemoizedArray (sut) directly
    sut.value = [2, 2];

    expect(
      cb,
      "doesn't call `onChange` callback since new array set directly as `sut.value` has the same length",
    ).toHaveBeenCalledTimes(0);
    expect(
      sut.prevValue,
      "`prevValue` is `undefined` since new array set directly as `sut.value` has the same length",
    ).toBe(undefined);
    expect(
      sut.value,
      "`value` remains the same since new value set directly as `sut.value` has the same length",
    ).toEqual([1, 1]);

    sut.value = [1, 1, 1];

    expect(
      cb,
      "calls `onChange` callback since new array set directly as `sut.value` is one element bigger",
    ).toHaveBeenCalledTimes(1);
    expect(cb, "calls `onChange` passing new bigger array").toBeCalledWith([
      1, 1, 1,
    ]);
    expect(sut.prevValue, "`prevValue` is prev value").toEqual([1, 1]);
    expect(sut.value, "`value` is new bigger array").toEqual([1, 1, 1]);

    // set value of a dependency
    val.value = 2;

    expect(
      cb,
      "calls `onChange` callback since new array is one element smaller",
    ).toHaveBeenCalledTimes(2);
    expect(cb, "calls `onChange` passing new smaller array").toBeCalledWith([
      2, 2,
    ]);
    expect(sut.prevValue, "`prevValue` is prev value").toEqual([1, 1, 1]);
    expect(sut.value, "`value` is new smaller array").toEqual([2, 2]);

    val.value = 3;

    expect(
      cb,
      "doesn't call `onChange` callback since array length is the same",
    ).toHaveBeenCalledTimes(2);
    expect(sut.prevValue, "`prevValue` remains the same").toEqual([1, 1, 1]);
    expect(sut.value, "`value` remains the same").toEqual([2, 2]);
  });
});
