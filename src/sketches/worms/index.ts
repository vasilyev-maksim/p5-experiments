import type { ISketch } from "../../models";
import { controls, type Controls } from "./controls";
import { factory } from "./factory";
import { presets } from "./presets";

export const sketch: ISketch<Controls> = {
  factory,
  id: "worms",
  name: "worms",
  preview: {
    sizeInPercents: 35,
  },
  controls,
  presets,
  type: "released",
  startTime: 0,
};
