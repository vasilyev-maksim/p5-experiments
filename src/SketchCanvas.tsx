import { useMemo } from "react";
import type { ISketch } from "./models";
import styles from "./SketchCanvas.module.css";
import { sketchFactory } from "./sketches/spiral";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { useViewport } from "./hooks";
import { animated, easings, to, useSpring } from "react-spring";

export function SketchCanvas(props: {
  sketch: ISketch;
  size: "preview" | "expanded";
  playing: boolean;
}) {
  const {
    modalCanvasHeight,
    modalCanvasWidth,
    // tileHeight,
    tileWidth,
    tilePadding,
  } = useViewport();

  const { x } = useSpring({
    from: { x: 0 },
    to: { x: props.size === "preview" ? 0 : 1 },
    config: { duration: 500, easing: easings.easeInOutCubic },
    // delay: 500000,
  });

  const w = tileWidth - tilePadding * 2;
  const w2 = 520;

  const p5Sketch = useMemo(() => {
    return sketchFactory(modalCanvasWidth, modalCanvasHeight);
  }, [modalCanvasWidth, modalCanvasHeight]);

  const scale = x.to([0, 1], [w / w2, 1]);
  const translateX = x.to([0, 1], [-(modalCanvasWidth - w2) / 2, 0]);
  const translateY = x.to([0, 1], [-(modalCanvasHeight - w2) / 2, 0]);

  return (
    <animated.div
      className={styles.Wrapper}
      style={{
        width: x.to([0, 1], [w, modalCanvasWidth]),
        height: x.to([0, 1], [w, modalCanvasHeight]),
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
        <ReactP5Wrapper sketch={p5Sketch} n={3} t={4} p={props.playing} />
      </animated.div>
      {/* {showSketch ? (
      ) : (
        <animated.div
          className={styles.ImgWrapper}
          style={{
            flexGrow: x.to([0, 1], [0, 1]),
            backgroundImage: `url(${imgSrc})`,
            backgroundSize: x.to([0, 1], [150, 100]).to((x) => `auto ${x}%`),
            backgroundPosition: "center",
          }}
        />
      )} */}
    </animated.div>
  );
}
