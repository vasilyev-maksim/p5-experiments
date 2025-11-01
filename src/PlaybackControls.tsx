import styles from "./PlaybackControls.module.css";

export function PlaybackControls(props: {
  onPlayPause: () => void;
  playing: boolean;
}) {
  return (
    <div className={styles.PlaybackControls}>
      <button onClick={props.onPlayPause}>
        {props.playing ? "pause" : "play"}
      </button>
    </div>
  );
}
