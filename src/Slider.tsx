import { type ReactNode } from "react";
import styles from "./Slider.module.css";
import { animated, easings, to, useSpring } from "react-spring";
import { useSliderBehavior } from "./utils";

const TRACK_HEIGHT = [2, 2];
const TRACK_WRAPPER_HEIGHT = 15;
const HANDLE_HEIGHT = [TRACK_HEIGHT[0], 12] as const;
const HANDLE_WIDTH = [2, HANDLE_HEIGHT[1]] as const; // [min, max]

export function Slider(props: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  label: ReactNode;
  initDelay?: number;
}) {
  const { initX } = useSpring({
    from: { initX: 0 },
    to: { initX: 1 },
    config: { duration: 400, easing: easings.easeInOutCubic },
    delay: props.initDelay ?? 0,
  });
  const {
    trackRef,
    handleMouseDown,
    handleMouseEnter,
    handleMouseLeave,
    handleKeyPress,
    handleMove,
    activeX,
    handleLeft,
  } = useSliderBehavior(
    props.value,
    props.min,
    props.max,
    props.step,
    props.onChange
  );

  const handleWidth = activeX.to([0, 1], HANDLE_WIDTH);
  const handleHeight = initX.to([0, 1], HANDLE_HEIGHT);

  const handleTop = handleHeight.to((h) => `calc(50% - ${h / 2}px)`);
  const trackHeight = activeX.to([0, 1], TRACK_HEIGHT);
  const trackTop = trackHeight.to((t) => `calc(50% - ${t / 2}px)`);
  const rangeWidth = handleLeft;

  return (
    <div className={styles.Slider}>
      <div className={styles.Title}>{props.label}</div>
      <div
        tabIndex={2}
        className={styles.TrackWrapper}
        ref={trackRef}
        onClick={(e) => handleMove(e.clientX)}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyPress}
        style={{
          height: TRACK_WRAPPER_HEIGHT,
        }}
      >
        <animated.div
          className={styles.Track}
          style={{
            height: trackHeight,
            top: trackTop,
          }}
        />
        <animated.div
          className={styles.Range}
          style={{
            width: rangeWidth.to((x) => x + "%"),
            height: trackHeight,
            top: trackTop,
          }}
        />
        <animated.div
          className={styles.Handle}
          style={{
            left: to(
              [handleWidth, handleLeft],
              (w, x) => `calc(${x}% - ${w / 2}px)`
            ),
            width: handleWidth,
            height: handleHeight,
            top: handleTop,
            // rotate: x.to([0, 1], [0, 45]).to((a) => `${a}deg`),
          }}
        />
      </div>
    </div>
  );
}
