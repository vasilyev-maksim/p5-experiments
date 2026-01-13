import type { IControls, IPreset, ISketch, ExtractParams } from "../models";
import { range } from "../utils";
import { createFactory, type DrawArgs } from "./utils";

const controls = {
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
  TIME_DELTA: {
    type: "range",
    min: -2,
    max: 2,
    step: 0.1,
    label: "Playback speed",
    valueFormatter: (x) => x.toFixed(1),
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

type Params = ExtractParams<typeof controls>;

const factory = createFactory<Params>(() => {
  const POLYGONS_COUNT = 500,
    BG_COLOR = "black";
  let THICKNESS = 1,
    COIL_SPEED = 1;

  function getNodes({
    p,
    time,
    props: { ZOOM, COIL_FACTOR, ROTATION_SPEED },
  }: DrawArgs<Params>): [number, number][] {
    return range(POLYGONS_COUNT).map((i) => {
      return [
        i * ZOOM,
        i * COIL_FACTOR * (COIL_SPEED === 0 ? 1 : p.sin(time / COIL_SPEED)) +
          time * ROTATION_SPEED,
      ];
    });
  }

  function drawCircle(
    { p, args: { canvasWidth, canvasHeight } }: DrawArgs<Params>,
    [d, angle]: [number, number]
  ) {
    const x = d * p.cos(angle);
    const y = d * p.sin(angle);
    p.circle(canvasWidth / 2 + x, canvasHeight / 2 + y, (d * 2) / THICKNESS);
  }

  function drawPolygon(
    {
      p,
      args: { canvasWidth, canvasHeight },
      props: { POLYGON_N },
    }: DrawArgs<Params>,
    [d, angle]: [number, number]
  ) {
    const x = d * p.cos(angle) + canvasWidth / 2;
    const y = d * p.sin(angle) + canvasHeight / 2;
    const adelta = 360 / POLYGON_N;

    p.push();
    {
      p.translate(x, y);
      p.beginShape();
      for (let a = 0; a < 360; a += adelta) {
        const sx = (p.cos(a) * d) / THICKNESS;
        const sy = (p.sin(a) * d) / THICKNESS;
        p.vertex(sx, sy);
      }
      p.endShape("close");
    }
    p.pop();
  }

  return {
    setup: (p, { canvasWidth, canvasHeight }) => {
      p.createCanvas(canvasWidth, canvasHeight);
      p.background("black");
      p.fill(255, 0, 0, 10);
      p.strokeWeight(1);
      p.angleMode("degrees");
    },
    draw: (drawArgs) => {
      const {
        p,
        props: { BORDER_COLOR, FILL_COLORS, COLOR_CHANGE_SPEED, POLYGON_N },
        time,
      } = drawArgs;

      p.background(BG_COLOR);

      getNodes(drawArgs).forEach((x, i, arr) => {
        const [colorA, colorB] = controls.FILL_COLORS.colors[FILL_COLORS];
        const fillColor = p.lerpColor(
          p.color(colorA),
          p.color(colorB),
          p.sin(time * COLOR_CHANGE_SPEED + (i / arr.length) * 360 * 4)
        );

        p.fill(fillColor);
        p.stroke(controls.BORDER_COLOR.colors[BORDER_COLOR][0]);

        if (POLYGON_N === controls.POLYGON_N.max) {
          drawCircle(drawArgs, x);
        } else {
          drawPolygon(drawArgs, x);
        }
      });
    },
    updateWithProps: (props) => {
      THICKNESS =
        controls.THICKNESS.max + controls.THICKNESS.min - props.THICKNESS;
      COIL_SPEED =
        props.COIL_SPEED === 0
          ? 0
          : controls.COIL_SPEED.max +
            controls.COIL_SPEED.min -
            props.COIL_SPEED +
            1;
    },
  };
});

const presets: IPreset<Params>[] = [
  {
    params: {
      POLYGON_N: 5,
      THICKNESS: 18,
      COIL_FACTOR: 2,
      COIL_SPEED: 10,
      ZOOM: 2,
      ROTATION_SPEED: 1.5,
      COLOR_CHANGE_SPEED: 10,
      TIME_DELTA: 1,
      FILL_COLORS: 0,
      BORDER_COLOR: 0,
    },
    name: "spiral",
  },
  {
    params: {
      POLYGON_N: controls.POLYGON_N.max,
      THICKNESS: 20,
      COIL_FACTOR: 1,
      COIL_SPEED: 10,
      ZOOM: 4,
      ROTATION_SPEED: 4,
      COLOR_CHANGE_SPEED: 10,
      TIME_DELTA: 1,
      FILL_COLORS: 2,
      BORDER_COLOR: 4,
    },
    name: "peach",
  },
  {
    params: {
      POLYGON_N: 3,
      THICKNESS: 2,
      COIL_FACTOR: 28,
      COIL_SPEED: 1,
      ZOOM: 2,
      ROTATION_SPEED: 10,
      COLOR_CHANGE_SPEED: 10,
      TIME_DELTA: 1,
      FILL_COLORS: 4,
      BORDER_COLOR: 5,
    },
    name: "glimmer",
  },
  {
    params: {
      POLYGON_N: 3,
      THICKNESS: 2,
      COIL_FACTOR: 28,
      COIL_SPEED: 1,
      ZOOM: 2,
      ROTATION_SPEED: 0,
      COLOR_CHANGE_SPEED: 10,
      TIME_DELTA: 1,
      FILL_COLORS: 3,
      BORDER_COLOR: 3,
    },
    name: "reptile",
  },
  {
    params: {
      POLYGON_N: 3,
      THICKNESS: 2,
      COIL_FACTOR: 27,
      COIL_SPEED: 0,
      ZOOM: 2,
      ROTATION_SPEED: 1.5,
      COLOR_CHANGE_SPEED: 10,
      TIME_DELTA: 1,
      FILL_COLORS: 3,
      BORDER_COLOR: 2,
    },
    name: "cyclone",
  },
  {
    params: {
      POLYGON_N: 11,
      THICKNESS: 2,
      COIL_FACTOR: 62,
      COIL_SPEED: 0,
      ZOOM: 2,
      ROTATION_SPEED: 10,
      COLOR_CHANGE_SPEED: 10,
      TIME_DELTA: 1,
      FILL_COLORS: 0,
      BORDER_COLOR: 5,
    },
    name: "black hole",
  },
  {
    params: {
      POLYGON_N: 11,
      THICKNESS: 2,
      COIL_FACTOR: 58,
      COIL_SPEED: 0,
      ZOOM: 2,
      ROTATION_SPEED: 10,
      COLOR_CHANGE_SPEED: -10,
      TIME_DELTA: 1,
      FILL_COLORS: 0,
      BORDER_COLOR: 5,
    },
    name: "white hole",
  },
  {
    params: {
      POLYGON_N: 6,
      THICKNESS: 2,
      COIL_FACTOR: 10,
      COIL_SPEED: 0,
      ZOOM: 2,
      ROTATION_SPEED: 0.1,
      COLOR_CHANGE_SPEED: 1,
      TIME_DELTA: 0.2,
      FILL_COLORS: 4,
      BORDER_COLOR: 4,
    },
    name: "space odyssey",
  },
  {
    params: {
      POLYGON_N: 6,
      THICKNESS: 20,
      COIL_FACTOR: 100,
      COIL_SPEED: 10,
      ZOOM: 20,
      ROTATION_SPEED: 10,
      COLOR_CHANGE_SPEED: 10,
      TIME_DELTA: 0.1,
      FILL_COLORS: 1,
      BORDER_COLOR: 5,
    },
    name: "hexornado",
  },
  {
    params: {
      POLYGON_N: 11,
      THICKNESS: 11,
      COIL_FACTOR: 65,
      COIL_SPEED: 1,
      ZOOM: 2,
      ROTATION_SPEED: 6,
      COLOR_CHANGE_SPEED: 10,
      TIME_DELTA: 1,
      FILL_COLORS: 0,
      BORDER_COLOR: 0,
    },
    name: "mandala",
  },
  {
    params: {
      POLYGON_N: 7,
      THICKNESS: 2,
      COIL_FACTOR: 62,
      COIL_SPEED: 10,
      ZOOM: 2,
      ROTATION_SPEED: 10,
      COLOR_CHANGE_SPEED: 10,
      TIME_DELTA: 1,
      FILL_COLORS: 1,
      BORDER_COLOR: 5,
    },
    name: "subatomic",
  },
  {
    params: {
      POLYGON_N: 2,
      THICKNESS: 2,
      COIL_FACTOR: 42,
      COIL_SPEED: 1,
      ZOOM: 2,
      ROTATION_SPEED: 10,
      COLOR_CHANGE_SPEED: 1,
      TIME_DELTA: 1,
      FILL_COLORS: 0,
      BORDER_COLOR: 0,
    },
    name: "phase space",
  },
  {
    params: {
      POLYGON_N: 2,
      THICKNESS: 20,
      COIL_FACTOR: 16,
      COIL_SPEED: 1,
      ZOOM: 1,
      ROTATION_SPEED: 0,
      COLOR_CHANGE_SPEED: 1,
      TIME_DELTA: 1,
      FILL_COLORS: 0,
      BORDER_COLOR: 3,
    },
    name: "radiation",
  },
  {
    params: {
      POLYGON_N: 7,
      THICKNESS: 20,
      COIL_FACTOR: 83,
      COIL_SPEED: 0,
      ZOOM: 3,
      ROTATION_SPEED: 2,
      COLOR_CHANGE_SPEED: 10,
      TIME_DELTA: 0.1,
      FILL_COLORS: 3,
      BORDER_COLOR: 0,
    },
    name: "toxic",
  },
  {
    params: {
      POLYGON_N: 7,
      THICKNESS: 20,
      COIL_FACTOR: 51,
      COIL_SPEED: 0,
      ZOOM: 2,
      ROTATION_SPEED: 4,
      COLOR_CHANGE_SPEED: 10,
      TIME_DELTA: 0.1,
      FILL_COLORS: 0,
      BORDER_COLOR: 3,
    },
    name: "purple lambo",
  },
  {
    params: {
      POLYGON_N: 11,
      THICKNESS: 20,
      COIL_FACTOR: 33,
      COIL_SPEED: 0,
      ZOOM: 1.4,
      ROTATION_SPEED: 0.05,
      COLOR_CHANGE_SPEED: -1,
      TIME_DELTA: -1,
      FILL_COLORS: 4,
      BORDER_COLOR: 0,
    },
    name: "spiderverse",
  },
];

export const spiralSketch: ISketch<Params> = {
  factory,
  id: "spiral",
  name: "spiral",
  preview: {
    size: 515,
  },
  timeShift: 1002,
  controls,
  presets,
  defaultParams: presets[0].params,
};
