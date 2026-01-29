import type { ExtractParams, IControls } from "../../models";

export const controls = {
  RESOLUTION: {
    label: "Pillars count",
    max: 20,
    min: 1,
    step: 1,
    type: "range",
  },
  AMPLITUDE: {
    label: "Wave amplitude",
    max: 10,
    min: 0,
    step: 1,
    type: "range",
  },
  PERIOD: {
    label: "Wave period",
    max: 4,
    min: 0.5,
    step: 0.5,
    type: "range",
  },
  GAP_X: {
    label: "Horizontal gap",
    max: 30,
    min: 0,
    step: 1,
    type: "range",
  },
  GAP_Y: {
    label: "Vertical gap",
    max: 200,
    min: 1,
    step: 1,
    type: "range",
  },
  W_DISPERSION: {
    label: "Pillar width dispersion",
    max: 0.8,
    min: 0,
    step: 0.1,
    type: "range",
    valueFormatter: (x) => x.toFixed(1),
  },
  COLOR: {
    type: "color",
    colors: [
      ["#340998ff", "#ea72f7ff"],
      ["#ff4b4bff", "#f0f689ff"],
      ["#13005fff", "#a3ff9aff"],
      ["#000", "#ffffffff"],
    ],
    label: "Color",
  },
} as const satisfies IControls;
export type Params = ExtractParams<typeof controls>;
