import type {
  SketchEvent,
  IPreset,
  ISketch,
  SketchCanvasSize,
} from "../models";
import styles from "./SketchModal.module.css";
import { animated, easings, useSpring } from "@react-spring/web";
import { useKeyboardShortcuts, useModalBehavior, useViewport } from "../hooks";
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
import { copyPresetCodeToClipboard, getRandomParams } from "@/utils/misc";

const EXPORT_WIDTH = 3840 / 2,
  EXPORT_HEIGHT = 2160 / 2;

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
    borderWidth,
  } = useViewport();

  const { useListener, useSegment } = useSequence<MODAL_OPEN_SEGMENTS, Ctx>(
    MODAL_OPEN_SEQUENCE,
  );
  const showSidebar = useSegment("SHOW_SIDEBAR").wasRun;
  const showBottomActions = useSegment("SHOW_BOTTOM_ACTIONS").wasRun;
  const playbackControlsEnabled = useSegment("START_PLAYING").completed;

  const onProgress = useCallback((seg: SegmentBase) => {
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
      setPlaying(true);
    }
  }, []);

  useListener(onProgress);

  const [size, setSize] = useState<SketchCanvasSize>("tile");
  const [playing, setPlaying] = useState(false);
  const sketchCanvasRef = useRef<HTMLDivElement>(null);
  const [params, setParams] = useState(sketch.defaultParams);
  /** initially used for sketch timeShift (to match preview tile) and then for playback controls */
  const [timeShift, setTimeShift] = useState<number>(sketch.timeShift ?? 0);
  /** time delta is a speed of animation set by user */
  const [timeDelta, setTimeDelta] = useState(
    sketch.defaultParams.timeDelta ?? 1,
  );
  /** manual time delta is used by playback controls and takes precedence over timeDelta (if former is set) */
  const [manualTimeDelta, setManualTimeDelta] = useState<number>();
  const [event, setEvent] = useState<SketchEvent>();

  const changeParam = (key: string, value: number) => {
    setParams((x) => ({ ...x, [key]: value }));
  };

  const applyPreset = (preset: IPreset) => {
    setParams(preset.params);
    setEvent({
      type: "presetChange",
      preset,
    });
    setTimeDelta(preset.params.timeDelta ?? 1);
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

  const handleExport = () => {
    setEvent({
      type: "export",
      exportFileWidth: EXPORT_WIDTH,
      exportFileHeight: EXPORT_HEIGHT,
      exportFileName: `${sketch.id}_wallpaper.jpg`,
    });
  };

  const jumpNFrames = (N: number) => () => {
    if (playing) {
      setPlaying(false);
    }
    setTimeShift((x) => (x ?? 0) + N);
  };

  const playWithCustomDelta = (delta: number) => () => {
    setManualTimeDelta(delta);
    if (!playing) {
      setPlaying(true);
    }
  };

  const stopPlayingWithCustomDelta = () => {
    setManualTimeDelta(undefined);
    changeParam("TIME_DELTA", 1);
    if (playing) {
      setPlaying(false);
    }
  };

  const randomizeParams = () => {
    const newParams = getRandomParams(sketch.controls);
    setParams(newParams);
  };

  const [{ modalX, headerX, playbackControlsX }, api] = useSpring(() => ({
    from: { modalX: 0, headerX: 0, playbackControlsX: 0 },
  }));

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
              paddingRight: modalX.to([0, 1], [0, modalSidebarPadding - 6]),
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
                  }}
                >
                  {sketch.name.toUpperCase()}
                </animated.h2>
                <div
                  className={styles.Body}
                  style={{
                    paddingTop: modalPadding,
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
                  {showBottomActions && (
                    <div
                      style={{
                        paddingLeft: modalSidebarPadding,
                      }}
                      className={styles.BottomActionsBlock}
                    >
                      <Button
                        onClick={() => copyPresetCodeToClipboard(params)}
                        label={"Export preset"}
                      />
                      &nbsp;
                      <Button onClick={randomizeParams} label={"Randomize"} />
                    </div>
                  )}
                </div>
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
                sketch={sketch}
                params={params}
                playing={playing}
                ref={sketchCanvasRef}
                timeShift={timeShift}
                timeDelta={manualTimeDelta || timeDelta}
                event={event}
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
              <PlaybackControls
                playing={playing}
                timeDelta={timeDelta}
                onTimeDeltaChange={setTimeDelta}
                onPlayPause={playPause}
                onFullscreenToggle={openInFullscreen}
                onJumpNFrames={jumpNFrames}
                onPlayWithCustomDelta={playWithCustomDelta}
                onStopPlayingWithCustomDelta={stopPlayingWithCustomDelta}
                onExport={handleExport}
              />
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
                {sketch.name}
              </h2>
            </animated.div>
          </div>
        </div>
      </animated.div>
    </animated.div>
  );
};
