/* eslint-disable @typescript-eslint/no-explicit-any */
import type { P5CanvasInstance } from "@p5-wrapper/react";
import type { EventBus } from "./core/EventBus";

/** Events */

type EventBase = {
  id?: number;
};

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

export type TestEvent = {
  type: "test";
  test: true;
};

export type SketchEvent = EventBase &
  (ExportRequestEvent | PresetChangeEvent | TestEvent);

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

export type IParams<Controls extends IControls = any> = {
  [K in keyof Controls]: ControlValueType<Controls[K]>;
} & { timeDelta?: number };

export type ISketchProps<Controls extends IControls = IControls> =
  IParams<Controls> & {
    mode: "static" | "animated";
    paused: boolean;
    timeShift?: number;
    timeDelta: number;
    canvasWidth: number;
    canvasHeight: number;
    randomSeed: number;
    event?: SketchEvent;
    eventBus?: EventBus;
  };

export type ISketchFactory<Controls extends IControls> = (args: {
  initialProps: ISketchProps<Controls>;
  id?: string;
}) => (p: P5CanvasInstance<ISketchProps<Controls>>) => void;

export type IPreset<Controls extends IControls = any> = {
  name?: string;
  params: IParams<Controls>;
  startTime?: number;
  randomSeed?: number;
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
