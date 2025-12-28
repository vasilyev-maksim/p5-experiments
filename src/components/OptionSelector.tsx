import styles from "./OptionSelector.module.css";
import { OptionButton } from "./OptionButton";
import { useEffect, useState } from "react";
import { delay } from "../utils";

export function OptionSelector(props: {
  options: { value: number; body: React.ReactNode }[];
  value: number;
  onChange: (val: number) => void;
  title?: string;
  initDelay?: number;
  className?: string;
}) {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    delay(props.initDelay ?? 0).then(() => setInitialized(true));
  }, []);

  return (
    <div className={props.className}>
      {props.title && <div className={styles.Title}>{props.title}</div>}
      <div className={styles.ButtonsBlock}>
        {props.options.map(({ value, body }) => (
          <OptionButton
            key={value}
            active={initialized && value === props.value}
            onClick={() => props.onChange(value)}
          >
            {body}
          </OptionButton>
        ))}
      </div>
    </div>
  );
}
