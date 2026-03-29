import type { ISketch } from "../../models";
import { controls, type Controls } from "./controls";
import { factory } from "./factory";
import { presets } from "./presets";

export const spiralSketch: ISketch<Controls> = {
  factory,
  id: "spiral",
  name: "spiral",
  preview: {
    sizeInPercents: 44,
  },
  controls,
  presets,
  type: "released",
};
