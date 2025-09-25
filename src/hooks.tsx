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
  return {
    ...ctx,
    tileWidth: 292,
    tileHeight: 335,
  };
}
