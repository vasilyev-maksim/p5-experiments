import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./CustomSlider.module.css";
import { animated, easings, to, useSpring, useSpringValue } from "react-spring";

const TRACK_HEIGHT = [2, 2];
const TRACK_WRAPPER_HEIGHT = 15;
const HANDLE_HEIGHT = [TRACK_HEIGHT[0], 12] as const;
const HANDLE_WIDTH = [2, HANDLE_HEIGHT[1]] as const; // [min, max]

function getClosestDiscreteValue(
  min: number,
  max: number,
  step: number,
  value: number
): number {
  if (value >= max) {
    return max;
  } else if (value <= min) {
    return min;
  } else {
    let tmp = (value - min) / step;
    const remainder = tmp % 1;
    tmp = Math.floor(tmp);
    return min + (remainder < 0.5 ? tmp : tmp + 1) * step;
  }
}

export function CustomSlider(props: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  label: ReactNode;
  initDelay?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const { activeX } = useSpring({
    from: { activeX: 0 },
    to: { activeX: hovered || dragging ? 1 : 0 },
    config: { duration: 150, easing: easings.easeInOutCubic },
  });
  const { initX } = useSpring({
    from: { initX: 0 },
    to: { initX: 1 },
    config: { duration: 300, easing: easings.easeInOutCubic },
    delay: props.initDelay ?? 0,
  });

  const animatedValue = useSpringValue(props.value, {
    config: { duration: 150 },
  });

  useEffect(() => {
    animatedValue.start(props.value);
  }, [props.value]);

  const handleMove = (clientX: number) => {
    if (trackRef.current) {
      const { left, width } = trackRef.current.getBoundingClientRect();

      const value =
        ((props.max - props.min) * (clientX - left)) / width + props.min;
      const closestDiscreteValue = getClosestDiscreteValue(
        props.min,
        props.max,
        props.step,
        value
      );
      props.onChange(closestDiscreteValue);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    document.body.style.userSelect = "none";

    handleMove(e.clientX);
    setDragging(true);

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleMouseUp = () => {
      setDragging(false);
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let newVal = props.value;

    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      newVal = Math.min(props.value + props.step, props.max);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      newVal = Math.max(props.value - props.step, props.min);
    }

    props.onChange(newVal);
  };

  const handleWidth = activeX.to([0, 1], HANDLE_WIDTH);
  const handleHeight = initX.to([0, 1], HANDLE_HEIGHT);
  const handleLeft = animatedValue.to(
    (v) => ((v - props.min) / (props.max - props.min)) * 100
  );
  const handleTop = handleHeight.to((h) => `calc(50% - ${h / 2}px)`);
  const trackHeight = activeX.to([0, 1], TRACK_HEIGHT);
  const trackTop = trackHeight.to((t) => `calc(50% - ${t / 2}px)`);
  const rangeWidth = handleLeft;

  return (
    <div className={styles.CustomSlider}>
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
