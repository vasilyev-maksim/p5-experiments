import type { IControls } from "@/models";

export type Controls = typeof controls;

export const controls = {
  N: {
    type: "range",
    min: 0,
    max: 1,
    step: 0.05,
    label: "N",
  },
  NInt: {
    type: "range",
    min: 1,
    max: 10,
    step: 1,
    label: "N",
  },
} as const satisfies IControls;
