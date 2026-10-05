import { useActiveSketchContext } from "@/hooks/useActiveSketchContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useNotifications } from "@/hooks/useNotifications";
import { copyCurrentUrlToClipboard } from "@/utils/clipboard";
import { Button } from "./Button";
import { DiceIcon, ShareIcon } from "./Icons";

export function SidebarActions() {
  const { params, randomizeParams } = useActiveSketchContext();

  const { pushNotification } = useNotifications();
  const { sendAnalyticsEvent } = useAnalytics();

  const handleShareClick = async () => {
    const shareUrl = await copyCurrentUrlToClipboard();
    pushNotification("Link copied to clipboard", "share-url-copied");
    sendAnalyticsEvent("share button clicked", { params, shareUrl });
  };

  const handleRandomizeClick = () => {
    const newRandomParams = randomizeParams();
    sendAnalyticsEvent("randomize button clicked", { newRandomParams });
  };

  return (
    <>
      <Button
        icon={<DiceIcon />}
        onClick={handleRandomizeClick}
        label="Randomize"
      />
      <Button icon={<ShareIcon />} onClick={handleShareClick} label="Share" />
      {/* {ENV.isProd ? null : (
        <>
          <Button
            onClick={() =>
              copyPresetCodeToClipboard(
                params,
                timeDelta,
                activeSketch.presets.length,
              )
            }
            label="preset"
          />
        </>
      )} */}
    </>
  );
}
