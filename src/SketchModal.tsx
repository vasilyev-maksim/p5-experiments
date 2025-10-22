import type { IPreset, ISketch } from "./models";
import styles from "./SketchModal.module.css";
import { animated, useSpring } from "@react-spring/web";
import { useViewport } from "./hooks";
import { easings } from "@react-spring/web";
import classNames from "classnames";
import { useRef, useState } from "react";
import { SketchCanvas } from "./SketchCanvas";
import { Controls } from "./Controls";
import { Presets } from "./Presets";
import { extractDefaultParams } from "./utils";

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
  const [showLeftSideContent, setShowLeftSideContent] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const sketchContainerRef = useRef<HTMLDivElement>(null);

  const { modalX, headerX } = useSpring({
    from: { modalX: 0, headerX: 0 },
    to: async (next) => {
      setSize("modal");
      await next({ modalX: 1 });
      setShowLeftSideContent(true);
      // await delay(1000);
      setPlaying(true);
      await next({ headerX: 1 });
      setShowPresets(true);
    },
    config: { duration: 500, easing: easings.easeInOutCubic },
    delay: 500,
  });

  const [params, setParams] = useState(extractDefaultParams(sketch));
  const changeParam = (key: string, value: number) => {
    setParams((x) => ({ ...x, [key]: value }));
  };
  const applyPreset = (preset: IPreset) => {
    setParams(preset.params);
  };

  return (
    <animated.div
      className={styles.SketchOverlay}
      style={{
        backgroundColor: modalX.to((x) => `rgba(20, 20, 20, ${x})`),
      }}
    >
      <animated.div
        className={styles.SketchModal}
        style={{
          width: modalX.to(
            [0, 1],
            [tileWidth, window.innerWidth - modalMargin * 2]
          ),
          height: modalX.to(
            [0, 1],
            [tileHeight, window.innerHeight - modalMargin * 2]
          ),
          left: modalX.to([0, 1], [left, modalMargin]),
          top: modalX.to([0, 1], [top, modalMargin]),
          scale: modalX.to([0, 1], [1.03, 1]),
          padding: modalX.to([0, 1], [15, modalPadding]),
        }}
      >
        <div className={styles.Horizontal}>
          <animated.div
            className={styles.Left}
            style={{
              width: modalX.to([0, 1], [0, modalSidebarWidth]),
              paddingRight: modalX.to([0, 1], [0, modalPadding]),
            }}
          >
            {showLeftSideContent && (
              <>
                <animated.h2
                  className={styles.ModalTitle}
                  style={{
                    marginBottom: modalPadding * 2,
                    marginTop: modalPadding,
                    translateY: headerX.to([0, 1], [15, 0]),
                    opacity: headerX,
                  }}
                >
                  {sketch.name.toUpperCase()}
                </animated.h2>
                {showPresets && (
                  <Presets
                    sketch={sketch}
                    params={params}
                    onApply={applyPreset}
                    onAnimationEnd={() => setShowControls(true)}
                  />
                )}
                {showControls && (
                  <Controls
                    sketch={sketch}
                    params={params}
                    onParamChange={changeParam}
                    onAnimationEnd={() => setPlaying(true)}
                  />
                )}
              </>
            )}
          </animated.div>
          <div className={classNames(styles.Vertical, styles.Right)}>
            <div ref={sketchContainerRef} className={styles.RightTop}>
              <SketchCanvas
                size={size}
                sketch={sketch}
                params={params}
                playing={playing}
              />
            </div>
            <animated.div
              className={styles.RightBottom}
              style={{
                maxHeight: modalX.to([0, 1], [50, 0]),
                opacity: modalX.to([0, 1], [1, 0]),
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
