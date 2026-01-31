import type { ISketch } from "../../models";
import { controls, type Params } from "./controls";
import { factory } from "./factory";
import { presets } from "./presets";

export const circlesSketch: ISketch<Params> = {
  factory,
  id: "circles",
  name: "circles",
  preview: {
    size: 700,
  },
  timeShift: 85,
  controls,
  presets,
  defaultParams: presets[0].params,
};
