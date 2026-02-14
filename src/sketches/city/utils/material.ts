import p5 from "p5";

export function drawMaterial(p: p5, cb: () => void, material: MaterialType) {
  const color =
    material === "plastic"
      ? "white"
      : material === "stone"
        ? "grey"
        : material === "glass"
          ? "#68a8c6"
          : material === "sand"
            ? "#ffefbc"
            : "brown";
  p.push();
  {
    p.fill(color);
    cb();
  }
  p.pop();
}
export type MaterialType = "wood" | "stone" | "plastic" | "glass" | "sand";
