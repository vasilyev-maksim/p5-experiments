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

    sut.animateTo({
      currentTime: time,
      value: 10,
    });

    expect(sut.getEndValue(), "end value should be correct").toBe(10);

    range(3).map((i) => {
      expect(sut.getCurrentValue(time++), `time=${time}`).toBe(i * 5);
    });

    // Force set all values to 0 without any interpolations

    sut.set({
      currentTime: time,
      value: 0,
    });

    expect(sut.getCurrentValue(time), "after `set`").toBe(0);

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
});
