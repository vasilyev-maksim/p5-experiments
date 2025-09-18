import type { PropsWithChildren } from "react";
import styles from "./SketchOverlay.module.css";

export function SketchOverlay(props: PropsWithChildren) {
  return <div className={styles.SketchOverlay}>{props.children}</div>;
}
