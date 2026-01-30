import type { ExtractParams, IControls } from "@/models";

export type Params = ExtractParams<typeof controls>;

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
    options: [
      { label: "#1", value: 0 },
      { label: "#2", value: 1 },
      { label: "#3", value: 2 },
      { label: "#4", value: 3 },
      { label: "#5", value: 4 },
    ],
    label: "Pattern type",
  },
  CURVATURE_TYPE: {
    type: "choice",
    options: [
      { label: "dynamic", value: 0 },
      { label: "dynamic inverted", value: 1 },
      { label: "static", value: 2 },
    ],
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
      // ["#ffffffff", "#1e00c8ff"],
      ["#ffffffff", "#000000ff"],
    ],
    label: "Color",
  },
} as const satisfies IControls;
