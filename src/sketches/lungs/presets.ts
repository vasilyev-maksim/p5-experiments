import type { IPreset } from "@/models";
import type { Params } from "./controls";

export const presets: IPreset<Params>[] = [
  {
    params: {
      RESOLUTION: 40,
      COLOR: 0,
      ZOOM: 1,
      ROTATION_SPEED: 20,
      COIL_FACTOR: 1,
      COIL_SPEED: 1,
      GAP: 1,
    },
  },
  {
    params: {
      RESOLUTION: 45,
      COLOR: 2,
      ZOOM: 1,
      ROTATION_SPEED: 46,
      COIL_FACTOR: 176,
      COIL_SPEED: 0,
      GAP: 35,
    },
    name: "4 tornado",
  },
  {
    params: {
      RESOLUTION: 45,
      COLOR: 1,
      ZOOM: 1,
      ROTATION_SPEED: 15,
      COIL_FACTOR: 346,
      COIL_SPEED: 0,
      GAP: 35,
    },
  },
];
