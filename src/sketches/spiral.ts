import type {
  IControls,
  IPreset,
  ISketch,
  ISketchFactory,
  ExtractParams,
} from "../models";

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
    defaultValue: 5,
  },
  THICKNESS: {
    label: "Thickness",
    max: 20,
    min: 2,
    step: 1,
    type: "range",
    defaultValue: 18,
  },
  ROTATION_SPEED: {
    label: "Rotation speed",
    max: 10,
    min: 0,
    step: 1,
    type: "range",
    defaultValue: 1.5,
  },
  COIL_FACTOR: {
    label: "Coil factor",
    max: 100,
    min: 0,
    step: 1,
    type: "range",
    defaultValue: 2,
  },
  COIL_SPEED: {
    label: "Coil speed",
    max: 10,
    min: 0,
    step: 1,
    type: "range",
    defaultValue: 10,
  },
  ZOOM: {
    label: "Zoom",
    max: 20,
    min: 1,
    step: 0.1,
    type: "range",
    defaultValue: 2,
    valueFormatter: (x) => "x" + x.toFixed(1),
  },
  COLOR_CHANGE_SPEED: {
    label: "Color change speed",
    max: 10,
    min: -10,
    step: 1,
    type: "range",
    defaultValue: 10,
  },
  TIME_DELTA: {
    type: "range",
    min: -2,
    max: 2,
    defaultValue: 1,
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
    defaultValue: 0,
    label: "Border color",
  },
  FILL_COLORS: {
    type: "color",
    colors: [
      ["#670374ff", "#2d0193ff", "#ff0000ff"],
      ["#340998ff", "#ea72f7ff", "#1cb0ffff"],
      ["#ff4b4bff", "#f0f689ff", "#ff0000ff"],
      ["#13005fff", "#a3ff9aff", "#ff0000ff"],
      ["#000", "#ffffffff", "#ff0000ff"],
      // ["#003e49ff", "#8aee98ff"],
    ],
    defaultValue: 0,
    label: "Main colors",
  },
} as const satisfies IControls;

type Params = ExtractParams<typeof controls>;

const factory: ISketchFactory<Params> =
  (WIDTH, HEIGHT, _randomSeed, timeShift) => (p) => {
    const POLYGONS_COUNT = 500,
      // BORDER_COLOR = "#ff0000ff",
      BG_COLOR = "black";

    let time: number = timeShift,
      POLYGON_N: number = controls.POLYGON_N.defaultValue,
      THICKNESS: number = controls.THICKNESS.defaultValue,
      COIL_FACTOR: number = controls.COIL_FACTOR.defaultValue,
      COLOR_CHANGE_SPEED: number = controls.COLOR_CHANGE_SPEED.defaultValue,
      ZOOM: number = controls.ZOOM.defaultValue,
      COIL_SPEED: number = controls.COIL_SPEED.defaultValue,
      ROTATION_SPEED: number = controls.ROTATION_SPEED.defaultValue,
      TIME_DELTA: number = controls.TIME_DELTA.defaultValue,
      FILL_COLORS_INDEX: number = controls.FILL_COLORS.defaultValue,
      BORDER_COLOR_INDEX: number = controls.BORDER_COLOR.defaultValue;

    p.updateWithProps = (props) => {
      POLYGON_N = props.POLYGON_N;
      THICKNESS =
        controls.THICKNESS.max + controls.THICKNESS.min - props.THICKNESS;
      COIL_FACTOR = props.COIL_FACTOR;
      FILL_COLORS_INDEX = props.FILL_COLORS;
      BORDER_COLOR_INDEX = props.BORDER_COLOR;
      COIL_SPEED =
        props.COIL_SPEED === 0
          ? 0
          : controls.COIL_SPEED.max +
            controls.COIL_SPEED.min -
            props.COIL_SPEED +
            1;
      ZOOM = props.ZOOM;
      ROTATION_SPEED = props.ROTATION_SPEED;
      COLOR_CHANGE_SPEED = props.COLOR_CHANGE_SPEED;
      TIME_DELTA = props.TIME_DELTA;

      if (props.playing) {
        p.loop();
      } else {
        p.noLoop();
      }
    };

    p.setup = () => {
      p.createCanvas(WIDTH, HEIGHT);
      p.background("black");
      p.fill(255, 0, 0, 10);
      p.strokeWeight(1);
      p.angleMode("degrees");
    };

    function getNodes(): [number, number][] {
      return Array.from({ length: POLYGONS_COUNT }, (_, i) => {
        return [
          i * ZOOM,
          i * COIL_FACTOR * (COIL_SPEED === 0 ? 1 : p.sin(time / COIL_SPEED)) +
            time * ROTATION_SPEED,
        ];
      });
    }

    function drawCircle([d, angle]: [number, number]) {
      const x = d * p.cos(angle);
      const y = d * p.sin(angle);
      p.circle(WIDTH / 2 + x, HEIGHT / 2 + y, (d * 2) / THICKNESS);
    }

    function drawPolygon([d, angle]: [number, number]) {
      const x = d * p.cos(angle) + WIDTH / 2;
      const y = d * p.sin(angle) + HEIGHT / 2;
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

    p.draw = () => {
      time += TIME_DELTA;
      p.background(BG_COLOR);

      getNodes().forEach((x, i, arr) => {
        const [colorA, colorB] = controls.FILL_COLORS.colors[FILL_COLORS_INDEX];
        const fillColor = p.lerpColor(
          p.color(colorA),
          p.color(colorB),
          p.sin(time * COLOR_CHANGE_SPEED + (i / arr.length) * 360 * 4)
        );

        p.fill(fillColor);
        p.stroke(controls.BORDER_COLOR.colors[BORDER_COLOR_INDEX][0]);

        if (POLYGON_N === controls.POLYGON_N.max) {
          drawCircle(x);
        } else {
          drawPolygon(x);
        }
      });
    };
  };

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
  timeShift: 1000,
  controls,
  presets,
};
