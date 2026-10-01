import { PostHogProvider } from "@posthog/react";
import { ENV } from "@/env";
import type { PostHogConfig } from "posthog-js";

const options: Partial<PostHogConfig> = {
  api_host: ENV.posthogHost,
  autocapture: false,
  defaults: "2026-05-30",
} as const;

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  if (ENV.disableAnalytics) {
    return children;
  }

  return (
    <PostHogProvider apiKey={ENV.posthogProjectToken} options={options}>
      {children}
    </PostHogProvider>
  );
}
