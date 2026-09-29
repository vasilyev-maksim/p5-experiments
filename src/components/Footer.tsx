import { useSegment } from "@/sequencer";
import styles from "./Footer.module.css";
import { type HOME_PAGE_SEGMENTS, HOME_PAGE_SEQUENCE } from "@/animations";
import classNames from "classnames";
import { AUTHOR_NAME, LINKEDIN_URL, SOURCE_CODE_URL } from "@/consts";

export function Footer(props: { className?: string }) {
  const { wasRun, duration } = useSegment<HOME_PAGE_SEGMENTS>(
    HOME_PAGE_SEQUENCE,
    "FOOTER",
  );

  return (
    <div
      className={classNames(
        styles.Footer,
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
      <span className={styles.NoWrap}>© 2025-2026 {AUTHOR_NAME}</span>
      <a className={styles.NoWrap} href={LINKEDIN_URL} target="_blank">
        LinkedIn
      </a>
      <a className={styles.NoWrap} href={SOURCE_CODE_URL} target="_blank">
        Source code
      </a>
      <div
        style={{
          flex: 1,
        }}
      ></div>
      <span style={{ textAlign: "right" }}>
        Handcrafted&nbsp;with&nbsp;love&nbsp;using{" "}
        <a href="https://react.dev/" target="_blank">
          react
        </a>
        ,&nbsp;
        <a href="https://www.react-spring.dev/" target="_blank">
          react-spring
        </a>
        &nbsp; and&nbsp;
        <a href="https://p5js.org/" target="_blank">
          p5.js
        </a>
      </span>
    </div>
  );
}
