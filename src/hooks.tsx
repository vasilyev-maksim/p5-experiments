import { createContext, useContext } from "react";

export const ViewportContext = createContext<{
  viewportWidth: number;
  viewportHeight: number;
}>({
  viewportWidth: 0,
  viewportHeight: 0,
});

export function useViewport() {
  const ctx = useContext(ViewportContext);
  const tileWidth = 292;
  const tileHeight = 335;
  const tilePadding = 15;
  const modalMargin = 15;
  const modalPadding = 30;
  const modalLeftSideWidth = 300;
  const modalCanvasWidth =
    ctx.viewportWidth - modalLeftSideWidth - 2 * (modalPadding + modalMargin);
  const modalCanvasHeight =
    ctx.viewportHeight - 2 * (modalPadding + modalMargin);

  return {
    ...ctx,
    tileWidth,
    tileHeight,
    modalMargin,
    modalPadding,
    modalLeftSideWidth,
    modalCanvasWidth,
    modalCanvasHeight,
    tilePadding,
  };
}
