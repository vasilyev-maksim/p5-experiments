import type { IPreset } from "@/models";
import type { Params } from ".";

export const presets: IPreset<Params>[] = [
  {
    params: {
      ZOOM: 300,
      RESOLUTION: 0,
      CAMERA_ROTATION: 1,
      CUBE_SIZE: 30,
      GAP: 0,
    },
  },

  {
    params: {
      ZOOM: 300,
      RESOLUTION: 1,
      CAMERA_ROTATION: 1,
      CUBE_SIZE: 30,
      GAP: 0,
    },
  },
  {
    params: {
      ZOOM: 400,
      RESOLUTION: 1,
      CAMERA_ROTATION: 1,
      CUBE_SIZE: 60,
      GAP: 1,
    },
  },
  {
    params: {
      ZOOM: 400,
      RESOLUTION: 1,
      CAMERA_ROTATION: 1,
      CUBE_SIZE: 60,
      GAP: 0,
    },
  },

  {
    params: {
      ZOOM: 600,
      RESOLUTION: 1,
      CAMERA_ROTATION: 1,
      CUBE_SIZE: 60,
      GAP: 0,
    },
  },
  {
    params: {
      ZOOM: 600,
      RESOLUTION: 3,
      CAMERA_ROTATION: 1,
      CUBE_SIZE: 60,
      GAP: 0,
    },
  },
  {
    params: {
      ZOOM: 600,
      RESOLUTION: 3,
      CAMERA_ROTATION: 1,
      CUBE_SIZE: 60,
      GAP: 1,
    },
  },
];
