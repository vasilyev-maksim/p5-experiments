import styles from "./SketchModalSidebar.module.css";
import { animated, SpringValue } from "@react-spring/web";
import { useSizes } from "@/hooks/useSizes";
import { ParamControls } from "./ParamControls";
import { Presets } from "./Presets";
import { useSegment } from "../sequencer";
import { MODAL_OPEN_SEQUENCE, type MODAL_OPEN_SEGMENTS } from "../animations";
import { useActiveSketchContext } from "@/hooks/useActiveSketchContext";
import { ScrollShadow } from "./ScrollShadow";
import { SidebarActions } from "./SidebarActions";

export const SketchModalSidebar = (props: {
  modalX: SpringValue<number>;
  headerX: SpringValue<number>;
}) => {
  const { modalPadding, modalSidebarPadding } = useSizes();
  const showBottomActions = useSegment<MODAL_OPEN_SEGMENTS>(
    MODAL_OPEN_SEQUENCE,
    "SHOW_BOTTOM_ACTIONS",
  );
  const { activeSketch } = useActiveSketchContext();

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
          <SidebarActions />
        </div>
      )}
    </div>
  );
};
