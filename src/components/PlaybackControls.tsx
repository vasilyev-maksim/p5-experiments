import { memo } from "react";
import classNames from "classnames";
import { PlayPauseButton } from "./PlayPauseButton";
import styles from "./PlaybackControls.module.css";
import { Slider } from "./Slider";
import { JumpNFramesButton } from "./JumpNFramesButton";
import { useActiveSketch } from "@hooks";
import { FullScreenIcon } from "./Icons";

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

  return (
    <div className={styles.PlaybackControls}>
      <div className={styles.Section}>
        <button
          className={classNames(styles.IconButton)}
          onClick={props.onFullscreenToggle}
        >
          <FullScreenIcon />
        </button>
        <button className={styles.TextButton} onClick={exportToFile}>
          Capture
        </button>
      </div>
      <div className={styles.Section}>
        <JumpNFramesButton
          className={styles.IconButton}
          n={-10}
          onClick={jumpNFrames(-10)}
          onLongPress={playWithCustomDelta(-2)}
          onLongPressRelease={stopPlayingWithCustomDelta}
        />
        <JumpNFramesButton
          className={styles.IconButton}
          n={-1}
          onClick={jumpNFrames(-1)}
          onLongPress={playWithCustomDelta(-0.5)}
          onLongPressRelease={stopPlayingWithCustomDelta}
        />
        <PlayPauseButton paused={paused} onClick={playPause} />
        <JumpNFramesButton
          className={styles.IconButton}
          n={1}
          onClick={jumpNFrames(1)}
          onLongPress={playWithCustomDelta(0.5)}
          onLongPressRelease={stopPlayingWithCustomDelta}
        />
        <JumpNFramesButton
          className={styles.IconButton}
          n={10}
          onClick={jumpNFrames(10)}
          onLongPress={playWithCustomDelta(2)}
          onLongPressRelease={stopPlayingWithCustomDelta}
        />
      </div>
      <div className={styles.Section}>
        <Slider
          value={timeDelta}
          min={0}
          max={3}
          step={0.1}
          onChange={changeTimeDelta}
          label={
            <div className={styles.PlaybackSpeedLabel}>
              Playback speed: x
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
