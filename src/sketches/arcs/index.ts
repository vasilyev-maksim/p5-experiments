import type { ISketch } from "@/models";
import { factory } from "./factory";
import { controls, type Controls } from "./controls";
import { presets } from "./presets";

export const arcsSketch: ISketch<Controls> = {
  factory,
  id: "arcs",
  name: "arcs",
  preview: {
    sizeInPercents: 26,
  },
  controls,
  presets,
  type: "released",
};
