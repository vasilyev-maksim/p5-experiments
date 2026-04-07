import type { ISketch } from "../../models";
import { controls, type Controls } from "./controls";
import { factory } from "./factory";
import { presets } from "./presets";

export const sketch: ISketch<Controls> = {
  factory,
  id: "cubes",
  name: "cubes",
  preview: {
    sizeInPercents: 28,
  },
  randomSeed: 44,
  controls,
  presets,
  shufflePresets: 1,
  shufflePresetsInterval: 1500,
  startTime: 150,
  type: "released",
};
