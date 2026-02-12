import type { ISketch } from "@/models";
import { factory } from "./factory";
import { controls, type Controls } from "./controls";
import { presets } from "./presets";

export const arcSketch: ISketch<Controls> = {
  factory,
  id: "arcs",
  name: "arcs",
  preview: {
    size: 300,
  },
  controls,
  presets,
  type: "released",
};
