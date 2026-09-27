import { forwardRef, memo } from "react";
import type { ISketch } from "../models";
import { SketchTile } from "./SketchTile";
import styles from "./SketchTilesGrid.module.css";
import { useSequence } from "../sequencer";
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
      activeSketch?: ISketch;
      className?: string;
    }
  >(function SketchTilesGrid(props, selectedTileRef) {
    const { useSegment } = useSequence<HOME_PAGE_SEGMENTS>(HOME_PAGE_SEQUENCE);

    const {
      wasRun,
      timingPayload: { itemDelay, itemDuration },
      complete,
    } = useSegment<GridAnimationParams>("TILES");

    return (
      <div className={classNames(styles.Grid, props.className)}>
        {props.sketches.map((x, i, { length }) => (
          <SketchTile
            key={x.id}
            sketch={x}
            hidden={props.activeSketch === x}
            ref={props.activeSketch === x ? selectedTileRef : null}
            onSelect={() => props.onClick(x)}
            animated={wasRun}
            animationDelay={itemDelay * i}
            animationDuration={itemDuration}
            onAnimationComplete={i === length - 1 ? complete : undefined}
          />
        ))}
      </div>
    );
  }),
);
