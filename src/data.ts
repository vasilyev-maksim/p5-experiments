import type { ISketch } from "./models";
import { escalator } from "./sketches/escalator";
import { lungs } from "./sketches/lungs";
import { pillars } from "./sketches/pillars";
import { pulse } from "./sketches/pulse";
import { spiral } from "./sketches/spiral";
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
    timeShift: 1000,
    factory: spiral,
    controls: [
      {
        key: "n",
        max: 11,
        min: 2,
        step: 1,
        type: "range",
        defaultValue: 3,
      },
      {
        key: "t",
        max: 20,
        min: 2,
        step: 1,
        type: "range",
        defaultValue: 4,
      },
      {
        key: "as",
        max: 100,
        min: 1,
        step: 1,
        type: "range",
        defaultValue: 2,
      },
      {
        key: "bs",
        max: 20,
        min: 1,
        step: 1,
        type: "range",
        defaultValue: 2,
      },
      {
        key: "ls",
        max: 10,
        min: 0,
        step: 1,
        type: "range",
        defaultValue: 1.5,
      },
      {
        key: "cs",
        max: 10,
        min: 1,
        step: 1,
        type: "range",
        defaultValue: 10,
      },
      {
        key: "s",
        max: 10,
        min: 0,
        step: 1,
        type: "range",
        defaultValue: 1,
      },
      {
        key: "sf",
        max: 10,
        min: 1,
        step: 1,
        type: "range",
        defaultValue: 1,
      },
    ],
    presets: [
      {
        params: {
          n: 3,
          t: 4,
          as: 2,
          bs: 2,
          ls: 1.5,
          cs: 10,
          s: 1,
          sf: 1,
        },
      },
      {
        params: {
          n: 11,
          t: 20,
          as: 90,
          bs: 2,
          ls: 1.5,
          cs: 10,
          s: 10,
          sf: 10,
        },
      },
      {
        params: {
          n: 11,
          t: 20,
          as: 76,
          bs: 2,
          ls: 10,
          cs: 10,
          s: 0,
          sf: 1,
        },
      },
      {
        params: {
          n: 6,
          t: 2,
          as: 100,
          bs: 20,
          ls: 10,
          cs: 10,
          s: 1,
          sf: 10,
        },
      },
      {
        params: {
          n: 3,
          t: 20,
          as: 28,
          bs: 2,
          ls: 0,
          cs: 10,
          s: 10,
          sf: 1,
        },
      },
      {
        params: {
          n: 11,
          t: 11,
          as: 65,
          bs: 2,
          ls: 6,
          cs: 10,
          s: 10,
          sf: 1,
        },
      },
    ],
  } satisfies ISketch<"n" | "t" | "as" | "bs" | "s" | "ls" | "cs" | "sf">,
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
