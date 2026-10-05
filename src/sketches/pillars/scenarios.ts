import type { IScenario } from "@/models";
import { changePresetFactory, delay } from "@/utils/sketch";
import { presets } from "./presets";

const changePresetAction = changePresetFactory(presets);

export const scenarios: IScenario[] = [
  {
    name: "trailer",
    fn: function* () {
      yield changePresetAction("looks uneven", { timeDelta: 1.5 });
      yield delay(3000);
      yield changePresetAction("lava lamp");
      yield delay(3000);
      yield changePresetAction("rush hour", { timeDelta: 1.5 });
      yield delay(3000);
      yield changePresetAction("dragon");
      yield delay(3000);
      yield changePresetAction("scoliosis", { timeDelta: 4 });
      yield delay(3000);
      yield changePresetAction("wave");
    },
  },
];
