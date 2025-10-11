import type { IRangeControl } from "./models";
import styles from "./Slider.module.css";

export function Slider({
  control: c,
  value,
  onChange,
}: {
  control: IRangeControl;
  value: number;
  onChange: (value: number) => void;
}) {
  const label = c.label ?? c.key;
  const valueStr = c.valueFormatter?.(value, c) ?? value;

  return (
    <div className={styles.Slider}>
      <div className={styles.Title}>
        {label}: {valueStr}
      </div>
      <input
        name={c.key}
        type="range"
        max={c.max}
        min={c.min}
        step={c.step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
    </div>
  );
}
