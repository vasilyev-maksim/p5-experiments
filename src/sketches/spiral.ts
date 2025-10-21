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
    defaultValue: 3,
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
    step: 1,
    type: "range",
    defaultValue: 2,
    valueFormatter: (x) => "x" + x,
  },
  COLOR_CHANGE_SPEED: {
    label: "Color change speed",
    max: 10,
    min: 1,
    step: 1,
    type: "range",
    defaultValue: 10,
  },
  SLOWDOWN: {
    label: "Slowdown",
    max: 10,
    min: 1,
    step: 1,
    type: "range",
    defaultValue: 1,
    valueFormatter: (x) => "x" + x,
  },
} as const satisfies IControls;

type Params = ExtractParams<typeof controls>;

const factory: ISketchFactory<Params> =
  (WIDTH, HEIGHT, _randomSeed, timeShift) => (p) => {
    const POLYGONS_COUNT = 500,
      BORDER_COLOR = "rgba(255, 0, 0, 1)",
      A_COLOR = "rgba(103, 3, 116, 1)",
      B_COLOR = "rgba(45, 1, 147, 1)",
      BG_COLOR = "black";

    let POLYGON_N = 3,
      THICKNESS = 4,
      COIL_FACTOR = 2,
      COLOR_CHANGE_SPEED = 1,
      ZOOM = 2,
      COIL_SPEED = 1,
      ROTATION_SPEED = 1.5,
      SLOWDOWN = 1;

    function getTime() {
      return (p.frameCount + timeShift) / SLOWDOWN;
    }

    p.updateWithProps = (props) => {
      POLYGON_N = props.POLYGON_N;
      THICKNESS =
        controls.THICKNESS.max + controls.THICKNESS.min - props.THICKNESS;
      COIL_FACTOR = props.COIL_FACTOR;
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
      SLOWDOWN = props.SLOWDOWN;

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
      p.stroke(BORDER_COLOR);
      p.strokeWeight(1);
      p.angleMode("degrees");
    };

    function getNodes(): [number, number][] {
      return Array.from({ length: POLYGONS_COUNT }, (_, i) => {
        return [
          i * ZOOM,
          i *
            COIL_FACTOR *
            (COIL_SPEED === 0 ? 1 : p.sin(getTime() / COIL_SPEED)) +
            getTime() * ROTATION_SPEED,
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

    function getColor(i: number, maxI: number) {
      return p.lerpColor(
        p.color(A_COLOR),
        p.color(B_COLOR),
        p.sin(getTime() * COLOR_CHANGE_SPEED + (i / maxI) * 360 * 4)
      );
    }

    p.draw = () => {
      p.background(BG_COLOR);

      getNodes().forEach((x, i, arr) => {
        p.fill(getColor(i, arr.length));

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
      POLYGON_N: 3,
      THICKNESS: 18,
      COIL_FACTOR: 2,
      COIL_SPEED: 10,
      ZOOM: 2,
      ROTATION_SPEED: 1.5,
      COLOR_CHANGE_SPEED: 10,
      SLOWDOWN: 1,
    },
    name: "spiral",
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
      SLOWDOWN: 1,
    },
    name: "cyclone 1",
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
      SLOWDOWN: 1,
    },
    name: "cyclone 2",
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
      SLOWDOWN: 1,
    },
    name: "cyclone 3",
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
      SLOWDOWN: 1,
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
      COLOR_CHANGE_SPEED: 10,
      SLOWDOWN: 1,
    },
    name: "white hole",
  },
  {
    params: {
      POLYGON_N: 11,
      THICKNESS: 2,
      COIL_FACTOR: 10,
      COIL_SPEED: 0,
      ZOOM: 2,
      ROTATION_SPEED: 10,
      COLOR_CHANGE_SPEED: 10,
      SLOWDOWN: 1,
    },
    name: "black hole 2",
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
      SLOWDOWN: 10,
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
      SLOWDOWN: 1,
    },
    name: "hypno 1",
  },
  {
    params: {
      POLYGON_N: 7,
      THICKNESS: 2,
      COIL_FACTOR: 19,
      COIL_SPEED: 10,
      ZOOM: 2,
      ROTATION_SPEED: 10,
      COLOR_CHANGE_SPEED: 10,
      SLOWDOWN: 1,
    },
    name: "hypno 2",
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
      SLOWDOWN: 1,
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
      SLOWDOWN: 1,
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
      SLOWDOWN: 10,
    },
    name: "slow",
  },
  {
    params: {
      POLYGON_N: 7,
      THICKNESS: 20,
      COIL_FACTOR: 51,
      COIL_SPEED: 0,
      ZOOM: 2,
      ROTATION_SPEED: 1,
      COLOR_CHANGE_SPEED: 10,
      SLOWDOWN: 10,
    },
    name: "sloooower",
  },
  {
    params: {
      POLYGON_N: 11,
      THICKNESS: 20,
      COIL_FACTOR: 33,
      COIL_SPEED: 0,
      ZOOM: 1,
      ROTATION_SPEED: 0.05,
      COLOR_CHANGE_SPEED: 1,
      SLOWDOWN: 1,
    },
    name: "the slowest",
  },
];

export const spiralSketch: ISketch<Params> = {
  factory,
  id: "spiral",
  name: "spiral",
  preview: {
    size: 520,
  },
  timeShift: 1000,
  controls,
  presets,
};
