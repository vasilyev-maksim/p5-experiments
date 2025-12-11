import styles from "./App.module.css";
import { Header } from "./Header";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { SketchTile } from "./SketchTile";
import classNames from "classnames";
import { sketchList } from "./data";
import { SketchModal } from "./SketchModal";
import { useURLParams } from "./utils";
import type { ISketch } from "./models";
import { useSequence } from "./sequencer";
import {
  MODAL_OPEN_SEQUENCE,
  type Ctx,
  type MODAL_OPEN_SEGMENTS,
} from "./main";

function App() {
  const { openedSketch, openSketch, closeSketch } = useURLParams();
  const selectedTileRef = useRef<HTMLDivElement>(null);
  const [cloneTop, setCloneTop] = useState<number>();
  const [cloneLeft, setCloneLeft] = useState<number>();
  const { start, useSegment } = useSequence<MODAL_OPEN_SEGMENTS, Ctx>(
    MODAL_OPEN_SEQUENCE
  );

  const seg = useSegment("GRID_GOES_IN_BG");

  const ctx = useMemo(
    () => ({
      controlsPresent: Object.entries(openedSketch?.controls ?? {}).length > 0,
      presetsPresent: (openedSketch?.presets?.length ?? 0) > 0,
    }),
    [openedSketch?.controls, openedSketch?.presets]
  );

  useLayoutEffect(() => {
    if (selectedTileRef.current) {
      const { top, left } = selectedTileRef.current.getBoundingClientRect();
      setCloneLeft(left);
      setCloneTop(top);
    }

    if (openedSketch) {
      start(ctx);
    }
  }, [openedSketch, ctx]);

  const handleSketchClick = (x: ISketch) => {
    openSketch(x);
  };

  return (
    <>
      <div
        className={classNames(styles.Container, {
          [styles.InBackground]: !!openedSketch,
        })}
        style={{
          transitionDuration: seg.duration + "ms",
          transitionDelay: seg.delay + "ms",
        }}
      >
        <Header />
        <div className={styles.GridWrapper}>
          <div className={styles.Grid}>
            {sketchList.map((x, i) => (
              <SketchTile
                invisible={openedSketch === x}
                ref={openedSketch === x ? selectedTileRef : undefined}
                onSelect={() => handleSketchClick(x)}
                key={x.id}
                sketch={x}
                animationDelay={700 + 125 * i}
                interactive
              />
            ))}
          </div>
        </div>
      </div>
      {openedSketch && (
        <SketchModal
          top={cloneTop}
          left={cloneLeft}
          sketch={openedSketch}
          onBackClick={closeSketch}
        />
      )}
    </>
  );
}

export default App;
