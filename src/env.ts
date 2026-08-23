import { tryParseNumber } from "@utils/misc";

export const ENV = {
  animationsDurationMultiplier: tryParseNumber(
    import.meta.env.VITE_ANIMATIONS_DURATION_MULTIPLIER,
    1,
  ),
  devTools: import.meta.env.VITE_DEV_TOOLS === "1",
  baseUrl: import.meta.env.VITE_BASE_URL as string,
  isProd: import.meta.env.PROD,
  sandboxMode: import.meta.env.VITE_SANDBOX_MODE === "1",
  posthogHost: import.meta.env.VITE_POSTHOG_HOST,
  posthogProjectToken: import.meta.env.VITE_POSTHOG_PROJECT_TOKEN,
  disableAnalytics: import.meta.env.VITE_DISABLE_ANALYTICS === "1",
};
