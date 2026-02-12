import type { IPreset } from "@/models";
import type { Controls } from "./controls";

export const presets: IPreset<Controls>[] = [
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
