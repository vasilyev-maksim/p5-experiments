import { useSequence } from "@/sequencer";
import styles from "./Footer.module.css";
import { HOME_PAGE_SEQUENCE } from "@/animations";
import classNames from "classnames";

export function Footer() {
  const { wasRun, duration } =
    useSequence(HOME_PAGE_SEQUENCE).useSegment("FOOTER");

  return (
    <div
      className={classNames(styles.Footer, {
        [styles.Visible]: wasRun,
        [styles.Hidden]: !wasRun,
      })}
      style={{
        animationDuration: duration + "ms",
      }}
    >
      © 2025-2026 Maksim Vasilyev | LinkedIn | Source code | Made with love
      using React, react-spring and p5.js
    </div>
  );
}
