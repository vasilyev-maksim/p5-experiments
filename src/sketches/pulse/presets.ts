import type { IPreset } from "@/models";
import type { Params } from "./controls";

export const presets: IPreset<Params>[] = [
  {
    params: {
      CURVES_COUNT: 37,
      GAP: 22,
      CURVE_RESOLUTION: 23,
      COLOR: 0,
      TRACE_FACTOR: 80,
      DISPERSION: 0.2,
      CHAOS_FACTOR: 3,
      JOINT_TYPE: 0,
    },
    name: "originality",
  },
  {
    params: {
      CURVES_COUNT: 50,
      GAP: 50,
      CURVE_RESOLUTION: 15,
      COLOR: 0,
      TRACE_FACTOR: 82,
      DISPERSION: 0.5,
      CHAOS_FACTOR: 69,
      JOINT_TYPE: 0,
    },
    name: "DnB",
  },
  {
    params: {
      CURVES_COUNT: 1,
      GAP: 38,
      CURVE_RESOLUTION: 5,
      COLOR: 0,
      TRACE_FACTOR: 100,
      DISPERSION: 0.45,
      CHAOS_FACTOR: 1,
      JOINT_TYPE: 0,
    },
    name: "sunrise",
  },
  {
    params: {
      CURVES_COUNT: 1,
      GAP: 10,
      CURVE_RESOLUTION: 6,
      COLOR: 2,
      TRACE_FACTOR: 100,
      DISPERSION: 1,
      CHAOS_FACTOR: 10,
      JOINT_TYPE: 0,
    },
    name: "hills",
  },
  {
    params: {
      CURVES_COUNT: 1,
      GAP: 24,
      CURVE_RESOLUTION: 100,
      COLOR: 0,
      TRACE_FACTOR: 100,
      DISPERSION: 0.05,
      CHAOS_FACTOR: 75,
      JOINT_TYPE: 0,
    },
    name: "fluctuations",
  },
  {
    params: {
      CURVES_COUNT: 50,
      GAP: 50,
      CURVE_RESOLUTION: 10,
      COLOR: 3,
      TRACE_FACTOR: 0,
      DISPERSION: 1,
      CHAOS_FACTOR: 0,
      JOINT_TYPE: 3,
    },
    name: "isolines",
  },
  {
    params: {
      CURVES_COUNT: 50,
      GAP: 10,
      CURVE_RESOLUTION: 5,
      COLOR: 1,
      TRACE_FACTOR: 100,
      DISPERSION: 0.5,
      CHAOS_FACTOR: 100,
      JOINT_TYPE: 0,
    },
    name: "ice plazma",
  },
];
