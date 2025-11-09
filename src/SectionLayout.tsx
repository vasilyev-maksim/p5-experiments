import type { PropsWithChildren } from "react";
import { useViewport } from "./hooks";
import styles from "./SectionLayout.module.css";
import classNames from "classnames";
import { animated, easings, useSpring } from "react-spring";

export function SectionLayout(
  props: PropsWithChildren<{
    header: string;
    className?: string;
    bodyClassName?: string;
    showHeader?: boolean;
    onHeaderAnimationEnd?: () => void;
  }>
) {
  const { modalSidebarPadding } = useViewport();
  const { x } = useSpring({
    from: { x: 0 },
    to: { x: props.showHeader ? 1 : 0 },
    config: { duration: 300, easing: easings.easeInOutCubic },
    onRest: props.onHeaderAnimationEnd,
  });

  return (
    <div className={classNames(styles.SectionLayout, props.className)}>
      <animated.div
        className={styles.Header}
        style={{
          lineHeight: modalSidebarPadding + "px",
          opacity: x,
          translateX: x.to([0, 1], [15, 0]),
        }}
      >
        {props.header}
      </animated.div>
      <div className={classNames(styles.Body, props.bodyClassName)}>
        {props.children}
      </div>
    </div>
  );
}
