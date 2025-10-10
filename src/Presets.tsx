import type { IParams, IPreset, ISketch } from "./models";
import styles from "./Presets.module.css";
import { areParamsEqual } from "./utils";
import classNames from "classnames";
import { SectionLayout } from "./SectionLayout";

export function Presets(props: {
  sketch: ISketch;
  onApply: (preset: IPreset) => void;
  params: IParams;
}) {
  return (
    <SectionLayout header="Presets">
      <div className={styles.Presets}>
        {props.sketch.presets?.map((p, i) => {
          const isActive = areParamsEqual(props.params, p.params);
          return (
            <button
              key={i}
              className={classNames(styles.PresetButton, {
                [styles.Active]: isActive,
              })}
              onClick={() => props.onApply(p)}
            >
              {p.name ?? i}
            </button>
          );
        })}
      </div>
    </SectionLayout>
  );
}
