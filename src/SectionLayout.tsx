import type { PropsWithChildren } from "react";
import { useViewport } from "./hooks";
import styles from "./SectionLayout.module.css";
import classNames from "classnames";
import { animated, easings, useSpring } from "react-spring";

export function SectionLayout(
  props: PropsWithChildren<{
    header: string;
    className?: string;
    showHeader?: boolean;
    onHeaderAnimationEnd?: () => void;
  }>
) {
  const { modalPadding } = useViewport();
  const { x } = useSpring({
    from: { x: 0 },
    to: { x: props.showHeader ? 1 : 0 },
    config: { duration: 300, easing: easings.easeInOutCubic },
    onRest: props.onHeaderAnimationEnd,
  });

  return (
    <div
      className={classNames(styles.SectionLayout, props.className)}
      style={{ left: -modalPadding / 2 }}
    >
      <animated.div
        className={styles.Header}
        style={{
          paddingRight: modalPadding / 2,
          lineHeight: modalPadding + "px",
          opacity: x,
          translateX: x.to([0, 1], [15, 0]),
        }}
      >
        {props.header}
      </animated.div>
      <div className={styles.Body}>{props.children}</div>
    </div>
  );
}
