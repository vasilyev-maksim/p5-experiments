import type { IControls } from "@/models";

export type Controls = typeof controls;

export const controls = {
  RESOLUTION: {
    type: "range",
    min: 0,
    max: 4,
    step: 1,
    label: "Resolution",
  },
  ZOOM: {
    type: "range",
    min: 0,
    max: 2000,
    step: 1,
    label: "Zoom",
  },
  CUBE_SIZE: {
    type: "range",
    min: 10,
    max: 60,
    step: 1,
    label: "Cube size",
  },
  GAP: {
    type: "range",
    min: 0,
    max: 2,
    step: 0.01,
    label: "Gap",
    valueFormatter: (x) => x.toFixed(2),
  },
  CAMERA_ROTATION: {
    type: "boolean",
    label: "Camera rotation",
  },
} as const satisfies IControls;
