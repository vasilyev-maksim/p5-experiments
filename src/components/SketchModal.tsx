import type { SketchCanvasSize } from "../models";
import styles from "./SketchModal.module.css";
import { animated, easings, useSpring } from "@react-spring/web";
import { useKeyboardShortcuts, useModalBehavior, useViewport } from "@hooks";
import classNames from "classnames";
import { useCallback, useRef, useState } from "react";
import { SketchCanvas } from "./SketchCanvas";
import { ParamControls } from "./ParamControls";
import { Presets } from "./Presets";
import { useSequence } from "../sequencer";
import {
  MODAL_OPEN_SEQUENCE,
  type Ctx,
  type MODAL_OPEN_SEGMENTS,
} from "../animations";
import { SyncSegment } from "../sequencer/SyncSegment";
import type { SegmentBase } from "../sequencer/SegmentBase";
import { PlaybackControls } from "./PlaybackControls";
import { Button } from "./Button";
import { copyPresetCodeToClipboard } from "@/utils/sketch";
import { usePopStateSync } from "@hooks/url";
import { useActiveSketch } from "@hooks";

export const SketchModal = ({
  left = 0,
  top = 0,
  onBackClick,
}: {
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
    borderWidth,
  } = useViewport();
  const [size, setSize] = useState<SketchCanvasSize>("tile");

  const [{ modalX, headerX, playbackControlsX }, api] = useSpring(() => ({
    from: { modalX: 0, headerX: 0, playbackControlsX: 0 },
  }));
  const { useListener, useSegment } = useSequence<MODAL_OPEN_SEGMENTS, Ctx>(
    MODAL_OPEN_SEQUENCE,
  );
  const showSidebar = useSegment("SHOW_SIDEBAR").wasRun;
  const showBottomActions = useSegment("SHOW_BOTTOM_ACTIONS").wasRun;
  const playbackControlsEnabled = useSegment("START_PLAYING").completed;

  const sketchCanvasRef = useRef<HTMLDivElement>(null);
  const {
    getActivePreset,
    activeSketch,
    params,
    timeDelta,
    paused,
    eventBus,
    spinUp,
    applyPreset,
    randomizeParams,
    playPause,
  } = useActiveSketch();
  const activePreset = getActivePreset();

  const showPlaybackControls = () => {
    if (playbackControlsEnabled) {
      api.start({
        playbackControlsX: 1,
        config: { duration: 300, easing: easings.easeInOutCubic },
      });
    }
  };

  const hidePlaybackControls = () => {
    if (playbackControlsEnabled) {
      api.start({
        playbackControlsX: 0,
        config: { duration: 300, easing: easings.easeInOutCubic },
      });
    }
  };

  const openInFullscreen = useCallback(() => {
    if (sketchCanvasRef.current) {
      function exitHandler() {
        if (!document.fullscreenElement) {
          setSize("modal");
          document.removeEventListener("fullscreenchange", exitHandler);
        }
      }

      setSize("fullscreen");
      sketchCanvasRef.current.requestFullscreen?.();
      document.addEventListener("fullscreenchange", exitHandler, false);
    }
  }, []);

  const onAnimationProgress = useCallback(
    (seg: SegmentBase) => {
      if (
        seg.id === "TILE_GOES_MODAL" &&
        seg.isRunning &&
        seg instanceof SyncSegment
      ) {
        setSize("modal");
        api.start({
          modalX: 1,
          config: { duration: seg.duration, easing: easings.easeInOutCubic },
        });
      } else if (
        seg.id === "SHOW_HEADER" &&
        seg.isRunning &&
        seg instanceof SyncSegment
      ) {
        api.start({
          headerX: 1,
          config: { duration: seg.duration, easing: easings.easeInOutCubic },
        });
      } else if (seg.id === "START_PLAYING" && seg.isRunning) {
        spinUp();
      }
    },
    [spinUp, api],
  );

  useListener(onAnimationProgress);
  useModalBehavior(true, onBackClick);
  useKeyboardShortcuts(playPause, openInFullscreen);
  usePopStateSync(() => {
    applyPreset(getActivePreset(), { updateUrl: false });
  });

  return (
    <animated.div
      className={styles.SketchOverlay}
      style={{
        backgroundColor: modalX.to((x) => `rgba(20, 20, 20, ${x})`),
      }}
    >
      <animated.div
        className={styles.SketchModal}
        style={
          {
            width: modalX.to(
              [0, 1],
              [tileWidth, window.innerWidth - modalMargin * 2],
            ),
            height: modalX.to(
              [0, 1],
              [tileHeight, window.innerHeight - modalMargin * 2],
            ),
            left: modalX.to([0, 1], [left, modalMargin]),
            top: modalX.to([0, 1], [top, modalMargin]),
            scale: modalX.to([0, 1], [1.03, 1]),
            paddingRight: modalX.to([0, 1], [15, modalPadding]),
            paddingTop: modalX.to([0, 1], [15, modalPadding]),
            paddingBottom: modalX.to([0, 1], [15, modalPadding]),
            paddingLeft: modalX.to([0, 1], [0, borderWidth]),
            "--borderWidth": borderWidth + "px",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any
        }
      >
        <div className={styles.Horizontal}>
          <animated.div
            className={styles.Left}
            style={{
              width: modalX.to([0, 1], [0, modalSidebarWidth + modalPadding]),
            }}
          >
            {showSidebar && (
              <>
                <animated.h2
                  className={styles.ModalTitle}
                  style={{
                    marginBottom: modalPadding,
                    marginTop: (modalPadding * 3) / 2,
                    marginLeft: modalSidebarPadding,
                    translateY: headerX.to([0, 1], [15, 0]),
                    opacity: headerX,
                    paddingRight: modalX.to(
                      [0, 1],
                      [0, modalSidebarPadding - 6],
                    ),
                  }}
                >
                  {activeSketch.name.toUpperCase()}
                </animated.h2>
                <animated.div
                  className={styles.Body}
                  style={{
                    paddingTop: modalPadding,
                    paddingRight: modalX.to(
                      [0, 1],
                      [0, modalSidebarPadding - 6],
                    ),
                  }}
                >
                  <Presets />
                  <ParamControls />

                  {showBottomActions && (
                    <div
                      style={{
                        paddingLeft: modalSidebarPadding,
                      }}
                      className={styles.BottomActionsBlock}
                    >
                      <Button
                        onClick={() =>
                          copyPresetCodeToClipboard(
                            params,
                            timeDelta,
                            activeSketch.presets.length,
                          )
                        }
                        label={"Export preset"}
                      />
                      <Button onClick={randomizeParams} label={"Randomize"} />
                    </div>
                  )}
                </animated.div>
              </>
            )}
          </animated.div>
          <div
            className={classNames(styles.Vertical, styles.Right)}
            onMouseEnter={showPlaybackControls}
            onMouseLeave={hidePlaybackControls}
          >
            <div className={styles.RightTop}>
              <SketchCanvas
                id="modal"
                size={size}
                sketch={activeSketch}
                initParams={params}
                paused={paused}
                mode={"static"}
                ref={sketchCanvasRef}
                startTime={
                  activePreset.startTime ?? activeSketch.startTime ?? 0
                }
                timeDelta={timeDelta}
                eventBus={eventBus}
                randomSeed={activePreset.randomSeed ?? activeSketch.randomSeed}
              />
            </div>
            <animated.div
              style={{
                translateY: playbackControlsX
                  .to([0, 1], [100, 0])
                  .to((x) => x + `%`),
                opacity: playbackControlsX,
              }}
              className={styles.PlaybackControlsBlock}
            >
              <PlaybackControls onFullscreenToggle={openInFullscreen} />
            </animated.div>
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
                {activeSketch.name}
              </h2>
            </animated.div>
          </div>
        </div>
      </animated.div>
    </animated.div>
  );
};
