import type { ExtractParams, ISketch } from "../../models";
import { controls } from "./controls";
import { factory } from "./factory";
import { presets } from "./presets";

export type Params = ExtractParams<typeof controls>;

export const sketch: ISketch<Params> = {
  factory,
  id: "cubes",
  name: "cubes",
  preview: {
    size: 320,
  },
  randomSeed: 44,
  controls,
  presets,
  presetsShuffle: 1,
  presetsShuffleInterval: 1500,
  startTime: 150,
};
