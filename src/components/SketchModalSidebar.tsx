import styles from "./SketchModalSidebar.module.css";
import { animated, SpringValue } from "@react-spring/web";
import { useViewport } from "@/hooks/useViewport";
import { ParamControls } from "./ParamControls";
import { Presets } from "./Presets";
import { useSequence } from "../sequencer";
import {
  MODAL_OPEN_SEQUENCE,
  type Ctx,
  type MODAL_OPEN_SEGMENTS,
} from "../animations";
import { Button } from "./Button";
import { copyPresetCodeToClipboard } from "@utils/sketch";
import { useActiveSketch } from "@/hooks/useActiveSketch";
import { DiceIcon } from "./Icons";
import { ENV } from "@/env";
import { ScrollShadow } from "./ScrollShadow";

export const SketchModalSidebar = (props: {
  modalX: SpringValue<number>;
  headerX: SpringValue<number>;
}) => {
  const { modalPadding, modalSidebarPadding } = useViewport();
  const { useSegment } = useSequence<MODAL_OPEN_SEGMENTS, Ctx>(
    MODAL_OPEN_SEQUENCE,
  );
  const showBottomActions = useSegment("SHOW_BOTTOM_ACTIONS");
  const { activeSketch, params, timeDelta, randomizeParams } =
    useActiveSketch();

  const paddingRight = modalSidebarPadding - 6;

  return (
    <div className={styles.SketchModalSidebar}>
      <animated.h2
        className={styles.ModalTitle}
        style={{
          paddingBottom: modalPadding,
          paddingTop: (modalPadding * 3) / 2,
          paddingLeft: modalSidebarPadding,
          translateY: props.headerX.to([0, 1], [15, 0]),
          opacity: props.headerX,
          paddingRight: props.modalX.to([0, 1], [0, paddingRight]),
        }}
      >
        {activeSketch.name.toUpperCase()}
      </animated.h2>

      <div className={styles.Body}>
        <ScrollShadow active={showBottomActions.completed}>
          <div
            style={{
              paddingTop: modalPadding,
              paddingBottom: 10,
              paddingRight,
            }}
          >
            <Presets />
            <ParamControls />
          </div>
        </ScrollShadow>
      </div>

      {showBottomActions.wasRun && (
        <div
          style={{
            paddingLeft: modalSidebarPadding,
            animationDuration: showBottomActions.duration + "ms",
            paddingRight,
          }}
          className={styles.BottomActionsBlock}
        >
          <Button
            onClick={randomizeParams}
            className={styles.RandomizeButton}
            label={
              <>
                <DiceIcon />
                &nbsp; Randomize
              </>
            }
          />
          {ENV.isProd ? null : (
            <Button
              onClick={() =>
                copyPresetCodeToClipboard(
                  params,
                  timeDelta,
                  activeSketch.presets.length,
                )
              }
              label="Export preset"
            />
          )}
        </div>
      )}
    </div>
  );
};
