import type { IControls } from "@/models";

export const controls = {
  ZOOM: {
    type: "range",
    min: 0.5,
    max: 3,
    step: 0.01,
    label: "Zoom",
    valueFormatter: (x) => x.toFixed(2),
  },
} as const satisfies IControls;
