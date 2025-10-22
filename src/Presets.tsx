import type { IParams, IPreset, ISketch } from "./models";
import styles from "./Presets.module.css";
import { areParamsEqual, delay } from "./utils";
import classNames from "classnames";
import { SectionLayout } from "./SectionLayout";
import { animated, easings, useSprings } from "react-spring";
import { useState } from "react";

export function Presets(props: {
  sketch: ISketch;
  onApply: (preset: IPreset) => void;
  params: IParams;
  onAnimationEnd?: () => void;
}) {
  const [showHeader, setShowHeader] = useState(false);
  const paramsCount = props.sketch.presets?.length ?? 0;
  const [springs] = useSprings(
    paramsCount,
    (i) => ({
      from: { x: 0 },
      to: { x: 1 },
      config: {
        duration: 180,
        easing: easings.easeInOutCubic,
      },
      delay: i * 25,
      onRest: async () => {
        if (i === paramsCount - 1) {
          await delay(50);
          setShowHeader(true);
        }
      },
    }),
    []
  );

  return (
    paramsCount > 0 && (
      <SectionLayout
        header="Presets"
        showHeader={showHeader}
        onHeaderAnimationEnd={props.onAnimationEnd}
      >
        <div className={styles.Presets}>
          {springs.map(({ x }, i) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            const p = props.sketch.presets?.[i]!;
            const isActive = areParamsEqual(props.params, p.params);
            return (
              <animated.button
                tabIndex={1}
                key={i}
                className={classNames(styles.PresetButton, {
                  [styles.Active]: isActive,
                })}
                onClick={() => props.onApply(p)}
                style={{
                  opacity: x,
                  scale: x.to([0, 1], [0.9, 1]),
                }}
              >
                {p.name ?? i}
              </animated.button>
            );
          })}
        </div>
      </SectionLayout>
    )
  );
}
