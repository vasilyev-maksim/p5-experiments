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
  ZOOM: {
    type: "range",
    min: 1,
    max: 5,
    step: 1,
    label: "Zoom",
  },
  ROTATION_SPEED: {
    type: "range",
    min: 0,
    max: 100,
    step: 1,
    label: "Rotation speed",
  },
  COIL_FACTOR: {
    label: "Coil factor",
    max: 400,
    min: 0,
    step: 1,
    type: "range",
  },
  COIL_SPEED: {
    label: "Coil speed",
    max: 5,
    min: 0,
    step: 0.1,
    type: "range",
    valueFormatter: (x) => x.toFixed(1),
  },
  GAP: {
    label: "Gap",
    max: 100,
    min: 1,
    step: 1,
    type: "range",
  },
  COLOR: {
    type: "color",
    colors: [
      ["rgb(47, 0, 78)", "#ea72f7ff"],
      ["rgb(0, 37, 14)", "rgb(242, 255, 0)"],
      ["#13005fff", "rgb(97, 255, 83)"],
      ["#000", "#ffffffff"],
    ],
    label: "Color",
  },
} as const satisfies IControls;
