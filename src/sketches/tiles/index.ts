import type { ISketch } from "../../models";
import { controls, type Controls } from "./controls";
import { factory } from "./factory";
import { presets } from "./presets";

export const sketch: ISketch<Controls> = {
  factory,
  controls,
  presets,
  type: "draft",
  id: "tiles",
  name: "tiles",
  preview: {
    sizeInPercents: 36,
  },
  startTime: 0,
  shufflePresets: -1,
  // randomSeed: 123,
};
