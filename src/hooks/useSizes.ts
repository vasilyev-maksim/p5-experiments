import { ViewportContext } from "@/contexts/ViewportContext";
import { useContext } from "react";

const tileWidth = 292;
const tileHeight = 335;
const tilePadding = 15;
const modalMargin = 10;
const modalPadding = 15;
const modalSidebarWidth = 300;
const modalSidebarPadding = 20;
const borderWidth = 4;

export function useSizes() {
  const ctx = useContext(ViewportContext);
  const canvasModalWidth =
    ctx.viewportWidth -
    modalSidebarWidth -
    2 * (modalPadding + modalMargin) -
    borderWidth;
  const canvasModalHeight =
    ctx.viewportHeight - 2 * (modalPadding + modalMargin);
  const canvasTileSize = tileWidth - tilePadding * 2;
  const tileScreenCenteredLeft = ctx.viewportWidth / 2 - tileWidth / 2;
  const tileScreenCenteredTop = ctx.viewportHeight / 2 - tileHeight / 2;

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
    tileScreenCenteredLeft,
    tileScreenCenteredTop,
  };
}
