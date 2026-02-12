import type { IControls } from "@/models";

export type Controls = typeof controls;

export const controls = {
  RESOLUTION: {
    type: "range",
    min: 3,
    max: 50,
    step: 1,
    label: "Resolution",
  },
  WORM_LENGTH: {
    type: "range",
    min: 0,
    max: 100,
    step: 1,
    label: "Worm length",
  },
  THICKNESS: {
    type: "range",
    min: 0.05,
    max: 0.95,
    step: 0.05,
    label: "Worm thickness",
    valueFormatter: (x) => x.toFixed(2),
  },
  CORNERS_TYPE: {
    type: "choice",
    label: "Corner type",
    options: ["Square", "Round", "Cut"],
  },
  ANIMATION_TYPE: {
    type: "choice",
    label: "Animation type",
    options: ["Static", "Direct", "Inverse", "Dynamic"],
  },
  L: {
    label: "L",
    type: "range",
    min: 0,
    max: 1,
    step: 0.1,
    valueFormatter: (x) => x.toFixed(1),
  },
  R: {
    label: "R",
    type: "range",
    min: 0,
    max: 1,
    step: 0.1,
    valueFormatter: (x) => x.toFixed(1),
  },
  U: {
    label: "U",
    type: "range",
    min: 0,
    max: 1,
    step: 0.1,
    valueFormatter: (x) => x.toFixed(1),
  },
  D: {
    label: "D",
    type: "range",
    min: 0,
    max: 1,
    step: 0.1,
    valueFormatter: (x) => x.toFixed(1),
  },
  DIRECTION_RANDOMNESS: {
    type: "boolean",
    label: "Random direction",
  },
  COLOR: {
    type: "color",
    colors: [
      ["red", "red"],
      ["red", "rgb(74, 0, 0)"],
      ["#0000ffff", "#ea72f7ff"],
      ["#fcff39ff", "#c04affff"],
      ["#18005fff", "#5aff4aff"],
      ["#ffffffff", "rgb(37, 37, 37)"],
    ],
    label: "Color",
  },
  INVERT_COLORS: {
    type: "boolean",
    label: "Invert colors",
  },
  TEST: {
    type: "coordinate",
    label: "asasas",
  },
} as const satisfies IControls;
