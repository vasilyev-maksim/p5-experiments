import styles from "./SketchModalFooter.module.css";
import { PlayPauseButton } from "./PlayPauseButton";
import { useViewport } from "../hooks";
import { type MODAL_OPEN_SEGMENTS, MODAL_OPEN_SEQUENCE } from "../main";
import { useSequence } from "../sequencer";

export function SketchModalFooter(props: {
  onPlayPause: () => void;
  playing: boolean;
  onBackClick: () => void;
  onFullscreenToggle: () => void;
}) {
  const { modalPadding } = useViewport();
  const segment =
    useSequence<MODAL_OPEN_SEGMENTS>(MODAL_OPEN_SEQUENCE).useSegment(
      "SHOW_FOOTER"
    );

  return (
    segment.wasRun && (
      <div
        className={styles.SketchModalFooter}
        style={{
          paddingLeft: modalPadding - 4,
          paddingRight: 6,
          animationDelay: segment.delay + "ms",
          animationDuration: segment.duration + "ms",
        }}
      >
        <button className={styles.BackButton} onClick={props.onBackClick}>
          ⬅ &nbsp; back
        </button>
        <div style={{ flex: 1 }} />
        <button
          className={styles.FullscreenButton}
          onClick={props.onFullscreenToggle}
        >
          <strong>⛶</strong>
        </button>
        <PlayPauseButton playing={props.playing} onClick={props.onPlayPause} />
      </div>
    )
  );
}
