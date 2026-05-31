import type { IControls, IParams } from "@/models";

export type Controls = typeof controls;

export const AnimationType = {
  Static: 0,
  Linear: 1,
  Radial: 2,
  // Rectangular: 3,
  // Rhombus: 4,
} as const;

export const FillType = {
  Solid: 0,
  Hollow: 1,
  Zebra: 2,
} as const;

export const controls = {
  RANDOM_SEED: {
    type: "range",
    min: 0,
    max: 1000,
    step: 1,
    label: "Random seed",
  },
  RESOLUTION: {
    type: "range",
    min: 2,
    max: 40,
    step: 1,
    label: "Resolution",
  },
  GAP: {
    type: "range",
    min: 1,
    max: 20,
    step: 1,
    label: "Gap",
  },
  BORDER_RADIUS: {
    type: "range",
    min: 0,
    max: 1.5,
    step: 0.05,
    label: "Border radius",
    valueFormatter: (x) => Math.floor(x * 100) + "",
  },
  MAX_TILE_AREA: {
    type: "range",
    min: 0.5,
    max: 35,
    step: 0.5,
    label: "Max tile area",
    valueFormatter: (x) => x + "%",
  },
  FILL_TYPE: {
    type: "choice",
    label: "Fill type",
    options: Object.keys(FillType),
  },
  STRIPE_SIZE: {
    type: "range",
    min: 10,
    max: 100,
    step: 1,
    label: "Stripes size",
    active: (params: IParams) => (params.FILL_TYPE as number) === 2,
  },
  BORDER_SIZE: {
    type: "range",
    min: 10,
    max: 100,
    step: 1,
    label: "Border size",
    active: (params: IParams) => (params.FILL_TYPE as number) === 1,
  },
  ANIMATION_TYPE: {
    type: "choice",
    options: Object.keys(AnimationType),
    label: "Animation type",
  },
  ANIMATION_CENTER: {
    type: "coordinates",
    label: "Center",
    active: (params: IParams) => (params.ANIMATION_TYPE as number) > 1,
  },
  ANIMATION_DIRECTION: {
    type: "coordinates",
    label: "Direction",
    active: (params: IParams) => (params.ANIMATION_TYPE as number) < 2,
  },
  COLOR: {
    type: "color",
    label: "Color",
    colors: [
      ["#fff", "#ff0000"],
      // ["#ff0000", "#ff0000"],
      ["#909090", "#ff0000"],
      ["#434343", "#ff0000"],
      // ["#fff", "#17FFEF"],
      ["#9F5CFE", "#17FFEF"],
    ],
  },
  INVERT_COLORS: {
    type: "boolean",
    label: "Invert colors",
  },
} as const satisfies IControls;
