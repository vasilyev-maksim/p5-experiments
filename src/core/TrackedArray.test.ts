import { describe, expect, test } from "vitest";
import { TrackedArray } from "./TrackedArray";

describe("TrackedArray", () => {
  test("by default compares arrays by content (=== for elements)", () => {
    const sut = new TrackedArray<number>();

    sut.setValue([1, 2, 3]);

    sut.notChanged();
    sut.setValue([1, 2, 3]);
    expect(sut.hasChanged()).toBe(false);

    sut.notChanged();
    sut.setValue([1, 2, 999]);
    expect(sut.hasChanged()).toBe(true);

    sut.notChanged();
    sut.setValue([1, 2, 999, 4]);
    expect(sut.hasChanged()).toBe(true);
  });
});
