import styles from "./Header.module.css";
import { HOME_PAGE_SEQUENCE, type HOME_PAGE_SEGMENTS } from "../animations";
import { useSegment } from "../sequencer";
import classNames from "classnames";
import { AUTHOR_NAME, LINKEDIN_URL } from "@/consts";
import { useAnalytics } from "@/hooks/useAnalytics";

export function Header(props: { className?: string }) {
  const { wasRun, duration } = useSegment<HOME_PAGE_SEGMENTS>(
    HOME_PAGE_SEQUENCE,
    "HEADER",
  );
  const { sendAnalyticsEvent } = useAnalytics();

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
          href={LINKEDIN_URL}
          target="_blank"
          className={styles.Link}
          onClick={() => sendAnalyticsEvent("header: LinkedIn link clicked")}
        >
          {AUTHOR_NAME}
        </a>
      </h2>
    </div>
  );
}
