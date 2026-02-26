import { describe, expect, test, vi } from "vitest";
import { TrackedValue } from "./TrackedValue";
import type { TrackedValueComparator } from "./models";

describe("TrackedValue", () => {
  test(".setValue() sets new value, .getValue() returns value", () => {
    const sut = new TrackedValue();

    sut.setValue(1);

    expect(sut.getValue()).toBe(1);
  });

  test("calling .getValue() without prior call of .setValue() will cause an exception", () => {
    const sut = new TrackedValue();

    expect(() => {
      sut.getValue();
    }).toThrow();
  });

  test(".hasChanged() returns `false` before first .setValue()", () => {
    const sut = new TrackedValue();

    expect(sut.hasChanged()).toBe(false);
  });

  test(".hasChanged() returns `true` after first .setValue()", () => {
    const sut = new TrackedValue();

    sut.setValue(1);

    expect(sut.hasChanged()).toBe(true);
  });

  test(".hasChanged() return `true` if new value is different", () => {
    const sut = new TrackedValue();

    sut.setValue(1);
    sut.notChanged();

    sut.setValue(2);
    expect(sut.hasChanged()).toBe(true);
  });

  test(".notChanged() makes subsequent call of .hasChanged() to return `false`", () => {
    const sut = new TrackedValue();

    sut.setValue(1);

    sut.setValue(2);
    sut.notChanged();

    expect(sut.hasChanged()).toBe(false);
  });

  test("using custom comparator", () => {
    const evenComparator = vi.fn<TrackedValueComparator<number>>(
      (a, b) => (a ?? 0) % 2 === (b ?? 0) % 2,
    );
    const sut = new TrackedValue<number>(evenComparator);

    sut.setValue(1);
    sut.notChanged();

    sut.setValue(3);

    expect(sut.getValue()).toBe(1);
    expect(sut.hasChanged()).toBe(false);

    sut.setValue(2);

    expect(sut.getValue()).toBe(2);
    expect(sut.hasChanged()).toBe(true);
  });
});
