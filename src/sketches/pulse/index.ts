import type { ISketch } from "../../models";
import { controls, type Params } from "./controls";
import { factory } from "./factory";
import { presets } from "./presets";

export const pulseSketch: ISketch<Params> = {
  factory,
  id: "pulse",
  name: "pulse",
  preview: {
    size: 520,
  },
  timeShift: 0,
  randomSeed: 44,
  controls,
  presets,
  defaultParams: presets[0].params,
};
