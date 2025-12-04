import type { ISketch, IParams } from "./models";
import { SectionLayout } from "./SectionLayout";
import styles from "./ParamControls.module.css";
import { Slider } from "./Slider";
import { animated, easings, useSprings } from "react-spring";
import { useState } from "react";
import { useSequence } from "./sequencer";
import {
  MODAL_OPEN_SEQ,
  type STEPS,
  type ControlsAnimationParams,
} from "./main";

export function ParamControls(props: {
  sketch: ISketch<string>;
  params: IParams;
  onParamChange: (key: string, value: number) => void;
}) {
  const segment =
    useSequence<STEPS>(MODAL_OPEN_SEQ).useSegment<ControlsAnimationParams>(
      "SHOW_CONTROLS"
    );
  const { itemDelay, itemDuration, slidersInitDelay } = segment.timingPayload;
  const [showHeader, setShowHeader] = useState(false);
  const entries = Object.entries(props.sketch.controls ?? {});
  const entriesCount = entries.length;
  const [springs] = useSprings(
    entriesCount,
    (i) => ({
      from: { x: 0 },
      to: { x: segment.currentPhase !== "not_started" ? 1 : 0 },
      config: {
        duration: itemDuration,
        easing: easings.easeInOutCubic,
      },
      delay: i * itemDelay,
      onRest: async () => {
        if (i === entriesCount - 1) {
          // await delay(150);
          setShowHeader(true);
        }
      },
    }),
    [segment.currentPhase]
  );

  return (
    segment.currentPhase !== "not_started" && (
      <SectionLayout
        header="Parameters"
        className={styles.Controls}
        bodyClassName={styles.ItemsWrapper}
        showHeader={showHeader}
        onHeaderAnimationEnd={segment.complete}
      >
        {springs.map(({ x }, i) => {
          const [key, c] = entries[i];
          let body = null;

          if (c.type === "range") {
            const value = props.params[key];
            const label = c.label ?? key;
            const valueStr = c.valueFormatter?.(value, c) ?? value;
            body = (
              <Slider
                initDelay={entriesCount * itemDelay + slidersInitDelay}
                label={
                  <>
                    {label}: {valueStr}
                  </>
                }
                value={value}
                onChange={(val) => props.onParamChange(key, val)}
                max={c.max}
                min={c.min}
                step={c.step}
              />
            );
          }

          return (
            <animated.div
              key={i}
              className={styles.Item}
              style={{
                scale: x.to([0, 1], [0.9, 1]),
                opacity: x,
              }}
            >
              {body}
            </animated.div>
          );
        })}
      </SectionLayout>
    )
  );
}
