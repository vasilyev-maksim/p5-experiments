import type { SketchCanvasSize } from "../models";
import styles from "./SketchModal.module.css";
import { animated, easings, useSpring } from "@react-spring/web";
import { useSizes } from "@/hooks/useSizes";
import { useModalBehavior } from "@/hooks/useModalBehavior";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import classNames from "classnames";
import { useCallback, useState } from "react";
import { SketchCanvas } from "./SketchCanvas";
import { useSequence } from "../sequencer";
import {
  MODAL_OPEN_SEQUENCE,
  type Ctx,
  type MODAL_OPEN_SEGMENTS,
} from "../animations";
import { SyncSegment } from "../sequencer/SyncSegment";
import type { SegmentBase } from "../sequencer/SegmentBase";
import { PlaybackControls } from "./PlaybackControls";
import { usePopStateSync } from "@/hooks/usePopStateSync";
import { useActiveSketch } from "@/hooks/useActiveSketch";
import { SketchModalSidebar } from "./SketchModalSidebar";
import { CrossIcon } from "./Icons";
import { useAnalytics } from "@/hooks/useAnalytics";

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
    getActivePreset,
    activeSketch,
    params,
    timeDelta,
    paused,
    eventBus,
    spinUp,
    applyPreset,
    playPause,
  } = useActiveSketch();
  const activePreset = getActivePreset();
  const [size, setSize] = useState<SketchCanvasSize>("tile");

  const [{ modalX, headerX, overlayX }, api] = useSpring(() => ({
    from: { modalX: 0, headerX: 0, overlayX: 0 },
  }));
  const { useListener, useSegment } = useSequence<MODAL_OPEN_SEGMENTS, Ctx>(
    MODAL_OPEN_SEQUENCE,
  );

  const showSidebar = useSegment("SHOW_SIDEBAR").wasRun;
  // overlay consists of [playback controls panel at the bottom + close button at the top right]
  const overlayIsActive = useSegment("START_PLAYING").completed;

  // tracks if initially (before animation starts playing and `overlayIsActive` === false) the mouse was over the canvas
  const [mouseInside, setMouseInside] = useState(false);

  const showOverlay = () => {
    api.start({
      overlayX: 1,
      config: { duration: 300, easing: easings.easeInOutCubic },
    });
  };

  const hideOverlay = () => {
    api.start({
      overlayX: 0,
      config: { duration: 300, easing: easings.easeInOutCubic },
    });
  };

  const handleMouseEnter = () => {
    if (overlayIsActive) {
      showOverlay();
    } else if (mouseInside === false) {
      setMouseInside(true);
    }
  };

  const handleMouseLeave = () => {
    if (overlayIsActive) {
      hideOverlay();
    } else if (mouseInside === true) {
      setMouseInside(false);
    }
  };

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

        // show overlay if at the moment the modal was expanding the mouse happened to be over the canvas
        if (mouseInside) {
          showOverlay();
        }
      }
    },
    [spinUp, api, mouseInside],
  );

  useListener(onAnimationProgress);
  useModalBehavior(true, onBackClick);
  usePopStateSync(() => {
    applyPreset(getActivePreset(), { updateUrl: false });
  });

  const { sendAnalyticsEvent } = useAnalytics();
  const openInFullscreen = useCallback(() => {
    sendAnalyticsEvent("fullscreen");
    setSize("fullscreen");
  }, []);
  const handleFullScreenExit = () => setSize("modal");
  useKeyboardShortcuts(playPause, openInFullscreen);

  const {
    tileWidth,
    tileHeight,
    tilePadding,
    modalMargin,
    modalPadding,
    modalSidebarWidth,
    borderWidth,
    viewportHeight,
    viewportWidth,
  } = useSizes();

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
              [tileWidth, viewportWidth - modalMargin * 2],
            ),
            height: modalX.to(
              [0, 1],
              [tileHeight, viewportHeight - modalMargin * 2],
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
              <SketchModalSidebar modalX={modalX} headerX={headerX} />
            )}
          </animated.div>
          <div
            className={classNames(styles.Vertical, styles.Right)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className={styles.RightTop}>
              <SketchCanvas
                id="modal"
                size={size}
                sketch={activeSketch}
                initParams={params}
                paused={paused}
                mode="static"
                startTime={
                  activePreset.startTime ?? activeSketch.startTime ?? 0
                }
                timeDelta={timeDelta}
                eventBus={eventBus}
                randomSeed={activePreset.randomSeed ?? activeSketch.randomSeed}
                onFullScreenExit={handleFullScreenExit}
              />
            </div>

            <animated.div
              className={styles.RightBottom}
              style={{
                maxHeight: modalX.to([0, 1], [50, 0]),
                opacity: modalX.to([0, 1], [1, 0]),
              }}
            >
              <h2 className={styles.Title} style={{ paddingLeft: tilePadding }}>
                {activeSketch.name}
              </h2>
            </animated.div>

            <animated.div
              style={{
                translateY: overlayX.to([0, 1], [100, 0]).to((x) => x + `%`),
                opacity: overlayX,
              }}
              className={styles.PlaybackControlsBlock}
            >
              <PlaybackControls onFullscreenToggle={openInFullscreen} />
            </animated.div>

            <animated.div
              style={{
                translateX: overlayX.to([0, 1], [100, 0]).to((x) => x + `%`),
                opacity: overlayX,
              }}
              className={styles.CloseButtonBlock}
              onClick={onBackClick}
            >
              <CrossIcon />
            </animated.div>
          </div>
        </div>
      </animated.div>
    </animated.div>
  );
};
