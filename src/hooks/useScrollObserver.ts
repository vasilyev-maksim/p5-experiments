import { type RefObject, useEffect } from "react";

type ScrollObserverEvent =
  | {
      contentScrolling: true;
      scrollPercent: number;
      scrollPosition: "top" | "bottom" | "middle";
    }
  | {
      contentScrolling: false;
    };

export function useScrollObserver(
  containerRef: RefObject<HTMLElement | null>,
  callback: (event: ScrollObserverEvent) => void,
) {
  useEffect(() => {
    const el = containerRef.current;

    if (!el) return;

    const handler = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const height = scrollHeight - clientHeight;
      const contentScrolling = height > 0;

      if (!contentScrolling) {
        callback({ contentScrolling: false });
        return;
      }

      const scrollPercent = Math.min(1, Math.max(0, scrollTop / height));

      const EPSILON = 1;
      const scrollPosition =
        scrollTop <= EPSILON
          ? "top"
          : scrollTop >= height - EPSILON
            ? "bottom"
            : "middle";

      callback({ contentScrolling: true, scrollPercent, scrollPosition });
    };

    el.addEventListener("scroll", handler);

    const resizeObserver = new ResizeObserver(handler);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", handler);
      resizeObserver.disconnect();
    };
  }, []);
}
