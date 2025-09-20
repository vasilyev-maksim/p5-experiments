import { forwardRef } from "react";
import type { ISketch } from "./models";
import styles from "./SketchTile.module.css";
import classNames from "classnames";

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
    const imgSrc = `./${sketch.id}.png`;
    // const imgSrc = `./${sketch.id}_full.png`;
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
        }}
      >
        <img src={imgSrc} alt={sketch.name} />
        <h2>{sketch.name}</h2>
      </div>
    );
  }
);
