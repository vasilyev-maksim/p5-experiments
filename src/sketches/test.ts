import type p5 from "p5";
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
type Nodes = [AnimatedValue, AnimatedValue][];

const factory: ISketchFactory<Params> =
  (WIDTH, HEIGHT, _randomSeed, timeShift) => (p) => {
    const NODES_UPDATE_PERIOD = 51;
    const NODES: Nodes = [
      [
        new AnimatedValue(NODES_UPDATE_PERIOD, WIDTH / 2),
        new AnimatedValue(NODES_UPDATE_PERIOD, HEIGHT / 2),
      ],
    ];
    let time = timeShift,
      TIME_DELTA: number;

    p.updateWithProps = (props) => {
      TIME_DELTA = props.TIME_DELTA;

      if (props.playing) {
        p.loop();
      } else {
        p.noLoop();
      }
    };

    // function getNextNodes(p: p5): Nodes {
    //   return [[WIDTH / 2, p.noise(time * 0.01) * HEIGHT]];
    // }

    p.mouseClicked = () => {
      updateNodes();
    };

    function renderNodes(p: p5) {
      NODES.forEach((node) => {
        p.fill("white");
        const [x, y] = node;
        p.circle(x.getCurrentValue()!, y.getCurrentValue()!, 10);
        p.fill("red");
        p.circle(x.getNextValue()!, y.getNextValue()!, 5);
        // console.log(
        //   time,
        //   animatedY.getCurrentValue(),
        //   animatedY.getNextValue()
        // );
        x.nextStep();
        y.nextStep();
      });

      // NODES = NODES.map((arr, j) =>
      //   arr.map((node, i) => {
      //     const [x, y, progress] = node;
      //     if (progress > 0) {
      //       const nextX = NEXT_NODES[j][i][0];
      //       const distance = nextX - x;
      //       const newX = x + distance / progress;
      //       return [newX, y, progress - 1];
      //     } else {
      //       return node;
      //     }
      //   })
      // );
    }

    function updateNodes() {
      NODES.forEach(([x, y]) => {
        x.animateTo(p.mouseX);
        y.animateTo(p.mouseY);
      });
      // NODES = NEXT_NODES;
      // NODES = NODES.map((x) => [x[0], x[1], NODES_UPDATE_PERIOD]);
    }

    p.setup = () => {
      p.createCanvas(WIDTH, HEIGHT);
      p.noiseSeed(42);
      // updateNodes();
      // NODES = getNextNodes();
      // NEXT_NODES = getNextNodes();
    };

    p.draw = () => {
      p.background("black");
      time += TIME_DELTA;

      // if (time % NODES_UPDATE_PERIOD === 0) {
      //   // if (time === NODES_UPDATE_PERIOD) {
      //   updateNodes();
      // }

      renderNodes(p);
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

export class AnimatedValue {
  private prev: number | undefined;
  private interpolated: number | undefined;
  private next: number | undefined;
  private currentStep: number = 0;

  public constructor(
    private readonly stepsCount: number,
    initialValue?: number
  ) {
    if (initialValue) {
      this.prev = initialValue;
      this.interpolated = initialValue;
      this.next = initialValue;
    }
  }

  public animateTo(val: number) {
    this.prev = this.prev === undefined ? val : this.interpolated;
    this.interpolated = this.prev;
    this.next = val;
    this.currentStep = this.prev === this.next ? 0 : this.stepsCount;
  }

  public nextStep() {
    if (
      this.next !== undefined &&
      this.prev !== undefined &&
      this.next !== this.prev &&
      this.interpolated !== undefined &&
      this.currentStep > 0
    ) {
      const delta = (this.next - this.prev) / this.stepsCount;
      this.interpolated += delta;
      // console.log({ step: this.currentStep });
      this.currentStep--;
    }
  }

  public getCurrentValue() {
    return this.interpolated;
  }

  public getNextValue() {
    return this.next;
  }
}
