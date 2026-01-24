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
  timeShift: 1002,
  controls,
  presets,
  defaultParams: presets[0].params,
};
