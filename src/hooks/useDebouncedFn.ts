import { useRef, useCallback } from "react";


export function useDebouncedFn<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): T {
  const timer = useRef<ReturnType<typeof setTimeout>>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timer.current != null) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay],
  ) as T;
}
