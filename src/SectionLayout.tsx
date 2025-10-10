import type { PropsWithChildren } from "react";
import { useViewport } from "./hooks";
import styles from "./SectionLayout.module.css";
import classNames from "classnames";

export function SectionLayout(
  props: PropsWithChildren<{ header: string; className?: string }>
) {
  const { modalPadding } = useViewport();

  return (
    <div
      className={classNames(styles.SectionLayout, props.className)}
      style={{ left: -modalPadding / 2 }}
    >
      <div
        className={styles.Header}
        style={{
          paddingRight: modalPadding / 2,
          lineHeight: modalPadding + "px",
        }}
      >
        {props.header}
      </div>
      <div className={styles.Body}>{props.children}</div>
    </div>
  );
}
