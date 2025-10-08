import type { ISketchFactory } from "../models";

export const pulse: ISketchFactory =
  (WIDTH, HEIGHT, randomSeed, timeShift) => (p) => {
    const ORIENTATION: "v" | "h" = "h",
      W = ORIENTATION === "v" ? WIDTH : HEIGHT,
      H = ORIENTATION === "v" ? HEIGHT : WIDTH,
      Y_SIZE = 20,
      RANDOMNESS_MODE: "bates" | "noise" = "noise",
      POINTS_PER_LINE = 5,
      X_DISPERSION = 0.2,
      SPEED = 20,
      Y_DELTA = H / Y_SIZE,
      INDEPENDENT_CURVES_COUNT = 1,
      TWIN_CURVES_COUNT = 25, // same curve with x-axis offset
      TWIN_X_OFFSET = 30,
      OPACITY = 20,
      BG = [0, 0, 0],
      twinMidIndex = Math.round((TWIN_CURVES_COUNT - 1) / 2);
    let NODES: [number, number][][] = [];
    let NEXT_NODES: [number, number][][] = [];

    function getNextNodes() {
      const time = p.frameCount + timeShift;
      const nodes: typeof NODES = [];

      for (let l = 0; l < INDEPENDENT_CURVES_COUNT; l++) {
        const arr: (typeof NODES)[0] = [];
        for (let i = -1; i <= Y_SIZE + 1; i++) {
          const y = i * Y_DELTA;

          if (RANDOMNESS_MODE == "noise") {
            const x = p.map(
              p.noise(i, l, (time * 0.1) / SPEED),
              0,
              1,
              (W / 2) * (1 - X_DISPERSION),
              (W / 2) * (1 + X_DISPERSION)
            );
            arr.push([x, y]);
          } else {
            const xs = [];
            for (let j = 0; j < POINTS_PER_LINE; j++) {
              const node = p.random(
                (W / 2) * (1 - X_DISPERSION),
                (W / 2) * (1 + X_DISPERSION)
              );
              xs.push(node);
            }

            const avgX = xs.reduce((acc, x) => acc + x, 0) / POINTS_PER_LINE;
            arr.push([avgX, y]);
          }
        }
        nodes.push(arr);
      }

      return nodes;
    }

    function renderNodesDeltaPerFrame() {
      NODES = NODES.map((arr, j) =>
        arr.map(([x, y], i) => {
          const nextX = p.mouseIsPressed ? W / 2 : NEXT_NODES[j][i][0];
          const distance = nextX - x;
          const newX = x + distance / SPEED;
          return [newX, y];
        })
      );
    }

    function drawLines() {
      for (let j = 0; j < INDEPENDENT_CURVES_COUNT; j++) {
        // const color = p.lerpColor(
        //   p.color("rgba(52, 9, 152, 1)"),
        //   p.color("rgba(234, 114, 247, 1)"),
        //   j / INDEPENDENT_CURVES_COUNT
        // );

        for (let t = -twinMidIndex; t <= twinMidIndex; t++) {
          const xOffset = t * TWIN_X_OFFSET;
          const alpha = t === 0 ? 255 : p.map(p.abs(t), 0, twinMidIndex, 20, 0);
          const color = p.color(255, 0, 0, alpha);
          p.stroke(color);

          p.beginShape();
          for (let i = 0; i < NODES[j].length; i++) {
            const [x, y] = NODES[j][i];

            if (ORIENTATION === "v") {
              p.curveVertex(x + xOffset, y);
            } else {
              p.curveVertex(y, x + xOffset);
            }
          }
          p.endShape();
          // p.endShape("close");
        }
      }
    }

    p.setup = () => {
      if (ORIENTATION === "v") {
        p.createCanvas(W, H);
      } else {
        p.createCanvas(H, W);
      }
      const [r, g, b] = BG;
      p.background(r, g, b);
      p.stroke(255, 0, 0, 255);
      p.strokeWeight(2);
      p.randomSeed(randomSeed);
      p.noiseSeed(randomSeed);
      // p.noiseDetail(4, 0.7);
      NODES = getNextNodes();
      NEXT_NODES = getNextNodes();
    };

    p.updateWithProps = (props) => {
      if (props.playing) {
        p.loop();
      } else {
        p.noLoop();
      }
    };

    p.draw = () => {
      const time = p.frameCount + timeShift;

      if (time % SPEED === 0) {
        NEXT_NODES = getNextNodes();
      }

      p.noStroke();
      const [r, g, b] = BG;
      p.fill(p.color(r, g, b, OPACITY));

      if (ORIENTATION === "v") {
        p.rect(0, 0, W, H);
      } else {
        p.rect(0, 0, H, W);
      }
      p.noFill();

      renderNodesDeltaPerFrame();
      drawLines();
    };
  };
