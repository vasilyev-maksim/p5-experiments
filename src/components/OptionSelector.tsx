import styles from "./OptionSelector.module.css";
import { Fragment, useEffect, useState } from "react";
import { delay, range } from "../utils";

export function OptionSelector(props: {
  valuesCount: number;
  renderOption: (
    value: number,
    active: boolean,
    onClick: () => void
  ) => React.ReactNode;
  value: number;
  onChange: (val: number) => void;
  title?: string;
  initDelay?: number;
  className?: string;
  gap?: number;
}) {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    delay(props.initDelay ?? 0).then(() => setInitialized(true));
  }, []);

  return (
    <div className={props.className}>
      {props.title && <div className={styles.Title}>{props.title}</div>}
      <div className={styles.OptionsBlock} style={{ gap: props.gap ?? 0 }}>
        {range(props.valuesCount).map((value) => (
          <Fragment key={value}>
            {props.renderOption(
              value,
              initialized && value === props.value,
              () => props.onChange(value)
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
