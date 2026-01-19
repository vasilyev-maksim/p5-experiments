import type { P5CanvasInstance } from "@p5-wrapper/react";

export type ISketchProps<ParamKey extends string = string> = {
  [K in ParamKey]: number;
} & {
  playing: boolean;
  presetName?: string;
  timeShift?: number;
  timeDelta: number;
  canvasWidth: number;
  canvasHeight: number;
  randomSeed: number;
};

export type ISketchFactory<ParamKey extends string = string> = (
  initialProps: ISketchProps<ParamKey>
) => (p: P5CanvasInstance<ISketchProps<ParamKey>>) => void;

interface IControlBase {
  label: string;
  valueFormatter?: (value: number, control: this) => string;
}

export interface IRangeControl extends IControlBase {
  type: "range";
  min: number;
  max: number;
  step: number;
}

export interface IBooleanControl extends IControlBase {
  type: "boolean";
}

export interface IColorControl extends IControlBase {
  type: "color";
  colors: string[][];
}

export interface IChoiceControl extends IControlBase {
  type: "choice";
  options: { label: string; value: number }[];
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
};

export interface ISketch<ParamKey extends string = string> {
  name: string;
  id: string;
  preview: {
    size: number;
  };
  factory: ISketchFactory<ParamKey>;
  randomSeed?: number;
  timeShift?: number;
  controls: IControls<ParamKey>;
  defaultParams: IParams<ParamKey>;
  presets: IPreset<ParamKey>[];
}

export type SketchCanvasSize = "tile" | "modal" | "fullscreen";
