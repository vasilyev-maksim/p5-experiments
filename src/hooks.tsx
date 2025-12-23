import { useContext, useEffect, useRef, useState } from "react";
import { useSpring, easings, useSpringValue } from "react-spring";
import { ViewportContext } from "./components/ViewportContext";
import type { ISketch } from "./models";
import { getClosestDiscreteValue } from "./utils";

export function useViewport() {
  const ctx = useContext(ViewportContext);
  const tileWidth = 292;
  const tileHeight = 335;
  const tilePadding = 15;
  const modalMargin = 15;
  const modalPadding = 20;
  const modalSidebarWidth = 300;
  const modalSidebarPadding = 27;
  const canvasModalWidth =
    ctx.viewportWidth - modalSidebarWidth - 2 * (modalPadding + modalMargin);
  const canvasModalHeight =
    ctx.viewportHeight - 2 * (modalPadding + modalMargin);
  const canvasTileSize = tileWidth - tilePadding * 2;

  return {
    ...ctx,
    tileWidth,
    tileHeight,
    tilePadding,
    modalMargin,
    modalPadding,
    modalSidebarWidth,
    modalSidebarPadding,
    canvasModalWidth,
    canvasModalHeight,
    canvasTileSize,
  };
}

export function useURLParams(sketchList: ISketch[]) {
  const baseUrl = import.meta.env.BASE_URL;
  const directLinkSketchId = location.pathname
    .split(baseUrl)
    .filter(Boolean)
    .pop();
  const [isDirectSketchLink, setIsDirectSketchLink] = useState(
    sketchList.some((x) => x.id === directLinkSketchId)
  );
  const [openedSketchId, setOpenedSketchId] = useState<
    ISketch["id"] | undefined
  >(directLinkSketchId);
  const openedSketch = sketchList.find((x) => x.id === openedSketchId);

  const openSketch = (sketch: ISketch) => {
    setOpenedSketchId(sketch.id);
    history.pushState({}, "", baseUrl + sketch.id);
  };
  const closeSketch = () => {
    setIsDirectSketchLink(false);
    setOpenedSketchId(undefined);
    history.pushState({}, "", location.origin + import.meta.env.BASE_URL);
  };

  return {
    isDirectSketchLink,
    openedSketchId,
    openedSketch,
    openSketch,
    closeSketch,
  };
}

export function useModalBehavior(isOpen: boolean, closeModal: () => void) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeModal();
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, closeModal]);
}

export function useKeyboardShortcuts(
  onPlayPause: () => void,
  onFullscreenToggle: () => void
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "p" || e.key === "P" || e.key === " ") onPlayPause();
      if (e.key === "f" || e.key === "F") onFullscreenToggle();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPlayPause, onFullscreenToggle]);
}

export function useSliderBehavior(
  value: number,
  min: number,
  max: number,
  step: number,
  onChange: (val: number) => void
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
  const handleLeft = animatedValue.to((v) => ((v - min) / (max - min)) * 100);

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
        value
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
