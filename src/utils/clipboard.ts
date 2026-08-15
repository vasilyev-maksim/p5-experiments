import type { IParams, IPreset } from "@/models";

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Copied!", text);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
}

export function copyPresetCodeToClipboard(
  params: IParams,
  timeDelta: number,
  presetIndex: number,
) {
  const name = prompt("Preset name (optional):")?.trim();
  const preset: IPreset = {
    params,
    name: name ?? presetIndex.toString(),
    timeDelta,
  };
  const code = JSON.stringify(preset, null, 4) + ",";
  return copyToClipboard(code);
}

export function copyCurrentUrlToClipboard() {
  return copyToClipboard(document.URL);
}
