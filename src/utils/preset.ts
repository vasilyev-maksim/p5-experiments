import type { IParams, IPreset, ISketch } from "@/models";
import { copyToClipboard } from "./misc";

export function presetToJsonString(preset: IPreset) {
  return JSON.stringify(preset, null, 4) + ",";
}

export function addPresetDataToQs(preset: IPreset, qs: URLSearchParams) {
  Object.entries(preset.params).forEach(([name, value]) => {
    if (Array.isArray(value)) {
      value.forEach((x, i) => {
        qs.set(`${name}[${i}]`, x.toString());
      });
    } else {
      qs.set(name, value.toString());
    }
  });

  qs.set("timeDelta", preset.timeDelta.toString());

  return qs.toString();
}

export function readPresetFromQs(qs: URLSearchParams) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const preset = { params: {}, timeDelta: 1 } as IPreset as any;

  qs.forEach((valueStr, name) => {
    const val =
      valueStr === "true" || valueStr === "false"
        ? Boolean(valueStr)
        : Number(valueStr);

    if (name === "timeDelta") {
      preset.timeDelta = val;
    } else if (name !== "sid") {
      if (name.includes("[")) {
        const propName = name.split("[")?.[0];

        if (preset.params[propName]) {
          preset.params[propName].push(val);
        } else {
          preset.params[propName] = [val];
        }
      } else {
        preset.params[name] = val;
      }
    }
  });

  return Object.keys(preset.params).length > 0 ? (preset as IPreset) : null;
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

export function getDefaultPreset(sketch: ISketch) {
  return sketch.presets[0];
}
