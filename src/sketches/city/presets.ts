import type { IPreset } from "@/models";
import type { Params } from ".";

export const presets: IPreset<Params>[] = [
  {
    params: {
      N: 0.1,
      NInt: 3,
    },
  },
  {
    params: {
      N: 1,
      NInt: 5,
    },
  },
];
