import styles from "./App.module.css";
import { Header } from "./Header";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { usePopStateSync } from "@hooks/url";
import { sketchList } from "../sketches/list";
import {
  getActiveSketchFromUrl,
  removeSketchDataFromUrl,
  setSketchToUrl,
} from "@/utils/url";
import { useRerender } from "@hooks";
import { ActiveSketchProvider } from "@/contexts/ActiveSketchProvider";

function App() {
  const rerender = useRerender();
  const activeSketch = getActiveSketchFromUrl(sketchList);
  const selectedTileRef = useRef<HTMLDivElement>(null);
  const [cloneTop, setCloneTop] = useState<number>();
  const [cloneLeft, setCloneLeft] = useState<number>();
  const { start, reset, useSegment } = useSequence<MODAL_OPEN_SEGMENTS, Ctx>(
    MODAL_OPEN_SEQUENCE,
  );
  useSequence(HOME_PAGE_SEQUENCE).useStart();

  const seg = useSegment("GRID_GOES_IN_BG");

  const ctx = useMemo(
    () => ({
      controlsPresent: Object.entries(activeSketch?.controls ?? {}).length > 0,
      presetsPresent: (activeSketch?.presets?.length ?? 0) > 0,
    }),
    [activeSketch?.controls, activeSketch?.presets],
  );

  useEffect(() => {
    if (activeSketch) {
      start(ctx);
    }
    return reset;
  }, [activeSketch, ctx]);

  useLayoutEffect(() => {
    if (selectedTileRef.current) {
      const { top, left } = selectedTileRef.current.getBoundingClientRect();
      setCloneLeft(left);
      setCloneTop(top);
    }
  }, [activeSketch]);

  usePopStateSync();

  const handleSketchClick = useCallback((x: ISketch) => {
    setSketchToUrl(x);
    rerender();
  }, []);

  const closeSketch = () => {
    removeSketchDataFromUrl();
    rerender();
  };

  return (
    <>
      <div
        className={classNames(styles.Container, {
          [styles.InBackground]: !!activeSketch,
        })}
        style={{
          transitionDuration: seg.duration + "ms",
          transitionDelay: seg.delay + "ms",
        }}
      >
        <Header />
        <SketchTilesGrid
          onClick={handleSketchClick}
          activeSketch={activeSketch}
          sketches={sketchList}
          ref={selectedTileRef}
        />
      </div>
      {activeSketch && (
        <ActiveSketchProvider activeSketch={activeSketch}>
          <SketchModal
            top={cloneTop}
            left={cloneLeft}
            onBackClick={closeSketch}
          />
        </ActiveSketchProvider>
      )}
    </>
  );
}

export default App;
