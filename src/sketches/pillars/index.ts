import type { ISketch } from "../../models";
import { controls, type Controls } from "./controls";
import { factory } from "./factory";
import { presets } from "./presets";

export const pillarsSketch: ISketch<Controls> = {
  factory,
  id: "pillars",
  name: "pillars",
  preview: {
    sizeInPercents: 33,
  },
  randomSeed: 144,
  controls,
  presets,
  type: "released",
};
