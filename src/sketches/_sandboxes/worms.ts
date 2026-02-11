import type {
  ExtractParams,
  IControls,
  IPreset,
  ISketch,
  ISketchFactory,
} from "../../models";
import { createSketch } from "@core/createSketch";
import { Matrix } from "../tiles/Matrix";
import { Size } from "../tiles/Size";
import p5, { type STROKE_JOIN } from "p5";
import { oscillateBetween } from "@/core/utils";

const controls = {
  RESOLUTION: {
    type: "range",
    min: 3,
    max: 50,
    step: 1,
    label: "Resolution",
  },
  WORM_LENGTH: {
    type: "range",
    min: 0,
    max: 100,
    step: 1,
    label: "Worm length",
  },
  THICKNESS: {
    type: "range",
    min: 0.05,
    max: 0.95,
    step: 0.05,
    label: "Worm thickness",
    valueFormatter: (x) => x.toFixed(2),
  },
  CORNERS_TYPE: {
    type: "choice",
    label: "Corner type",
    options: [
      { label: "Square", value: 0 },
      { label: "Round", value: 1 },
      { label: "Cut", value: 2 },
    ],
  },
  COLOR: {
    type: "color",
    colors: [
      ["red", "red"],
      ["red", "rgb(74, 0, 0)"],
      ["#0000ffff", "#ea72f7ff"],
      ["#fcff39ff", "#c04affff"],
      ["#18005fff", "#5aff4aff"],
      ["#ffffffff", "#000000ff"],
    ],
    label: "Color",
  },
  INVERT_COLORS: {
    type: "boolean",
    label: "Invert colors",
  },
  ANIMATED: {
    type: "boolean",
    label: "Animated",
  },
} as const satisfies IControls;

type Params = ExtractParams<typeof controls>;

const ANIMATION_SPEED = 25;

export const factory: ISketchFactory<Params> = createSketch<Params>(
  ({
    p,
    createMemo,
    getTrackedProp,
    getProp,
    createAnimatedValue,
    createAnimatedColors,
    getTime,
  }) => {
    const width = createMemo(
      (w, h, r) => p.floor((w * r) / h),
      [
        getTrackedProp("canvasWidth"),
        getTrackedProp("canvasHeight"),
        getTrackedProp("RESOLUTION"),
      ],
    );
    const worms = createMemo(
      (res, len, width) => {
        if (len === 0) {
          return Array.from({ length: res * width }, (_, i) => {
            const pos = p.createVector((i % width) + 1, p.floor(i / width) + 1);
            return new Worm(pos, 1, () => 1);
          });
        }

        const height = res;
        const matrix = new Matrix(new Size(width, height), () => p.random());
        const arr: Worm[] = [];

        let worm: Worm, head: p5.Vector;

        while (true) {
          head = matrix.getRandomTrue();

          if (!head) {
            break;
          }

          matrix.set(head, false);
          worm = new Worm(head, len, (pos) =>
            matrix.get(pos) ? p.random() : 0,
          );

          while (worm.step((pos) => matrix.set(pos, false))) {
            // noop
          }

          arr.push(worm);
        }

        return arr;
      },
      [getTrackedProp("RESOLUTION"), getTrackedProp("WORM_LENGTH"), width],
    );
    const thickness = createAnimatedValue(ANIMATION_SPEED, (t) => t, [
      getTrackedProp("THICKNESS"),
    ]);
    const colorsAnimated = createAnimatedColors(
      ANIMATION_SPEED,
      [getTrackedProp("COLOR"), getTrackedProp("INVERT_COLORS")],
      (x, inverted) => [
        controls.COLOR.colors[x][inverted ? 1 : 0],
        controls.COLOR.colors[x][inverted ? 0 : 1],
      ],
      p,
    );

    // alert(W);

    return {
      setup: () => {
        p.background("black");
      },
      draw: () => {
        return () => {
          p.background("black");
          p.stroke("white");
          p.stroke("red");
          p.noFill();

          // const N = getProp("N");
          // console.log("N = ", N);
          // console.log("NA = ", NA.value);

          const W = width.value;
          const H = getProp("RESOLUTION");
          const L = getProp("WORM_LENGTH");
          const [colorA, colorB] = colorsAnimated.value!;
          const time = getTime();
          const animF = oscillateBetween(p, 0, 1, 0.02, time);
          // const animF = (time % 200) / 200;

          p.scale(
            getProp("canvasWidth") / (W + 1),
            getProp("canvasHeight") / (H + 1),
          );
          // p.translate(0.25, 0.25);
          p.strokeWeight(thickness.value!);
          p.strokeJoin(
            ["miter", "round", "bevel"][getProp("CORNERS_TYPE")] as STROKE_JOIN,
          );

          worms.value.forEach((worm) => {
            p.stroke(p.lerpColor(colorA, colorB, worm.tail.length / L));

            p.beginShape();
            {
              p.vertex(worm.head.x, worm.head.y);
              p.vertex(worm.head.x, worm.head.y);

              const curr =
                (getProp("ANIMATED") === 1 ? animF : 1) * worm.tail.length;
              // console.log("curr", curr);

              worm.tail.forEach((pos, i, arr) => {
                if (curr >= i + 1) {
                  p.vertex(pos.x, pos.y);
                } else if (curr < i + 1 && curr > i) {
                  const prev = i === 0 ? worm.head : arr[i - 1];
                  const int = p5.Vector.lerp(prev, pos, curr % 1);
                  p.vertex(int.x, int.y);
                }
              });
            }
            p.endShape();
          });

          // p.stroke("white");
          // p.beginShape();
          // p.vertex(5.6, 5.6);
          // // p.vertex(2.6, 5.6);
          // p.endShape();

          // p.circle(2, 2, 2);
          // p.rect(0, 0, W - 1, H - 1);
        };
      },
    };
  },
);

