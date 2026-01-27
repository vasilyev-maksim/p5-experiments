import type { ISketch } from "../../models";
import { controls, type Params } from "./controls";
import { factory } from "./factory";
import { presets } from "./presets";

export const pillarsSketch: ISketch<Params> = {
  factory,
  id: "pillars",
  name: "pillars",
  preview: {
    size: 390,
  },
  timeShift: 25.5,
  randomSeed: 144,
  controls,
  presets,
  defaultParams: presets[0].params,
};
