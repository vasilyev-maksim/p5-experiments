import type { IScenario } from "@/models";
import { changePresetFactory, delay } from "@/utils/sketch";
import { presets } from "./presets";

const changePresetAction = changePresetFactory(presets);

export const scenarios: IScenario[] = [
  {
    name: "trailer",
    fn: function* () {
      yield changePresetAction("signal", {
        timeDelta: 1,
      });
      yield delay(3000);
      yield changePresetAction("nature");
      yield delay(6000);
      yield changePresetAction("cats", {
        timeDelta: 2,
      });
      yield delay(3000);
      yield changePresetAction("drill");
      yield delay(3000);
      yield changePresetAction("turbulence", {
        startTime: 460,
      });
    },
  },
];
