import classNames from "classnames";
import styles from "./Button.module.css";
import type { PropsWithChildren } from "react";

export const Button = (
  props: PropsWithChildren<{
    onClick: () => void;
    label: string;
    mini?: boolean;
  }>,
) => {
  return (
    <button
      tabIndex={1}
      className={classNames(styles.Button, {
        [styles.Mini]: props.mini,
      })}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
};
