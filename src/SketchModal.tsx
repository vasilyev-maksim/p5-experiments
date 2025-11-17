import type { IPreset, ISketch, SketchCanvasSize } from "./models";
import styles from "./SketchModal.module.css";
import { animated, useSpring } from "@react-spring/web";
import { useViewport } from "./hooks";
import { easings } from "@react-spring/web";
import classNames from "classnames";
import { useEffect, useMemo, useRef, useState } from "react";
import { SketchCanvas } from "./SketchCanvas";
import { ParamControls } from "./ParamControls";
import { Presets } from "./Presets";
import {
  // delay,
  extractDefaultParams,
  useModalBehavior,
  useKeyboardShortcuts,
  useSequence,
} from "./utils";
import { SketchModalFooter } from "./SketchModalFooter";
import { DelayStep } from "./sequencer/DelayStep";
import { CallbackStep } from "./sequencer/CallbackStep";
import { ValueStep } from "./sequencer/ValueStep";
import type { Step } from "./sequencer/models";

enum _STEP {
  Sidebar = 0,
  Presets = 1,
}

export const SketchModal = ({
  sketch,
  left = 0,
  top = 0,
  onBackClick,
}: {
  sketch: ISketch;
  left?: number;
  top?: number;
  onBackClick: () => void;
}) => {
  const {
    tileWidth,
    tileHeight,
    tilePadding,
    modalMargin,
    modalPadding,
    modalSidebarWidth,
    modalSidebarPadding,
  } = useViewport();

  //  async function runAnimations() {
  //     await delay(500);
  //     setSize("modal");
  //     await Promise.all(api.start({ modalX: 1 }));
  //     setShowLeftSideContent(true);

  //     Promise.all(api.start({ headerX: 1 })).then(() => setShowPresets(true));
  //     await delay(300);
  //     setPlaying(true);
  //   }
  //   runAnimations();
  const steps: Step<_STEP>[] = useMemo(
    () => [
      new DelayStep(500),
      new CallbackStep(() => setSize("modal")),
      new CallbackStep(() =>
        Promise.all(
          api.start({
            modalX: 1,
            config: { duration: 500, easing: easings.easeInOutCubic },
          })
        )
      ),
      new ValueStep(_STEP.Sidebar),
      new CallbackStep(async (_, setValue) => {
        await Promise.all(
          api.start({
            headerX: 1,
            config: { duration: 500, easing: easings.easeInOutCubic },
          })
        );
        setValue(_STEP.Presets);
      }),
      new DelayStep(300),
      new CallbackStep(() => setPlaying(true)),
    ],
    []
  );
  const { currentValue } = useSequence<_STEP>(steps);

  useEffect(() => {
    console.log({ currentValue });
  }, [currentValue]);

  const [size, setSize] = useState<SketchCanvasSize>("tile");
  const [playing, setPlaying] = useState(false);
  // const [showLeftSideContent, setShowLeftSideContent] = useState(false);
  // const [showPresets, setShowPresets] = useState(false);

  const [showParamControls, setShowParamControls] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const sketchCanvasRef = useRef<HTMLDivElement>(null);
  const [params, setParams] = useState(extractDefaultParams(sketch));
  const changeParam = (key: string, value: number) => {
    setParams((x) => ({ ...x, [key]: value }));
  };
  const applyPreset = (preset: IPreset) => {
    setParams(preset.params);
  };
  const playPause = () => setPlaying((x) => !x);
  const openInFullscreen = () => {
    if (sketchCanvasRef.current) {
      setSize("fullscreen");
      sketchCanvasRef.current.requestFullscreen?.();
      document.addEventListener("fullscreenchange", exitHandler, false);

      function exitHandler() {
        if (!document.fullscreenElement) {
          setSize("modal");
          document.removeEventListener("fullscreenchange", exitHandler);
        }
      }
    }
  };

  const [{ modalX, headerX }, api] = useSpring(() => ({
    from: { modalX: 0, headerX: 0 },
    // config: { duration: 500, easing: easings.easeInOutCubic },
  }));

  // useEffect(() => {
  //   async function runAnimations() {
  //     await delay(500);
  //     setSize("modal");
  //     await Promise.all(api.start({ modalX: 1 }));
  //     setShowLeftSideContent(true);
  //     Promise.all(api.start({ headerX: 1 })).then(() => setShowPresets(true));
  //     await delay(300);
  //     setPlaying(true);
  //   }
  //   runAnimations();
  // }, [api]);

  useModalBehavior(true, onBackClick);
  useKeyboardShortcuts(playPause, openInFullscreen);

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
          paddingLeft: modalX.to([0, 1], [0, 4]),
        }}
      >
        <div className={styles.Horizontal}>
          <animated.div
            className={styles.Left}
            style={{
              width: modalX.to([0, 1], [0, modalSidebarWidth + modalPadding]),
              paddingRight: modalX.to([0, 1], [0, modalSidebarPadding - 6]),
            }}
          >
            {(currentValue ?? 0) >= _STEP.Sidebar && (
              <>
                <animated.h2
                  className={styles.ModalTitle}
                  style={{
                    marginBottom: modalPadding / 2,
                    marginTop: modalPadding,
                    marginLeft: modalSidebarPadding,
                    translateY: headerX.to([0, 1], [15, 0]),
                    opacity: headerX,
                  }}
                >
                  {sketch.name.toUpperCase()}
                </animated.h2>
                <div
                  className={styles.Body}
                  style={{
                    paddingTop: (modalPadding * 3) / 2,
                  }}
                >
                  {(currentValue ?? 0) >= _STEP.Presets && (
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
                      onAnimationEnd={() => setShowFooter(true)}
                    />
                  )}
                </div>
                {showFooter && (
                  <div
                    className={styles.Footer}
                    style={{
                      paddingLeft: modalPadding - 4,
                      paddingRight: 6,
                    }}
                  >
                    <SketchModalFooter
                      onPlayPause={playPause}
                      playing={playing}
                      onBackClick={onBackClick}
                      onFullscreenToggle={openInFullscreen}
                    />
                  </div>
                )}
              </>
            )}
          </animated.div>
          <div className={classNames(styles.Vertical, styles.Right)}>
            <div className={styles.RightTop}>
              <SketchCanvas
                size={size}
                sketch={sketch}
                params={params}
                playing={playing}
                ref={sketchCanvasRef}
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
