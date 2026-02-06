import type { IPreset } from "@/models";
import type { Params } from ".";

export const presets: IPreset<Params>[] = [
  {
    params: {
      ZOOM: 200,
      RESOLUTION: 0,
      CAMERA_ROTATION: 1,
      CUBE_SIZE: 20,
      GAP: 0,
    },
  },

  {
    params: {
      ZOOM: 200,
      RESOLUTION: 1,
      CAMERA_ROTATION: 1,
      CUBE_SIZE: 20,
      GAP: 0,
    },
  },
  {
    params: {
      ZOOM: 200,
      RESOLUTION: 1,
      CAMERA_ROTATION: 1,
      CUBE_SIZE: 40,
      GAP: 1,
    },
  },
  {
    params: {
      ZOOM: 200,
      RESOLUTION: 1,
      CAMERA_ROTATION: 1,
      CUBE_SIZE: 40,
      GAP: 0,
    },
  },

  {
    params: {
      ZOOM: 450,
      RESOLUTION: 1,
      CAMERA_ROTATION: 1,
      CUBE_SIZE: 40,
      GAP: 0,
    },
  },
  {
    params: {
      ZOOM: 450,
      RESOLUTION: 3,
      CAMERA_ROTATION: 1,
      CUBE_SIZE: 40,
      GAP: 0,
    },
  },
  {
    params: {
      ZOOM: 450,
      RESOLUTION: 3,
      CAMERA_ROTATION: 1,
      CUBE_SIZE: 40,
      GAP: 1,
    },
  },
];
