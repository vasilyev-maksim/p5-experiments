import { tryParseNumber } from "./utils/misc";

export const ENV = {
  animationsDurationMultiplier: tryParseNumber(
    import.meta.env.VITE_ANIMATIONS_DURATION_MULTIPLIER,
    1,
  ),
  devTools: import.meta.env.VITE_DEV_TOOLS === "1",
  baseUrl: import.meta.env.VITE_BASE_URL as string,
};
