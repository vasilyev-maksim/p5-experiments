import type {
  ExtractParams,
  IControls,
  IPreset,
  ISketch,
  ISketchFactory,
} from "../models";

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
  ({ canvasWidth, canvasHeight }) =>
  (p) => {
    p.updateWithProps = (props) => {
      console.log("updateWithProps");
    };

    p.setup = () => {
      console.log("setup");
      p.noLoop();
      p.createCanvas(canvasWidth, canvasHeight);
    };

    p.draw = () => {
      console.log("draw");

      p.background("black");
    };
  };

const presets: IPreset<Params>[] = [
  {
    params: {
      TIME_DELTA: 1,
    },
  },
];

export const testSketch: ISketch<Params> = {
  factory,
  id: "test",
  name: "test",
  preview: {
    size: 520,
  },
  timeShift: 0,
  randomSeed: 44,
  controls,
  presets,
  defaultParams: presets[0].params,
};
