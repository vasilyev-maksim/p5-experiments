import type { ExtractParams, ISketch } from "../../models";
import { controls } from "./controls";
import { factory } from "./factory";
import { presets } from "./presets";

export type Params = ExtractParams<typeof controls>;

export const sketch: ISketch<Params> = {
  factory,
  id: "cube3D",
  name: "cube3D",
  preview: {
    size: 520,
  },
  randomSeed: 44,
  controls,
  presets,
};
