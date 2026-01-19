import type { ISketch } from "../models";
import { lungs } from "./lungs";
import { pillarsSketch } from "./pillars";
import { pulseSketch } from "./pulse";
import { spiralSketch } from "./spiral";
// import { tiles } from "./tiles/tiles";
import { arcSketch } from "./border-points-joiner/arcs";
import { escalatorSketch } from "./border-points-joiner/zigzags";
import { testSketch } from "./test";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sketchList: ISketch<any>[] = [
  {
    id: "lungs",
    name: "lungs",
    preview: {
      size: 420,
    },
    factory: lungs,
    timeShift: 50,
    presets: [],
    controls: {},
    defaultParams: {},
  },
  escalatorSketch,
  arcSketch,
  spiralSketch,
  pulseSketch,
  pillarsSketch,
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
  testSketch,
];
