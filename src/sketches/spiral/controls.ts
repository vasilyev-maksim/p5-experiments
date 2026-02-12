import type { IControls } from "../../models";

export type Controls = typeof controls;

export const controls = {
  POLYGON_N: {
    label: "Profile shape",
    valueFormatter: (value, { max }) => {
      if (value === max) {
        return "circle";
      } else if (value === 2) {
        return "line";
      } else if (value === 3) {
        return "triangle";
      } else if (value === 4) {
        return "square";
      } else if (value === 5) {
        return "pentagon";
      } else {
        return value + "-gon";
      }
    },
    max: 11,
    min: 2,
    step: 1,
    type: "range",
  },
  THICKNESS: {
    label: "Thickness",
    max: 20,
    min: 2,
    step: 1,
    type: "range",
  },
  ROTATION_SPEED: {
    label: "Rotation speed",
    max: 10,
    min: 0,
    step: 1,
    type: "range",
  },
  COIL_FACTOR: {
    label: "Coil factor",
    max: 100,
    min: 0,
    step: 1,
    type: "range",
  },
  COIL_SPEED: {
    label: "Coil speed",
    max: 10,
    min: 0,
    step: 1,
    type: "range",
  },
  ZOOM: {
    label: "Zoom",
    max: 20,
    min: 1,
    step: 0.1,
    type: "range",
    valueFormatter: (x) => "x" + x.toFixed(1),
  },
  COLOR_CHANGE_SPEED: {
    label: "Color change speed",
    max: 10,
    min: -10,
    step: 1,
    type: "range",
  },
  BORDER_COLOR: {
    type: "color",
    colors: [
      ["#ff0000ff"],
      ["#aa00ffff"],
      ["#00a6ffff"],
      ["#00ff4cff"],
      ["#ffffffff"],
      ["#000000ff"],
    ],
    label: "Border color",
  },
  FILL_COLORS: {
    type: "color",
    colors: [
      ["#670374ff", "#2d0193ff"],
      ["#340998ff", "#ea72f7ff"],
      ["#ff4b4bff", "#f0f689ff"],
      ["#13005fff", "#a3ff9aff"],
      ["#000", "#ffffffff"],
    ],
    label: "Fill colors",
  },
} as const satisfies IControls;
