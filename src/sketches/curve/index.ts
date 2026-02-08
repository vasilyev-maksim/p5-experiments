import type { ISketch } from "../../models";
import { controls, type Params } from "./controls";
import { factory } from "./factory";
import { presets } from "./presets";

export const curveSketch: ISketch<Params> = {
  factory,
  id: "curve",
  name: "curve",
  preview: {
    size: 520,
  },
  randomSeed: 44,
  controls,
  presets,
  type: 'released',
};
