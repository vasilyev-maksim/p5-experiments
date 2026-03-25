import type { IControls } from "@/models";
import { patternNames } from "./patterns";

export type Controls = typeof controls;

export const controls = {
  PATTERN_TYPE: {
    type: "choice",
    options: patternNames,
    label: "Pattern type",
  },
  ANIMATION_TYPE: {
    type: "choice",
    label: "Animation type",
    options: ["Static", "Forward", "Backward", "Both"],
  },
  RANDOM_SEED: {
    type: "range",
    min: 0,
    max: 1000,
    step: 1,
    label: "Random seed",
  },
  RESOLUTION: {
    type: "range",
    min: 3,
    max: 50,
    step: 1,
    label: "Resolution",
  },
  LENGTH: {
    type: "range",
    min: 1,
    max: 100,
    step: 1,
    label: "Max length",
  },
  THICKNESS: {
    type: "range",
    min: 0.05,
    max: 0.95,
    step: 0.05,
    label: "Thickness",
    valueFormatter: (x) => x.toFixed(2),
  },
  INNER_THICKNESS: {
    type: "range",
    min: 0,
    max: 0.95,
    step: 0.05,
    label: "Hollowness",
    valueFormatter: (x) => x.toFixed(2),
  },
  CORNERS_TYPE: {
    type: "choice",
    label: "Corner type",
    options: ["Square", "Round", "Cut"],
  },
  COLOR: {
    type: "color",
    colors: [
      ["red", "red"],
      ["red", "hsl(0, 100%, 14%)"],
      ["white", "white"],
      ["#ffffffff", "rgb(37, 37, 37)"],
      ["#5aff4aff", "hsl(115, 100%, 7%)"],
      ["#ea72f7ff", "#0000ffff"],
      ["rgb(253, 255, 121)", "#c04affff"],
    ],
    label: "Color",
  },
  INVERT_COLORS: {
    type: "boolean",
    label: "Invert colors",
  },
} as const satisfies IControls;
