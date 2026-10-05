import type { IScenario } from "@/models";
import { changePresetFactory, delay } from "@/utils/sketch";
import { presets } from "./presets";

const changePreset = changePresetFactory(presets);

export const scenarios: IScenario[] = [
  {
    name: "trailer",
    fn: function* () {
      yield changePreset("tiles", {
        timeDelta: 5,
        startTime: -30,
        params: {
          ANIMATION_DELAY: 500,
          ANIMATION_DURATION: 180,
        },
      });
      yield delay(3000);
      yield changePreset("forest fire", {
        timeDelta: 3.5,
        startTime: 0,
        params: {
          ANIMATION_DELAY: 500,
          ANIMATION_DURATION: 180,
        },
      });
      yield delay(3000);
      yield changePreset("frames", {
        timeDelta: 2,
        startTime: 250,
      });
      yield delay(3000);
      yield changePreset("wes", {
        timeDelta: 1.5,
        startTime: 300,
      });
      yield delay(3000);
      yield changePreset("bricks", {
        timeDelta: 2.1,
        params: {
          ANIMATION_DELAY: 600,
          ANIMATION_DURATION: 100,
        },
      });
      yield delay(3000);
      yield changePreset("mosaic", {
        timeDelta: 3.2,
        params: {
          ANIMATION_DELAY: 500,
          ANIMATION_DURATION: 100,
        },
      });
      yield delay(3000);
      yield changePreset("epicenter", {
        timeDelta: 3.5,
        startTime: 100,
      });
    },
  },
];
