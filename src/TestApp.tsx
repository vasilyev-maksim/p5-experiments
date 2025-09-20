import { SketchTile } from "./SketchTile";
import { SketchOverlay } from "./SketchOverlay";
import { sketchList } from "./data";

function App() {
  return (
    <SketchOverlay>
      <SketchTile sketch={sketchList[0]} />
    </SketchOverlay>
  );
}

export default App;
