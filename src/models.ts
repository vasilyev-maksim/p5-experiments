import type { P5CanvasInstance } from "@p5-wrapper/react";

export type SketchFactory = (
  width: number,
  height: number,
  randomSeed: number,
  timeShift: number // nice game btw
) => (
  p: P5CanvasInstance<{
    playing: boolean;
  }>
) => void;

export interface ISketch {
  name: string;
  id: string;
  preview: {
    size: number;
  };
  factory: SketchFactory;
  randomSeed?: number;
  timeShift?: number;
}
