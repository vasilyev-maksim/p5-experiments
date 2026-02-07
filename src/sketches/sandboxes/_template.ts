import type {
  ExtractParams,
  IControls,
  IPreset,
  ISketch,
  ISketchFactory,
} from "../../models";
import { createSketch } from "@core/createSketch";

const controls = {
  N: {
    type: "range",
    min: 1,
    max: 10,
    step: 1,
    label: "Discrete N",
  },
  NA: {
    type: "range",
    min: 1,
    max: 10,
    step: 1,
    label: "Animated N",
  },
} as const satisfies IControls;

type Params = ExtractParams<typeof controls>;

export const factory: ISketchFactory<Params> = createSketch<Params>(
  ({ p, createAnimatedValue, getTrackedProp, getProp }) => {
    const NA = createAnimatedValue(25, (x) => x, [getTrackedProp("NA")]);

    return {
      setup: () => {
        p.background("black");
      },
      draw: () => {
        return () => {
          p.background("black");
          p.stroke("white");

          const N = getProp("N");
          console.log("N = ", N);
          console.log("NA = ", NA.value);
        };
      },
    };
  },
);

const presets: IPreset<Params>[] = [
  {
    params: {
      N: 1,
      NA: 1,
    },
  },
];

export const sketch: ISketch<Params> = {
  factory,
  id: "_template",
  name: "_template",
  preview: {
    size: 520,
  },
  randomSeed: 44,
  controls,
  presets,
};
