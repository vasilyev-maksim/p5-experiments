import type { ISketch } from "./models";
import styles from "./SketchModal.module.css";
import { animated, useChain, useSpring, useSpringRef } from "@react-spring/web";
import { useViewport } from "./hooks";
import { easings } from "@react-spring/web";
import classNames from "classnames";
import { useRef, useState } from "react";
import { SketchCanvas } from "./SketchCanvas";
import { Controls } from "./Controls";

export const SketchModal = ({
  sketch,
  left = 0,
  top = 0,
}: {
  sketch: ISketch;
  left?: number;
  top?: number;
}) => {
  const {
    tileWidth,
    tileHeight,
    modalMargin,
    modalPadding,
    modalSidebarWidth,
  } = useViewport();

  const [size, setSize] = useState<"tile" | "modal">("tile");
  const [playing, setPlaying] = useState(false);
  const sketchContainerRef = useRef<HTMLDivElement>(null);

  const x1Ref = useSpringRef();
  const { x } = useSpring({
    from: { x: 0 },
    to: { x: 1 },
    config: { duration: 500, easing: easings.easeInOutCubic },
    delay: 500,
    onStart: () => {
      setSize("modal");
    },
    ref: x1Ref,
  });

  const x2Ref = useSpringRef();
  const { x2 } = useSpring({
    from: { x2: 0 },
    to: { x2: 1 },
    config: { duration: 400, easing: easings.easeInOutCubic },
    onRest: () => {},
    ref: x2Ref,
    onResolve: () => {
      setPlaying(true);
    },
  });

  useChain([x1Ref, x2Ref]);

  const [paramsMap, setParamsMap] = useState(
    Object.fromEntries(
      sketch.controls?.map((x) => [x.key, x.defaultValue]) ?? []
    )
  );
  const changeParam = (key: string, value: number) => {
    setParamsMap((x) => ({ ...x, [key]: value }));
  };
  const applyPreset = (paramsMap: Record<string, number>) => {
    setParamsMap(paramsMap);
  };

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
          width: x.to([0, 1], [tileWidth, window.innerWidth - modalMargin * 2]),
          height: x.to(
            [0, 1],
            [tileHeight, window.innerHeight - modalMargin * 2]
          ),
          left: x.to([0, 1], [left, modalMargin]),
          top: x.to([0, 1], [top, modalMargin]),
          scale: x.to([0, 1], [1.03, 1]),
          padding: x.to([0, 1], [15, modalPadding]),
        }}
      >
        <div className={styles.Horizontal}>
          <animated.div
            className={styles.Left}
            style={{
              width: x.to([0, 1], [0, modalSidebarWidth]),
              opacity: x2.to([0, 1], [0, 1]),
              translateY: x2.to([0, 1], [15, 0]),
            }}
          >
            <h2
              style={{ paddingRight: modalPadding }}
              className={styles.ModalTitle}
            >
              {sketch.name.toUpperCase()}
            </h2>
            <br />
            <Controls
              onPresetApply={applyPreset}
              sketch={sketch}
              paramsMap={paramsMap}
              onParamChange={changeParam}
            />
          </animated.div>
          <div className={classNames(styles.Vertical, styles.Right)}>
            <div ref={sketchContainerRef} className={styles.RightTop}>
              <SketchCanvas
                size={size}
                sketch={sketch}
                params={paramsMap}
                playing={playing}
              />
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
