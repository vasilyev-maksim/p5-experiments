import { describe, expect, test } from "vitest";
import { setPresetDataToQs, getPresetDataFromQs, setParamToQs } from "./url";
import type { IParams } from "@/models";

describe("url utils", () => {
  describe("setPresetDataToQs", () => {
    test("serialized", () => {
      const qs = new URLSearchParams({
        oldProp: "oldProp",
      });
      const params: IParams = {
        NUM: 0,
        NUM2: 0.45,
        NUM3: 490,
        NUM4: -490,
        BOOL: true,
        BOOL2: false,
        ARR2: [-1.222, 2.282],
      };
      const timeDelta = 1;

      setPresetDataToQs({ type: "serialized", params, timeDelta }, qs);

      expect(qs.toString()).toMatchInlineSnapshot(
        `"oldProp=oldProp&p_NUM=0&p_NUM2=0.45&p_NUM3=490&p_NUM4=-490&p_BOOL=true&p_BOOL2=false&p_ARR2%5B0%5D=-1.222&p_ARR2%5B1%5D=2.282&timeDelta=1"`,
      );
    });

    test("pid", () => {
      const qs = new URLSearchParams({
        oldProp: "oldProp",
      });
      setPresetDataToQs({ type: "pid", pid: "testPid" }, qs);

      expect(qs.toString()).toMatchInlineSnapshot(
        `"oldProp=oldProp&pid=testPid"`,
      );
    });
  });

  describe("getPresetDataFromQs", () => {
    test("default case", () => {
      const qs = new URLSearchParams(
        "p_NUM=0&p_NUM2=0.45&p_NUM3=490&p_NUM4=-490&p_BOOL=true&p_BOOL2=false&p_ARR2%5B0%5D=-1.222&p_ARR2%5B1%5D=2.282&timeDelta=1",
      );

      expect(getPresetDataFromQs(qs)).toMatchInlineSnapshot(`
      {
        "params": {
          "ARR2": [
            -1.222,
            2.282,
          ],
          "BOOL": true,
          "BOOL2": false,
          "NUM": 0,
          "NUM2": 0.45,
          "NUM3": 490,
          "NUM4": -490,
        },
        "timeDelta": 1,
        "type": "serialized",
      }
    `);
    });

    test("returns null", () => {
      const qs = new URLSearchParams("timeDelta=1");

      expect(getPresetDataFromQs(qs)).toBeNull();
    });
  });

  test("setParamToQs", () => {
    const qs = new URLSearchParams({
      oldPropKey: "oldPropValue",
    });
    setParamToQs("testKey", "testValue", qs);
    expect(qs.toString()).toMatchInlineSnapshot(
      `"oldPropKey=oldPropValue&p_testKey=testValue"`,
    );
    setParamToQs("testArrKey", [1, 2, 3], qs);
    expect(qs.toString()).toMatchInlineSnapshot(
      `"oldPropKey=oldPropValue&p_testKey=testValue&p_testArrKey%5B0%5D=1&p_testArrKey%5B1%5D=2&p_testArrKey%5B2%5D=3"`,
    );
  });
});
