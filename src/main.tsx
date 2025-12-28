// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./reset.css";
import "./index.css";
import App from "./components/App.tsx";
import { ViewportProvider } from "./components/ViewportProvider.tsx";
import { SequenceProvider } from "./sequencer/SequenceProvider.tsx";
import { sequences } from "./animations.ts";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ViewportProvider>
    <SequenceProvider sequences={sequences}>
      <App />
    </SequenceProvider>
  </ViewportProvider>
  // </StrictMode>
);
