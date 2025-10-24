import styles from "./PlaybackControls.module.css";

export function PlaybackControls(props: {
  onPlayPause: () => void;
  onFaster: () => void;
  onSlower: () => void;
  playing: boolean;
  timeDelta: number;
}) {
  return (
    <div className={styles.PlaybackControls}>
      <button onClick={props.onSlower}>slower</button>
      <button onClick={props.onPlayPause}>
        {props.playing ? "pause" : "play"}
      </button>
      <button onClick={props.onFaster}>faster</button>
    </div>
  );
}
