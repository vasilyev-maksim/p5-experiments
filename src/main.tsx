// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./reset.css";
import "./index.css";
import App from "./components/App.tsx";
import { ViewportProvider } from "./components/ViewportProvider.tsx";
import { Sequence } from "./sequencer/Sequence";
import { SequenceProvider } from "./sequencer/SequenceProvider.tsx";

export const MODAL_OPEN_SEQUENCE = "MODAL_OPEN";
export type MODAL_OPEN_SEGMENTS =
  | "GRID_GOES_IN_BG"
  | "TILE_GOES_MODAL"
  | "START_PLAYING"
  | "SHOW_SIDEBAR"
  | "SHOW_HEADER"
  | "SHOW_PRESETS"
  | "SHOW_CONTROLS"
  | "SHOW_FOOTER";
export const HOME_PAGE_SEQUENCE = "HOME_PAGE";
export type HOME_PAGE_SEGMENTS = "HEADER" | "TILES";
export type PresetsAnimationParams = {
  itemDelay: number;
  itemDuration: number;
};
export type ControlsAnimationParams = {
  itemDelay: number;
  itemDuration: number;
  slidersInitDelay: number;
};
export type Ctx = {
  presetsPresent: boolean;
  controlsPresent: boolean;
};
export type GridAnimationParams = {
  itemDelay: number;
  itemDuration: number;
};

const sequences = [
  new Sequence(MODAL_OPEN_SEQUENCE, [
    Sequence.syncSegment({ id: "GRID_GOES_IN_BG", duration: 400 }),
    Sequence.syncSegment({
      id: "TILE_GOES_MODAL",
      delay: 100,
      duration: 500,
    }),
    Sequence.syncSegment({ id: "START_PLAYING", delay: 100 }),
    Sequence.syncSegment({ id: "SHOW_SIDEBAR" }),
    Sequence.syncSegment({ id: "SHOW_HEADER", duration: 500 }),
    Sequence.asyncSegment<PresetsAnimationParams>({
      id: "SHOW_PRESETS",
      timingPayload: {
        itemDelay: 25,
        itemDuration: 180,
      },
      disabledIf: (ctx) => !(ctx as Ctx).presetsPresent,
    }),
    Sequence.asyncSegment<ControlsAnimationParams>({
      id: "SHOW_CONTROLS",
      timingPayload: {
        itemDelay: 50,
        itemDuration: 300,
        slidersInitDelay: 500,
      },
      disabledIf: (ctx) => !(ctx as Ctx).controlsPresent,
    }),
    Sequence.syncSegment({ id: "SHOW_FOOTER", duration: 200, delay: 200 }),
  ]),
  new Sequence(HOME_PAGE_SEQUENCE, [
    Sequence.syncSegment({
      id: "HEADER",
      delay: 700,
      duration: 400,
    }),
    Sequence.asyncSegment<GridAnimationParams>({
      id: "TILES",
      delay: 200,
      timingPayload: {
        itemDelay: 125,
        itemDuration: 300,
      },
    }),
  ]),
]; // TODO: fix typings

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ViewportProvider>
    <SequenceProvider sequences={sequences}>
      <App />
    </SequenceProvider>
  </ViewportProvider>
  // </StrictMode>
);
