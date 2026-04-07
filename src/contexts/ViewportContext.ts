import { createContext } from "react";

export const ViewportContext = createContext<{
  viewportWidth: number;
  viewportHeight: number;
}>({
  viewportWidth: 0,
  viewportHeight: 0,
});
