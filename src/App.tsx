import styles from "./App.module.css";
import { Header } from "./Header";
import { useLayoutEffect, useRef, useState } from "react";
import type { ISketch } from "./models";
import { SketchTile } from "./SketchTile";
import classNames from "classnames";
import { useModalBehavior } from "./utils";
import { sketchList } from "./data";
import { SketchModal } from "./SketchModal";

function App() {
  const [selectedSketch, selectSketch] = useState<ISketch | undefined>(
    sketchList[2]
  );
  const selectedTileRef = useRef<HTMLDivElement>(null);
  const [cloneTop, setCloneTop] = useState<number>();
  const [cloneLeft, setCloneLeft] = useState<number>();

  useLayoutEffect(() => {
    if (selectedTileRef.current) {
      const { top, left } = selectedTileRef.current.getBoundingClientRect();
      setCloneLeft(left);
      setCloneTop(top);
    }
  }, [selectedSketch]);

  useModalBehavior(!!selectedSketch, () => selectSketch(undefined));

  return (
    <>
      <div
        className={classNames(styles.Container, {
          [styles.InBackground]: !!selectedSketch,
        })}
      >
        <Header />
        <div className={styles.GridWrapper}>
          <div className={styles.Grid}>
            {sketchList.map((x, i) => (
              <SketchTile
                invisible={selectedSketch === x}
                ref={selectedSketch === x ? selectedTileRef : undefined}
                onSelect={() => selectSketch(x)}
                key={x.id}
                sketch={x}
                animationDelay={700 + 200 * i}
                interactive
              />
            ))}
          </div>
        </div>
      </div>
      {selectedSketch && (
        <SketchModal top={cloneTop} left={cloneLeft} sketch={selectedSketch} />
      )}
    </>
  );
}

export default App;
