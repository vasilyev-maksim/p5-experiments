import styles from "./App.module.css";
import { Header } from "./Header";
import { useLayoutEffect, useRef, useState } from "react";
import type { ISketch } from "./models";
import { SketchTile } from "./SketchTile";
import { SketchOverlay } from "./SketchOverlay";
import classNames from "classnames";
import { useModalBehavior } from "./utils";
import { sketchList } from "./data";

function App() {
  const [selectedSketch, selectSketch] = useState<ISketch>();
  const original = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (original.current && copy.current) {
      const { top, left } = original.current.getBoundingClientRect();
      copy.current.style.left = left + "px";
      copy.current.style.top = top + "px";
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
                ref={selectedSketch === x ? original : undefined}
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
        <SketchOverlay>
          <SketchTile ref={copy} sketch={selectedSketch} />
        </SketchOverlay>
      )}
    </>
  );
}

export default App;
