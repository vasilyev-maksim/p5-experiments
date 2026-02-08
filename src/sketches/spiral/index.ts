import type { ISketch } from "../../models";
import { controls, type Params } from "./controls";
import { factory } from "./factory";
import { presets } from "./presets";

export const spiralSketch: ISketch<Params> = {
  factory,
  id: "spiral",
  name: "spiral",
  preview: {
    size: 515,
  },
  controls,
  presets,
  type: "released",
};
