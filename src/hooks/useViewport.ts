import { ViewportContext } from "@/contexts/ViewportContext";
import { useContext } from "react";

// TODO: move consts from here / use react context for that

export function useViewport() {
  const ctx = useContext(ViewportContext);
  const tileWidth = 292;
  const tileHeight = 335;
  const tilePadding = 15;
  const modalMargin = 10;
  const modalPadding = 15;
  const modalSidebarWidth = 300;
  const modalSidebarPadding = 27;
  const borderWidth = 4;
  const canvasModalWidth =
    ctx.viewportWidth -
    modalSidebarWidth -
    2 * (modalPadding + modalMargin) -
    borderWidth;
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
    borderWidth,
  };
}
