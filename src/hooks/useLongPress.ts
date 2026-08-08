import { useRef } from "react";

export function useLongPress(
  timeout: number,
  onLongPress: () => void,
  onLongPressRelease?: () => void,
) {
  const pressedRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);

  const handlePress = () => {
    pressedRef.current = true;
    timeoutRef.current = setTimeout(() => {
      if (pressedRef.current) {
        onLongPress();
      }
    }, timeout);
  };
  const handleRelease = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    if (pressedRef.current) {
      onLongPressRelease?.();
    }
    pressedRef.current = false;
  };

  return { handlePress, handleRelease };
}
