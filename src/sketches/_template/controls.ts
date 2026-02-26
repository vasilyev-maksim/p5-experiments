import type { IControls } from "@/models";

export type Controls = typeof controls;

export const controls = {
  N: {
    type: "range",
    min: 1,
    max: 10,
    step: 1,
    label: "Discrete N",
  },
  NA: {
    type: "range",
    min: 1,
    max: 10,
    step: 1,
    label: "Animated N",
  },
} as const satisfies IControls;
