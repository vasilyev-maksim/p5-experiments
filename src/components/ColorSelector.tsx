import type { IColorControl } from "../models";
import styles from "./ColorSelector.module.css";
import { ColorButton } from "./ColorButton";
import { useEffect, useState } from "react";
import { delay } from "../utils";

export function ColorSelector(props: {
  colors: IColorControl["colors"];
  value: number;
  onChange: (val: number) => void;
  title?: string;
  initDelay?: number;
}) {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    delay(props.initDelay ?? 0).then(() => setInitialized(true));
  }, []);

  return (
    <div className={styles.ColorSelector}>
      {props.title && <div className={styles.Title}>{props.title}</div>}
      <div className={styles.ButtonsBlock}>
        {props.colors.map(([c1, c2], i) => (
          <ColorButton
            key={[c1,c2].join('-')}
            active={initialized && i === props.value}
            color1={c1}
            color2={c2}
            onClick={() => props.onChange(i)}
          />
        ))}
      </div>
    </div>
  );
}
