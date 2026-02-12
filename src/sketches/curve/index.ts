import type { ISketch } from "../../models";
import { controls, type Controls } from "./controls";
import { factory } from "./factory";
import { presets } from "./presets";

export const curveSketch: ISketch<Controls> = {
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
