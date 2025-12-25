import type { ISketch } from "./models";
import { escalatorSketch } from "./sketches/escalator";
import { lungs } from "./sketches/lungs";
import { pillarsSketch } from "./sketches/pillars";
import { pulse } from "./sketches/pulse";
import { spiralSketch } from "./sketches/spiral";
import { tiles } from "./sketches/tiles/tiles";

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
  },
  escalatorSketch,
  spiralSketch,
  {
    id: "pulse",
    name: "pulse",
    preview: {
      size: 520,
    },
    factory: pulse,
    randomSeed: 44,
  },
  pillarsSketch,
  {
    id: "tiles",
    name: "tiles",
    preview: {
      size: 420,
    },
    factory: tiles,
    timeShift: -20,
    randomSeed: 123,
    // randomSeed: 12,
    // randomSeed: 45,
  },
];
