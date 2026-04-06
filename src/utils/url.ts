import type { IParams, IPreset, ISketch } from "@/models";
import { assert } from "./misc";
import { getDefaultPreset } from "./sketch";

const PARAM_PREFIX = "p_";
const PRESET_ID_KEY = "pid";
const TIME_DELTA_KEY = "timeDelta";
const SKETCH_ID_KEY = "sid";

const baseUrl = import.meta.env.BASE_URL;

export type IPresetUrlData =
  | {
      type: "pid";
      pid: string;
    }
  | {
      type: "serialized";
      params: IParams;
      timeDelta: number;
    };

export function setParamToQs(
  paramName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paramValue: any,
  qs: URLSearchParams,
) {
  const key = PARAM_PREFIX + paramName;

  if (Array.isArray(paramValue)) {
    paramValue.forEach((x, i) => {
      qs.set(`${key}[${i}]`, x.toString());
    });
  } else {
    qs.set(key, paramValue.toString());
  }
}

export function setPresetDataToQs(
  presetData: IPresetUrlData,
  qs: URLSearchParams,
) {
  if (presetData.type === "pid") {
    // remove serialized
    Array.from(qs.keys()).forEach((key) => {
      if (key.startsWith(PARAM_PREFIX)) {
        qs.delete(key);
      }
    });
    qs.delete(TIME_DELTA_KEY);

    qs.set(PRESET_ID_KEY, presetData.pid);
  } else {
    // remove pid
    qs.delete(PRESET_ID_KEY);

    Object.entries(presetData.params).forEach(([key, value]) => {
      setParamToQs(key, value, qs);
    });
    qs.set(TIME_DELTA_KEY, presetData.timeDelta.toString());
  }
}

export function getPresetDataFromQs(
  qs: URLSearchParams,
): IPresetUrlData | null {
  const presetId = qs.get(PRESET_ID_KEY);

  if (presetId) {
    return { type: PRESET_ID_KEY, pid: presetId };
  } else {
    let timeDelta: number = 1;
    const params: IParams = {};

    qs.forEach((valueStr, name) => {
      const val =
        valueStr === "true" || valueStr === "false"
          ? Boolean(valueStr)
          : Number(valueStr);

      if (name === TIME_DELTA_KEY) {
        assert(typeof val === "number", `${TIME_DELTA_KEY} should be a number`);
        timeDelta = val;
      } else if (name.startsWith(PARAM_PREFIX)) {
        const paramName = name.replace(PARAM_PREFIX, "");

        if (paramName.includes("[")) {
          assert(typeof val === "number", "numerical arrays only");
          const arrayParamName = paramName.split("[")?.[0];

          if (params[arrayParamName] && Array.isArray(params[arrayParamName])) {
            params[arrayParamName].push(val);
          } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            params[arrayParamName] = [val] as any;
          }
        } else {
          params[paramName] = val;
        }
      }
    });

    return Object.keys(params).length > 0
      ? { params, timeDelta, type: "serialized" }
      : null;
  }
}

export function setPresetDataToUrl(presetData: IPresetUrlData) {
  const qs = new URLSearchParams(location.search);
  setPresetDataToQs(presetData, qs);
  // Note: browsers throttle `history.pushState` on continuous updates (programmatically triggered),
  // silently reverting to `replaceState`, so nav back button doesn't work as expected
  history.pushState({}, "", `${baseUrl}?${qs.toString()}`);
}

export function getPresetDataFromUrl() {
  const qs = new URLSearchParams(location.search);
  return getPresetDataFromQs(qs);
}

export function getActivePresetFromUrl(sketch: ISketch): IPreset {
  let result = getDefaultPreset(sketch);
  const presetData = getPresetDataFromUrl();

  if (presetData) {
    if (presetData.type === "pid") {
      const found = sketch.presets.find((x) => x.name === presetData.pid);
      if (found) {
        result = found;
      }
    } else {
      result = {
        params: presetData?.params,
        timeDelta: presetData?.timeDelta,
        name: "",
      };
    }
  }

  return result;
}

export function setSketchToUrl(sketch: ISketch) {
  const qs = new URLSearchParams(location.search);
  qs.set(SKETCH_ID_KEY, sketch.id);
  const preset = getDefaultPreset(sketch);
  setPresetDataToQs({ type: "pid", pid: preset.name }, qs);
  history.pushState({}, "", `${baseUrl}?${qs.toString()}`);
}

export function setParamToUrl(
  paramName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paramValue: any,
) {
  const qs = new URLSearchParams(location.search);
  setParamToQs(paramName, paramValue, qs);
  history.pushState({}, "", `${baseUrl}?${qs.toString()}`);
}

export function removeSketchDataFromUrl() {
  // yes, it's super naive
  history.pushState({}, "", location.origin + baseUrl);
}

export function getSketchIdFromUrl() {
  return new URLSearchParams(location.search).get(SKETCH_ID_KEY);
}

export function getActiveSketchFromUrl(sketchList: ISketch[]) {
  const activeSketchId = getSketchIdFromUrl();
  return sketchList.find((x) => x.id === activeSketchId);
}
