// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./reset.css";
import "./index.css";
// import App from "./Test.tsx";
import App from "./App.tsx";
import { ViewportProvider } from "./ViewportProvider.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ViewportProvider>
    <App />
  </ViewportProvider>
  // </StrictMode>
);
