import type {
  ExtractParams,
  IControls,
  IPreset,
  ISketch,
  ISketchFactory,
} from "../models";
import { ValueWithHistory } from "../utils";

const controls = {
  GAP: {
    label: "Gap",
    max: 50,
    min: 10,
    step: 1,
    type: "range",
  },
  CURVES_COUNT: {
    label: "Curves count",
    max: 50,
    min: 1,
    step: 2,
    type: "range",
  },
  TRACE_FACTOR: {
    label: "Trace factor",
    max: 100,
    min: 0,
    step: 1,
    type: "range",
    valueFormatter: (x) => x + "%",
  },
  FRACTURE_FREQUENCY: {
    label: "Fracture frequency",
    max: 60,
    min: 5,
    step: 1,
    type: "range",
  },
  DISPERSION: {
    label: "Dispersion",
    max: 1,
    min: 0,
    step: 0.05,
    type: "range",
    valueFormatter: (x) => x.toFixed(2),
  },
  // ORIENTATION: {
  //   label: "Orientation",
  //   options: [
  //     {
  //       label: "horizontal",
  //       value: 0,
  //     },
  //     {
  //       label: "vertical",
  //       value: 1,
  //     },
  //   ],
  //   type: "choice",
  // },
  TIME_DELTA: {
    type: "range",
    min: 0,
    max: 3,
    step: 0.1,
    label: "Playback speed",
    valueFormatter: (x) => x.toFixed(1),
  },
  COLOR: {
    type: "color",
    colors: [["#ff0000ff"], ["#36ff1fff"], ["#ffffffff"]],
    label: "Color palette",
  },
} as const satisfies IControls;

type Params = ExtractParams<typeof controls>;
type Nodes = [number, number, number][][];

const factory: ISketchFactory<Params> =
  (WIDTH, HEIGHT, randomSeed, timeShift) => (p) => {
    const ORIENTATION: string = "h",
      W = ORIENTATION === "v" ? WIDTH : HEIGHT,
      H = ORIENTATION === "v" ? HEIGHT : WIDTH,
      // FRACTURE_FREQUENCY = 20,
      // X_DISPERSION = 0.2,
      SPEED = 20,
      INDEPENDENT_CURVES_COUNT = 1;
    const FRACTURE_FREQUENCY = new ValueWithHistory<number>();

    let NODES: Nodes = [];
    let NEXT_NODES: Nodes = [];

    let time = timeShift,
      GAP: number,
      TIME_DELTA: number,
      COLOR_INDEX: number,
      CURVES_COUNT: number,
      TRACE_FACTOR: number,
      DISPERSION: number;

    p.updateWithProps = (props) => {
      TIME_DELTA = props.TIME_DELTA;
      COLOR_INDEX = props.COLOR;
      GAP = props.GAP;
      CURVES_COUNT = props.CURVES_COUNT;
      TRACE_FACTOR = props.TRACE_FACTOR;
      FRACTURE_FREQUENCY.value = props.FRACTURE_FREQUENCY;
      DISPERSION = props.DISPERSION;

      if (FRACTURE_FREQUENCY.hasChanged) {
        NEXT_NODES = getNextNodes();
        NODES = NEXT_NODES;
      }

      if (props.playing) {
        p.loop();
      } else {
        p.noLoop();
      }
    };

    function getNextNodes() {
      const nodes: Nodes = [];
      const Y_DELTA = H / FRACTURE_FREQUENCY.value!;

      for (let l = 0; l < INDEPENDENT_CURVES_COUNT; l++) {
        const arr: Nodes[0] = [];
        for (let i = -1; i <= FRACTURE_FREQUENCY.value! + 1; i++) {
          const y = i * Y_DELTA;

          const x = p.map(
            p.noise(i, l, (time * 0.1) / SPEED),
            0,
            1,
            (W / 2) * (1 - DISPERSION),
            (W / 2) * (1 + DISPERSION)
          );
          arr.push([x, y, SPEED]);
        }
        nodes.push(arr);
      }

      return nodes;
    }

    function renderNodesDeltaPerFrame() {
      NODES = NODES.map((arr, j) =>
        arr.map((node, i) => {
          const [x, y, progress] = node;
          // console.log(progress);
          if (progress > 0) {
            const nextX = NEXT_NODES[j][i][0];
            // const nextX = p.mouseIsPressed ? W / 2 : NEXT_NODES[j][i][0];
            const distance = nextX - x;
            // console.log({ distance, i });
            const newX = x + distance / progress;
            return [newX, y, progress - 1];
          } else {
            return node;
          }
        })
      );
      // console.log({ NODES });
    }

    function drawLines() {
      for (let j = 0; j < INDEPENDENT_CURVES_COUNT; j++) {
        // const color = p.lerpColor(
        //   p.color("rgba(52, 9, 152, 1)"),
        //   p.color("rgba(234, 114, 247, 1)"),
        //   j / INDEPENDENT_CURVES_COUNT
        // );
        const twinMidIndex = Math.round((CURVES_COUNT - 1) / 2);

        for (let t = -twinMidIndex; t <= twinMidIndex; t++) {
          const xOffset = t * GAP;
          const alpha =
            t === 0 ? 255 : p.map(p.abs(t), 0, twinMidIndex + 1, 20, 0);

          const color = p.color(controls.COLOR.colors[COLOR_INDEX][0]);
          color.setAlpha(alpha);
          p.stroke(color);

          p.beginShape();
          for (let i = 0; i < NODES[j].length; i++) {
            const [x, y] = NODES[j][i];

            if (ORIENTATION === "v") {
              p.curveVertex(x + xOffset, y);
            } else {
              p.curveVertex(y, x + xOffset);
            }
          }
          p.endShape();
          // p.endShape("close");
        }
      }
    }

    p.setup = () => {
      if (ORIENTATION === "v") {
        p.createCanvas(W, H);
      } else {
        p.createCanvas(H, W);
      }
      p.strokeWeight(2);
      p.randomSeed(randomSeed);
      p.noiseSeed(randomSeed);
      p.background("black");
      // p.noiseDetail(4, 0.7);
      // NODES = getNextNodes();
      // NEXT_NODES = getNextNodes();
    };

    p.draw = () => {
      // console.log("draw", NEXT_NODES);

      time += TIME_DELTA;

      if (time % SPEED === 0) {
        // console.log("new");

        NEXT_NODES = getNextNodes();
        NODES = NODES.map((arr) => arr.map((x) => [x[0], x[1], SPEED]));
        // NODES = NEXT_NODES;
      }

      p.noStroke();
      const OPACITY = p.map(TRACE_FACTOR, 0, 100, 100, 5);

      p.fill(p.color(0, 0, 0, OPACITY));

      if (ORIENTATION === "v") {
        p.rect(0, 0, W, H);
      } else {
        p.rect(0, 0, H, W);
      }

      p.noFill();
      // p.stroke(p.color(controls.COLOR.colors[COLOR_INDEX][0]));

      renderNodesDeltaPerFrame();
      drawLines();
    };
  };

const presets: IPreset<Params>[] = [
  {
    params: {
      CURVES_COUNT: 35,
      GAP: 20,
      TIME_DELTA: 1,
      FRACTURE_FREQUENCY: 6,
      COLOR: 0,
      TRACE_FACTOR: 80,
      DISPERSION: 0.6, // 0.2
    },
    // name: "looks uneven",
  },
];

export const pulseSketch: ISketch<Params> = {
  factory,
  id: "pulse",
  name: "pulse",
  preview: {
    size: 520,
  },
  timeShift: 0,
  randomSeed: 44,
  controls,
  presets,
  defaultParams: presets[0].params,
};
