import { useRef, useEffect, useMemo } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export function useThrottleWithTrailing<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
): T {
  const callbackRef = useRef(callback);
  const lastCallRef = useRef(0);
  const pendingArgsRef = useRef<Parameters<T> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useMemo(() => {
    return ((...args: Parameters<T>) => {
      const now = Date.now();

      // Clear any pending trailing call
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (now - lastCallRef.current >= delay) {
        // Immediate call
        lastCallRef.current = now;
        callbackRef.current(...args);
        pendingArgsRef.current = null;
      } else {
        // Schedule trailing call
        pendingArgsRef.current = args;
        timeoutRef.current = setTimeout(
          () => {
            lastCallRef.current = Date.now();
            if (pendingArgsRef.current) {
              callbackRef.current(...pendingArgsRef.current);
            }
            pendingArgsRef.current = null;
          },
          delay - (now - lastCallRef.current),
        );
      }
    }) as T;
  }, [delay]);
}
