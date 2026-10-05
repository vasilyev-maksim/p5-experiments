import type { IScenario } from "@/models";
import { changePresetFactory, delay as delay } from "@/utils/sketch";
import { presets } from "./presets";

const changePreset = changePresetFactory(presets);

export const scenarios: IScenario[] = [
  {
    name: "trailer",
    fn: function* () {
      yield changePreset("toxic", { params: { ROTATION_SPEED: 10 } });
      yield delay(2900);
      yield changePreset("purple lambo");
      yield delay(3000);
      yield changePreset("spiderverse");
      yield delay(3000);
      yield changePreset("radiation", {
        timeDelta: 1.5,
        startTime: 800,
      });
      yield delay(3000);
      yield changePreset("spiral", { timeDelta: 1.5 });
      yield delay(3000);
      yield changePreset("black hole");
      yield delay(3000);
      yield changePreset("glimmer");
      yield delay(2900);
      yield changePreset("subatomic");
      yield delay(3000);
      yield changePreset("carousel");
      yield delay(3000);
      yield changePreset("mandala", { params: { ROTATION_SPEED: 10 } });
      yield delay(3000);
      yield changePreset("whirlpool");
      yield delay(3000);
      yield changePreset("space odyssey");
      yield delay(3000);
    },
  },
];
