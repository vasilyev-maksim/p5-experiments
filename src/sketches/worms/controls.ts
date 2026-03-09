import type { IControls } from "@/models";
import { patternNames } from "./patterns";

export type Controls = typeof controls;

export const controls = {
  PATTERN_TYPE: {
    type: "choice",
    options: patternNames,
    label: "Pattern type",
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
  ANIMATION_TYPE: {
    type: "choice",
    label: "Animation type",
    options: ["Static", "Forward", "Backward", "Both"],
  },
  COLOR: {
    type: "color",
    colors: [
      ["red", "red"],
      ["red", "rgb(74, 0, 0)"],
      // ["red", "rgb(0, 0, 0)"],
      ["white", "white"],
      ["#0000ffff", "#ea72f7ff"],
      ["rgb(253, 255, 121)", "#c04affff"],
      ["#18005fff", "#5aff4aff"],
      ["#ffffffff", "rgb(37, 37, 37)"],
    ],
    label: "Color",
  },
  INVERT_COLORS: {
    type: "boolean",
    label: "Invert colors",
  },
} as const satisfies IControls;
