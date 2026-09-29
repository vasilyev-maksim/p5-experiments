import { ActiveSketchContext } from "@/contexts/ActiveSketchContext";
import { useContext } from "react";

export function useActiveSketchContext() {
  return useContext(ActiveSketchContext);
}
