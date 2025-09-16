import type { ISketch } from "./models";
import { SketchGrid } from "./SketchGrid";
import styles from "./App.module.css";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { sketch } from "./sketches/spiral";

const items: ISketch[] = [
  {
    id: "lungs",
    name: "lungs",
    img: "/lungs.png",
  },
  {
    id: "diamond",
    name: "diamond",
    img: "/diamond.png",
  },
  {
    id: "pulse",
    name: "pulse",
    img: "/pulse.png",
  },
  {
    id: "spiral",
    name: "spiral",
    img: "/spiral.png",
  },
  {
    id: "pillars",
    name: "pillars",
    img: "/pillars.png",
  },
  {
    id: "tiles",
    name: "tiles",
    img: "/tiles.png",
  },
];

function App() {
  return (
    <div className={styles.Container}>
      <h1 className={styles.Header}>My experiments with p5.js</h1>
      <SketchGrid items={items} />
      <ReactP5Wrapper sketch={sketch} />
    </div>
  );
}

export default App;
