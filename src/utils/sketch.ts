import type {
  ControlValueType,
  IControl,
  IControls,
  IParams,
  IPreset,
  ISketch,
} from "@/models";
import { copyToClipboard } from "./misc";

function serializeParams(params: IParams): string {
  return Object.entries(params)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((key, value) => key + "__" + value)
    .join("___");
}

export function areParamsEqual(a: IParams, b: IParams): boolean {
  return serializeParams(a) === serializeParams(b);
}

export function getRandomParamValue(c: IControl): ControlValueType<typeof c> {
  switch (c.type) {
    case "boolean":
      return Math.random() > 0.5;
    case "choice":
      return Math.round(Math.random() * (c.options.length - 1));
    case "color":
      return Math.round(Math.random() * (c.colors.length - 1));
    case "range": {
      const raw =
        Math.floor((Math.random() * (c.max - c.min)) / c.step) * c.step + c.min;
      const precision = c.step.toString().split(".")[1]?.length ?? 0;
      return parseFloat(raw.toFixed(precision));
    }
    case "coordinates":
      return [Math.random(), Math.random()];
  }
}

export function getRandomParams<Controls extends IControls>(
  controls: Controls,
): IParams<Controls> {
  return Object.entries<IControl>(controls).reduce((acc, [key, val]) => {
    return { ...acc, [key]: getRandomParamValue(val) };
  }, {}) as IParams<Controls>;
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
