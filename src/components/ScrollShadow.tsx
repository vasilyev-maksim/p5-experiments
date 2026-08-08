import { useRef, useState, type PropsWithChildren } from "react";
import styles from "./ScrollShadow.module.css";
import classNames from "classnames";
import { useScrollObserver } from "@/hooks/useScrollObserver";

export function ScrollShadow(
  props: PropsWithChildren<{
    className?: string;
    style?: React.CSSProperties;
    active: boolean;
  }>,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [topShadow, setTopShadow] = useState(false);
  const [bottomShadow, setBottomShadow] = useState(false);

  useScrollObserver(containerRef, (event) => {
    if (event.contentScrolling) {
      switch (event.scrollPosition) {
        case "top":
          setTopShadow(false);
          setBottomShadow(true);
          break;
        case "bottom":
          setTopShadow(true);
          setBottomShadow(false);
          break;
        case "middle":
          setTopShadow(true);
          setBottomShadow(true);
          break;
      }
    } else {
      setTopShadow(false);
      setBottomShadow(false);
    }
  });

  return (
    <div
      style={props.style}
      ref={containerRef}
      className={classNames(props.className, styles.ScrollShadow)}
    >
      <div
        className={classNames(styles.TopShadow, {
          [styles.Active]: topShadow && props.active,
        })}
      />
      {props.children}
      <div
        className={classNames(styles.BottomShadow, {
          [styles.Active]: bottomShadow && props.active,
        })}
      />
    </div>
  );
}
