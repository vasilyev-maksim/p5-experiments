import type { ISketch } from "../../models";
import { controls, type Controls } from "./controls";
import { factory } from "./factory";
import { presets } from "./presets";

export const circlesSketch: ISketch<Controls> = {
  factory,
  id: "circles",
  name: "circles",
  preview: {
    size: 700,
  },
  controls,
  presets,
  type: "released",
};
