import p5 from "p5";
import type {
  ExtractParams,
  IControls,
  IPreset,
  ISketch,
  ISketchFactory,
} from "../models";
import { range } from "../utils/misc";

const controls = {
  TIME_DELTA: {
    type: "range",
    min: 0,
    max: 3,
    step: 0.1,
    label: "Playback speed",
    valueFormatter: (x) => x.toFixed(1),
  },
} as const satisfies IControls;

type Params = ExtractParams<typeof controls>;

const factory: ISketchFactory<Params> =
  ({ initialProps: { canvasWidth, canvasHeight } }) =>
  (p) => {
    const R = 50;
    const N = 25;
    const A = 120;
    const arr: p5.Vector[] = range(N).map((i) =>
      p.createVector(canvasWidth / 2 + R * i, canvasHeight / 2),
    );

    p.updateWithProps = (props) => {
      if (props.playing) {
        p.loop();
      } else {
        p.noLoop();
      }
    };

    p.setup = () => {
      p.createCanvas(canvasWidth, canvasHeight);
      p.angleMode("degrees");
    };

    function updatePositions() {
      arr[0] = p.createVector(p.mouseX, p.mouseY);

      for (let i = 1; i < arr.length; i++) {
        const v = p5.Vector.sub(arr[i], arr[i - 1]).setMag(R);
        arr[i] = p5.Vector.add(arr[i - 1], v);
      }

      for (let i = 1; i < arr.length - 1; i++) {
        const a = arr[i - 1];
        const b = arr[i];
        const c = arr[i + 1];
        const ba = p5.Vector.sub(a, b);
        const bc = p5.Vector.sub(c, b);
        const angle = p5.Vector.angleBetween(ba, bc);
        if (p.abs(angle) < A) {
          const n = ba
            .copy()
            .rotate(Math.sign(angle) * A)
            .add(b);
          // p.circle(n.x, n.y, 5);
          arr[i + 1] = n;
        }
      }
    }

    p.draw = () => {
      p.background("black");
      p.noFill();
      p.stroke("white");

      updatePositions();

      arr.forEach((x) => {
        p.circle(x.x, x.y, R);
      });

      p.push();
      p.strokeWeight(R);
      p.beginShape();
      p.curveVertex(arr[0].x, arr[0].y);
      arr.forEach((x) => {
        p.curveVertex(x.x, x.y);
      });
      p.curveVertex(arr[arr.length - 1].x, arr[arr.length - 1].y);
      p.endShape();
      p.pop();
    };
  };

const presets: IPreset<Params>[] = [
  {
    params: {
      TIME_DELTA: 1,
    },
  },
];

export const wormSketch: ISketch<Params> = {
  factory,
  id: "worm",
  name: "worm",
  preview: {
    size: 520,
  },
  randomSeed: 44,
  controls,
  presets,
};
