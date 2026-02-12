import type { ISketch } from "../../models";
import { controls, type Controls } from "./controls";
import { factory } from "./factory";
import { presets } from "./presets";

export const sketch: ISketch<Controls> = {
  factory,
  id: "city",
  name: "city",
  preview: {
    size: 520,
  },
  randomSeed: 44,
  controls,
  presets,
  type: "draft",
};