export class Worm {
  public readonly tail: p5.Vector[] = [];
  public constructor(
    public head: p5.Vector,
    private readonly length: number,
    private readonly sensor: (pos: p5.Vector) => number,
  ) {}

  public get body() {
    return [this.head, ...this.tail];
  }

  public step(cb: (pos: p5.Vector) => void): boolean {
    if (this.tail.length >= this.length) {
      return false;
    }

    const next = [
      new p5.Vector(1, 0),
      new p5.Vector(0, 1),
      new p5.Vector(-1, 0),
      new p5.Vector(0, -1),
    ]
      .map((direction) => {
        const nextHead = p5.Vector.add(this.head, direction);
        return {
          head: nextHead,
          weight: this.sensor(nextHead),
        };
      })
      .filter((x) => x.weight > 0)
      .sort((a, b) => a.weight - b.weight)
      .map((x) => x.head)[0];

    if (next) {
      this.tail.unshift(this.head);
      this.head = next;
      cb(this.head);
      return true;
    } else {
      return false;
    }
  }
}

const presets: IPreset<Params>[] = [
  {
    params: {
      RESOLUTION: 15,
      WORM_LENGTH: 9,
      THICKNESS: 0.9,
      CORNERS_TYPE: 1,
      COLOR: 1,
      INVERT_COLORS: 1,
      ANIMATED: 1,
    },
    name: "animated",
  },
  {
    params: {
      RESOLUTION: 40,
      WORM_LENGTH: 30,
      THICKNESS: 0.3,
      CORNERS_TYPE: 1,
      COLOR: 1,
      INVERT_COLORS: 1,
      ANIMATED: 1,
    },
    name: "animated 2",
  },
  {
    params: {
      RESOLUTION: 35,
      WORM_LENGTH: 100,
      THICKNESS: 0.85,
      COLOR: 3,
      INVERT_COLORS: 0,
      CORNERS_TYPE: 1,
      ANIMATED: 1,
    },
    name: "animated 3",
  },
  {
    params: {
      RESOLUTION: 35,
      WORM_LENGTH: 2,
      THICKNESS: 0.1,
      COLOR: 0,
      INVERT_COLORS: 0,
      CORNERS_TYPE: 0,
      ANIMATED: 1,
    },
  },
  {
    params: {
      RESOLUTION: 3,
      WORM_LENGTH: 0,
      THICKNESS: 0.1,
      COLOR: 0,
      INVERT_COLORS: 0,
      CORNERS_TYPE: 0,
      ANIMATED: 1,
    },
  },
  {
    params: {
      RESOLUTION: 35,
      WORM_LENGTH: 2,
      THICKNESS: 0.1,
      COLOR: 0,
      INVERT_COLORS: 0,
      CORNERS_TYPE: 0,
      ANIMATED: 1,
    },
  },
  {
    params: {
      RESOLUTION: 35,
      WORM_LENGTH: 100,
      THICKNESS: 0.1,
      COLOR: 0,
      INVERT_COLORS: 0,
      CORNERS_TYPE: 0,
      ANIMATED: 1,
    },
  },
  {
    params: {
      RESOLUTION: 35,
      WORM_LENGTH: 100,
      THICKNESS: 0.75,
      COLOR: 0,
      INVERT_COLORS: 0,
      CORNERS_TYPE: 0,
      ANIMATED: 1,
    },
  },
  {
    params: {
      RESOLUTION: 35,
      WORM_LENGTH: 100,
      THICKNESS: 0.75,
      COLOR: 1,
      INVERT_COLORS: 1,
      CORNERS_TYPE: 0,
      ANIMATED: 1,
    },
  },
  {
    params: {
      RESOLUTION: 35,
      WORM_LENGTH: 100,
      THICKNESS: 0.75,
      COLOR: 1,
      INVERT_COLORS: 0,
      CORNERS_TYPE: 0,
      ANIMATED: 1,
    },
  },
  {
    params: {
      RESOLUTION: 35,
      WORM_LENGTH: 100,
      THICKNESS: 0.1,
      COLOR: 1,
      INVERT_COLORS: 0,
      CORNERS_TYPE: 0,
      ANIMATED: 1,
    },
  },
];

export const sketch: ISketch<Params> = {
  factory,
  id: "worms",
  name: "worms",
  preview: {
    size: 450,
  },
  randomSeed: 40,
  controls,
  presets,
  type: "draft",
  startTime: 78,
  // presetsShuffle: 1,
};
