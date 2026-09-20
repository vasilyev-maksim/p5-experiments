import { EventBus } from "@/core/EventBus";
import type { SketchEvent } from "@/core/events";
import type { IControls, IParams, IPreset, ISketch } from "@/models";
import { noop } from "@utils/misc";
import { createContext } from "react";

type ActiveSketchContextValue = {
  activeSketch: ISketch;
  eventBus: EventBus<SketchEvent>;
  paused: boolean;
  setPaused: React.Dispatch<React.SetStateAction<boolean>>;
  params: IParams;
  setParams: React.Dispatch<React.SetStateAction<IParams>>;
  timeDelta: number;
  setTimeDelta: React.Dispatch<React.SetStateAction<number>>;
  getActivePreset: () => IPreset;
  changeTimeDelta: (timeDelta: number) => void;
  changeParam: (
    paramName: string,
    paramValue: number | boolean | [number, number],
  ) => void;
  playPause: () => void;
  jumpNFrames: (N: number) => void;
  playWithCustomDelta: (timeDelta: number) => void;
  stopPlayingWithCustomDelta: () => void;
  randomizeParams: () => IParams<IControls>;
  exportToFile: () => void;
  spinUp: () => void;
  applyPreset: (preset: IPreset, opts: { updateUrl: boolean }) => void;
};

export const ActiveSketchContext = createContext<ActiveSketchContextValue>({
  activeSketch: null as any,
  eventBus: null as any,
  paused: true,
  setPaused: noop,
  params: {},
  setParams: noop,
  timeDelta: 1,
  setTimeDelta: noop,
  getActivePreset: noop as any,
  changeTimeDelta: noop,
  changeParam: noop,
  playPause: noop,
  jumpNFrames: () => noop,
  playWithCustomDelta: () => noop,
  stopPlayingWithCustomDelta: noop,
  randomizeParams: noop as any,
  exportToFile: noop,
  spinUp: noop,
  applyPreset: noop,
});
