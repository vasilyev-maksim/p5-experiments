import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSpring, easings, useSpringValue } from "react-spring";
import { ViewportContext } from "./components/ViewportContext";
import type { ISketch } from "./models";
import { getClosestDiscreteValue } from "./utils/misc";

// TODO: move consts from here / use react context for that
export function useViewport() {
  const ctx = useContext(ViewportContext);
  const tileWidth = 292;
  const tileHeight = 335;
  const tilePadding = 15;
  const modalMargin = 10;
  const modalPadding = 15;
  const modalSidebarWidth = 300;
  const modalSidebarPadding = 27;
  const borderWidth = 4;
  const canvasModalWidth =
    ctx.viewportWidth -
    modalSidebarWidth -
    2 * (modalPadding + modalMargin) -
    borderWidth;
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
    borderWidth,
  };
}

export function useURLParams(sketchList: ISketch[]) {
  const baseUrl = import.meta.env.BASE_URL;
  const qs = new URLSearchParams(location.search);
  const directLinkSketchId = qs.get("sid");
  const [directLinkSketch, setDirectLinkSketch] = useState<ISketch | undefined>(
    sketchList.find((x) => x.id === directLinkSketchId),
  );

  const updateUrlSketch = (sketch: ISketch) => {
    history.pushState({}, "", `${baseUrl}?sid=${sketch.id}`);
  };

  const clearUrlSketch = () => {
    setDirectLinkSketch(undefined);
    history.pushState({}, "", location.origin + import.meta.env.BASE_URL);
  };

  return {
    directLinkSketch,
    updateUrlSketch,
    clearUrlSketch,
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
  onFullscreenToggle: () => void,
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "p" || e.key === "P") onPlayPause();
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
    (v) => Math.min(1, Math.max(0, (v - min) / (max - min))) * 100,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useThrottleWithTrailing<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): T {
  const callbackRef = useRef(callback);
  const lastCallRef = useRef(0);
  const pendingArgsRef = useRef<Parameters<T> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useMemo(() => {
    return ((...args: Parameters<T>) => {
      const now = Date.now();

      // Clear any pending trailing call
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (now - lastCallRef.current >= delay) {
        // Immediate call
        lastCallRef.current = now;
        callbackRef.current(...args);
        pendingArgsRef.current = null;
      } else {
        // Schedule trailing call
        pendingArgsRef.current = args;
        timeoutRef.current = setTimeout(
          () => {
            lastCallRef.current = Date.now();
            if (pendingArgsRef.current) {
              callbackRef.current(...pendingArgsRef.current);
            }
            pendingArgsRef.current = null;
          },
          delay - (now - lastCallRef.current),
        );
      }
    }) as T;
  }, [delay]);
}

export function useLongPress(
  timeout: number,
  onLongPress: () => void,
  onLongPressRelease?: () => void,
) {
  const pressedRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);

  const handlePress = () => {
    pressedRef.current = true;
    timeoutRef.current = setTimeout(() => {
      if (pressedRef.current) {
        onLongPress();
      }
    }, timeout);
  };
  const handleRelease = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    if (pressedRef.current) {
      onLongPressRelease?.();
    }
    pressedRef.current = false;
  };

  return { handlePress, handleRelease };
}

export function useGlobalDrag(
  onMouseDown: (e: Pick<MouseEvent, "clientX" | "clientY">) => void,
) {
  const handleMouseDown = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    document.body.style.userSelect = "none";
    onMouseDown(e);

    const removeHandlers = () => {
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMouseDown);
      window.removeEventListener("mouseup", removeHandlers);
    };

    window.addEventListener("mousemove", onMouseDown);
    window.addEventListener("mouseup", removeHandlers);
  };

  return { handleMouseDown };
}
