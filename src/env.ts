import { tryParseNumber } from "@utils/misc";

export const ENV = {
  devTools: import.meta.env.VITE_DEV_TOOLS === "1",
  baseUrl: import.meta.env.VITE_BASE_URL as string,
  isProd: import.meta.env.PROD,
  animationsDurationMultiplier: tryParseNumber(
    import.meta.env.VITE_ANIMATIONS_DURATION_MULTIPLIER,
    1,
  ),
  sandboxModeEnabled: import.meta.env.VITE_SANDBOX_MODE === "1",
  posthogHost: import.meta.env.VITE_POSTHOG_HOST,
  posthogProjectToken: import.meta.env.VITE_POSTHOG_PROJECT_TOKEN,
  analyticsDisabled: import.meta.env.VITE_ANALYTICS_DISABLED === "1",
  scenariosEnabled: import.meta.env.VITE_SCENARIOS_ENABLED === "1",
};
