import { describe, expect, test } from "vitest";
import { TrackedValue } from "./TrackedValue";
import { MemoizedValue } from "./MemoizedValue";

describe("MemoizedValue", () => {
  test(".recalc() calculates and sets new value", () => {
    const a = new TrackedValue<number>();
    const b = new TrackedValue<number>();
    const sut = new MemoizedValue({ fn: (a, b) => a + b, deps: [a, b] });

    a.setValue(1);
    b.setValue(2);

    sut.recalc();

    expect(sut.getValue()).toBe(3);
  });

  test(".recalc() will not change value if none of `deps` has changed", () => {
    const a = new TrackedValue<number>();
    const b = new TrackedValue<number>();
    const sut = new MemoizedValue({ fn: (a, b) => a + b, deps: [a, b] });

    sut.recalc();

    expect(sut.hasChanged()).toBe(false);
  });

  test(".recalc() will not change value if calculated result is the same", () => {
    const a = new TrackedValue<number>();
    const b = new TrackedValue<number>();
    const sut = new MemoizedValue({ fn: (a, b) => a + b, deps: [a, b] });

    a.setValue(1);
    b.setValue(2);

    sut.recalc();

    a.setValue(2);
    b.setValue(1);

    sut.recalc();
    expect(sut.hasChanged()).toBe(true);
  });
});
