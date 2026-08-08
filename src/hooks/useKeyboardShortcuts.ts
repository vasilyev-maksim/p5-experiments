import { useEffect } from "react";

export function useKeyboardShortcuts(
  onPlayPause: () => void,
  onFullscreenToggle: () => void,
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "p" || e.key === "P") onPlayPause();
      if (e.key === "f" || e.key === "F") onFullscreenToggle();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPlayPause, onFullscreenToggle]);
}
