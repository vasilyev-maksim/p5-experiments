import styles from "./SketchModalFooter.module.css";
import { PlayPauseButton } from "./PlayPauseButton";

export function SketchModalFooter(props: {
  onPlayPause: () => void;
  playing: boolean;
  onBackClick: () => void;
}) {
  return (
    <div className={styles.SketchModalFooter}>
      <button className={styles.BackButton} onClick={props.onBackClick}>
        ⬅ &nbsp; back
      </button>
      <PlayPauseButton playing={props.playing} onClick={props.onPlayPause} />
    </div>
  );
}
