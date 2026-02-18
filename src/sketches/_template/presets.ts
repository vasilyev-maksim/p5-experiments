import type { IPreset } from "@/models";
import type { Controls } from "./controls";

export const presets: IPreset<Controls>[] = [
  {
    params: {
      N: 1,
      NA: 1,
    },
    timeDelta: 1,
  },
];
