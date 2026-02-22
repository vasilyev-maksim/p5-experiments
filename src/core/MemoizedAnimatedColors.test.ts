/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, test } from "vitest";
import {
  MemoizedAnimatedColors,
  type p5Subset,
} from "./MemoizedAnimatedColors";
import { TrackedValue } from "./TrackedValue";
import { AnimatedValue } from "./AnimatedValue";

test("MemoizedAnimatedColors", () => {
  const colorIndex = new TrackedValue(0);
  const p: p5Subset = {
    red: (colorStr: string) => Number(colorStr.split("_")[0]),
    green: (colorStr: string) => Number(colorStr.split("_")[0]),
    blue: (colorStr: string) => Number(colorStr.split("_")[0]),
    color: ((...args: any[]) => {
      if (typeof args[0] === "string") {
        return args[0];
      } else {
        return args.join("_");
      }
    }) as any,
  };
  const colors = [
    ["0_0_0", "50_50_50"],
    ["100_100_100", "150_150_150"],
    ["200_200_200", "225_225_225"],
  ];

  let time = 0;
  const sut = new MemoizedAnimatedColors({
    colorProvider: (i) => colors[i],
    animationDuration: 10,
    deps: [colorIndex],
    timeProvider: () => time,
    timingFunction: AnimatedValue.TIMING_FUNCTIONS.LINEAR,
    p,
  });

  expect(sut.getCurrentValue(0), "has correct initial value").toEqual([
    "0_0_0",
    "50_50_50",
  ]);

  colorIndex.value = 1;

  expect(sut.getEndValue(), "end value is correct").toEqual([
    "100_100_100",
    "150_150_150",
  ]);

  expect(sut.getCurrentValue(0), "starts with init value").toEqual([
    "0_0_0",
    "50_50_50",
  ]);
  expect(sut.getCurrentValue(1), "interpolates correctly").toEqual([
    "10_10_10",
    "60_60_60",
  ]);
  expect(sut.getCurrentValue(2), "interpolates correctly").toEqual([
    "20_20_20",
    "70_70_70",
  ]);
  expect(sut.getCurrentValue(9), "interpolates correctly").toEqual([
    "90_90_90",
    "140_140_140",
  ]);
  expect(sut.getCurrentValue(10), "reaches target value").toEqual([
    "100_100_100",
    "150_150_150",
  ]);

  time = 10;
  colorIndex.value = 2;

  expect(sut.getEndValue(), "end value is correct").toEqual([
    "200_200_200",
    "225_225_225",
  ]);

  expect(sut.getCurrentValue(10), "starts with prev value").toEqual([
    "100_100_100",
    "150_150_150",
  ]);
  expect(sut.getCurrentValue(11), "interpolates correctly").toEqual([
    "110_110_110",
    "157.5_157.5_157.5",
  ]);
  expect(sut.getCurrentValue(20), "reaches target value").toEqual([
    "200_200_200",
    "225_225_225",
  ]);
});
