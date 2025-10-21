import type { ISketch, IParams } from "./models";
import { SectionLayout } from "./SectionLayout";
import styles from "./Controls.module.css";
// import { Slider } from "./Slider";
import { CustomSlider } from "./CustomSlider";

export function Controls(props: {
  sketch: ISketch<string>;
  params: IParams;
  onParamChange: (key: string, value: number) => void;
}) {
  return (
    <SectionLayout header="Parameters" className={styles.Controls}>
      {Object.entries(props.sketch.controls ?? {})?.map(([key, c]) => {
        let body = null;

        if (c.type === "range") {
          const value = props.params[key];
          const label = c.label ?? key;
          const valueStr = c.valueFormatter?.(value, c) ?? value;
          body = (
            <CustomSlider
              label={label + ": " + valueStr}
              value={value}
              onChange={(val) => props.onParamChange(key, val)}
              max={c.max}
              min={c.min}
              step={c.step}
            />
          );
        }

        return (
          <div key={key} className={styles.Item}>
            {body}
          </div>
        );
      })}
    </SectionLayout>
  );
}
