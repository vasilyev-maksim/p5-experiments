import type { IPreset } from "../../models";
import type { Params } from "./controls";

export const presets: IPreset<Params>[] = [
  {
    params: {
      RESOLUTION: 15,
      AMPLITUDE: 6,
      PERIOD: 1,
      GAP_X: 6,
      GAP_Y: 6,
      W_DISPERSION: 0.5,
      COLOR: 0,
      timeDelta: 1,
    },
    name: "looks uneven",
  },
  {
    params: {
      RESOLUTION: 25,
      AMPLITUDE: 1,
      PERIOD: 2,
      GAP_X: 1,
      GAP_Y: 200,
      W_DISPERSION: 0,
      COLOR: 1,
      timeDelta: 3,
    },
    name: "dragon",
  },
  {
    params: {
      RESOLUTION: 5,
      AMPLITUDE: 7,
      PERIOD: 1,
      GAP_X: 25,
      GAP_Y: 25,
      W_DISPERSION: 0.3,
      COLOR: 0,
      timeDelta: 0.3,
    },
    name: "lava lamp",
  },
  {
    params: {
      RESOLUTION: 25,
      AMPLITUDE: 10,
      PERIOD: 1,
      GAP_X: 8,
      GAP_Y: 8,
      W_DISPERSION: 0,
      COLOR: 2,
      timeDelta: 3,
    },
    name: "wave",
  },
  {
    params: {
      RESOLUTION: 25,
      AMPLITUDE: 10,
      PERIOD: 4,
      GAP_X: 23,
      GAP_Y: 25,
      W_DISPERSION: 0,
      COLOR: 0,
      timeDelta: 0.3,
    },
    name: "rush hour",
  },
  {
    params: {
      RESOLUTION: 6,
      AMPLITUDE: 10,
      PERIOD: 3,
      GAP_X: 10,
      GAP_Y: 12,
      W_DISPERSION: 0,
      COLOR: 3,
      timeDelta: 1,
    },
    name: "piano",
  },
  {
    params: {
      RESOLUTION: 25,
      AMPLITUDE: 1,
      PERIOD: 1,
      GAP_X: 10,
      GAP_Y: 35,
      W_DISPERSION: 0,
      COLOR: 1,
      timeDelta: 0.8,
    },
    name: "scoliosis",
  },
];
