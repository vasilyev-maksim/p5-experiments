import styles from "./Header.module.css";
import { HOME_PAGE_SEQUENCE, type HOME_PAGE_SEGMENTS } from "../animations";
import { useSequence } from "../sequencer";
import classNames from "classnames";

export function Header() {
  const { wasRun, duration } =
    useSequence<HOME_PAGE_SEGMENTS>(HOME_PAGE_SEQUENCE).useSegment("HEADER");

  return (
    <div
      className={classNames(styles.HeaderWrapper, {
        [styles.Visible]: wasRun,
        [styles.Hidden]: !wasRun,
      })}
      style={{
        animationDuration: duration + "ms",
      }}
    >
      <h1 className={styles.Header}>Generative Art</h1>
      <h2
        className={styles.SubHeader}
        style={{
          animationDuration: duration + "ms",
        }}
      >
        by{" "}
        <a
          href="https://www.linkedin.com/in/maksim-vasilyev-09099a77/"
          target="_blank"
          className={styles.Link}
        >
          Maksim Vasilyev
        </a>
      </h2>
    </div>
  );
}
