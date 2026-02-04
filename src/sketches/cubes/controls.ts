import type { IControls } from "@/models";

export const controls = {
  RESOLUTION: {
    type: "range",
    min: 0,
    max: 4,
    step: 1,
    label: "Layers",
    // valueFormatter: (x) => x * 2 + 1 + "",
  },
  ZOOM: {
    type: "range",
    min: 0,
    max: 2000,
    step: 1,
    label: "Zoom",
  },
  CAMERA_ROTATION: {
    type: "boolean",
    label: "Camera rotation",
  },
  CUBE_SIZE: {
    type: "range",
    min: 10,
    max: 100,
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
} as const satisfies IControls;
