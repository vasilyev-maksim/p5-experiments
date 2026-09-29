import { useRef, type KeyboardEvent } from "react";

const isActivationKey = (e: KeyboardEvent) =>
  e.key === "Enter" || e.key === " ";

export function useLongPress(
  timeout: number,
  onLongPress: () => void,
  onLongPressRelease?: () => void,
) {
  const pressedRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);

  const handlePress = () => {
    clearTimeout(timeoutRef.current);
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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isActivationKey(e)) return;

    if (e.repeat) {
      e.preventDefault();
      return;
    }

    handlePress();
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (!isActivationKey(e)) return;

    handleRelease();
  };

  return { handlePress, handleRelease, handleKeyDown, handleKeyUp };
}
