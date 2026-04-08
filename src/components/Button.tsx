import classNames from "classnames";
import styles from "./Button.module.css";
import type { PropsWithChildren, ReactNode } from "react";

export const Button = (
  props: PropsWithChildren<{
    onClick: () => void;
    label: ReactNode;
    mini?: boolean;
    className?: string;
  }>,
) => {
  return (
    <button
      tabIndex={1}
      className={classNames(
        styles.Button,
        {
          [styles.Mini]: props.mini,
        },
        props.className,
      )}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
};
