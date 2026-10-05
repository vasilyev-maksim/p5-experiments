import type {
  ControlValueType,
  IControl,
  IControls,
  IParams,
  IPreset,
  ISketch,
  ParamName,
  ScenarioAction,
} from "@/models";

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

export function getDefaultPreset(sketch: ISketch) {
  return sketch.presets[0];
}

export function delay(duration: number): ScenarioAction {
  return { type: "delay", duration };
}

type PresetPatch<Controls extends IControls> = Partial<
  Omit<IPreset<Controls>, "params">
> & {
  params?: Partial<IParams<Controls>>;
};

export function changePresetFactory<Controls extends IControls = any>(
  presets: IPreset<Controls>[],
): (presetName: string, patch?: PresetPatch<Controls>) => ScenarioAction {
  return (presetName: string, patch?: PresetPatch<Controls>) => {
    const target = presets.find((x) => x.name === presetName)!;
    const preset = patch
      ? {
          ...target,
          ...patch,
          params: {
            ...target.params,
            ...patch.params,
          },
        }
      : target;

    return {
      type: "sketchEvent",
      event: {
        type: "applyPreset",
        preset,
      },
    };
  };
}

export function playPause(paused: boolean): ScenarioAction {
  return { type: "sketchEvent", event: { type: "playPause", paused } };
}

export function paramChangeFactory<Controls extends IControls>() {
  return <K extends ParamName<Controls>>(
    paramName: K,
    paramValue: IParams<Controls>[K],
  ): ScenarioAction => ({
    type: "sketchEvent",
    event: {
      type: "paramChange",
      paramName: paramName as string,
      paramValue,
    },
  });
}
