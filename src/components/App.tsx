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
import { useSegment, useSequence, useSequenceStart } from "../sequencer";
import {
  HOME_PAGE_SEQUENCE,
  MODAL_OPEN_SEQUENCE,
  type MODAL_OPEN_SEGMENTS,
} from "../animations";
import { SketchTilesGrid } from "./SketchTilesGrid";
import { usePopStateSync } from "@/hooks/usePopStateSync";
import { sketchList } from "../sketches/list";
import {
  getActiveSketchFromUrl,
  removeSketchDataFromUrl,
  setSketchToUrl,
} from "@utils/url";
import { useRerender } from "@/hooks/useRerender";
import { ActiveSketchProvider } from "@/contexts/ActiveSketchProvider";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useSizes } from "@/hooks/useSizes";
import { MobileDevicesRestrictionMessage } from "./MobileDevicesRestrictionMessage";
import { Footer } from "./Footer";

function App() {
  const rerender = useRerender();
  const activeSketch = getActiveSketchFromUrl(sketchList);
  const selectedTileRef = useRef<HTMLDivElement>(null);
  const { tileScreenCenteredLeft, tileScreenCenteredTop, isDesktop } =
    useSizes();
  const [cloneTop, setCloneTop] = useState<number>(tileScreenCenteredTop);
  const [cloneLeft, setCloneLeft] = useState<number>(tileScreenCenteredLeft);
  const { start, reset } = useSequence(MODAL_OPEN_SEQUENCE);
  const seg = useSegment<MODAL_OPEN_SEGMENTS>(
    MODAL_OPEN_SEQUENCE,
    "GRID_GOES_IN_BG",
  );
  const ctx = useMemo(
    () => ({
      controlsPresent: Object.entries(activeSketch?.controls ?? {}).length > 0,
      presetsPresent: (activeSketch?.presets?.length ?? 0) > 0,
    }),
    [activeSketch?.controls, activeSketch?.presets],
  );
  const { sendAnalyticsEvent } = useAnalytics();

  useSequenceStart(HOME_PAGE_SEQUENCE);
  usePopStateSync();

  useEffect(() => {
    if (activeSketch) {
      start(ctx);
      sendAnalyticsEvent("sketch opened", { activeSketchId: activeSketch.id });
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

  const handleSketchClick = useCallback((x: ISketch) => {
    setSketchToUrl(x);
    rerender();
  }, []);

  const closeSketch = () => {
    removeSketchDataFromUrl();
    rerender();
  };

  return isDesktop ? (
    <>
      <div
        inert={Boolean(activeSketch)}
        className={classNames(styles.Container, {
          [styles.InBackground]: !!activeSketch,
        })}
        style={{
          transitionDuration: seg.duration + "ms",
          transitionDelay: seg.delay + "ms",
        }}
      >
        <Header className={styles.HeaderBlock} />
        <SketchTilesGrid
          onClick={handleSketchClick}
          activeSketch={activeSketch}
          sketches={sketchList}
          ref={selectedTileRef}
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
