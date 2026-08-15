import { useEffect, useRef, useState } from "react";
import { useSpring, easings, useSpringValue } from "@react-spring/web";
import { getClosestDiscreteValue } from "@utils/misc";
import { clamp } from "@/core/utils";

export function useSliderBehavior(
  value: number,
  min: number,
  max: number,
  step: number,
  onChange: (val: number) => void,
) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { activeX } = useSpring({
    from: { activeX: 0 },
    to: { activeX: hovered || dragging ? 1 : 0 },
    config: { duration: 150, easing: easings.easeInOutCubic },
  });
  const animatedValue = useSpringValue(value, {
    config: { duration: 150 },
  });
  const handleLeft = animatedValue.to(
    (v) => clamp((v - min) / (max - min), 0, 1) * 100,
  );

  useEffect(() => {
    animatedValue.start(value);
  }, [value]);

  const handleMove = (clientX: number) => {
    if (trackRef.current) {
      const { left, width } = trackRef.current.getBoundingClientRect();

      const value = ((max - min) * (clientX - left)) / width + min;
      const closestDiscreteValue = getClosestDiscreteValue(
        min,
        max,
        step,
        value,
      );
      onChange(closestDiscreteValue);
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
    let newVal = value;

    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      newVal = Math.min(value + step, max);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      newVal = Math.max(value - step, min);
    }

    onChange(newVal);
  };

  return {
    trackRef,
    dragging,
    handleMouseDown,
    handleMouseEnter,
    handleMouseLeave,
    handleKeyPress,
    handleMove,
    handleLeft,
    activeX,
  };
}
