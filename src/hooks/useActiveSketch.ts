import { ActiveSketchContext } from "@/contexts/ActiveSketchContext";
import { useContext } from "react";

export function useActiveSketch() {
  const ctx = useContext(ActiveSketchContext);
  return ctx;
}
