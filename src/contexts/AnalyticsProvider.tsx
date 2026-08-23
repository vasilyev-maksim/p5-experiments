import { PostHogProvider } from "@posthog/react";
import { ENV } from "@/env";
import type { PostHogConfig } from "posthog-js";

const options: Partial<PostHogConfig> = {
  api_host: ENV.posthogHost,
  cookieless_mode: "always",
  autocapture: false,
  defaults: "2026-05-30",
} as const;

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider apiKey={ENV.posthogProjectToken} options={options}>
      {children}
    </PostHogProvider>
  );
}
