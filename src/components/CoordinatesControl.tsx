import { useEffect, useRef, useState } from "react";
import styles from "./CoordinatesControl.module.css";
import { animated, easings, useSpring } from "react-spring";
import { useGlobalDrag, useThrottleWithTrailing } from "@hooks";
import { clamp } from "@/core/utils";

const MAX_HANDLE_SIZE = 12;
const PLANE_SIZE = 70;
const PLANE_PADDING = MAX_HANDLE_SIZE / 2;
const PLANE_ACTIVE_SIZE = PLANE_SIZE - PLANE_PADDING * 2;
const ARROW_KEYS_CHANGE_DELTA = 0.01;

export const CoordinatesControl = (props: {
  label: string;
  value: [number, number];
  active: boolean;
  animationDuration: number;
  onChange: (val: [number, number]) => void;
  className?: string;
  disabled?: boolean;
}) => {
  const { initProgress } = useSpring({
    from: { initProgress: 0 },
    to: { initProgress: props.active ? 1 : 0 },
    config: {
      duration: props.animationDuration,
      easing: easings.easeInOutCubic,
    },
  });
  const planeRef = useRef<HTMLDivElement>(null);
  const handleSize = initProgress.to([0, 1], [0, MAX_HANDLE_SIZE]);
  const propsX = props.value[0];
  const propsY = props.value[1];
  const [x, setX] = useState<number>(propsX);
  const [y, setY] = useState<number>(propsX);

  useEffect(() => {
    setX(propsX);
  }, [propsX]);

  useEffect(() => {
    setY(propsY);
  }, [propsY]);

  const onChangeThrottled = useThrottleWithTrailing((x: number, y: number) => {
    props.onChange([x, y]);
  }, 200);

  // both react synthetic and native events can be passed as arg
  const changeValue = ({
    clientX,
    clientY,
  }: Pick<MouseEvent, "clientX" | "clientY">) => {
    if (planeRef.current) {
      const { x: parentX, y: parentY } =
        planeRef.current.getBoundingClientRect();

      const mouseX = clientX - (parentX + PLANE_PADDING);
      const mouseY = clientY - (parentY + PLANE_PADDING);
      const clampedX = clamp(mouseX, 0, PLANE_ACTIVE_SIZE);
      const clampedY = clamp(mouseY, 0, PLANE_ACTIVE_SIZE);
      const x = clampedX / PLANE_ACTIVE_SIZE;
      const y = clampedY / PLANE_ACTIVE_SIZE;

      setX(x);
      setY(y);
      onChangeThrottled(x, y);
    }
  };

  const { handleMouseDown } = useGlobalDrag(changeValue);
  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let newX = x;
    let newY = y;

    switch (e.key) {
      case "ArrowRight":
        newX = clamp(x + ARROW_KEYS_CHANGE_DELTA, 0, 1);
        setX(newX);
        e.preventDefault();
        break;
      case "ArrowLeft":
        newX = clamp(x - ARROW_KEYS_CHANGE_DELTA, 0, 1);
        setX(newX);
        e.preventDefault();
        break;
      case "ArrowUp":
        newY = clamp(y - ARROW_KEYS_CHANGE_DELTA, 0, 1);
        setY(newY);
        e.preventDefault();
        break;
      case "ArrowDown":
        newY = clamp(y + ARROW_KEYS_CHANGE_DELTA, 0, 1);
        setY(newY);
        e.preventDefault();
        break;
      default:
        break;
    }

    if (newX !== x || newY !== y) {
      console.log(111111);

      onChangeThrottled(newX, newY);
    }
  };

  return (
    <div className={props.className}>
      {props.label && (
        <div className={styles.Label}>
          {props.label}: {`[${x.toFixed(2)}, ${y.toFixed(2)}]`}
        </div>
      )}
      <div className={styles.Container}>
        <div
          tabIndex={2}
          className={styles.Plane}
          style={{
            width: PLANE_SIZE,
            height: PLANE_SIZE,
          }}
          ref={planeRef}
          onMouseDown={handleMouseDown}
          onKeyDown={handleKeyPress}
        >
          <animated.div
            className={styles.Handle}
            style={{
              left: x * PLANE_ACTIVE_SIZE + PLANE_PADDING,
              top: y * PLANE_ACTIVE_SIZE + PLANE_PADDING,
              height: handleSize,
              width: handleSize,
            }}
          />
        </div>
      </div>
    </div>
  );
};
