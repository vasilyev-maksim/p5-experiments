import { forwardRef } from "react";
import type { ISketch } from "./models";
import styles from "./SketchTile.module.css";
import classNames from "classnames";
import { useViewport } from "./hooks";
import { SketchCanvas } from "./SketchCanvas";
import { extractDefaultParamsMap } from "./utils";

export const SketchTile = forwardRef<
  HTMLDivElement,
  {
    sketch: ISketch;
    animationDelay?: number;
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
    },
    ref
  ) => {
    const { tileWidth, tileHeight } = useViewport();
    const params = extractDefaultParamsMap(sketch);

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
          className
        )}
        onClick={onSelect}
        style={{
          animationDelay: animationDelay + "ms",
          width: tileWidth,
          height: tileHeight,
        }}
      >
        <SketchCanvas
          sketch={sketch}
          playing={false}
          size="tile"
          params={params}
        />
        <h2 className={styles.Title}>{sketch.name}</h2>
      </div>
    );
  }
);
