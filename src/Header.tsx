import styles from "./Header.module.css";
import { HOME_PAGE_SEQUENCE, type HOME_PAGE_SEGMENTS } from "./main";
import { useSequence } from "./sequencer";

export function Header() {
  const { wasRun, duration } =
    useSequence<HOME_PAGE_SEGMENTS>(HOME_PAGE_SEQUENCE).useSegment("HEADER");

  return wasRun ? (
    <h1
      className={styles.Header}
      style={{
        animationDuration: duration + "ms",
      }}
    >
      <a href="https://vasilyev-maksim.github.io/resume/" target="_blank">
        My
      </a>{" "}
      experiments with{" "}
      <a href="https://p5js.org/" target="_blank">
        p5.js
      </a>
    </h1>
  ) : null;
}
