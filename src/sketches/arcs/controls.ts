import type { IControls } from "@/models";

export type Controls = typeof controls;

export const controls = {
  RESOLUTION: {
    type: "range",
    min: 2,
    max: 60,
    step: 1,
    label: "Resolution",
  },
  MAX_CURVATURE: {
    type: "range",
    min: 0,
    max: 2,
    step: 0.05,
    label: "Max curvature",
    valueFormatter: (x) => x.toFixed(2),
  },
  MAX_NEGATIVE_CURVATURE: {
    type: "range",
    min: 0,
    max: 2,
    step: 0.05,
    label: "Max negative curvature",
    valueFormatter: (x) => x.toFixed(2),
  },
  PADDING_PERCENT: {
    type: "range",
    min: 0,
    max: 50,
    step: 1,
    label: "Padding",
    valueFormatter: (x) => x + "%",
  },
  PATTERN_TYPE: {
    type: "choice",
    options: ["1", "2", "3", "4", "5"],
    label: "Pattern type",
  },
  CURVATURE_TYPE: {
    type: "choice",
    options: ["Dynamic", "Dynamic inverted", "Static"],
    label: "Curvature type",
  },
  INVERT_COLORS: {
    type: "boolean",
    label: "Invert colors",
  },
  COLOR: {
    type: "color",
    colors: [
      ["#0000ffff", "#ea72f7ff"],
      ["#fcff39ff", "#c04affff"],
      ["#18005fff", "#5aff4aff"],
      ["#ffffffff", "#000000ff"],
    ],
    label: "Color",
  },
} as const satisfies IControls;
