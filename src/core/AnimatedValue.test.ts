import { describe, expect, test } from "vitest";
import { AnimatedValue } from "./AnimatedValue";
import { range } from "@/utils/misc";

describe("AnimatedValue", () => {
  test("default scenario", () => {
    let time = 0;
    const sut = new AnimatedValue({
      animationDuration: 2,
      initialValue: 0,
      timingFunction: AnimatedValue.TIMING_FUNCTIONS.LINEAR,
    });

    expect(sut.reachedTheEnd(time), "initially reaches the end").toBe(true);

    expect(
      sut.getCurrentValue(time - 1),
      "doesn't extrapolate, stays at `start`",
    ).toBe(0);

    sut.animateTo({
      currentTime: time,
      value: 10,
      animationDuration: 2,
    });

    expect(sut.getEndValue(), "end value should be correct").toBe(10);
    expect(sut.reachedTheEnd(time), "does not reach the end").toBe(false);

    range(3).map((i) => {
      expect(sut.getCurrentValue(time++), `time=${time}`).toBe(i * 5);
    });

    expect(sut.reachedTheEnd(time), "reaches the end").toBe(true);

    time++;

    expect(
      sut.getCurrentValue(time),
      "doesn't extrapolate, stays at `end`",
    ).toBe(10);
    expect(sut.reachedTheEnd(time), "reaches the end").toBe(true);

    // Force set all values to 0 without any interpolations

    sut.set({
      currentTime: time,
      value: 0,
    });

    expect(sut.getCurrentValue(time), "after `set`").toBe(0);
    expect(sut.getEndValue(), "after `set`").toBe(0);

    // start slow animation

    sut.animateTo({
      currentTime: time,
      value: 10,
      animationDuration: 10,
    });

    range(11).map((i) => {
      expect(sut.getCurrentValue(time++), `time=${time}`).toBe(i);
    });

    // reset value to 0

    sut.set({
      currentTime: time,
      value: 0,
    });

    // start animation, then in the middle animate to another value with different speed

    sut.animateTo({
      currentTime: time,
      value: 10,
      animationDuration: 10,
    });

    range(5).map((i) => {
      expect(sut.getCurrentValue(time++), `time=${time}`).toBe(i);
    });

    // this is the middle of animation, curr value at the moment is 5,
    // now move to 15 fast

    sut.animateTo({
      currentTime: time,
      value: 15,
      animationDuration: 2,
    });

    range(3).map((i) => {
      expect(sut.getCurrentValue(time++), `time=${time}`).toBe(5 + i * 5);
    });

    // then move in negative direction with even more speed

    sut.animateTo({
      currentTime: time,
      value: -15,
      animationDuration: 3,
    });

    range(4).map((i) => {
      expect(sut.getCurrentValue(time++), `time=${time}`).toBe(15 - i * 10);
    });
  });

  describe("custom timing function", () => {
    test("ascending", () => {
      const sut = new AnimatedValue({
        animationDuration: 2,
        initialValue: 0,
        timingFunction: (x) => x ** 2,
      });

      sut.animateTo({
        currentTime: 0,
        value: 10,
        animationDuration: 2,
      });

      expect(sut.getCurrentValue(0)).toBe(0);
      expect(sut.getCurrentValue(1)).toBe(2.5);
      expect(sut.getCurrentValue(2)).toBe(10);
      expect(sut.getCurrentValue(3)).toBe(10);
    });

    test("descending", () => {
      const sut = new AnimatedValue({
        animationDuration: 2,
        initialValue: 0,
        timingFunction: (x) => 1 - x,
      });

      sut.animateTo({
        currentTime: 0,
        value: 10,
        animationDuration: 2,
      });

      expect(sut.getCurrentValue(0)).toBe(10);
      expect(sut.getCurrentValue(1)).toBe(5);
      expect(sut.getCurrentValue(2)).toBe(0);
      expect(sut.getCurrentValue(3)).toBe(10);
    });
  });
});
