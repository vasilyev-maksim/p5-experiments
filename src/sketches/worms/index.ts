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
  controls,
  presets,
  type: "only",
  startTime: 0,
  // randomSeed: 40,
  // presetsShuffle: 1,
};
