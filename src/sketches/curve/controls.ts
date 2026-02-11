import type { ExtractParams, IControls } from "@/models";

export type Params = ExtractParams<typeof controls>;

export const controls = {
  CURVE_RESOLUTION: {
    label: "Curve resolution",
    max: 100,
    min: 5,
    step: 1,
    type: "range",
  },
  CURVES_COUNT: {
    label: "Curves count",
    max: 49,
    min: 1,
    step: 2,
    type: "range",
  },
  GAP: {
    label: "Gap",
    max: 50,
    min: 10,
    step: 1,
    type: "range",
  },
  CHAOS_FACTOR: {
    label: "Chaos factor",
    max: 100,
    min: 0,
    step: 1,
    type: "range",
    valueFormatter: (x) => x + "%",
  },
  DISPERSION: {
    label: "Dispersion",
    max: 1,
    min: 0,
    step: 0.05,
    type: "range",
    valueFormatter: (x) => x.toFixed(2),
  },
  TRACE_FACTOR: {
    label: "Trace factor",
    max: 100,
    min: 0,
    step: 1,
    type: "range",
    valueFormatter: (x) => x + "%",
  },
  JOINT_TYPE: {
    label: "Joint type",
    type: "choice",
    options: ["None", "Square", "Circle", "Plus", "Cross"],
  },
  COLOR: {
    type: "color",
    colors: [["#ff0000ff"], ["#00fbffff"], ["#36ff1fff"], ["#ffffffff"]],
    label: "Color",
  },
} as const satisfies IControls;
