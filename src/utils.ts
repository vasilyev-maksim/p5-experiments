import { useEffect } from "react";
import type { IControl, IParams, ISketch } from "./models";

export function useModalBehavior(isOpen: boolean, closeModal: () => void) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeModal();
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, closeModal]);
}

export function extractDefaultParams<K extends string>(
  sketch: ISketch<K>
): IParams {
  return Object.fromEntries(
    Object.entries<IControl>(sketch.controls ?? {}).map(
      ([key, { defaultValue }]) => [key, defaultValue]
    )
  );
}

function serializeParams(params: IParams): string {
  return Object.entries(params)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((key, value) => key + "__" + value)
    .join("___");
}

export function areParamsEqual(a: IParams, b: IParams): boolean {
  return serializeParams(a) === serializeParams(b);
}

export function delay(delay: number) {
  return new Promise((r) => setTimeout(r, delay));
}
