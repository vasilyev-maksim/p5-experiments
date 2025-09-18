import type { ISketch } from "./models";
import { SketchGrid } from "./SketchGrid";
import styles from "./App.module.css";
import { Header } from "./Header";

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
      <Header />
      <SketchGrid items={items} />
    </div>
  );
}

export default App;
