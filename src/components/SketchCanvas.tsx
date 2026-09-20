import { useMemo, useEffect, useRef } from "react";
import type {
  ISketch,
  IParams,
  SketchCanvasSize,
  ISketchInitData,
  SketchMode,
} from "../models";
import styles from "./SketchCanvas.module.css";
import { useSizes } from "@/hooks/useSizes";
import { animated, easings, to, useSpring } from "@react-spring/web";
import { MODAL_OPEN_SEQUENCE, type MODAL_OPEN_SEGMENTS } from "../animations";
import { useSequence } from "../sequencer";
import type { EventBus } from "@/core/EventBus";
import type { SketchEvent } from "@/core/events";
import p5 from "p5";
import { Event } from "@/utils/Event";
import type { CanvasSizeChangeEvent } from "@/core/events";

export const SketchCanvas = (props: {
  sketch: ISketch;
  size: SketchCanvasSize;
  paused: boolean;
  mode: SketchMode;
  initParams: IParams;
  timeDelta?: ISketchInitData["timeDelta"];
  startTime?: ISketchInitData["startTime"];
  randomSeed?: ISketchInitData["randomSeed"];
  eventBus?: EventBus<SketchEvent>;
  id: string;
  onFullScreenExit?: () => void;
}) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5>(null);
  const prevSizeRef = useRef<SketchCanvasSize>(null);
  const canvasSizeChangeEventRef = useRef<CanvasSizeChangeEvent>(new Event());

  const {
    canvasModalWidth,
    canvasModalHeight,
    canvasTileSize,
    viewportWidth,
    viewportHeight,
  } = useSizes();
  const previewSizeInPercents = props.sketch.preview.sizeInPercents / 100;
  const previewSize = canvasModalWidth * previewSizeInPercents;

  const canvasWidth =
    props.size === "fullscreen" ? viewportWidth : canvasModalWidth;
  const canvasHeight =
    props.size === "fullscreen" ? viewportHeight : canvasModalHeight;

  const p5Sketch = useMemo(() => {
    return props.sketch.factory({
      initData: {
        params: props.initParams,
        paused: props.paused,
        mode: props.mode,
        startTime: props.startTime ?? 0,
        timeDelta: props.timeDelta ?? 0,
        canvasWidth,
        canvasHeight,
        randomSeed: props.randomSeed,
      },
      id: `${props.sketch.id}_${props.id}`,
      eventBus: props.eventBus,
      canvasSizeChangeEvent: canvasSizeChangeEventRef.current,
    });
  }, []);

  const { duration } =
    useSequence<MODAL_OPEN_SEGMENTS>(MODAL_OPEN_SEQUENCE).useSegment(
      "TILE_GOES_MODAL",
    );
  const [{ x }, api] = useSpring(() => ({
    from: { x: 0 },
    config: { duration, easing: easings.easeInOutCubic },
  }));

  useEffect(() => {
    if (canvasContainerRef.current && !p5InstanceRef.current) {
      p5InstanceRef.current = new p5(p5Sketch, canvasContainerRef.current);
    }
    return () => {
      props.eventBus?.removeAllListeners();
      p5InstanceRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    canvasSizeChangeEventRef.current.dispatch({
      type: "canvasSizeChange",
      canvasWidth,
      canvasHeight,
    });
  }, [canvasWidth, canvasHeight]);

  useEffect(() => {
    const prev = prevSizeRef.current;
    const curr = props.size;
    prevSizeRef.current = curr;

    if (curr === "modal") {
      if (prev === "fullscreen") {
        api.set({ x: 1 });
      } else if (prev === "tile") {
        api.start({ x: 1 });
      }
    } else if (curr === "tile") {
      api.set({ x: 0 });
    } else if (curr === "fullscreen" && canvasContainerRef.current) {
      function exitHandler() {
        if (!document.fullscreenElement) {
          props.onFullScreenExit?.();
          document.removeEventListener("fullscreenchange", exitHandler);
        }
      }

      canvasContainerRef.current.requestFullscreen?.();
      document.addEventListener("fullscreenchange", exitHandler, false);
    }
  }, [props.size]);

  const scale = x.to([0, 1], [canvasTileSize / previewSize, 1]);
  const translateX = x.to(
    [0, 1],
    [-(canvasModalWidth - canvasTileSize) / 2, 0],
  );
  const translateY = x.to(
    [0, 1],
    [-(canvasModalHeight - canvasTileSize) / 2, 0],
  );
  const width = x.to([0, 1], [canvasTileSize, canvasModalWidth]);
  const height = x.to([0, 1], [canvasTileSize, canvasModalHeight]);

  return (
    <animated.div
      className={styles.Wrapper}
      style={{
        width,
        height,
      }}
    >
      <animated.div
        className={styles.CanvasWrapper}
        style={{
          transformOrigin: "center",
          transform: to(
            [scale, translateX, translateY],
            (s, tx, ty) => `translate(${tx}px, ${ty}px) scale(${s})`,
          ),
          width: canvasModalWidth,
          height: canvasModalHeight,
        }}
      >
        <div ref={canvasContainerRef} />
      </animated.div>
    </animated.div>
  );
};
