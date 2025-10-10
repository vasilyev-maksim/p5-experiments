import type { ISketch, IParams } from "./models";
import { SectionLayout } from "./SectionLayout";
import styles from "./Controls.module.css";
import { Slider } from "./Slider";

export function Controls(props: {
  sketch: ISketch<string>;
  params: IParams;
  onParamChange: (key: string, value: number) => void;
}) {
  console.log(props.params);
  return (
    <SectionLayout header="Parameters" className={styles.Controls}>
      {props.sketch.controls?.map((c) => {
        if (c.type === "range") {
          const value = props.params[c.key];
          return (
            <Slider
              key={c.key}
              control={c}
              value={value}
              onChange={(val) => props.onParamChange(c.key, val)}
            />
          );
        }
      })}
    </SectionLayout>
  );
}
