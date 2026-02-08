import type { ISketch } from "@/models";
import { factory } from "./factory";
import { type Params, controls } from "./controls";
import { presets } from "./presets";

export const arcSketch: ISketch<Params> = {
  factory,
  id: "arcs",
  name: "arcs",
  preview: {
    size: 300,
  },
  controls,
  presets,
  type: 'released',
};
