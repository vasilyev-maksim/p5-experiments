// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./reset.css";
import "./index.css";
import App from "./components/App.tsx";
import { SequenceProvider } from "./sequencer/SequenceProvider.tsx";
import { sequences } from "./animations.ts";
import { ViewportProvider } from "./contexts/ViewportProvider.tsx";
import { ENV } from "./env.ts";
import { Test } from "./components/Test.tsx";
import { NotificationsProvider } from "./contexts/NotificationsProvider.tsx";
import { AnalyticsProvider } from "./contexts/AnalyticsProvider.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <AnalyticsProvider>
    <ViewportProvider>
      <NotificationsProvider>
        <SequenceProvider sequences={sequences}>
          {ENV.sandboxMode ? <Test /> : <App />}
        </SequenceProvider>
      </NotificationsProvider>
    </ViewportProvider>
  </AnalyticsProvider>,
  // </StrictMode>
);
