import { useMemo, forwardRef, useEffect, useRef } from "react";
import type {
  ISketch,
  IParams,
  SketchCanvasSize,
  ISketchProps,
} from "../models";
import styles from "./SketchCanvas.module.css";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { useViewport } from "../hooks";
import { animated, easings, to, useSpring } from "react-spring";
import { MODAL_OPEN_SEQUENCE, type MODAL_OPEN_SEGMENTS } from "../animations";
import { useSequence } from "../sequencer";

export const SketchCanvas = forwardRef<
  HTMLDivElement,
  {
    sketch: ISketch;
    size: SketchCanvasSize;
    playing: boolean;
    params: IParams;
    presetName?: string;
    timeDelta?: number;
    timeShift?: number;
  }
>((props, ref) => {
  const { canvasModalWidth, canvasModalHeight, canvasTileSize } = useViewport();
  const previewSize = props.sketch.preview.size;
  const prevSize = useRef<SketchCanvasSize>(null);
  const canvasWidth =
    props.size === "fullscreen" ? window.innerWidth : canvasModalWidth;
  const canvasHeight =
    props.size === "fullscreen" ? window.innerHeight : canvasModalHeight;

  const sketchProps = {
    ...props.params,
    playing: props.playing,
    presetName: props.presetName,
    timeShift: props.timeShift ?? props.sketch.timeShift ?? 0,
    timeDelta: props.timeDelta ?? 0,
    canvasWidth: canvasWidth,
    canvasHeight: canvasHeight,
    randomSeed: props.sketch.randomSeed ?? 0,
  } as ISketchProps;

  const p5Sketch = useMemo(() => {
    // this time `sketchProps` are initial props
    return props.sketch.factory(sketchProps);
  }, []);

  const { duration } =
    useSequence<MODAL_OPEN_SEGMENTS>(MODAL_OPEN_SEQUENCE).useSegment(
      "TILE_GOES_MODAL"
    );
  const [{ x }, api] = useSpring(() => ({
    from: { x: 0 },
    config: { duration, easing: easings.easeInOutCubic },
  }));

  useEffect(() => {
    const prev = prevSize.current;
    const curr = props.size;
    prevSize.current = curr;

    if (curr === "modal") {
      if (prev === "fullscreen") {
        api.set({ x: 1 });
      } else if (prev === "tile") {
        api.start({ x: 1 });
      }
    } else if (curr === "tile") {
      api.set({ x: 0 });
    }
  }, [props.size, api]);

  const scale = x.to([0, 1], [canvasTileSize / previewSize, 1]);
  const translateX = x.to([0, 1], [-(canvasModalWidth - previewSize) / 2, 0]);
  const translateY = x.to([0, 1], [-(canvasModalHeight - previewSize) / 2, 0]);
  const width = x.to([0, 1], [canvasTileSize, canvasModalWidth]);
  const height = x.to([0, 1], [canvasTileSize, canvasModalHeight]);

  return (
    <animated.div
      className={styles.Wrapper}
      ref={ref}
      style={{
        width,
        height,
      }}
    >
      <animated.div
        className={styles.CanvasWrapper}
        style={{
          transformOrigin: "top left",
          transform: to(
            [scale, translateX, translateY],
            (s, tx, ty) => `scale(${s}) translate(${tx}px, ${ty}px)`
          ),
        }}
      >
        <ReactP5Wrapper sketch={p5Sketch} {...sketchProps} />
      </animated.div>
    </animated.div>
  );
});
