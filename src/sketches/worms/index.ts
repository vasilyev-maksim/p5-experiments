import type { ISketch } from "../../models";
import { controls, type Controls } from "./controls";
import { factory } from "./factory";
import { presets } from "./presets";

export const sketch: ISketch<Controls> = {
  factory,
  id: "worms",
  name: "worms",
  preview: {
    size: 434,
  },
  randomSeed: 40,
  controls,
  presets,
  type: "draft",
  startTime: 223,
  // presetsShuffle: 1,
};
