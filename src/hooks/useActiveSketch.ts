import { ActiveSketchContext } from "@/contexts/ActiveSketchContext";
import { useContext } from "react";

export function useActiveSketch() {
  return useContext(ActiveSketchContext);
}
