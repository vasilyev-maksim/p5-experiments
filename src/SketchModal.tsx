import type { IPreset, ISketch } from "./models";
import styles from "./SketchModal.module.css";
import { animated, useSpring } from "@react-spring/web";
import { useViewport } from "./hooks";
import { easings } from "@react-spring/web";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { SketchCanvas } from "./SketchCanvas";
import { ParamControls } from "./ParamControls";
import { Presets } from "./Presets";
import { delay, extractDefaultParams } from "./utils";
import { PlaybackControls } from "./PlaybackControls";

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
    tilePadding,
    modalMargin,
    modalPadding,
    modalSidebarWidth,
  } = useViewport();

  const [size, setSize] = useState<"tile" | "modal">("tile");
  const [playing, setPlaying] = useState(false);
  const [showLeftSideContent, setShowLeftSideContent] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showParamControls, setShowParamControls] = useState(false);
  const sketchContainerRef = useRef<HTMLDivElement>(null);
  const [params, setParams] = useState(extractDefaultParams(sketch));
  const changeParam = (key: string, value: number) => {
    setParams((x) => ({ ...x, [key]: value }));
  };
  const applyPreset = (preset: IPreset) => {
    setParams(preset.params);
  };

  const [{ modalX, headerX }, api] = useSpring(() => ({
    from: { modalX: 0, headerX: 0 },
    config: { duration: 500, easing: easings.easeInOutCubic },
  }));

  useEffect(() => {
    async function runAnimations() {
      await delay(500);
      setSize("modal");
      await Promise.all(api.start({ modalX: 1 }));
      setShowLeftSideContent(true);
      Promise.all(api.start({ headerX: 1 })).then(() => setShowPresets(true));
      await delay(300);
      setPlaying(true);
    }
    runAnimations();
  }, [api]);

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
          paddingRight: modalX.to([0, 1], [15, modalPadding]),
          paddingTop: modalX.to([0, 1], [15, modalPadding]),
          paddingBottom: modalX.to([0, 1], [15, modalPadding]),
        }}
      >
        <div className={styles.Horizontal}>
          <animated.div
            className={styles.Left}
            style={{
              width: modalX.to([0, 1], [0, modalSidebarWidth + modalPadding]),
              paddingRight: modalX.to([0, 1], [0, modalPadding]),
              // paddingLeft: modalX.to([0, 1], [0, modalPadding]),
            }}
          >
            {showLeftSideContent && (
              <>
                <animated.h2
                  className={styles.ModalTitle}
                  style={{
                    marginBottom: modalPadding * 2,
                    marginTop: modalPadding,
                    marginLeft: modalPadding,
                    translateY: headerX.to([0, 1], [15, 0]),
                    opacity: headerX,
                  }}
                >
                  {sketch.name.toUpperCase()}
                </animated.h2>
                <div className={styles.Body}>
                  {showPresets && (
                    <Presets
                      sketch={sketch}
                      params={params}
                      onApply={applyPreset}
                      onAnimationEnd={() => setShowParamControls(true)}
                    />
                  )}
                  {showParamControls && (
                    <ParamControls
                      sketch={sketch}
                      params={params}
                      onParamChange={changeParam}
                      // onAnimationEnd={() => setPlaying(true)}
                    />
                  )}
                </div>
                <div
                  className={styles.Footer}
                  style={{
                    paddingLeft: modalPadding,
                    paddingRight: modalPadding,
                  }}
                >
                  <PlaybackControls
                    onPlayPause={() => setPlaying((x) => !x)}
                    playing={playing}
                  />
                </div>
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
              <h2
                className={styles.Title}
                style={{
                  paddingLeft: tilePadding,
                }}
              >
                {sketch.name}
              </h2>
            </animated.div>
          </div>
        </div>
      </animated.div>
    </animated.div>
  );
};
