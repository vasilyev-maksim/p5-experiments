import styles from "./SketchModalSidebar.module.css";
import { animated, SpringValue } from "@react-spring/web";
import { useSizes } from "@/hooks/useSizes";
import { ParamControls } from "./ParamControls";
import { Presets } from "./Presets";
import { useSegment } from "../sequencer";
import { MODAL_OPEN_SEQUENCE, type MODAL_OPEN_SEGMENTS } from "../animations";
import { Button } from "./Button";
import {
  copyCurrentUrlToClipboard,
  copyPresetCodeToClipboard,
} from "@/utils/clipboard";
import { useActiveSketchContext } from "@/hooks/useActiveSketchContext";
import { DiceIcon, ShareIcon } from "./Icons";
import { ENV } from "@/env";
import { ScrollShadow } from "./ScrollShadow";
import { useNotifications } from "@/hooks/useNotifications";
import { useAnalytics } from "@/hooks/useAnalytics";

export const SketchModalSidebar = (props: {
  modalX: SpringValue<number>;
  headerX: SpringValue<number>;
}) => {
  const { modalPadding, modalSidebarPadding } = useSizes();
  const showBottomActions = useSegment<MODAL_OPEN_SEGMENTS>(
    MODAL_OPEN_SEQUENCE,
    "SHOW_BOTTOM_ACTIONS",
  );
  const { activeSketch, params, timeDelta, randomizeParams } =
    useActiveSketchContext();
  const { pushNotification } = useNotifications();
  const { sendAnalyticsEvent } = useAnalytics();

  const handleShareClick = async () => {
    const shareUrl = await copyCurrentUrlToClipboard();
    pushNotification("Link copied to clipboard", "share-url-copied");
    sendAnalyticsEvent("share button clicked", { params, shareUrl });
  };

  const handleRandomizeClick = () => {
    const newRandomParams = randomizeParams();
    sendAnalyticsEvent("randomize button clicked", { newRandomParams });
  };

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
          paddingRight: props.modalX.to([0, 1], [0, modalSidebarPadding]),
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
              paddingRight: modalSidebarPadding,
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
            paddingRight: modalSidebarPadding,
          }}
          className={styles.BottomActionsBlock}
        >
          <Button
            icon={<DiceIcon />}
            onClick={handleRandomizeClick}
            label="Randomize"
          />
          <Button
            icon={<ShareIcon />}
            onClick={handleShareClick}
            label="Share"
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
              label="preset"
            />
          )}
        </div>
      )}
    </div>
  );
};
