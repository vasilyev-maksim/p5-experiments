import type { P5CanvasInstance } from "@p5-wrapper/react";
import p5 from "p5";
import type { ISketchFactory, ISketchProps } from "../models";
import { TrackedValue } from "../utils";

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
    callback: (cArgs) => {
      grid.push(cArgs);
    },
  });
  return grid;
}

export function getRandomPartition(
  p: p5,
  partsCount: number,
  dispersion: number
): number[] {
  if (dispersion < 0 || dispersion > 1) {
    throw Error(
      `Invalid dispersion value "${dispersion}", should be < 0 and > 1`
    );
  }

  const min = (1 - dispersion) / partsCount;
  const max = (1 + dispersion) / partsCount;

  function r(n: number, remainder: number): number[] {
    if (n <= 1) {
      return [remainder];
    }

    const _max = Math.min(max, remainder - min * (n - 1));
    if (min - _max > 0.00001) {
      throw Error(
        `No sufficient range left for partition (for n = ${n}, reminder = ${remainder}, min = ${min}, _max = ${_max})`
      );
    }
    const curr = p.map(p.random(), 0, 1, min, _max);

    return [curr, ...r(n - 1, remainder - curr)];
  }

  const res = r(partsCount, 1);
  return res;
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

type Props<Param extends string = string> = keyof ISketchProps<Param>;
type TrackedProps<Param extends string = string> = {
  [k in Props<Param>]: TrackedValue<ISketchProps<Param>[k]>;
};

export function createFactory<Param extends string = string>(
  fn: (
    p: P5CanvasInstance<ISketchProps<Param>>,
    getProp: <K extends Props<Param>>(propName: K) => TrackedProps<Param>[K],
    getTime: () => number
  ) => {
    setup: () => void;
    draw: (time: number) => void;
    updateWithProps: () => void;
  }
): ISketchFactory<Param> {
  return ({ initialCanvasHeight, initialCanvasWidth, initialRandomSeed }) =>
    (p) => {
      let time = 0,
        initialPropsUpdate = true,
        props: TrackedProps<Param>;

      const getProp = <K extends Props<Param>>(propName: K) => props[propName]!;
      const getTime = () => time;
      const { setup, draw, updateWithProps } = fn(p, getProp, getTime);

      const _updateProps = (newRawProps: ISketchProps<Param>) => {
        if (!props) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          props = {} as any;
        }

        (Object.keys(newRawProps) as Props<Param>[]).forEach((key) => {
          if (props[key] === undefined) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            props[key] = new TrackedValue(newRawProps[key] as any) as any;
          } else {
            props[key].value = newRawProps[key];
          }
        });
      };

      p.setup = () => {
        p.createCanvas(initialCanvasWidth, initialCanvasHeight);
        p.randomSeed(initialRandomSeed);
        p.noiseSeed(initialRandomSeed);

        setup();
      };

      p.draw = () => {
        draw(time);
        time += getProp("timeDelta").value!;
      };

      p.updateWithProps = (newRawProps) => {
        const drawIfNotInitialUpdate = () => {
          // updateWithProps's first call happens before `p.setup` call,
          // so calling `draw` triggers a runtime error (`p` is not "well defined" yet)
          if (!initialPropsUpdate) {
            draw(time);
          }
        };

        _updateProps(newRawProps);

        const timeShift = getProp("timeShift");
        if (timeShift.hasChanged && timeShift.value !== undefined) {
          const delta = timeShift.value - (timeShift.prevValue ?? 0);
          time += delta;
          drawIfNotInitialUpdate();
        }

        const playing = getProp("playing").value!;
        if (playing) {
          p.loop();
        } else {
          p.noLoop();
        }

        const canvasHeight = getProp("canvasHeight");
        const canvasWidth = getProp("canvasWidth");
        if (canvasHeight.hasChanged || canvasWidth.hasChanged) {
          p.resizeCanvas(canvasWidth.value!, canvasHeight.value!, true);
          drawIfNotInitialUpdate();
        }

        updateWithProps();
        drawIfNotInitialUpdate();

        initialPropsUpdate = false;
      };
    };
}
