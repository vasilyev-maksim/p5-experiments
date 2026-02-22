import { describe, expect, test } from "vitest";
import { MemoizedAnimatedValue } from "./MemoizedAnimatedValue";
import { TrackedValue } from "./TrackedValue";
import { AnimatedValue } from "./AnimatedValue";
import { range } from "@/utils/misc";

describe("MemoizedAnimatedValue", () => {
  test("default scenario", () => {
    const a = new TrackedValue(0);
    const b = new TrackedValue(0);
    let time = 0;
    const sut = new MemoizedAnimatedValue({
      fn: (a, b) => a + b,
      animationDuration: 10,
      deps: [a, b],
      timeProvider: () => time,
      timingFunction: AnimatedValue.TIMING_FUNCTIONS.LINEAR,
    });

    expect(sut.getCurrentValue(time)).toBe(0);

    a.value = 10;

    expect(sut.getEndValue()).toBe(10);

    range(11).map((i) => {
      expect(sut.getCurrentValue(time++), `time=${time}`).toBe(i);
    });

    sut.animatedValue.set({ currentTime: 0, value: 10 });
    b.value = 10;

    range(11).map((i) => {
      expect(sut.getCurrentValue(time++), `time=${time}`).toBe(10 + i);
    });
  });
});
