import styles from "./SketchModal.module.css";
import { animated, SpringValue } from "@react-spring/web";
import { useViewport } from "@hooks";
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
import { useActiveSketch } from "@hooks";
import { DiceIcon } from "./Icons";
import { ENV } from "@/env";

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

  return (
    <>
      <animated.h2
        className={styles.ModalTitle}
        style={{
          marginBottom: modalPadding,
          marginTop: (modalPadding * 3) / 2,
          marginLeft: modalSidebarPadding,
          translateY: props.headerX.to([0, 1], [15, 0]),
          opacity: props.headerX,
          paddingRight: props.modalX.to([0, 1], [0, modalSidebarPadding - 6]),
        }}
      >
        {activeSketch.name.toUpperCase()}
      </animated.h2>
      <animated.div
        className={styles.Body}
        style={{
          paddingTop: modalPadding,
          paddingRight: props.modalX.to([0, 1], [0, modalSidebarPadding - 6]),
        }}
      >
        <Presets />
        <ParamControls />

        {showBottomActions.wasRun && (
          <div
            style={{
              paddingLeft: modalSidebarPadding,
              animationDuration: showBottomActions.duration + "ms",
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
      </animated.div>
    </>
  );
};
