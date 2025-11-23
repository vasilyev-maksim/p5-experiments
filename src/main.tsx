// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./reset.css";
import "./index.css";
// import App from "./Test.tsx";
import App from "./App.tsx";
import { ViewportProvider } from "./ViewportProvider.tsx";
import { SequenceContext } from "./sequencer/index.ts";
import { Sequence } from "./sequencer/Sequence";
import { ValueStep } from "./sequencer/ValueStep";

export enum STEPS {
  GRID_GOES_IN_BG,
  TILE_GOES_MODAL,
  START_PLAYING,
  SHOW_SIDEBAR,
  SHOW_HEADER,
  SHOW_PRESETS,
  SHOW_CONTROLS,
  SHOW_FOOTER,
}

const seqs = [
  new Sequence<STEPS>("MODAL_OPEN", [
    new ValueStep(STEPS.GRID_GOES_IN_BG),
    new ValueStep(STEPS.TILE_GOES_MODAL, 400),
    new ValueStep(STEPS.START_PLAYING, 500),
    new ValueStep(STEPS.START_PLAYING),
    new ValueStep(STEPS.SHOW_HEADER),
    new ValueStep(STEPS.SHOW_PRESETS, 500),
    new ValueStep(STEPS.SHOW_CONTROLS),
    new ValueStep(STEPS.SHOW_FOOTER),
  ]),
];

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ViewportProvider>
    <SequenceContext.Provider value={{ seqs }}>
      <App />
    </SequenceContext.Provider>
  </ViewportProvider>
  // </StrictMode>
);
