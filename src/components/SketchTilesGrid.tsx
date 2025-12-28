import { forwardRef } from "react";
import type { ISketch } from "../models";
import { SketchTile } from "./SketchTile";
import styles from "./SketchTilesGrid.module.css";
import { useSequence } from "../sequencer";
import {
  type GridAnimationParams,
  type HOME_PAGE_SEGMENTS,
  HOME_PAGE_SEQUENCE,
} from "../animations";

export const SketchTilesGrid = forwardRef<
  HTMLDivElement | null,
  {
    sketches: ISketch[];
    onClick: (sketch: ISketch) => void;
    openedSketch?: ISketch;
  }
>(function SketchTilesGrid(props, selectedTileRef) {
  const { useSegment } = useSequence<HOME_PAGE_SEGMENTS>(HOME_PAGE_SEQUENCE);

  const {
    wasRun,
    timingPayload: { itemDelay, itemDuration },
  } = useSegment<GridAnimationParams>("TILES");

  return wasRun ? (
    <div className={styles.Grid}>
      {props.sketches.map((x, i) => (
        <SketchTile
          key={x.id}
          sketch={x}
          invisible={props.openedSketch === x}
          ref={props.openedSketch === x ? selectedTileRef : null}
          onSelect={() => props.onClick(x)}
          animationDelay={itemDelay * i}
          animationDuration={itemDuration}
          interactive
        />
      ))}
    </div>
  ) : null;
});
