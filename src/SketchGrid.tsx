import { useLayoutEffect, useRef, useState } from "react";
import type { ISketch } from "./models";
import styles from "./SketchGrid.module.css";
import { SketchTile } from "./SketchTile";
import { SketchOverlay } from "./SketchOverlay";
import classNames from "classnames";

export function SketchGrid(props: { items: ISketch[] }) {
  const [selectedSketch, selectSketch] = useState<ISketch>();
  const original = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  // const  = useRef<HTMLDivElement>(null);

  // console.log(original.current);

  useLayoutEffect(() => {
    if (original.current && copy.current) {
      const { top, left, width, height } =
        original.current.getBoundingClientRect();

      copy.current.style.width = width + "px"; // y
      copy.current.style.height = height + "px"; // y
      copy.current.style.left = left + "px"; // x
      copy.current.style.top = top + "px"; // y
    }
  }, [selectedSketch]);

  return (
    <div className={styles.GridWrapper}>
      <div
        className={classNames(styles.Grid, {
          [styles.Fading]: !!selectedSketch,
        })}
      >
        {props.items.map((x, i) => (
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
      {selectedSketch && (
        <SketchOverlay>
          <SketchTile
            ref={copy}
            className={styles.lol}
            sketch={selectedSketch}
          />
        </SketchOverlay>
      )}
    </div>
  );
}
