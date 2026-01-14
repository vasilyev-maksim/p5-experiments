import type { P5CanvasInstance } from "@p5-wrapper/react";
import p5 from "p5";
import type { FactoryArgs, ISketchFactory, ISketchProps } from "../models";
import { ValueWithHistory } from "../utils";

export function getQsParam(key: string, defaultValue: string): string {
  return new URLSearchParams(window.location.search).get(key) ?? defaultValue;
}

export function easeInOutQuad(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

// Types for grid1D and grid2D
interface Grid1DCallbackArgs {
  x: number;
  index: number;
  stepCount: number | undefined;
  stepLength: number;
}

interface Grid1DArgs {
  min: number;
  max: number;
  stepCount?: number;
  stepLength?: number;
  callback: (args: Grid1DCallbackArgs) => void;
}

interface Grid2DCallbackArgs {
  x: number;
  y: number;
  xIndex: number;
  yIndex: number;
  xStepCount: number | undefined;
  xStepLength: number;
  yStepCount: number | undefined;
  yStepLength: number;
}

interface Grid2DArgs {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  xStepCount?: number;
  xStepLength?: number;
  yStepCount?: number;
  yStepLength?: number;
  callback: (args: Grid2DCallbackArgs) => void;
}

interface GetGrid2DArgs {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  xStepCount?: number;
  xStepLength?: number;
  yStepCount?: number;
  yStepLength?: number;
}

// grid1D function
export function grid1D(args: Grid1DArgs): void {
  const { min, max, stepCount, stepLength, callback } = args;
  const length = max - min;
  const _stepLength = stepLength ?? Math.floor(length / (stepCount || 1));
  const padding = (length % _stepLength) / 2;
  const start = min + padding + _stepLength / 2;
  let i = 0;

  for (let x = start; x < max; x += _stepLength) {
    callback({ x, index: i++, stepCount, stepLength: _stepLength });
  }
}

// grid2D function
export function grid2D(args: Grid2DArgs): void {
  const {
    minX,
    maxX,
    minY,
    maxY,
    xStepCount,
    xStepLength,
    yStepCount,
    yStepLength,
    callback,
  } = args;

  if (xStepLength != null || xStepCount != null) {
    grid1D({
      min: minX,
      max: maxX,
      stepLength: xStepLength,
      stepCount: xStepCount,
      callback: ({
        x,
        index: xIndex,
        stepCount: _xStepCount,
        stepLength: _xStepLength,
      }) => {
        grid1D({
          min: minY,
          max: maxY,
          stepLength: yStepLength ?? _xStepLength,
          stepCount: yStepCount,
          callback: ({
            x: y,
            index: yIndex,
            stepCount: _yStepCount,
            stepLength: _yStepLength,
          }) => {
            callback({
              x,
              y,
              xIndex,
              yIndex,
              xStepCount: _xStepCount,
              xStepLength: _xStepLength,
              yStepCount: _yStepCount,
              yStepLength: _yStepLength,
            });
          },
        });
      },
    });
  } else {
    grid1D({
      min: minY,
      max: maxY,
      stepLength: yStepLength,
      stepCount: yStepCount,
      callback: ({
        x: y,
        index: yIndex,
        stepCount: _yStepCount,
        stepLength: _yStepLength,
      }) => {
        grid1D({
          min: minX,
          max: maxX,
          stepLength: xStepLength ?? _yStepLength,
          stepCount: xStepCount,
          callback: ({
            x,
            index: xIndex,
            stepCount: _xStepCount,
            stepLength: _xStepLength,
          }) => {
            callback({
              x,
              y,
              xIndex,
              yIndex,
              xStepCount: _xStepCount,
              xStepLength: _xStepLength,
              yStepCount: _yStepCount,
              yStepLength: _yStepLength,
            });
          },
        });
      },
    });
  }
}

// getGrid2D function
export function getGrid2D(args: GetGrid2DArgs): Grid2DCallbackArgs[] {
  const grid: Grid2DCallbackArgs[] = [];
  grid2D({
    ...args,
    callback: (cargs) => {
      grid.push(cargs);
    },
  });
  return grid;
}

export function getRandomPartition(
  n: number,
  minPart: number,
  maxPart: number,
  randomProvider: () => number
): number[] {
  if (n <= 0) {
    return [];
  }
  const part = Math.floor(
    Math.min(minPart + randomProvider() * (maxPart - minPart), n)
  );
  return [
    part,
    ...getRandomPartition(n - part, minPart, maxPart, randomProvider),
  ];
}

export function oscillateBetween(
  p: p5,
  start: number,
  end: number,
  speed: number,
  time: number
): number {
  return p.map(p.sin(time * speed), -1, 1, start, end);
}

export function linearOscillateBetween(
  p: p5,
  min: number,
  max: number,
  frequency: number
): number {
  const phase = p.frameCount * frequency;
  const oscillation = Math.sin(phase); // от -1 до 1
  const normalized = (oscillation + 1) / 2; // от 0 до 1
  return p.lerp(min, max, normalized);
}

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

export function createFactory<Prop extends string = string>(
  fn: (
    p: P5CanvasInstance<ISketchProps<Prop>>,
    getPropValue: (propName: Prop) => number,
    getTime: () => number
  ) => {
    setup: () => void;
    draw: (time: number) => void;
    updateWithProps: (
      props: ISketchProps<Prop>,
      p: P5CanvasInstance<ISketchProps<Prop>>,
      args: FactoryArgs
    ) => void;
  }
): ISketchFactory<Prop> {
  return (args) => (p) => {
    let time = 0,
      props: ISketchProps<Prop>,
      initialPropsUpdate = true;
    const timeShift = new ValueWithHistory<number | undefined>(),
      presetName = new ValueWithHistory<string | undefined>();

    const getPropValue = (propName: Prop) => props[propName];
    const getTime = () => time;
    const { setup, draw, updateWithProps } = fn(p, getPropValue, getTime);

    p.setup = () => {
      p.createCanvas(args.canvasWidth, args.canvasHeight);
      p.randomSeed(args.randomSeed);
      p.noiseSeed(args.randomSeed);
      setup();
    };

    p.draw = () => {
      draw(time);
      time += props.timeDelta;
    };

    p.updateWithProps = (newProps) => {
      props = newProps;
      timeShift.value = props.timeShift;
      presetName.value = props.presetName;

      const drawIfNotInitialUpdate = () => {
        // updateProps's first call happens before `p.setup` call,
        // so calling `draw` triggers a runtime error (`p` is not "well defined" yet)
        if (!initialPropsUpdate) {
          draw(time);
        }
      };

      if (timeShift.hasChanged && timeShift.value !== undefined) {
        const delta = timeShift.value - (timeShift.prev ?? 0);
        time += delta;
        drawIfNotInitialUpdate();
      }

      if (props.playing) {
        p.loop();
      } else {
        p.noLoop();
      }

      updateWithProps(props, p, args);
      drawIfNotInitialUpdate();

      initialPropsUpdate = false;
    };
  };
}
