import type { IPreset, ISketch, SketchCanvasSize } from "./models";
import styles from "./SketchModal.module.css";
import { animated, easings, useSpring } from "@react-spring/web";
import { useViewport } from "./hooks";
import classNames from "classnames";
import { useCallback, useRef, useState } from "react";
import { SketchCanvas } from "./SketchCanvas";
import { ParamControls } from "./ParamControls";
import { Presets } from "./Presets";
import {
  extractDefaultParams,
  useModalBehavior,
  useKeyboardShortcuts,
} from "./utils";
import { SketchModalFooter } from "./SketchModalFooter";
import { useSequence } from "./sequencer";
import { MODAL_OPEN_SEQ, type STEPS } from "./main";
import { SyncSegment } from "./sequencer/SyncSegment";
import type { Segment } from "./sequencer/models";

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

  const onSegmentActivation = useCallback((seg: Segment) => {
    if (seg.id === "TILE_GOES_MODAL" && seg instanceof SyncSegment) {
      setSize("modal");
      api.start({
        modalX: 1,
        config: { duration: seg.duration, easing: easings.easeInOutCubic },
      });
    } else if (seg.id === "SHOW_HEADER" && seg instanceof SyncSegment) {
      api.start({
        headerX: 1,
        config: { duration: seg.duration, easing: easings.easeInOutCubic },
      });
    } else if (seg.id === "START_PLAYING") {
      setPlaying(true);
    }
  }, []);

  const { useListener, useStart, useSegment } =
    useSequence<STEPS>(MODAL_OPEN_SEQ);
  const showSidebar = useSegment("SHOW_SIDEBAR").currentPhase !== "not_started";

  useListener(onSegmentActivation);
  useStart();

  const [size, setSize] = useState<SketchCanvasSize>("tile");
  const [playing, setPlaying] = useState(false);
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
  }));

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
            {showSidebar && (
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
                  <Presets
                    sketch={sketch}
                    params={params}
                    onApply={applyPreset}
                  />
                  <ParamControls
                    sketch={sketch}
                    params={params}
                    onParamChange={changeParam}
                  />
                </div>
                <SketchModalFooter
                  onPlayPause={playPause}
                  playing={playing}
                  onBackClick={onBackClick}
                  onFullscreenToggle={openInFullscreen}
                />
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
