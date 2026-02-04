import { forwardRef } from "react";
import type { ISketch } from "../models";
import styles from "./SketchTile.module.css";
import classNames from "classnames";
import { useViewport } from "../hooks";
import { SketchCanvas } from "./SketchCanvas";

export const SketchTile = forwardRef<
  HTMLDivElement,
  {
    sketch: ISketch;
    animationDelay?: number;
    animationDuration?: number;
    onSelect?: () => void;
    interactive?: boolean;
    className?: string;
    invisible?: boolean;
  }
>(
  (
    {
      sketch,
      animationDelay = 0,
      onSelect,
      interactive = false,
      className,
      invisible = false,
      animationDuration = 0,
    },
    ref,
  ) => {
    const { tileWidth, tileHeight, borderWidth } = useViewport();
    const defaultPreset = sketch.presets[0];

    return (
      <div
        ref={ref}
        className={classNames(
          styles.SketchTile,
          {
            [styles.Interactive]: interactive,
            [styles.Copy]: !interactive,
            [styles.Hidden]: invisible,
          },
          className,
        )}
        onClick={onSelect}
        style={
          {
            animationDelay: animationDelay + "ms",
            animationDuration: animationDuration + "ms",
            width: tileWidth,
            height: tileHeight,
            "--borderWidth": borderWidth + "px",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any
        }
      >
        <SketchCanvas
          id="tile"
          sketch={sketch}
          playing={false}
          size="tile"
          params={defaultPreset.params}
          timeShift={defaultPreset.startTime ?? sketch.startTime}
        />
        <h2 className={styles.Title}>{sketch.name}</h2>
      </div>
    );
  },
);
