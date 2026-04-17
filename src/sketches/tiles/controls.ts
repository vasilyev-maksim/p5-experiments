import type { IControls } from "@/models";

export type Controls = typeof controls;

export const controls = {
  RANDOM_SEED: {
    type: "range",
    min: 0,
    max: 1000,
    step: 1,
    label: "Random seed",
  },
  RESOLUTION: {
    type: "range",
    min: 2,
    max: 40,
    step: 1,
    label: "Resolution",
  },
  GAP: {
    type: "range",
    min: 1,
    max: 20,
    step: 1,
    label: "Gap",
  },
  BORDER_RADIUS: {
    type: "range",
    min: 0,
    max: 1.5,
    step: 0.05,
    label: "Border radius",
    valueFormatter: (x) => Math.floor(x * 100) + "%",
  },
  MAX_TILE_AREA: {
    type: "range",
    min: 1,
    max: 75,
    step: 1,
    label: "Max tile area",
    valueFormatter: (x) => x + "%",
  },
  HOLLOWNESS: {
    type: "range",
    min: 0,
    max: 0.95,
    step: 0.01,
    label: "Hollowness",
    valueFormatter: (x) => Math.floor(x * 100) + "%",
  },
  ZEBRA: {
    type: "range",
    min: 0,
    max: 100,
    step: 1,
    label: "Zebra",
  },
  ANIMATED: {
    type: "boolean",
    label: "Animated",
  },
} as const satisfies IControls;
