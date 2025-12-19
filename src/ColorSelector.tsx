import type { IColorControl } from "./models";
import styles from "./ColorSelector.module.css";
import classNames from "classnames";

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
          <button
            className={classNames(styles.Button, {
              [styles.Active]: i === props.value,
            })}
            style={{
              backgroundImage: `linear-gradient(to right, ${c1}, ${c2})`,
            }}
            onClick={() => props.onChange(i)}
          ></button>
        ))}
      </div>
    </div>
  );
}
