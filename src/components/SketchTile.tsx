import { forwardRef, useEffect } from "react";
import type { ISketch } from "../models";
import styles from "./SketchTile.module.css";
import classNames from "classnames";
import { useSizes } from "@/hooks/useSizes";
import { SketchCanvas } from "./SketchCanvas";
import { getDefaultPreset } from "@utils/sketch";

export const SketchTile = forwardRef<
  HTMLDivElement,
  {
    sketch: ISketch;
    animationDelay?: number;
    animationDuration?: number;
    onAnimationComplete?: () => void;
    onClick?: () => void;
    className?: string;
    hidden?: boolean;
    animated: boolean;
  }
>(
  (
    {
      sketch,
      animationDelay = 0,
      animationDuration = 0,
      onAnimationComplete,
      onClick,
      className,
      hidden = false,
      animated,
    },
    ref,
  ) => {
    const { tileWidth, tileHeight, borderWidth } = useSizes();
    const defaultPreset = getDefaultPreset(sketch);

    useEffect(() => {
      if (onAnimationComplete && animated) {
        const id = setTimeout(
          onAnimationComplete,
          animationDelay + animationDuration,
        );
        return () => clearTimeout(id);
      }
    }, [onAnimationComplete, animated]);

    return (
      <div
        ref={ref}
        className={classNames(
          styles.SketchTile,
          {
            [styles.Hidden]: hidden,
            [styles.Enter]: animated,
          },
          className,
        )}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.();
          }
        }}
        style={
          {
            animationDelay: animationDelay + "ms",
            animationDuration: animationDuration + "ms",
            width: tileWidth,
            height: tileHeight,
            "--borderWidth": borderWidth + "px",
          } as any
        }
      >
        <SketchCanvas
          id="tile"
          sketch={sketch}
          mode="static"
          paused={true}
          size="tile"
          initParams={defaultPreset.params}
          startTime={defaultPreset.startTime ?? sketch.startTime}
          randomSeed={defaultPreset.randomSeed ?? sketch.randomSeed}
        />
        <h2 className={styles.Title}>{sketch.name}</h2>
      </div>
    );
  },
);
