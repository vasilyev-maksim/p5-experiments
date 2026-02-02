import type { IPreset } from "@/models";
import type { Params } from "./controls";

export const presets: IPreset<Params>[] = [
  {
    params: {
      COIL_FACTOR: 12,
      COIL_SPEED: 0,
      COLOR: 0,
      GAP: 14,
      RESOLUTION: 30,
      ROTATION_SPEED: 29,
      ZOOM: 1,
    },
    name: "heart",
    timeShift: 85,
  },
  {
    params: {
      COIL_FACTOR: 176,
      COIL_SPEED: 0,
      COLOR: 3,
      GAP: 35,
      RESOLUTION: 45,
      ROTATION_SPEED: 30,
      ZOOM: 1,
    },
    name: "drill",
  },
  {
    params: {
      COIL_FACTOR: 346,
      COIL_SPEED: 0,
      COLOR: 5,
      GAP: 35,
      RESOLUTION: 45,
      ROTATION_SPEED: 15,
      ZOOM: 1,
    },
    name: "cats",
  },
  {
    params: {
      COIL_FACTOR: 180,
      COIL_SPEED: 0,
      COLOR: 4,
      GAP: 100,
      RESOLUTION: 45,
      ROTATION_SPEED: 12,
      ZOOM: 1,
    },
    name: "nuclear fusion",
  },
  {
    params: {
      RESOLUTION: 48,
      ZOOM: 1,
      ROTATION_SPEED: 74,
      COIL_FACTOR: 400,
      COIL_SPEED: 0,
      GAP: 1,
      COLOR: 2,
    },
    name: "signal",
  },
  {
    params: {
      RESOLUTION: 49,
      ZOOM: 1,
      ROTATION_SPEED: 20,
      COIL_FACTOR: 228,
      COIL_SPEED: 0.3,
      GAP: 26,
      COLOR: 1,
    },
    name: "nature",
    timeShift: 900,
  },
  {
    params: {
      COIL_FACTOR: 180,
      COIL_SPEED: 0,
      COLOR: 4,
      GAP: 100,
      RESOLUTION: 7,
      ROTATION_SPEED: 4,
      ZOOM: 1,
    },
    name: "glare",
  },
  {
    params: {
      RESOLUTION: 60,
      ZOOM: 1,
      ROTATION_SPEED: 18,
      COIL_FACTOR: 274,
      COIL_SPEED: 0.2,
      GAP: 40,
      COLOR: 6,
    },
    name: "turbulence",
    timeShift: 325,
  },
];
