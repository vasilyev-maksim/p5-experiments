import { useMemo } from "react";
import type { ISketch } from "./models";
import styles from "./SketchCanvas.module.css";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { useViewport } from "./hooks";
import { animated, easings, to, useSpring } from "react-spring";

export function SketchCanvas(props: {
  sketch: ISketch;
  size: "tile" | "modal";
  playing: boolean;
  params: Record<string, number>;
}) {
  const { canvasModalWidth, canvasModalHeight, canvasTileSize } = useViewport();
  const previewSize = props.sketch.preview.size;

  const p5Sketch = useMemo(() => {
    return props.sketch.factory(
      canvasModalWidth,
      canvasModalHeight,
      props.sketch.randomSeed ?? 0,
      props.sketch.timeShift ?? 0
    );
  }, [props.sketch, canvasModalWidth, canvasModalHeight]);

  const { x } = useSpring({
    from: { x: 0 },
    to: { x: props.size === "tile" ? 0 : 1 },
    config: { duration: 500, easing: easings.easeInOutCubic },
  });

  const scale = x.to([0, 1], [canvasTileSize / previewSize, 1]);
  const translateX = x.to([0, 1], [-(canvasModalWidth - previewSize) / 2, 0]);
  const translateY = x.to([0, 1], [-(canvasModalHeight - previewSize) / 2, 0]);

  return (
    <animated.div
      className={styles.Wrapper}
      style={{
        width: x.to([0, 1], [canvasTileSize, canvasModalWidth]),
        height: x.to([0, 1], [canvasTileSize, canvasModalHeight]),
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
        <ReactP5Wrapper
          sketch={p5Sketch}
          {...props.params}
          playing={props.playing}
        />
      </animated.div>
    </animated.div>
  );
}
