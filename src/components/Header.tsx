import styles from "./Header.module.css";
import { HOME_PAGE_SEQUENCE, type HOME_PAGE_SEGMENTS } from "../animations";
import { useSequence } from "../sequencer";
import classNames from "classnames";
import { AUTHOR_NAME } from "@/consts";

export function Header(props: { className?: string }) {
  const { wasRun, duration } =
    useSequence<HOME_PAGE_SEGMENTS>(HOME_PAGE_SEQUENCE).useSegment("HEADER");

  return (
    <div
      className={classNames(
        styles.Header,
        {
          [styles.Visible]: wasRun,
          [styles.Hidden]: !wasRun,
        },
        props.className,
      )}
      style={{
        animationDuration: duration + "ms",
      }}
    >
      <h1 className={styles.FirstLine}>Generative Art</h1>
      <h2
        className={styles.SecondLine}
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
          {AUTHOR_NAME}
        </a>
      </h2>
    </div>
  );
}
