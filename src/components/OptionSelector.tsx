import styles from "./OptionSelector.module.css";
import { Fragment } from "react";
import { range } from "../utils/misc";

export function OptionSelector(props: {
  valuesCount: number;
  renderOption: (
    value: number,
    active: boolean,
    onClick: () => void,
  ) => React.ReactNode;
  value: number;
  onChange: (val: number) => void;
  title?: string;
  className?: string;
  gap?: number;
  active: boolean;
}) {
  return (
    <div className={props.className}>
      {props.title && <div className={styles.Title}>{props.title}</div>}
      <div className={styles.OptionsBlock} style={{ gap: props.gap ?? 0 }}>
        {range(props.valuesCount).map((value) => (
          <Fragment key={value}>
            {props.renderOption(
              value,
              props.active && value === props.value,
              () => props.onChange(value),
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
