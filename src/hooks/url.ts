import { useRerender } from "@/hooks/index";
import { useEffect } from "react";

/** triggers re-render on browser back/forward navigation */
export function usePopStateSync(handler?: () => void) {
  const rerender = useRerender();

  useEffect(() => {
    const listener = () => {
      handler?.();
      rerender();
    };

    window.addEventListener("popstate", listener);

    return () => {
      window.removeEventListener("popstate", listener);
    };
  }, []);
}
