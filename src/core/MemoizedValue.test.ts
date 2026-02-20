import { describe, expect, test, vi } from "vitest";
import { TrackedValue } from "./TrackedValue";
import { MemoizedValue } from "./MemoizedValue";
import type { TrackedValueComparator } from "./models";

describe("MemoizedValue", () => {
  test("default scenario", () => {
    const cb = vi.fn();
    const a = new TrackedValue(1);
    const b = new TrackedValue(2);
    const sut = new MemoizedValue({ fn: (a, b) => a + b, deps: [a, b] });
    sut.onChanged.addCallback(cb);

    expect(
      cb,
      "doesn't call `onChange` callback during initialization",
    ).not.toHaveBeenCalled();
    expect(sut.value).toBe(3);
    expect(sut.prevValue).toBe(undefined);

    a.value = 3;

    expect(
      cb,
      "calls `onChange` callback for the first time since `a` dep changed",
    ).toHaveBeenCalledTimes(1);
    expect(
      cb,
      "calls `onChange` callback passing new `a`",
    ).toHaveBeenLastCalledWith(5);
    expect(sut.value, "`value` is correct").toBe(5);
    expect(sut.prevValue).toBe(3);

    b.value = 4;

    expect(
      cb,
      "calls `onChange` callback for the first time since `b` dep changed",
    ).toHaveBeenCalledTimes(2);
    expect(
      cb,
      "calls `onChange` callback passing new `b`",
    ).toHaveBeenLastCalledWith(7);
    expect(sut.value, "`value` is correct").toBe(7);
    expect(sut.prevValue).toBe(5);

    b.value = 4;

    expect(
      cb,
      "doesn't call `onChange` callback for the same `b`",
    ).toHaveBeenCalledTimes(2);
    expect(sut.value, "`value` remains the same").toBe(7);
    expect(sut.prevValue).toBe(5);

    sut.value = 42;

    expect(
      cb,
      "calls `onChange` callback with value set directly as `sut.value`",
    ).toHaveBeenCalledTimes(3);
    expect(
      cb,
      "calls `onChange` callback passing new value",
    ).toHaveBeenLastCalledWith(42);
    expect(sut.value, "`value` is correct").toBe(42);
    expect(sut.prevValue).toBe(7);

    sut.value = 42;

    expect(
      cb,
      "doesn't call `onChange` callback with value set directly as `sut.value`",
    ).toHaveBeenCalledTimes(3);
    expect(sut.value, "`value` remains the same").toBe(42);
    expect(sut.prevValue).toBe(7);
  });

  test("using custom comparator", () => {
    const cb = vi.fn();
    const evenComparator = vi.fn<TrackedValueComparator<number>>(
      (a, b) => (a ?? 0) % 2 === (b ?? 0) % 2,
    );
    const a = new TrackedValue(1);
    const b = new TrackedValue(2);
    const sut = new MemoizedValue({
      fn: (a, b) => a + b,
      deps: [a, b],
      comparator: evenComparator,
    });
    sut.onChanged.addCallback(cb);

    // set value of MemoizedValue (sut) directly
    sut.value = 5;

    expect(
      cb,
      "doesn't call `onChange` callback since new value set directly as `sut.value` is odd",
    ).toHaveBeenCalledTimes(0);
    expect(
      sut.prevValue,
      "`prevValue` is `undefined` since new value set directly as `sut.value` is odd",
    ).toBe(undefined);
    expect(
      sut.value,
      "`value` remains the same since new value set directly as `sut.value` is odd",
    ).toBe(3);

    sut.value = 4;

    expect(
      cb,
      "calls `onChange` callback since new value set directly as `sut.value` is even",
    ).toHaveBeenCalledTimes(1);
    expect(
      cb,
      "calls `onChange` passing new even value set directly as `sut.value`",
    ).toBeCalledWith(4);
    expect(
      sut.prevValue,
      "`prevValue` is prev value since new value set directly as `sut.value` is even",
    ).toBe(3);
    expect(sut.value, "memoized `value` is new even number").toBe(4);

    // set value of a dependency
    a.value = 2;

    expect(
      cb,
      "doesn't call `onChange` callback since a+b=5 is odd",
    ).toHaveBeenCalledTimes(1);
    expect(
      sut.prevValue,
      "`prevValue` remains the same since a+b=5 is odd",
    ).toBe(3);
    expect(sut.value, "`value` remains the same since a+b=5 is odd").toBe(4);

    b.value = 3;

    expect(
      cb,
      "calls `onChange` callback since new memoized value is even",
    ).toHaveBeenCalledTimes(2);
    expect(
      cb,
      "calls `onChange` passing new even memoized value",
    ).toBeCalledWith(5);
    expect(
      sut.prevValue,
      "`prevValue` is prev value since new memoized value is even",
    ).toBe(4);
    expect(sut.value, "memoized `value` is new even number").toBe(5);
  });
});
