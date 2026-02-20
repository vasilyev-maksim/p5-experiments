import { describe, expect, test, vi } from "vitest";
import { TrackedValue } from "./TrackedValue";
import type { TrackedValueComparator } from "./models";

describe("TrackedValue", () => {
  test("default scenario", () => {
    const cb = vi.fn();
    const sut = new TrackedValue(1);
    sut.onChanged.addCallback(cb);

    expect(
      cb,
      "doesn't call `onChange` callback during initialization",
    ).not.toHaveBeenCalled();
    expect(sut.value, "`value` is correct").toBe(1);
    expect(
      sut.prevValue,
      "`prevValue` is `undefined` after initialization",
    ).toBe(undefined);

    sut.value = 1;

    expect(
      cb,
      "doesn't call `onChange` callback when the same value is provided",
    ).toHaveBeenCalledTimes(0);
    expect(sut.value, "`value` is the same").toBe(1);
    expect(
      sut.prevValue,
      "`prevValue` is `undefined` since `value` hasn't changed",
    ).toBe(undefined);

    sut.value = 10;

    expect(
      cb,
      "calls `onChange` callback for the first time",
    ).toHaveBeenCalledTimes(1);
    expect(
      cb,
      "calls `onChange` callback passing new value",
    ).toHaveBeenLastCalledWith(10);
    expect(sut.value, "`value` is the new one").toBe(10);
    expect(sut.prevValue, "`prevValue` is correct").toBe(1);
  });

  test("using custom comparator", () => {
    const cb = vi.fn();
    const evenComparator = vi.fn<TrackedValueComparator<number>>(
      (a, b) => (a ?? 0) % 2 === (b ?? 0) % 2,
    );
    const sut = new TrackedValue<number>(1, evenComparator);
    sut.onChanged.addCallback(cb);

    sut.value = 3;

    expect(
      cb,
      "doesn't call `onChange` callback since new value is odd",
    ).toHaveBeenCalledTimes(0);
    expect(
      sut.prevValue,
      "`prevValue` is `undefined` since new value is odd",
    ).toBe(undefined);
    expect(sut.value, "`value` remains the same since new value is odd").toBe(
      1,
    );

    sut.value = 4;

    expect(
      cb,
      "calls `onChange` callback since new value is even",
    ).toHaveBeenCalledTimes(1);
    expect(cb, "calls `onChange` passing new even value").toBeCalledWith(4);
    expect(
      sut.prevValue,
      "`prevValue` is prev value since new value is even",
    ).toBe(1);
    expect(sut.value, "`value` is new even number").toBe(4);
  });
});
