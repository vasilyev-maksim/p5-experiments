import { ENV } from "@/env";
import { usePostHog } from "@posthog/react";

export function useAnalytics() {
  const posthog = usePostHog();

  return {
    sendEvent: (...args: Parameters<typeof posthog.capture>) => {
      if (ENV.disableAnalytics) {
        console.log("analytics event: ", ...args);
      } else {
        posthog.capture(...args);
      }
    },
  };
}
