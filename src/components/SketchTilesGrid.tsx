import { forwardRef, memo, useRef } from "react";
import type { ISketch } from "../models";
import { SketchTile } from "./SketchTile";
import styles from "./SketchTilesGrid.module.css";
import { useSegment } from "../sequencer";
import {
  type GridAnimationParams,
  type HOME_PAGE_SEGMENTS,
  HOME_PAGE_SEQUENCE,
} from "../animations";
import classNames from "classnames";

export const SketchTilesGrid = memo(
  forwardRef<
    HTMLDivElement | null,
    {
      sketches: ISketch[];
      onClick: (sketch: ISketch) => void;
      onRendered?: () => void;
      activeSketch?: ISketch;
      className?: string;
    }
  >(function SketchTilesGrid(props, selectedTileRef) {
    const {
      wasRun,
      timingPayload: { itemDelay, itemDuration },
      complete,
    } = useSegment<HOME_PAGE_SEGMENTS, GridAnimationParams>(
      HOME_PAGE_SEQUENCE,
      "TILES",
    );

    const renderedCountRef = useRef(0);
    const handleFirstFrameDrawn = () => {
      renderedCountRef.current++;
      if (renderedCountRef.current === props.sketches.length) {
        props.onRendered?.();
      }
    };

    return (
      <div className={classNames(styles.Grid, props.className)}>
        {props.sketches.map((x, i, { length }) => (
          <SketchTile
            key={x.id}
            sketch={x}
            hidden={props.activeSketch === x}
            ref={props.activeSketch === x ? selectedTileRef : null}
            onClick={() => props.onClick(x)}
            animated={wasRun}
            animationDelay={itemDelay * i}
            animationDuration={itemDuration}
            onAnimationComplete={i === length - 1 ? complete : undefined}
            onFirstFrameDrawn={handleFirstFrameDrawn}
          />
        ))}
      </div>
    );
  }),
);
