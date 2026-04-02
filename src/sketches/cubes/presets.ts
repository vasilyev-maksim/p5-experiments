import type { IPreset } from "@/models";
import type { Controls } from "./controls";

export const presets: IPreset<Controls>[] = [
  {
    params: {
      ZOOM: 200,
      RESOLUTION: 0,
      CAMERA_ROTATION: true,
      CUBE_SIZE: 20,
      GAP: 0,
    },
    timeDelta: 1,
    name: "0",
  },
  {
    params: {
      ZOOM: 200,
      RESOLUTION: 1,
      CAMERA_ROTATION: true,
      CUBE_SIZE: 20,
      GAP: 0,
    },
    timeDelta: 1,
    name: "1",
  },
  {
    params: {
      ZOOM: 200,
      RESOLUTION: 1,
      CAMERA_ROTATION: true,
      CUBE_SIZE: 40,
      GAP: 1,
    },
    timeDelta: 1,
    name: "2",
  },
  {
    params: {
      ZOOM: 200,
      RESOLUTION: 1,
      CAMERA_ROTATION: true,
      CUBE_SIZE: 40,
      GAP: 0,
    },
    timeDelta: 1,
    name: "3",
  },

  {
    params: {
      ZOOM: 450,
      RESOLUTION: 1,
      CAMERA_ROTATION: true,
      CUBE_SIZE: 40,
      GAP: 0,
    },
    timeDelta: 1,
    name: "4",
  },
  {
    params: {
      ZOOM: 450,
      RESOLUTION: 3,
      CAMERA_ROTATION: true,
      CUBE_SIZE: 40,
      GAP: 0,
    },
    timeDelta: 1,
    name: "5",
  },
  {
    params: {
      ZOOM: 450,
      RESOLUTION: 3,
      CAMERA_ROTATION: true,
      CUBE_SIZE: 40,
      GAP: 1,
    },
    timeDelta: 1,
    name: "6",
  },
];
