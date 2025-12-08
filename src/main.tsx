// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./reset.css";
import "./index.css";
// import App from "./Test.tsx";
import App from "./App.tsx";
import { ViewportProvider } from "./ViewportProvider.tsx";
import { SequenceProvider } from "./sequencer/SequenceProvider.tsx";

export type STEPS =
  | "GRID_GOES_IN_BG"
  | "TILE_GOES_MODAL"
  | "START_PLAYING"
  | "SHOW_SIDEBAR"
  | "SHOW_HEADER"
  | "SHOW_PRESETS"
  | "SHOW_CONTROLS"
  | "SHOW_FOOTER";

export const MODAL_OPEN_SEQ = "MODAL_OPEN";
export type PresetsAnimationParams = {
  itemDelay: number;
  itemDuration: number;
};
export type ControlsAnimationParams = {
  itemDelay: number;
  itemDuration: number;
  slidersInitDelay: number;
};

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ViewportProvider>
    <SequenceProvider>
      <App />
    </SequenceProvider>
  </ViewportProvider>
  // </StrictMode>
);
