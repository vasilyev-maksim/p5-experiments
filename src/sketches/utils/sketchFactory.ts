import type { P5CanvasInstance } from "@p5-wrapper/react";
import type { ISketchProps, ISketchFactory } from "../../models";
import { TrackedValue } from "../../utils";

type Props<Param extends string = string> = keyof ISketchProps<Param>;
type TrackedProps<Param extends string = string> = {
  [k in Props<Param>]: TrackedValue<ISketchProps<Param>[k]>;
};

export function createSketchFactory<Param extends string = string>(
  fn: (
    p: P5CanvasInstance<ISketchProps<Param>>,
    getProp: <K extends Props<Param>>(propName: K) => TrackedProps<Param>[K],
    getTime: () => number
  ) => {
    setup?: () => void;
    draw: (time: number) => void;
    updateWithProps?: () => void;
  }
): ISketchFactory<Param> {
  return (initialProps) => (p) => {
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
      _updateProps(initialProps);
      p.createCanvas(initialProps.canvasWidth, initialProps.canvasHeight);
      p.randomSeed(initialProps.randomSeed);
      p.noiseSeed(initialProps.randomSeed);

      setup?.();
    };

    p.draw = () => {
      draw(time);
      time += getProp("timeDelta").value!;
    };

    p.updateWithProps = (newRawProps) => {
      _updateProps(newRawProps);
      updateWithProps?.();

      // updateWithProps's first call happens before `p.setup` call
      if (!initialPropsUpdate) {
        // for playback controls
        const timeShift = getProp("timeShift");
        if (timeShift.hasChanged && timeShift.value !== undefined) {
          const delta = timeShift.value - (timeShift.prevValue ?? 0);
          time += delta;
        }

        // respond to canvas size changes
        const canvasHeight = getProp("canvasHeight");
        const canvasWidth = getProp("canvasWidth");

        if (canvasHeight.hasChanged || canvasWidth.hasChanged) {
          // `p.resizeCanvas` calls `p.draw` automatically, so we disable it by passing `true` as last arg.
          // The reason is that `p.draw` implies time increase, which is unintentional, we just want to redraw.
          p.resizeCanvas(canvasWidth.value!, canvasHeight.value!, true);
        }

        draw(time);
      } else {
        // set time using initial time shift (for pretty previews)
        time = getProp("timeShift").value ?? 0;
        initialPropsUpdate = false;
      }

      // play/pause
      const playing = getProp("playing").value!;
      if (playing) {
        p.loop();
      } else {
        p.noLoop();
      }
    };
  };
}
