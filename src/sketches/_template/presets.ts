import type { IPreset } from "@/models";
import type { Controls } from "./controls";

export const presets: IPreset<Controls>[] = [
  {
    params: {
      TIME_DELTA: 1,
    },
  },
];
