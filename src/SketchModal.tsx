import type { ISketch } from "./models";
import styles from "./SketchModal.module.css";
import { animated, useChain, useSpring, useSpringRef } from "@react-spring/web";
import { useViewport } from "./hooks";
import { easings } from "@react-spring/web";
import classNames from "classnames";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { sketchFactory } from "./sketches/spiral";
import { useMemo, useRef, useState } from "react";

const MODAL_PADDING = 15;

export const SketchModal = ({
  sketch,
  left = 0,
  top = 0,
}: {
  sketch: ISketch;
  left?: number;
  top?: number;
}) => {
  const { tileWidth, tileHeight } = useViewport();

  const [showSketch, setShowSketch] = useState(false);
  const sketchContainerRef = useRef<HTMLDivElement>(null);

  const x1Ref = useSpringRef();
  const { x } = useSpring({
    from: { x: 0 },
    to: { x: 1 },
    config: { duration: 500, easing: easings.easeInOutCubic },
    // delay: 500000,
    delay: 500,
    ref: x1Ref,
    onResolve: () => {
      setShowSketch(true);
    },
  });

  const p5Sketch = useMemo(() => {
    if (showSketch && sketchContainerRef?.current) {
      const { width, height } =
        sketchContainerRef.current.getBoundingClientRect();
      return sketchFactory(width, height);
    }
  }, [showSketch]);

  const x2Ref = useSpringRef();
  const { x2 } = useSpring({
    from: { x2: 0 },
    to: { x2: 1 },
    config: { duration: 400, easing: easings.easeInOutCubic },
    // delay: 500000,
    onRest: () => {},
    ref: x2Ref,
  });

  useChain([x1Ref, x2Ref]);

  const imgSrc = `./${sketch.id}_full.png`;

  const [n, setN] = useState(3);
  const [t, setT] = useState(4);

  return (
    <animated.div
      className={styles.SketchOverlay}
      style={{
        backgroundColor: x.to((x) => `rgba(20, 20, 20, ${x})`),
      }}
    >
      <animated.div
        className={styles.SketchModal}
        style={{
          width: x.to(
            [0, 1],
            [tileWidth, window.innerWidth - MODAL_PADDING * 2]
          ),
          height: x.to(
            [0, 1],
            [tileHeight, window.innerHeight - MODAL_PADDING * 2]
          ),
          left: x.to([0, 1], [left, MODAL_PADDING]),
          top: x.to([0, 1], [top, MODAL_PADDING]),
          scale: x.to([0, 1], [1.03, 1]),
          padding: x.to([0, 1], [15, 30]),
        }}
      >
        <div className={styles.Horizontal}>
          <animated.div
            className={styles.Left}
            style={{
              width: x.to([0, 1], [0, 300]),
              opacity: x2.to([0, 1], [0, 1]),
              translateY: x2.to([0, 1], [-15, 0]),
            }}
          >
            <h2 style={{ textAlign: "left" }}>{sketch.name.toUpperCase()}</h2>
            <br />
            <input
              type="range"
              max={10}
              min={3}
              step={1}
              value={n}
              onChange={(e) => setN(parseInt(e.target.value))}
            />{" "}
            N={n}
            <br />
            <input
              type="range"
              max={10}
              min={1}
              step={1}
              value={t}
              onChange={(e) => setT(parseInt(e.target.value))}
            />{" "}
            T={t}
          </animated.div>
          <div className={classNames(styles.Vertical, styles.Right)}>
            <div ref={sketchContainerRef} className={styles.RightTop}>
              {showSketch ? (
                <ReactP5Wrapper sketch={p5Sketch} n={n} t={t} />
              ) : (
                <animated.div
                  className={styles.ImgWrapper}
                  style={{
                    flexGrow: x.to([0, 1], [0, 1]),
                    backgroundImage: `url(${imgSrc})`,
                    backgroundSize: x
                      .to([0, 1], [150, 100])
                      .to((x) => `auto ${x}%`),
                    backgroundPosition: "center",
                  }}
                />
              )}
            </div>
            <animated.div
              className={styles.RightBottom}
              style={{
                maxHeight: x.to([0, 1], [50, 0]),
                opacity: x.to([0, 1], [1, 0]),
              }}
            >
              <h2 className={styles.Title}>{sketch.name}</h2>
            </animated.div>
          </div>
        </div>
      </animated.div>
    </animated.div>
  );
};
