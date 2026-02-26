import type {
  IControls,
  IParams,
  IPreset,
  ParamName,
  SketchMode,
} from "@/models";

type EventBase = {
  id?: number;
};

export type ExportRequestEvent = {
  type: "export";
  exportFileName: string;
  exportFileWidth: number;
  exportFileHeight: number;
};

export type ApplyPresetEvent<Controls extends IControls> = {
  type: "applyPreset";
  preset: IPreset<Controls>;
};

export type ParamChangeEvent<Controls extends IControls> = {
  type: "paramChange";
  paramName: ParamName<Controls>;
  paramValue: IParams<Controls>[string];
};

export type ParamsChangeEvent<Controls extends IControls> = {
  type: "paramsChange";
  params: IParams<Controls>;
};

export type ModeChangeEvent = {
  type: "modeChange";
  mode: SketchMode;
};

export type TimeDeltaChangeEvent = {
  type: "timeDeltaChange";
  timeDelta: number;
};

export type TimeTravelEvent = {
  type: "timeTravelEvent";
  timeShift: number;
};

export type CanvasSizeChangeEvent = {
  type: "canvasSizeChangeEvent";
  canvasWidth: number;
  canvasHeight: number;
};

export type PlayPauseEvent = {
  type: "playPauseEvent";
  paused: boolean;
};

export type SketchEvent<Controls extends IControls = IControls> = EventBase &
  (
    | ExportRequestEvent
    | ApplyPresetEvent<Controls>
    | ParamChangeEvent<Controls>
    | ParamsChangeEvent<Controls>
    | ModeChangeEvent
    | TimeDeltaChangeEvent
    | TimeTravelEvent
    | CanvasSizeChangeEvent
    | PlayPauseEvent
  );
