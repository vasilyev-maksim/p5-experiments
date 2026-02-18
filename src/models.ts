/* eslint-disable @typescript-eslint/no-explicit-any */
import type { P5CanvasInstance } from "@p5-wrapper/react";
import type { EventBus } from "./core/EventBus";
import type { SketchEvent } from "./core/events";

/** -1 = not visible in UI;
 * 0 = visible in UI, initially turned OFF;
 * 1 = visible in UI, initially turned ON */
export enum FeatureState {
  Disabled = -1,
  Off = 0,
  On = 1,
}

/** Controls */

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
  options?: [string, string]; // default value is ['Nope', 'Yeap']
}

export interface IColorControl extends IControlBase {
  type: "color";
  colors: string[][];
  shuffle?: FeatureState;
  shuffleSwitchLabel?: string;
}

export interface IChoiceControl extends IControlBase {
  type: "choice";
  options: string[];
}

export interface ICoordinateControl extends IControlBase {
  type: "coordinates";
}

export type IControl =
  | IRangeControl
  | IBooleanControl
  | IColorControl
  | IChoiceControl
  | ICoordinateControl;

export type ControlValueType<T extends IControl> = T extends ICoordinateControl
  ? [number, number]
  : T extends IBooleanControl
    ? boolean
    : number;

export type IControls = Record<string, IControl>;

/** Sketch factory */
export type ParamName<Controls extends IControls> = keyof IParams<Controls>;
export type IParams<Controls extends IControls = IControls> = {
  [K in keyof Controls]: ControlValueType<Controls[K]>;
};

export type SketchMode = "static" | "animated";

export interface ISketchInitData<Controls extends IControls = IControls> {
  params: IParams<Controls>;
  mode: SketchMode;
  paused: boolean;
  startTime?: number;
  timeDelta: number;
  canvasWidth: number;
  canvasHeight: number;
  randomSeed?: number;
}

export type ISketchFactory<Controls extends IControls> = (args: {
  initData: ISketchInitData<Controls>;
  id?: string;
  eventBus?: EventBus<SketchEvent<Controls>>;
}) => (p: P5CanvasInstance) => void;

export type IPreset<Controls extends IControls = any> = {
  name?: string;
  params: IParams<Controls>;
  startTime?: number;
  randomSeed?: number;
  timeDelta: number;
};

export interface ISketch<Controls extends IControls = IControls> {
  name: string;
  id: string;
  preview: {
    size: number;
  };
  factory: ISketchFactory<Controls>;
  randomSeed?: number;
  controls: Controls;
  presets: IPreset<Controls>[];
  presetsShuffle?: FeatureState;
  presetsShuffleInterval?: number;
  startTime?: number;
  type: "released" | "draft" | "hidden";
}

export type SketchCanvasSize = "tile" | "modal" | "fullscreen";
