import type { ISketch } from "./models";
import { escalator } from "./sketches/escalator";
import { lungs } from "./sketches/lungs";
import { pillars } from "./sketches/pillars";
import { pulse } from "./sketches/pulse";
import { spiral } from "./sketches/spiral";
import { tiles } from "./sketches/tiles/tiles";

export const sketchList: ISketch[] = [
  {
    id: "lungs",
    name: "lungs",
    preview: {
      size: 420,
    },
    factory: lungs,
    timeShift: 50,
  },
  {
    id: "escalator",
    name: "escalator",
    preview: {
      size: 300,
    },
    factory: escalator,
    timeShift: 60,
  },
  {
    id: "spiral",
    name: "spiral",
    preview: {
      size: 520,
    },
    factory: spiral,
  },
  {
    id: "pulse",
    name: "pulse",
    preview: {
      size: 520,
    },
    factory: pulse,
    randomSeed: 44,
  },
  {
    id: "pillars",
    name: "pillars",
    preview: {
      size: 420,
    },
    factory: pillars,
    randomSeed: 44,
    timeShift: 10,
  },
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
