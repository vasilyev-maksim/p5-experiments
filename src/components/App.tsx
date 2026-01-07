import styles from "./App.module.css";
import { Header } from "./Header";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { SketchModal } from "./SketchModal";
import type { ISketch } from "../models";
import { useSequence } from "../sequencer";
import {
  HOME_PAGE_SEQUENCE,
  MODAL_OPEN_SEQUENCE,
  type Ctx,
  type MODAL_OPEN_SEGMENTS,
} from "../animations";
import { SketchTilesGrid } from "./SketchTilesGrid";
import { useURLParams } from "../hooks";
import { delay } from "../utils";
import { sketchList } from "../sketches";

function App() {
  const { clearUrlSketch, directLinkSketch, updateUrlSketch } =
    useURLParams(sketchList);
  const [openedSketch, setOpenedSketch] = useState<ISketch | undefined>();
  const selectedTileRef = useRef<HTMLDivElement>(null);
  const [cloneTop, setCloneTop] = useState<number>();
  const [cloneLeft, setCloneLeft] = useState<number>();
  const { start, reset, useSegment } = useSequence<MODAL_OPEN_SEGMENTS, Ctx>(
    MODAL_OPEN_SEQUENCE
  );
  useSequence(HOME_PAGE_SEQUENCE).useStart();

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
  }, [openedSketch]);

  useEffect(() => {
    if (directLinkSketch) {
      delay(0).then(() => {
        setOpenedSketch(directLinkSketch);
      });
    }
  }, [directLinkSketch]);

  useEffect(() => {
    if (openedSketch) {
      start(ctx);
    }
    return reset;
  }, [openedSketch, ctx]);

  const handleSketchClick = (x: ISketch) => {
    updateUrlSketch(x);
    setOpenedSketch(x);
  };
  const closeSketch = () => {
    clearUrlSketch();
    setOpenedSketch(undefined);
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
        <SketchTilesGrid
          onClick={handleSketchClick}
          openedSketch={openedSketch}
          sketches={sketchList}
          ref={selectedTileRef}
        />
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
