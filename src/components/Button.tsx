import classNames from "classnames";
import styles from "./Button.module.css";
import type { PropsWithChildren, ReactNode } from "react";

export const Button = (
  props: PropsWithChildren<{
    onClick: () => void;
    label: ReactNode;
    mini?: boolean;
    className?: string;
    icon?: ReactNode;
  }>,
) => {
  return (
    <button
      tabIndex={1}
      className={classNames(
        styles.Button,
        {
          [styles.Mini]: props.mini,
          [styles.WithIcon]: props.icon != null,
        },
        props.className,
      )}
      onClick={props.onClick}
    >
      {props.icon}
      {props.label}
    </button>
  );
};
