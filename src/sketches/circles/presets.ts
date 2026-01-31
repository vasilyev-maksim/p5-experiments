import type { IPreset } from "@/models";
import type { Params } from "./controls";

export const presets: IPreset<Params>[] = [
  {
    params: {
      RESOLUTION: 30,
      COLOR: 0,
      ZOOM: 1,
      ROTATION_SPEED: 29,
      COIL_FACTOR: 12,
      COIL_SPEED: 0,
      GAP: 14,
    },
    name: "heart",
  },
  {
    params: {
      RESOLUTION: 45,
      COLOR: 1,
      ZOOM: 1,
      ROTATION_SPEED: 30,
      COIL_FACTOR: 176,
      COIL_SPEED: 0,
      GAP: 35,
    },
    name: "4 tornado",
  },
  {
    params: {
      RESOLUTION: 45,
      COLOR: 2,
      ZOOM: 1,
      ROTATION_SPEED: 15,
      COIL_FACTOR: 346,
      COIL_SPEED: 0,
      GAP: 35,
    },
  },
  {
    params: {
      RESOLUTION: 45,
      COLOR: 1,
      ZOOM: 1,
      ROTATION_SPEED: 12,
      COIL_FACTOR: 180,
      COIL_SPEED: 0,
      GAP: 100,
    },
    name: "nuclear fusion",
  },
];
