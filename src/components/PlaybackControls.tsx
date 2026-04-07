import classNames from "classnames";
import { PlayPauseButton } from "./PlayPauseButton";
import styles from "./PlaybackControls.module.css";
import { Slider } from "./Slider";
import { JumpNFramesButton } from "./JumpNFramesButton";

export function PlaybackControls(props: {
  paused: boolean;
  timeDelta: number;
  onTimeDeltaChange: (val: number) => void;
  onPlayPause: () => void;
  onFullscreenToggle: () => void;
  onJumpNFrames: (N: number) => () => void;
  onPlayWithCustomDelta: (delta: number) => () => void;
  onStopPlayingWithCustomDelta: () => void;
  onExport: () => void;
}) {
  return (
    <div className={styles.PlaybackControls}>
      <div className={styles.Section}>
        <button
          className={classNames(styles.Fullscreen, styles.IconButton)}
          onClick={props.onFullscreenToggle}
        >
          <strong>⛶</strong>
        </button>
        <button className={styles.TextButton} onClick={props.onExport}>
          Capture
        </button>
      </div>
      <div className={styles.Section}>
        <JumpNFramesButton
          className={styles.IconButton}
          n={-10}
          onClick={props.onJumpNFrames(-10)}
          onLongPress={props.onPlayWithCustomDelta(-2)}
          onLongPressRelease={props.onStopPlayingWithCustomDelta}
        />
        <JumpNFramesButton
          className={styles.IconButton}
          n={-1}
          onClick={props.onJumpNFrames(-1)}
          onLongPress={props.onPlayWithCustomDelta(-0.5)}
          onLongPressRelease={props.onStopPlayingWithCustomDelta}
        />
        <PlayPauseButton paused={props.paused} onClick={props.onPlayPause} />
        <JumpNFramesButton
          className={styles.IconButton}
          n={1}
          onClick={props.onJumpNFrames(1)}
          onLongPress={props.onPlayWithCustomDelta(0.5)}
          onLongPressRelease={props.onStopPlayingWithCustomDelta}
        />
        <JumpNFramesButton
          className={styles.IconButton}
          n={10}
          onClick={props.onJumpNFrames(10)}
          onLongPress={props.onPlayWithCustomDelta(2)}
          onLongPressRelease={props.onStopPlayingWithCustomDelta}
        />
      </div>
      <div className={styles.Section}>
        <Slider
          value={props.timeDelta}
          min={0}
          max={3}
          step={0.1}
          onChange={props.onTimeDeltaChange}
          label={
            <>
              Playback speed: x
              <span className={styles.SpeedValue}>
                {props.timeDelta.toFixed(1)}
              </span>
            </>
          }
          active
          activationAnimationDuration={0}
        />
      </div>
    </div>
  );
}
