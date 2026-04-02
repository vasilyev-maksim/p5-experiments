import { describe, expect, test } from "vitest";
import { addPresetDataToQs, readPresetFromQs } from "./preset";
import type { IPreset } from "@/models";

describe("preset utils", () => {
  test("presetQueryParamsString", () => {
    const qs = new URLSearchParams({
      oldProp: "oldProp",
    });
    const preset: IPreset = {
      params: {
        NUM: 0,
        NUM2: 0.45,
        NUM3: 490,
        NUM4: -490,
        BOOL: true,
        BOOL2: false,
        ARR2: [-1.222, 2.282],
      },
      name: "test", // should will be ignored
      timeDelta: 1,
    };

    expect(addPresetDataToQs(preset, qs)).toMatchInlineSnapshot(
      
    `"oldProp=oldProp&NUM=0&NUM2=0.45&NUM3=490&NUM4=-490&BOOL=true&BOOL2=false&ARR2%5B0%5D=-1.222&ARR2%5B1%5D=2.282&timeDelta=1"`);
  });

  test("readPresetFromQs", () => {
    const qs = new URLSearchParams(
      "NUM=0&NUM2=0.45&NUM3=490&NUM4=-490&BOOL=true&BOOL2=false&ARR2%5B0%5D=-1.222&ARR2%5B1%5D=2.282&timeDelta=1",
    );

    expect(readPresetFromQs(qs)).toMatchInlineSnapshot(`
      {
        "ARR2": [
          -1.222,
          2.282,
        ],
        "BOOL": true,
        "BOOL2": true,
        "NUM": 0,
        "NUM2": 0.45,
        "NUM3": 490,
        "NUM4": -490,
        "timeDelta": 1,
      }
    `);
  });
});
