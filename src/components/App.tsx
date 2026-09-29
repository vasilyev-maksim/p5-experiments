import styles from "./App.module.css";
import { Header } from "./Header";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { SketchModal } from "./SketchModal";
import { useSegment, useSequence, useSequenceStart } from "../sequencer";
import {
  HOME_PAGE_SEQUENCE,
  MODAL_OPEN_SEQUENCE,
  type HOME_PAGE_SEGMENTS,
  type MODAL_OPEN_SEGMENTS,
} from "../animations";
import { SketchTilesGrid } from "./SketchTilesGrid";
import { sketchList } from "../sketches/list";
import { ActiveSketchProvider } from "@/contexts/ActiveSketchProvider";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useSizes } from "@/hooks/useSizes";
import { MobileDevicesRestrictionMessage } from "./MobileDevicesRestrictionMessage";
import { Footer } from "./Footer";
import { useActiveSketchFromUrl } from "@/hooks/useActiveSketchFromUrl";

function App() {
  const { sendAnalyticsEvent } = useAnalytics();
  const { activeSketch, closeSketch, openSketch } = useActiveSketchFromUrl();

  const { tileScreenCenteredLeft, tileScreenCenteredTop, isDesktop } =
    useSizes();

  useSequenceStart(HOME_PAGE_SEQUENCE);
  const { start, reset } = useSequence(MODAL_OPEN_SEQUENCE);
  const gridSegment = useSegment<MODAL_OPEN_SEGMENTS>(
    MODAL_OPEN_SEQUENCE,
    "GRID_GOES_IN_BG",
  );
  const tilesSegment = useSegment<HOME_PAGE_SEGMENTS>(
    HOME_PAGE_SEQUENCE,
    "TILES",
  );

  // Default values explanation:
  // when user opens direct sketch link (?sid=...) home page grid is not visible yet,
  // so regular positioning for clone-tile feels odd, instead we position it in the center of the screen.
  const [cloneTop, setCloneTop] = useState<number>(tileScreenCenteredTop);
  const [cloneLeft, setCloneLeft] = useState<number>(tileScreenCenteredLeft);

  // needed to position clone tile above active (clicked) tile in the beginning of open animation
  const activeTileRef = useRef<HTMLDivElement>(null);

  // clone tile positioning on sketch open
  useLayoutEffect(() => {
    // `tilesSegment.wasRun === true` means that grid is currently visible
    // and positioning should be regular, otherwise - stay screen centered.
    if (activeTileRef.current && tilesSegment.wasRun) {
      const { top, left } = activeTileRef.current.getBoundingClientRect();
      setCloneLeft(left);
      setCloneTop(top);
    }
  }, [activeSketch]);

  const sketchOpenAnimationContext = useMemo(
    () => ({
      controlsPresent: Object.entries(activeSketch?.controls ?? {}).length > 0,
      presetsPresent: (activeSketch?.presets?.length ?? 0) > 0,
    }),
    [activeSketch?.controls, activeSketch?.presets],
  );

  // sketch open animation start/interrupt
  useEffect(() => {
    if (activeSketch) {
      start(sketchOpenAnimationContext);
      sendAnalyticsEvent("sketch opened", { activeSketchId: activeSketch.id });
    }
    return reset;
  }, [activeSketch, sketchOpenAnimationContext]);

  return isDesktop ? (
    <>
      <div
        inert={Boolean(activeSketch)}
        className={classNames(styles.Container, {
          [styles.InBackground]: !!activeSketch,
        })}
        style={{
          transitionDuration: gridSegment.duration + "ms",
          transitionDelay: gridSegment.delay + "ms",
        }}
      >
        <Header className={styles.HeaderBlock} />
        <SketchTilesGrid
          onClick={openSketch}
          activeSketch={activeSketch}
          sketches={sketchList}
          ref={activeTileRef}
          className={styles.GridBlock}
        />
        <Footer className={styles.FooterBlock} />
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
  ) : (
    <MobileDevicesRestrictionMessage />
  );
}

export default App;
