import type { IColorControl } from "../models";
import styles from "./ColorSelector.module.css";
import { OptionSelector } from "./OptionSelector";

export function ColorSelector(props: {
  colors: IColorControl["colors"];
  value: number;
  onChange: (val: number) => void;
  title?: string;
  initDelay?: number;
}) {
  const { colors, ...rest } = props;
  return (
    <OptionSelector
      options={colors.map(([c1, c2], i) => ({
        value: i,
        body: (
          <div
            className={styles.Bg}
            style={{
              backgroundImage: `linear-gradient(to right, ${c1}, ${c2 ?? c1})`,
            }}
          />
        ),
      }))}
      {...rest}
    />
  );
}
