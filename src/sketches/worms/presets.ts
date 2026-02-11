import type { IPreset } from "@/models";
import type { Params } from "./controls";

export const presets: IPreset<Params>[] = [
  {
    params: {
      RESOLUTION: 15,
      WORM_LENGTH: 9,
      THICKNESS: 0.9,
      CORNERS_TYPE: 1,
      COLOR: 1,
      INVERT_COLORS: 1,
      ANIMATED: 1,
    },
    name: "animated",
  },
  {
    params: {
      RESOLUTION: 40,
      WORM_LENGTH: 30,
      THICKNESS: 0.3,
      CORNERS_TYPE: 1,
      COLOR: 1,
      INVERT_COLORS: 1,
      ANIMATED: 1,
    },
    name: "animated 2",
  },
  {
    params: {
      RESOLUTION: 35,
      WORM_LENGTH: 100,
      THICKNESS: 0.85,
      COLOR: 3,
      INVERT_COLORS: 1,
      CORNERS_TYPE: 1,
      ANIMATED: 1,
    },
    name: "animated 3",
  },
  {
    params: {
      RESOLUTION: 35,
      WORM_LENGTH: 100,
      THICKNESS: 0.75,
      COLOR: 1,
      INVERT_COLORS: 1,
      CORNERS_TYPE: 0,
      ANIMATED: 1,
    },
    name: "animated 4",
  },
  {
    params: {
      RESOLUTION: 35,
      WORM_LENGTH: 3,
      THICKNESS: 0.55,
      COLOR: 1,
      INVERT_COLORS: 1,
      CORNERS_TYPE: 0,
      ANIMATED: 1,
    },
    name: "animated 5",
  },
  {
    params: {
      RESOLUTION: 35,
      WORM_LENGTH: 2,
      THICKNESS: 0.1,
      COLOR: 0,
      INVERT_COLORS: 0,
      CORNERS_TYPE: 0,
      ANIMATED: 1,
    },
  },
  {
    params: {
      RESOLUTION: 3,
      WORM_LENGTH: 0,
      THICKNESS: 0.1,
      COLOR: 0,
      INVERT_COLORS: 0,
      CORNERS_TYPE: 0,
      ANIMATED: 1,
    },
  },
  {
    params: {
      RESOLUTION: 35,
      WORM_LENGTH: 2,
      THICKNESS: 0.1,
      COLOR: 0,
      INVERT_COLORS: 0,
      CORNERS_TYPE: 0,
      ANIMATED: 1,
    },
  },
  {
    params: {
      RESOLUTION: 35,
      WORM_LENGTH: 100,
      THICKNESS: 0.1,
      COLOR: 0,
      INVERT_COLORS: 0,
      CORNERS_TYPE: 0,
      ANIMATED: 1,
    },
  },
  {
    params: {
      RESOLUTION: 35,
      WORM_LENGTH: 100,
      THICKNESS: 0.75,
      COLOR: 0,
      INVERT_COLORS: 0,
      CORNERS_TYPE: 0,
      ANIMATED: 1,
    },
  },
  {
    params: {
      RESOLUTION: 35,
      WORM_LENGTH: 100,
      THICKNESS: 0.75,
      COLOR: 1,
      INVERT_COLORS: 1,
      CORNERS_TYPE: 0,
      ANIMATED: 1,
    },
  },
  {
    params: {
      RESOLUTION: 35,
      WORM_LENGTH: 100,
      THICKNESS: 0.75,
      COLOR: 1,
      INVERT_COLORS: 0,
      CORNERS_TYPE: 0,
      ANIMATED: 1,
    },
  },
  {
    params: {
      RESOLUTION: 35,
      WORM_LENGTH: 100,
      THICKNESS: 0.1,
      COLOR: 1,
      INVERT_COLORS: 0,
      CORNERS_TYPE: 0,
      ANIMATED: 1,
    },
  },
];
