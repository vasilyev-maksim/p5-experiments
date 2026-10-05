import type { IScenario } from "@/models";
import { changePresetFactory, delay } from "@/utils/sketch";
import { presets } from "./presets";

const changePreset = changePresetFactory(presets);

export const scenarios: IScenario[] = [
  {
    name: "trailer",
    fn: function* () {
      yield changePreset("worms", {
        timeDelta: 2.4,
        params: {
          ANIMATION_TYPE: 3,
        },
      });
      yield delay(3000);
      yield changePreset("guts", {
        timeDelta: 2.2,
        // startTime: 200,
        params: {
          ANIMATION_TYPE: 3,
        },
      });
      yield delay(3000);
      yield changePreset("symmetry", {
        timeDelta: 2.3,
        params: {
          ANIMATION_TYPE: 3,
        },
      });
      yield delay(3000);
      yield changePreset("carpet", {
        timeDelta: 2.3,
        params: {
          ANIMATION_TYPE: 3,
        },
      });
      yield delay(3000);
      yield changePreset("core", {
        timeDelta: 2.2,
        startTime: 0,
        params: {
          ANIMATION_TYPE: 3,
        },
      });
    },
  },
];
