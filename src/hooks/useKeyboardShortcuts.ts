import { useEffect } from "react";

export function useKeyboardShortcuts(
  onPlayPause: () => void,
  onFullscreenToggle: () => void,
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyP") onPlayPause();
      if (e.code === "KeyF") onFullscreenToggle();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPlayPause, onFullscreenToggle]);
}
