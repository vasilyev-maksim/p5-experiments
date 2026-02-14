import p5 from "p5";
import type { MaterialType } from "./material";

export function drawPanel(p: p5, size: p5.Vector, type: MaterialType) {
  const color =
    type === "plastic"
      ? "white"
      : type === "stone"
        ? "grey"
        : type === "glass"
          ? "#68a8c6"
          : "brown";
  p.push();
  p.fill(color);
  p.box(...size.array());
  p.pop();
}
