import type { ExtractParams, IControls } from "@/models";

export type Params = ExtractParams<typeof controls>;

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
    options: [
      { label: "Square", value: 0 },
      { label: "Round", value: 1 },
      { label: "Cut", value: 2 },
    ],
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
  ANIMATED: {
    type: "boolean",
    label: "Animated",
  },
} as const satisfies IControls;
