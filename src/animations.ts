import { ENV } from "./env";
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
export type HOME_PAGE_SEGMENTS = "HEADER" | "TILES" | "FOOTER";
export type PresetsAnimationParams = {
  itemDelay: number;
  itemDuration: number;
};
export type ControlsAnimationParams = {
  itemDelay: number;
  itemDuration: number;
};
export type GridAnimationParams = {
  itemDelay: number;
  itemDuration: number;
};
export type ModalOpenAnimationCtx = {
  presetsPresent: boolean;
  controlsPresent: boolean;
};

const MULT = ENV.animationsDurationMultiplier;
const HIDE_SECTION_HEADERS = true;

// TODO: fix typings & MULT
export const sequences = [
  new Sequence(HOME_PAGE_SEQUENCE, [
    Sequence.syncSegment({
      id: "HEADER",
      delay: 100 * MULT,
      duration: 400 * MULT,
    }),
    Sequence.asyncSegment<GridAnimationParams>({
      id: "TILES",
      delay: 200 * MULT,
      timingPayload: {
        itemDelay: 200 * MULT,
        itemDuration: 400 * MULT,
      },
    }),
    Sequence.syncSegment({
      id: "FOOTER",
      delay: 200 * MULT,
      duration: 400 * MULT,
    }),
  ]),
  new Sequence(MODAL_OPEN_SEQUENCE, [
    Sequence.syncSegment({ id: "GRID_GOES_IN_BG", duration: 400 * MULT }),
    Sequence.syncSegment({
      id: "TILE_GOES_MODAL",
      delay: 100 * MULT,
      duration: 500 * MULT,
    }),
    Sequence.syncSegment({ id: "START_PLAYING", delay: 100 * MULT }),
    Sequence.syncSegment({ id: "SHOW_SIDEBAR" }),
    Sequence.syncSegment({ id: "SHOW_HEADER", duration: 300 * MULT }),
    Sequence.asyncSegment<PresetsAnimationParams>({
      id: "SHOW_PRESETS",
      delay: 100 * MULT,
      timingPayload: {
        itemDelay: 30 * MULT,
        itemDuration: 200 * MULT,
      },
      disabledIf: (ctx) => !(ctx as ModalOpenAnimationCtx).presetsPresent,
    }),
    Sequence.syncSegment({
      id: "SHOW_PRESET_HEADER",
      duration: 300 * MULT,
      disabledIf: () => HIDE_SECTION_HEADERS,
    }),
    Sequence.asyncSegment<ControlsAnimationParams>({
      id: "SHOW_CONTROLS",
      delay: 100 * MULT,
      timingPayload: {
        itemDelay: 50 * MULT,
        itemDuration: 300 * MULT,
      },
      disabledIf: (ctx) => !(ctx as ModalOpenAnimationCtx).controlsPresent,
    }),
    Sequence.syncSegment({
      id: "SHOW_CONTROLS_HEADER",
      duration: 300 * MULT,
      disabledIf: () => HIDE_SECTION_HEADERS,
    }),
    Sequence.syncSegment({
      id: "INIT_CONTROLS_AND_PRESETS",
      delay: 200 * MULT,
      duration: 200 * MULT,
    }),
    Sequence.syncSegment({
      id: "SHOW_BOTTOM_ACTIONS",
      duration: 200 * MULT,
      delay: 300 * MULT,
    }),
  ]),
];
