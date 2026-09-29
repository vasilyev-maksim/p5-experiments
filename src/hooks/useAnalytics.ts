import { ENV } from "@/env";
import { usePostHog } from "@posthog/react";
import { useActiveSketchContext } from "./useActiveSketchContext";
import { useThrottleWithTrailing } from "./useThrottleWithTrailing";

export function useAnalytics() {
  const posthog = usePostHog();
  const { activeSketch } = useActiveSketchContext();

  return {
    sendAnalyticsEvent: (...args: Parameters<typeof posthog.capture>) => {
      const newArgs = [
        args[0],
        { activeSketchId: activeSketch?.id, ...args[1] },
        ...(args[2] ? [args[2]] : []),
      ] as const;

      if (ENV.disableAnalytics) {
        console.log("analytics event: ", ...newArgs);
      } else {
        posthog.capture(...newArgs);
      }
    },
  };
}

export function useAnalyticsThrottled() {
  const { sendAnalyticsEvent } = useAnalytics();

  return {
    sendThrottledAnalyticsEvent: useThrottleWithTrailing(
      sendAnalyticsEvent,
      300,
    ),
  };
}
