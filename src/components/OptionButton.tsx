import classNames from "classnames";
import styles from "./OptionButton.module.css";
import type { PropsWithChildren } from "react";

export const OptionButton = (
  props: PropsWithChildren<{
    active: boolean;
    onClick: () => void;
    label: string;
    mini?: boolean;
  }>
) => {
  return (
    <button
      tabIndex={1}
      className={classNames(styles.OptionButton, {
        [styles.Active]: props.active,
        [styles.Mini]: props.mini,
      })}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
};
