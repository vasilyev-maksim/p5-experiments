import { useCallback, useMemo, useRef, useState } from "react";
import { EventBus } from "@/core/EventBus";
import type { SketchEvent } from "@/core/events";
import { ActiveSketchContext } from "./ActiveSketchContext";
import { getActivePresetFromUrl, setPresetDataToUrl } from "@utils/url";
import { getRandomParams } from "@utils/sketch";
import type { IPreset, ISketch } from "@/models";

const EXPORT_WIDTH = 336,
  EXPORT_HEIGHT = 216;

export function ActiveSketchProvider({
  children,
  activeSketch,
}: {
  children: React.ReactNode;
  activeSketch: ISketch;
}) {
  const eventBus = useRef<EventBus<SketchEvent>>(new EventBus());
  const initialActivePreset = getActivePresetFromUrl(activeSketch);
  const [paused, setPaused] = useState(true);
  const [params, setParams] = useState(initialActivePreset.params);
  const [timeDelta, setTimeDelta] = useState(initialActivePreset.timeDelta);

  const sendEvent = (...args: Parameters<EventBus<SketchEvent>["emit"]>) => {
    eventBus.current.emit(...args);
  };

  const getActivePreset = useCallback(
    () => getActivePresetFromUrl(activeSketch),
    [activeSketch],
  );

  const changeTimeDelta = useCallback((newTimeDelta: number) => {
    sendEvent({ type: "timeDeltaChange", timeDelta: newTimeDelta });
    setTimeDelta(newTimeDelta);
  }, []);

  const changeParam = useCallback(
    (paramName: string, paramValue: number | boolean | [number, number]) => {
      sendEvent({ type: "paramChange", paramName, paramValue });
      const newParams = { ...params, [paramName]: paramValue };
      setParams(newParams);
      setPresetDataToUrl({ type: "serialized", params: newParams, timeDelta });
    },
    [timeDelta, params],
  );

  const playPause = useCallback(() => {
    sendEvent({ type: "playPause", paused: !paused });
    setPaused(!paused);
  }, [paused]);

  const jumpNFrames = useCallback(
    (N: number) => () => {
      setPaused(true);
      sendEvent({ type: "timeTravel", timeShift: N });
    },
    [],
  );

  const playWithCustomDelta = useCallback(
    (newTimeDelta: number) => () => {
      sendEvent({ type: "timeDeltaChange", timeDelta: newTimeDelta });
      sendEvent({ type: "playPause", paused: false });
    },
    [],
  );

  const stopPlayingWithCustomDelta = useCallback(() => {
    sendEvent({ type: "timeDeltaChange", timeDelta });
    sendEvent({ type: "playPause", paused: true });
  }, [timeDelta]);

  const randomizeParams = useCallback(() => {
    const randomParams = getRandomParams(activeSketch.controls);
    sendEvent({ type: "paramsChange", params: randomParams });
    setParams(randomParams);
    setPresetDataToUrl({ type: "serialized", params: randomParams, timeDelta });
  }, [activeSketch.controls, timeDelta]);

  const exportToFile = useCallback(() => {
    sendEvent({
      type: "export",
      exportFileWidth: EXPORT_WIDTH,
      exportFileHeight: EXPORT_HEIGHT,
      exportFileName: `${activeSketch.id}_wallpaper.jpg`,
    });
  }, [activeSketch.id]);

  const spinUp = useCallback(() => {
    sendEvent({ type: "modeChange", mode: "animated" });
    sendEvent({ type: "playPause", paused: false });
    setPaused(false);
  }, []);

  const applyPreset = useCallback(
    (preset: IPreset, { updateUrl }: { updateUrl: boolean }) => {
      sendEvent({ type: "applyPreset", preset });
      setParams(preset.params);
      setTimeDelta(preset.timeDelta);
      if (updateUrl) {
        setPresetDataToUrl({ type: "pid", pid: preset.name });
      }
    },
    [],
  );

  const ctxValue = useMemo(
    () => ({
      activeSketch,
      eventBus: eventBus.current,
      paused,
      setPaused,
      params,
      setParams,
      timeDelta,
      setTimeDelta,
      getActivePreset,
      changeTimeDelta,
      changeParam,
      playPause,
      jumpNFrames,
      playWithCustomDelta,
      stopPlayingWithCustomDelta,
      randomizeParams,
      exportToFile,
      spinUp,
      applyPreset,
    }),
    [
      activeSketch,
      paused,
      params,
      timeDelta,
      getActivePreset,
      changeTimeDelta,
      changeParam,
      playPause,
      jumpNFrames,
      playWithCustomDelta,
      stopPlayingWithCustomDelta,
      randomizeParams,
      exportToFile,
      spinUp,
      applyPreset,
    ],
  );

  return (
    <ActiveSketchContext.Provider value={ctxValue}>
      {children}
    </ActiveSketchContext.Provider>
  );
}
