import { useCallback } from "react";
import type { ISketch } from "@/models";
import { sketchList } from "@/sketches/list";
import { usePopStateSync } from "@/hooks/usePopStateSync";
import {
  getActiveSketchFromUrl,
  removeSketchDataFromUrl,
  setSketchToUrl,
} from "@utils/url";
import { useRerender } from "@/hooks/useRerender";

export function useActiveSketchFromUrl() {
  const rerender = useRerender();
  const activeSketch = getActiveSketchFromUrl(sketchList);

  usePopStateSync();

  const openSketch = useCallback((x: ISketch) => {
    setSketchToUrl(x);
    rerender();
  }, []);

  const closeSketch = () => {
    removeSketchDataFromUrl();
    rerender();
  };

  return {
    activeSketch,
    openSketch,
    closeSketch,
  };
}
