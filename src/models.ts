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

interface IControlBase<ParamKey extends string = string> {
  key: ParamKey;
  label?: string;
  defaultValue: number;
  valueFormatter?: (value: number, control: IControl) => string;
}

export interface IRangeControl<ParamKey extends string = string>
  extends IControlBase<ParamKey> {
  type: "range";
  min: number;
  max: number;
  step: number;
}

export type IParams<ParamKey extends string = string> = Record<
  ParamKey,
  number
>;

export type IControl<ParamKey extends string = string> =
  IRangeControl<ParamKey>;

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
  controls?: IControl<ParamKey>[];
  presets?: IPreset<ParamKey>[];
}
