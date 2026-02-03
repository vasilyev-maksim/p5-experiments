import { Sequence } from "./sequencer/Sequence";

export const MODAL_OPEN_SEQUENCE = "MODAL_OPEN";
export type MODAL_OPEN_SEGMENTS =
  | "GRID_GOES_IN_BG"
  | "TILE_GOES_MODAL"
  | "START_PLAYING"
  | "SHOW_SIDEBAR"
  | "SHOW_HEADER"
  | "SHOW_PRESET_HEADER"
  | "SHOW_PRESETS"
  | "SHOW_CONTROLS"
  | "SHOW_CONTROLS_HEADER"
  | "INIT_CONTROLS_AND_PRESETS"
  | "SHOW_BOTTOM_ACTIONS";
export const HOME_PAGE_SEQUENCE = "HOME_PAGE";
export type HOME_PAGE_SEGMENTS = "HEADER" | "TILES";
export type PresetsAnimationParams = {
  itemDelay: number;
  itemDuration: number;
};
export type ControlsAnimationParams = {
  itemDelay: number;
  itemDuration: number;
};
export type Ctx = {
  presetsPresent: boolean;
  controlsPresent: boolean;
};
export type GridAnimationParams = {
  itemDelay: number;
  itemDuration: number;
};

let MULT = Number(import.meta.env.VITE_ANIMATIONS_DURATION_MULTIPLIER);
MULT = isNaN(MULT) ? 1 : MULT;

export const sequences = [
  new Sequence(MODAL_OPEN_SEQUENCE, [
    Sequence.syncSegment({ id: "GRID_GOES_IN_BG", duration: 400 * MULT }),
    Sequence.syncSegment({
      id: "TILE_GOES_MODAL",
      delay: 100 * MULT,
      duration: 500 * MULT,
    }),
    Sequence.syncSegment({ id: "START_PLAYING", delay: 100 * MULT }),
    Sequence.syncSegment({ id: "SHOW_SIDEBAR" }),
    Sequence.syncSegment({ id: "SHOW_HEADER", duration: 500 * MULT }),
    Sequence.asyncSegment<PresetsAnimationParams>({
      id: "SHOW_PRESETS",
      timingPayload: {
        itemDelay: 30 * MULT,
        itemDuration: 200 * MULT,
      },
      disabledIf: (ctx) => !(ctx as Ctx).presetsPresent,
    }),
    Sequence.syncSegment({ id: "SHOW_PRESET_HEADER", duration: 300 * MULT }),
    Sequence.asyncSegment<ControlsAnimationParams>({
      id: "SHOW_CONTROLS",
      timingPayload: {
        itemDelay: 50 * MULT,
        itemDuration: 300 * MULT,
      },
      disabledIf: (ctx) => !(ctx as Ctx).controlsPresent,
    }),
    Sequence.syncSegment({ id: "SHOW_BOTTOM_ACTIONS", delay: 0 * MULT }),
    Sequence.syncSegment({
      id: "SHOW_CONTROLS_HEADER",
      duration: 300 * MULT,
    }),
    Sequence.syncSegment({
      id: "INIT_CONTROLS_AND_PRESETS",
      delay: 100 * MULT,
      duration: 200 * MULT,
    }),
  ]),
  new Sequence(HOME_PAGE_SEQUENCE, [
    Sequence.syncSegment({
      id: "HEADER",
      delay: 700 * MULT,
      duration: 200 * MULT,
    }),
    Sequence.asyncSegment<GridAnimationParams>({
      id: "TILES",
      delay: 200 * MULT,
      timingPayload: {
        itemDelay: 125 * MULT,
        itemDuration: 300 * MULT,
      },
    }),
  ]),
]; // TODO: fix typings
