import { memo } from "react";
import classNames from "classnames";
import { PlayPauseButton } from "./PlayPauseButton";
import styles from "./PlaybackControls.module.css";
import { Slider } from "./Slider";
import { JumpNFramesButton } from "./JumpNFramesButton";
import { useActiveSketch } from "@/hooks/useActiveSketch";
import { DownloadIcon, FullScreenIcon } from "./Icons";
import { useAnalytics, useAnalyticsThrottled } from "@/hooks/useAnalytics";

export const PlaybackControls = memo(function PlaybackControls(props: {
  onFullscreenToggle: () => void;
}) {
  const {
    paused,
    timeDelta,
    playPause,
    jumpNFrames,
    playWithCustomDelta,
    stopPlayingWithCustomDelta,
    exportToFile,
    changeTimeDelta,
  } = useActiveSketch();

  const { sendAnalyticsEvent } = useAnalytics();
  const { sendThrottledAnalyticsEvent } = useAnalyticsThrottled();

  return (
    <div className={styles.PlaybackControls}>
      <div className={styles.Section}>
        <button
          className={styles.IconButton}
          onClick={props.onFullscreenToggle}
        >
          <FullScreenIcon />
        </button>
        <button
          className={styles.IconButton}
          onClick={() => {
            exportToFile();
            sendAnalyticsEvent("export");
          }}
        >
          <DownloadIcon />
        </button>
      </div>

      <div className={styles.Section}>
        <JumpNFramesButton
          className={styles.IconButton}
          n={-10}
          onClick={() => {
            jumpNFrames(-10);
            sendAnalyticsEvent("<< press");
          }}
          onLongPress={() => {
            playWithCustomDelta(-2);
            sendAnalyticsEvent("<< long press");
          }}
          onLongPressRelease={stopPlayingWithCustomDelta}
        />

        <JumpNFramesButton
          className={styles.IconButton}
          n={-1}
          onClick={() => {
            jumpNFrames(-1);
            sendAnalyticsEvent("< press");
          }}
          onLongPress={() => {
            playWithCustomDelta(-0.5);
            sendAnalyticsEvent("< long press");
          }}
          onLongPressRelease={stopPlayingWithCustomDelta}
        />

        <PlayPauseButton
          paused={paused}
          onClick={() => {
            playPause();
            sendAnalyticsEvent((paused ? "play" : "pause") + " press");
          }}
        />

        <JumpNFramesButton
          className={styles.IconButton}
          n={1}
          onClick={() => {
            jumpNFrames(1);
            sendAnalyticsEvent("> press");
          }}
          onLongPress={() => {
            playWithCustomDelta(0.5);
            sendAnalyticsEvent("> long press");
          }}
          onLongPressRelease={stopPlayingWithCustomDelta}
        />

        <JumpNFramesButton
          className={styles.IconButton}
          n={10}
          onClick={() => {
            jumpNFrames(10);
            sendAnalyticsEvent(">> press");
          }}
          onLongPress={() => {
            playWithCustomDelta(-2);
            sendAnalyticsEvent(">> long press");
          }}
          onLongPressRelease={stopPlayingWithCustomDelta}
        />
      </div>

      <div className={classNames(styles.Section, styles.SpeedSection)}>
        <Slider
          value={timeDelta}
          min={0}
          max={3}
          step={0.1}
          onChange={(delta) => {
            changeTimeDelta(delta);
            sendThrottledAnalyticsEvent("playback speed manually changed", {
              delta,
            });
          }}
          label={
            <div className={styles.PlaybackSpeedLabel}>
              &nbsp; Speed: x
              <span className={styles.PlaybackSpeedFactor}>
                {timeDelta.toFixed(1)}
              </span>
            </div>
          }
          active
          activationAnimationDuration={0}
        />
      </div>
    </div>
  );
});
