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
  const modalPadding = 20;
  const modalSidebarWidth = 300;
  const modalSidebarPadding = 27;
  const canvasModalWidth =
    ctx.viewportWidth - modalSidebarWidth - 2 * (modalPadding + modalMargin);
  const canvasModalHeight =
    ctx.viewportHeight - 2 * (modalPadding + modalMargin);
  const canvasTileSize = tileWidth - tilePadding * 2;

  return {
    ...ctx,
    tileWidth,
    tileHeight,
    tilePadding,
    modalMargin,
    modalPadding,
    modalSidebarWidth,
    modalSidebarPadding,
    canvasModalWidth,
    canvasModalHeight,
    canvasTileSize,
  };
}
