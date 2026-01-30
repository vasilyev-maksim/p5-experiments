import type {
  ExtractParams,
  IControls,
  IPreset,
  ISketch,
  ISketchFactory,
} from "../models";
import { AnimatedValue } from "@core/AnimatedValue";
import { createSketch } from "@core/createSketch";

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
        const startTime = getTime();
        animatedX.animateTo({ value: p.mouseX, startTime });
        animatedY.animateTo({ value: p.mouseY, startTime });
      };
    },
    draw: ({ p, getTime }) => {
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
