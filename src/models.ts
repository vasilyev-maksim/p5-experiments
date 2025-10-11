import type { P5CanvasInstance } from "@p5-wrapper/react";

export type ISketchProps<ParamKey extends string = string> = {
  [K in ParamKey]: number;
} & { playing: boolean };

export type ISketchFactory<ParamKey extends string = string> = (
  width: number,
  height: number,
  randomSeed: number,
  timeShift: number // nice game btw
) => (p: P5CanvasInstance<ISketchProps<ParamKey>>) => void;

interface IControlBase {
  label?: string;
  defaultValue: number;
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

export type IParams<ParamKey extends string = string> = Record<
  ParamKey,
  number
>;

export type IControl = IRangeControl | IBooleanControl;

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
  controls?: IControls<ParamKey>;
  presets?: IPreset<ParamKey>[];
}
