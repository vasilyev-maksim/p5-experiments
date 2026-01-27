import type {
  ExtractParams,
  IControls,
  IPreset,
  ISketch,
  ISketchFactory,
} from "../models";
import { AnimatedValue } from "./utils/AnimatedValue";
import { createSketch } from "./utils/createSketch";

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

export const factory: ISketchFactory<Params> = createSketch<Params>(() => {
  const animatedX = new AnimatedValue(0, 20);
  const animatedY = new AnimatedValue(0, 20);
  return {
    setup: ({ p, getTime }) => {
      p.noStroke();

      p.mouseClicked = () => {
        const time = getTime();
        animatedX.animateTo(p.mouseX, time);
        animatedY.animateTo(p.mouseY, time);
      };
    },
    drawFactory: ({ p, getTime }) => {
      return () => {
        p.background("black");
        p.stroke("white");
        const time = getTime();
        p.circle(
          animatedX.getCurrentValue()!,
          animatedY.getCurrentValue()!,
          10,
        );
        animatedX.runAnimationStep(time);
        animatedY.runAnimationStep(time);
      };
    },
  };
});

// const factory: ISketchFactory<Params> =
//   ({ canvasWidth, canvasHeight }) =>
//   (p) => {
//     p.updateWithProps = (props) => {
//       // console.log("updateWithProps");
//     };

//     p.setup = () => {
//       // console.log("setup");
//       p.noLoop();
//       p.createCanvas(canvasWidth, canvasHeight);
//     };

//     p.draw = () => {
//       // console.log("draw");

//       p.background("black");
//     };

//     p.mouseClicked = () => {
//       animatedX.animateTo(p.mouseX);
//     };
//   };

const presets: IPreset<Params>[] = [
  {
    params: {
      TIME_DELTA: 1,
    },
  },
];

export const interpolationSketch: ISketch<Params> = {
  factory,
  id: "interpolation",
  name: "interpolation",
  preview: {
    size: 520,
  },
  timeShift: 0,
  randomSeed: 44,
  controls,
  presets,
  defaultParams: presets[0].params,
};
