import { EventBus } from "@/core/EventBus";
import type { SketchEvent } from "@/core/events";
import type { IParams, IPreset, ISketch } from "@/models";
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
  jumpNFrames: (N: number) => () => void;
  playWithCustomDelta: (timeDelta: number) => () => void;
  stopPlayingWithCustomDelta: () => void;
  randomizeParams: () => void;
  exportToFile: () => void;
  spinUp: () => void;
  applyPreset: (preset: IPreset, opts: { updateUrl: boolean }) => void;
};

export const ActiveSketchContext = createContext<ActiveSketchContextValue>({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeSketch: null as any,
  eventBus: new EventBus(),
  paused: true,
  setPaused: noop,
  params: {},
  setParams: noop,
  timeDelta: 1,
  setTimeDelta: noop,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getActivePreset: noop as any,
  changeTimeDelta: noop,
  changeParam: noop,
  playPause: noop,
  jumpNFrames: () => noop,
  playWithCustomDelta: () => noop,
  stopPlayingWithCustomDelta: noop,
  randomizeParams: noop,
  exportToFile: noop,
  spinUp: noop,
  applyPreset: noop,
});
