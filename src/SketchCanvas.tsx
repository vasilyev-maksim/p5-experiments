import { useMemo } from "react";
import type { ISketch } from "./models";
import styles from "./SketchCanvas.module.css";
import { sketchFactory } from "./sketches/spiral";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { useViewport } from "./hooks";
import { animated } from "react-spring";

export function SketchCanvas(props: { sketch: ISketch }) {
  const {
    modalCanvasHeight,
    modalCanvasWidth,
    // tileHeight,
    tileWidth,
    tilePadding,
  } = useViewport();

  const p5Sketch = useMemo(() => {
    return sketchFactory(modalCanvasWidth, modalCanvasHeight);
  }, []);

  return (
    <animated.div
      className={styles.Wrapper}
      style={{
        width: tileWidth - tilePadding * 2,
        height: tileWidth - tilePadding * 2,
      }}
    >
      <div
        className={styles.CanvasWrapper}
        style={{
          position: "absolute",
          transformOrigin: "top left",
          transform: `scale(${tileWidth / modalCanvasHeight})`,
        }}
      >
        <ReactP5Wrapper sketch={p5Sketch} n={3} t={4} />
      </div>
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
