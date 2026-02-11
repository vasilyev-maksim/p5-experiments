import type { P5CanvasInstance } from "@p5-wrapper/react";

export type ExportRequestEvent = {
  type: "export";
  exportFileName: string;
  exportFileWidth: number;
  exportFileHeight: number;
};

export type PresetChangeEvent = {
  type: "presetChange";
  preset: IPreset;
};

export type SketchEvent = ExportRequestEvent | PresetChangeEvent;

export type ISketchProps<ParamKey extends string = string> = {
  [K in ParamKey]: number;
} & {
  playing: boolean;
  timeShift?: number;
  timeDelta: number;
  canvasWidth: number;
  canvasHeight: number;
  randomSeed: number;
  event?: SketchEvent;
};

// export type Init<T> = (arg: T) => void;

// export type ExportCallback = (
//   exportFilename: string,
//   width: number,
//   height: number,
// ) => void;

// export type SetSketchTimeCallback = (time: number) => void;

export type ISketchFactory<ParamKey extends string = string> = (args: {
  initialProps: ISketchProps<ParamKey>;
}) => (p: P5CanvasInstance<ISketchProps<ParamKey>>) => void;

interface IControlBase {
  label: string;
}

export interface IRangeControl extends IControlBase {
  type: "range";
  min: number;
  max: number;
  step: number;
  valueFormatter?: (value: number, control: this) => string;
}

export interface IBooleanControl extends IControlBase {
  type: "boolean";
}

export interface IColorControl extends IControlBase {
  type: "color";
  colors: string[][];
  /** -1 = not visible in UI;
   * 0 = visible in UI, initially turned OFF;
   * 1 = visible in UI, initially turned ON */
  shuffle?: -1 | 0 | 1;
  shuffleSwitchLabel?: string;
}

export interface IChoiceControl extends IControlBase {
  type: "choice";
  options: string[];
}

export type IParams<ParamKey extends string = string> = Record<
  ParamKey,
  number
> & { timeDelta?: number };

export type IControl =
  | IRangeControl
  | IBooleanControl
  | IColorControl
  | IChoiceControl;

export type IControls<ParamKey extends string = string> = Record<
  ParamKey,
  IControl
>;

export type ExtractParams<T> = T extends IControls<infer P> ? P : string;

export type IPreset<ParamKey extends string = string> = {
  name?: string;
  params: IParams<ParamKey>;
  startTime?: number;
};

export interface ISketch<ParamKey extends string = string> {
  name: string;
  id: string;
  preview: {
    size: number;
  };
  factory: ISketchFactory<ParamKey>;
  randomSeed?: number;
  controls: IControls<ParamKey>;
  presets: IPreset<ParamKey>[];
  presetsShuffle?: -1 | 0 | 1;
  presetsShuffleInterval?: number;
  startTime?: number;
  type: "released" | "draft" | "hidden";
}

export type SketchCanvasSize = "tile" | "modal" | "fullscreen";
