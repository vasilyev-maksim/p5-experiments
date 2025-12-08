import styles from "./App.module.css";
import { Header } from "./Header";
import { useLayoutEffect, useRef, useState } from "react";
import { SketchTile } from "./SketchTile";
import classNames from "classnames";
import { sketchList } from "./data";
import { SketchModal } from "./SketchModal";
import { useURLParams } from "./utils";
// import "./sequencer";

function App() {
  const { openedSketch, openSketch, closeSketch } = useURLParams();
  // sketchList[2]
  const selectedTileRef = useRef<HTMLDivElement>(null);
  const [cloneTop, setCloneTop] = useState<number>();
  const [cloneLeft, setCloneLeft] = useState<number>();

  useLayoutEffect(() => {
    if (selectedTileRef.current) {
      const { top, left } = selectedTileRef.current.getBoundingClientRect();
      setCloneLeft(left);
      setCloneTop(top);
    }
  }, [openedSketch]);

  return (
    <>
      <div
        className={classNames(styles.Container, {
          [styles.InBackground]: !!openedSketch,
        })}
      >
        <Header />
        <div className={styles.GridWrapper}>
          <div className={styles.Grid}>
            {sketchList.map((x, i) => (
              <SketchTile
                invisible={openedSketch === x}
                ref={openedSketch === x ? selectedTileRef : undefined}
                onSelect={() => openSketch(x)}
                key={x.id}
                sketch={x}
                animationDelay={700 + 125 * i}
                interactive
              />
            ))}
          </div>
        </div>
      </div>
      {openedSketch && (
        <SketchModal
          top={cloneTop}
          left={cloneLeft}
          sketch={openedSketch}
          onBackClick={closeSketch}
        />
      )}
    </>
  );
}

export default App;
