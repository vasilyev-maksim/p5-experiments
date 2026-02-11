import type { ISketch } from "../models";
import { spiralSketch } from "./spiral";
import { pillarsSketch } from "./pillars";
import { curveSketch } from "./curve";
import { arcSketch } from "./arcs";
import { circlesSketch } from "./circles";
import { sketch as citySketch } from "./city";
import { sketch as cubesSketch } from "./cubes";
import { zigzagsSketch } from "./zigzags";
import { sketch as lightsSketch } from "./_sandboxes/lights";
import { interpolationSketch } from "./_sandboxes/interpolation";
import { sketch as tilesSketch } from "./tiles/tiles";
import { sketch as wormsSketch } from "./worms";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sketchList: ISketch<any>[] = [
  cubesSketch,
  spiralSketch,
  pillarsSketch,
  arcSketch,
  curveSketch,
  circlesSketch,
  zigzagsSketch,
  lightsSketch,
  interpolationSketch,
  citySketch,
  tilesSketch,
  wormsSketch,
]
  .filter((x) =>
    import.meta.env.PROD ? x.type === "released" : x.type !== "hidden",
  )
  .sort((a, b) =>
    a.type === "draft" && b.type === "released"
      ? -1
      : a.type === b.type
        ? 0
        : 1,
  );
