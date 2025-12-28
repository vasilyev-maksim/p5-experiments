import classNames from "classnames";
import styles from "./BooleanSelector.module.css";
import { OptionSelector } from "./OptionSelector";

export function BooleanSelector(props: {
  value: number;
  onChange: (val: number) => void;
  title?: string;
  initDelay?: number;
}) {
  return (
    <OptionSelector
      options={[
        {
          value: 1,
          body: (
            <div className={classNames(styles.Button, styles.Yeap)}>Yeap</div>
          ),
        },
        {
          value: 0,
          body: (
            <div className={classNames(styles.Button, styles.Nope)}>Nope</div>
          ),
        },
      ]}
      {...props}
    />
  );
}
