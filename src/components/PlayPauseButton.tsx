import { animated, easings, useSpring } from "react-spring";
import styles from "./PlayPauseButton.module.css";

const LEFT_OFFSET = 15;
const WIDTH = 40;

export function PlayPauseButton(props: {
  playing: boolean;
  onClick: () => void;
}) {
  const { x } = useSpring({
    from: { x: props.playing ? 1 : 0 },
    to: { x: props.playing ? 0 : 1 },
    config: { duration: 300, easing: easings.easeInOutCubic },
  });

  return (
    <button
      className={styles.PlayPauseButton}
      onKeyDown={(e) => e.preventDefault()}
      onClick={props.onClick}
    >
      <div className={styles.Inner}>
        <animated.div
          className={styles.Layer}
          style={{
            clipPath: x.to(
              (a) =>
                `polygon(
                    ${LEFT_OFFSET * a}% 0,
                    ${WIDTH + (100 - WIDTH) * a}% ${50 * a}%,
                    ${WIDTH + (100 - WIDTH) * a}% ${100 - 50 * a}%,
                    ${LEFT_OFFSET * a}% 100%
                  )`
            ),
          }}
        />
        <animated.div
          className={styles.Layer}
          style={{
            opacity: x.to([0, 1], [1, 0]),
            clipPath: x.to(
              (a) =>
                `polygon(
                    ${100 - WIDTH * (1 - a)}% ${100 * a}%,
                    100% ${100 * a}%,
                    100% 100%,
                    ${100 - WIDTH * (1 - a)}% 100%
                  )`
            ),
          }}
        />
      </div>
    </button>
  );
}
