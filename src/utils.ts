import { useEffect, useRef, useState } from "react";
import type { IControl, IParams, ISketch } from "./models";
import { useSpring, easings, useSpringValue } from "react-spring";
import { sketchList } from "./data";

export function useURLParams() {
  const [openedSketchId, setOpenedSketchId] = useState<
    ISketch["id"] | undefined
  >(location.pathname.split("/").filter(Boolean).pop());
  const openedSketch = sketchList.find((x) => x.id === openedSketchId);

  const openSketch = (sketch: ISketch) => {
    setOpenedSketchId(sketch.id);
    history.pushState({}, "", "/" + sketch.id);
  };
  const closeSketch = () => {
    setOpenedSketchId(undefined);
    history.pushState({}, "", location.origin);
  };

  return {
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

export function extractDefaultParams<K extends string>(
  sketch: ISketch<K>
): IParams {
  return Object.fromEntries(
    Object.entries<IControl>(sketch.controls ?? {}).map(
      ([key, { defaultValue }]) => [key, defaultValue]
    )
  );
}

function serializeParams(params: IParams): string {
  return Object.entries(params)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((key, value) => key + "__" + value)
    .join("___");
}

export function areParamsEqual(a: IParams, b: IParams): boolean {
  return serializeParams(a) === serializeParams(b);
}

export function delay(delay: number) {
  return new Promise((r) => setTimeout(r, delay));
}

export function getClosestDiscreteValue(
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

export function checkExhaustiveness(x: never, message?: string): never {
  throw new Error(message ?? `Unreachable case reached: ${JSON.stringify(x)}`);
}

export class Event<in out Arg = void> {
  private callbacks: Array<(arg: Arg) => void> = [];

  public addCallback = (callback: (arg: Arg) => void): (() => void) => {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter((x) => x !== callback);
    };
  };

  public __invokeCallbacks = (arg: Arg): void => {
    this.callbacks.forEach((cb) => cb(arg));
  };
}

export class Deferred<T = void> {
  promise: Promise<T>;
  resolve!: (value: T | PromiseLike<T>) => void;
  reject!: (reason?: unknown) => void;

  constructor() {
    this.promise = new Promise<T>((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });
  }
}
