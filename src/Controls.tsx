import type { ISketch } from "./models";
import styles from "./Controls.module.css";

export function Controls(props: {
  sketch: ISketch<string>;
  paramsMap: Record<string, number>;
  onParamChange: (key: string, value: number) => void;
  onPresetApply: (paramsMap: Record<string, number>) => void;
}) {
  console.log(props.paramsMap);
  return (
    <>
      {props.sketch.controls?.map((c) => {
        if (c.type === "range") {
          const value = props.paramsMap[c.key];
          return (
            <div key={c.key}>
              {c.key} &nbsp;
              <input
                name={c.key}
                type="range"
                max={c.max}
                min={c.min}
                step={c.step}
                value={value}
                onChange={(e) =>
                  props.onParamChange(c.key, parseInt(e.target.value))
                }
              />
              &nbsp; ({value})
            </div>
          );
        }
      })}
      <br />
      PRESETS:
      <br />
      {props.sketch.presets?.map((p, i) => (
        <button
          key={i}
          className={styles.PresetButton}
          onClick={() => props.onPresetApply(p.params)}
        >
          {p.name ?? `_${i}`}
        </button>
      ))}
    </>
  );
}
