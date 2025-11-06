import styles from "./PlaybackControls.module.css";
import { PlayPauseButton } from "./PlayPauseButton";

export function PlaybackControls(props: {
  onPlayPause: () => void;
  playing: boolean;
}) {
  return (
    <div className={styles.PlaybackControls}>
      <PlayPauseButton playing={props.playing} onClick={props.onPlayPause} />
    </div>
  );
}
