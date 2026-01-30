import type { ISketch } from "../../models";
import { controls, type Params } from "./controls";
import { factory } from "./factory";
import { presets } from "./presets";

export const lungsSketch: ISketch<Params> = {
  factory,
  id: "lungs",
  name: "lungs",
  preview: {
    size: 420,
  },
  timeShift: 50,
  controls,
  presets,
  defaultParams: presets[0].params,
};
