import type { ISketch } from "../models";
import { spiralSketch } from "./spiral";
import { pillarsSketch } from "./pillars";
import { curveSketch } from "./curve";
import { arcSketch } from "./arcs";
import { circlesSketch } from "./circles";
import { sketch as _templateSketch } from "./_template";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sketchList: ISketch<any>[] = [
  spiralSketch,
  pillarsSketch,
  arcSketch,
  curveSketch,
  circlesSketch,
  _templateSketch,
  // {
  //   id: "tiles",
  //   name: "tiles",
  //   preview: {
  //     size: 420,
  //   },
  //   factory: tiles,
  //   timeShift: -20,
  //   randomSeed: 123,
  //   presets: [],
  //   controls: {},
  //   defaultParams: {},
  //   // randomSeed: 12,
  //   // randomSeed: 45,
  // },
];
