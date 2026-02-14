import { useEffect, useRef, useState } from "react";
import styles from "./CoordinatesControl.module.css";
import { animated, easings, useSpring } from "react-spring";
import { useGlobalDrag, useThrottleWithTrailing } from "@/hooks";

const MAX_HANDLE_SIZE = 12;
const PLANE_SIZE = 70;
const PLANE_PADDING = MAX_HANDLE_SIZE / 2;
const PLANE_ACTIVE_SIZE = PLANE_SIZE - PLANE_PADDING * 2;

export const CoordinatesControl = (props: {
  label: string;
  value: [number, number];
  active: boolean;
  animationDuration: number;
  onChange: (val: [number, number]) => void;
  className?: string;
}) => {
  const { initProgress } = useSpring({
    from: { initProgress: 0 },
    to: { initProgress: props.active ? 1 : 0 },
    config: {
      duration: props.animationDuration,
      easing: easings.easeInOutCubic,
    },
  });
  const handleSize = initProgress.to([0, 1], [0, MAX_HANDLE_SIZE]);
  const propsX = props.value[0];
  const propsY = props.value[1];
  const [x, setX] = useState<number>(propsX);
  const [y, setY] = useState<number>(propsX);
  const planeRef = useRef<HTMLDivElement>(null);

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
      const clampedX = Math.max(Math.min(mouseX, PLANE_ACTIVE_SIZE), 0);
      const clampedY = Math.max(Math.min(mouseY, PLANE_ACTIVE_SIZE), 0);
      const x = clampedX / PLANE_ACTIVE_SIZE;
      const y = clampedY / PLANE_ACTIVE_SIZE;

      setX(x);
      setY(y);
      onChangeThrottled(x, y);
    }
  };

  const { handleMouseDown } = useGlobalDrag(changeValue);

  return (
    <div className={props.className}>
      {props.label && (
        <div className={styles.Label}>
          {props.label}: {`[${x.toFixed(2)}, ${y.toFixed(2)}]`}
        </div>
      )}
      <div className={styles.Container}>
        <div
          className={styles.Plane}
          style={{
            width: PLANE_SIZE,
            height: PLANE_SIZE,
          }}
          ref={planeRef}
          onMouseDown={handleMouseDown}
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
