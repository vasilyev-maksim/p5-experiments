import { useRerender } from "@/hooks/index";
import type { ISketch, IPreset, IParams } from "@/models";
import { addPresetDataToQs, readPresetFromQs } from "@/utils/preset";
import { useEffect } from "react";

const baseUrl = import.meta.env.BASE_URL;

export function useUrlSketch() {
  const rerender = useRerender();

  const getSketchIdFromUrl = () =>
    new URLSearchParams(location.search).get("sid");
  const setSketchIdInUrl = (sketch: ISketch) => {
    const qs = new URLSearchParams(location.search);
    qs.set("sid", sketch.id);
    history.pushState({}, "", `${baseUrl}?${qs.toString()}`);
    rerender();
  };

  const removeSketchDataFromUrl = () => {
    history.pushState({}, "", location.origin + baseUrl);
    rerender();
  };

  return {
    getSketchIdFromUrl,
    setSketchIdInUrl,
    removeSketchDataFromUrl,
  };
}

/** gets/sets preset `params` and `timeDelta` from/in url */
export function useUrlPreset() {
  const setPresetInUrl = (preset: IPreset) => {
    const qs = new URLSearchParams(location.search);
    addPresetDataToQs(preset, qs);
    // Note: browsers throttle history.pushState on continuous updates (slider/animation), silently reverting to replaceState
    history.pushState({}, "", `${baseUrl}?${qs.toString()}`);
  };

  const getPresetFromUrl = () => {
    const qs = new URLSearchParams(location.search);
    return readPresetFromQs(qs);
  };

  return {
    setPresetInUrl,
    getPresetFromUrl,
  };
}

/** keeps preset's `params` and `timeDelta` in sync with URL */
export function useUrlPresetSync(params: IParams, timeDelta: number) {
  const { setPresetInUrl } = useUrlPreset();

  useEffect(() => {
    setPresetInUrl({
      params,
      timeDelta,
      name: "",
    });
  }, [params, timeDelta]);
}

/** triggers re-render on browser back/forward navigation */
export function usePopStateSync(handler?: () => void) {
  const rerender = useRerender();

  useEffect(() => {
    console.log("effect");

    const listener = () => {
      console.log("listener");
      handler?.();
      rerender();
    };

    window.addEventListener("popstate", listener);

    return () => {
      console.log("dispose");
      window.removeEventListener("popstate", listener);
    };
  }, []);
}
