import type { ISketch } from "../models";
import { spiralSketch } from "./spiral";
import { pillarsSketch } from "./pillars";
import { curveSketch } from "./curve";
import { arcsSketch } from "./arcs";
import { circlesSketch } from "./circles";
import { sketch as citySketch } from "./city";
import { sketch as cubesSketch } from "./cubes";
import { zigzagsSketch } from "./zigzags";
import { sketch as lightsSketch } from "./_sandboxes/lights";
import { interpolationSketch } from "./_sandboxes/interpolation";
import { sketch as tilesSketch } from "./tiles/tiles";
import { sketch as wormsSketch } from "./worms";
import { sketch } from "./_sandboxes/funcs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const all: ISketch<any>[] = [
  spiralSketch,
  cubesSketch,
  pillarsSketch,
  arcsSketch,
  curveSketch,
  circlesSketch,
  zigzagsSketch,
  lightsSketch,
  interpolationSketch,
  citySketch,
  tilesSketch,
  sketch,
  wormsSketch,
];

let sketchList = all
  .filter((x) =>
    import.meta.env.PROD ? x.type === "released" : x.type !== "hidden",
  )
  .sort((a, b) =>
    a.type === "only"
      ? -2
      : a.type === "draft" && b.type === "released"
        ? -1
        : a.type === b.type
          ? 0
          : 1,
  );

sketchList =
  sketchList[0]?.type === "only"
    ? sketchList.filter((x) => x.type === "only")
    : sketchList;

export { sketchList };
