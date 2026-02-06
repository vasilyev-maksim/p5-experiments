import type { ISketch } from "../models";
import { spiralSketch } from "./spiral";
import { pillarsSketch } from "./pillars";
import { curveSketch } from "./curve";
import { arcSketch } from "./arcs";
import { circlesSketch } from "./circles";
import { sketch as citySketch } from "./city";
import { sketch as cubesSketch } from "./cubes";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sketchList: ISketch<any>[] = [
  citySketch,
  cubesSketch,
  spiralSketch,
  pillarsSketch,
  arcSketch,
  curveSketch,
  circlesSketch,
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
