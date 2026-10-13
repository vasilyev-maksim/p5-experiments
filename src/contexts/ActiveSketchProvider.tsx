import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EventBus } from "@/core/EventBus";
import type { SketchEvent } from "@/core/events";
import { ActiveSketchContext } from "./ActiveSketchContext";
import { getActivePresetFromUrl, setPresetDataToUrl } from "@utils/url";
import { getRandomParams } from "@utils/sketch";
import type { IPreset, IScenario, ISketch } from "@/models";
import { checkExhaustiveness, delay } from "@/utils/misc";
import { MODAL_OPEN_SEQUENCE } from "@/animations";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useSequence } from "@/sequencer";

// const EXPORT_WIDTH = 2556, EXPORT_HEIGHT = 1179; // IPhone 15 res
const EXPORT_WIDTH = 3840,
  EXPORT_HEIGHT = 2160;

export function ActiveSketchProvider({
  children,
  activeSketch,
}: {
  children: React.ReactNode;
  activeSketch: ISketch;
}) {
  const scenarioRunIndex = useRef(0);
  const [eventBus] = useState<EventBus<SketchEvent>>(() => new EventBus()); // acts like useRef
  const initialActivePreset = getActivePresetFromUrl(activeSketch);
  const [paused, setPaused] = useState(true);
  const [params, setParams] = useState(initialActivePreset.params);
  const [timeDelta, setTimeDelta] = useState(initialActivePreset.timeDelta);
  const { start, reset } = useSequence(MODAL_OPEN_SEQUENCE);
  const { sendAnalyticsEvent } = useAnalytics();

  const sketchOpenAnimationContext = useMemo(
    () => ({
      controlsPresent: Object.entries(activeSketch?.controls ?? {}).length > 0,
      presetsPresent: (activeSketch?.presets?.length ?? 0) > 0,
    }),
    [activeSketch?.controls?.length, activeSketch?.presets?.length],
  );

  // sketch open animation start/interrupt
  useEffect(() => {
    if (activeSketch) {
      start(sketchOpenAnimationContext);
      sendAnalyticsEvent("sketch opened", { activeSketchId: activeSketch.id });
    }
    return reset;
  }, [activeSketch, sketchOpenAnimationContext]);

  const sendEvent = (
    ...args: Parameters<EventBus<SketchEvent>["dispatch"]>
  ) => {
    eventBus.dispatch(...args);
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
      setPresetDataToUrl({
        type: "serialized",
        params: newParams,
        timeDelta,
      });
    },
    [timeDelta, params],
  );

  const playPause = useCallback(() => {
    sendEvent({ type: "playPause", paused: !paused });
    setPaused(!paused);
  }, [paused]);

  const jumpNFrames = useCallback((N: number) => {
    sendEvent({ type: "playPause", paused: true });
    setPaused(true);
    sendEvent({ type: "timeTravel", timeShift: N });
  }, []);

  const playWithCustomDelta = useCallback((newTimeDelta: number) => {
    sendEvent({ type: "timeDeltaChange", timeDelta: newTimeDelta });
    sendEvent({ type: "playPause", paused: false });
  }, []);

  const stopPlayingWithCustomDelta = useCallback(() => {
    sendEvent({ type: "timeDeltaChange", timeDelta });
    sendEvent({ type: "playPause", paused: true });
  }, [timeDelta]);

  const randomizeParams = useCallback(() => {
    const randomParams = getRandomParams(activeSketch.controls);
    sendEvent({ type: "paramsChange", params: randomParams });
    setParams(randomParams);
    setPresetDataToUrl({
      type: "serialized",
      params: randomParams,
      timeDelta,
    });
    return randomParams;
  }, [activeSketch.controls, timeDelta]);

  const exportToFile = useCallback(() => {
    const activePreset = getActivePreset();

    sendEvent({
      type: "export",
      exportFileWidth: EXPORT_WIDTH,
      exportFileHeight: EXPORT_HEIGHT,
      exportFileName: [activeSketch.id, activePreset.name, "wallpaper.jpg"]
        .filter(Boolean)
        .join("_"),
    });
  }, [activeSketch.id, getActivePreset]);

  const scenarioRunner = async (
    scenario: IScenario["fn"],
    eventBus: EventBus<SketchEvent>,
  ) => {
    const generator = scenario();
    const initialRunIndex = ++scenarioRunIndex.current;

    for (const action of generator) {
      if (scenarioRunIndex.current !== initialRunIndex) {
        return;
      }

      switch (action.type) {
        case "delay":
          await delay(action.duration);
          break;
        case "sketchEvent":
          eventBus.dispatch(action.event);
          break;
        default:
          checkExhaustiveness(action);
      }
    }
  };

  const playScenario = useCallback((scenario: IScenario) => {
    scenarioRunner(scenario.fn, eventBus);
  }, []);

  const interruptScenario = () => {
    scenarioRunIndex.current += 1;
  };

  // interrupt running scenario on modal close/unmount
  useEffect(() => interruptScenario, []);

  const spinUp = useCallback(() => {
    sendEvent({ type: "modeChange", mode: "animated" });
    sendEvent({ type: "playPause", paused: false });
    setPaused(false);
  }, []);

  const applyPreset = useCallback(
    (preset: IPreset, { updateUrl }: { updateUrl: boolean }) => {
      interruptScenario();
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
      eventBus,
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
      playScenario,
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
      eventBus,
      playScenario,
    ],
  );

  return (
    <ActiveSketchContext.Provider value={ctxValue}>
      {children}
    </ActiveSketchContext.Provider>
  );
}
