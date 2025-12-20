import type { IColorControl } from "../models";
import styles from "./ColorSelector.module.css";
import { ColorButton } from "./ColorButton";

export function ColorSelector(props: {
  colors: IColorControl["colors"];
  value: number;
  onChange: (val: number) => void;
  title?: string;
}) {
  return (
    <div className={styles.ColorSelector}>
      {props.title && <div className={styles.Title}>{props.title}</div>}
      <div className={styles.ButtonsBlock}>
        {props.colors.map(([c1, c2], i) => (
          <ColorButton
            active={i === props.value}
            color1={c1}
            color2={c2}
            onClick={() => props.onChange(i)}
          />
        ))}
      </div>
    </div>
  );
}
