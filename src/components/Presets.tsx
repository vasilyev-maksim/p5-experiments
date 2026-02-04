import type { IParams, IPreset, ISketch } from "../models";
import styles from "./Presets.module.css";
import { areParamsEqual } from "../utils/misc";
import { SectionLayout } from "./SectionLayout";
import { animated, easings, useSprings } from "react-spring";
import { useSequence } from "../sequencer";
import {
  MODAL_OPEN_SEQUENCE,
  type MODAL_OPEN_SEGMENTS,
  type PresetsAnimationParams,
} from "../animations";
import { OptionButton } from "./OptionButton";
import { useEffect, useRef, useState } from "react";
import { BooleanParamControl } from "./BooleanParamControl";

export function Presets(props: {
  sketch: ISketch;
  onApply: (preset: IPreset) => void;
  params: IParams;
}) {
  const segment =
    useSequence<MODAL_OPEN_SEGMENTS>(
      MODAL_OPEN_SEQUENCE,
    ).useSegment<PresetsAnimationParams>("SHOW_PRESETS");
  const { itemDelay, itemDuration } = segment.timingPayload;
  const paramsCount = props.sketch.presets?.length ?? 0;
  const [springs] = useSprings(
    paramsCount,
    (i) => ({
      from: { x: 0 },
      to: { x: segment.wasRun ? 1 : 0 },
      config: {
        duration: itemDuration,
        easing: easings.easeInOutCubic,
      },
      delay: i * itemDelay,
      onRest: async () => {
        if (i === paramsCount - 1) {
          segment.complete();
        }
      },
    }),
    [segment.wasRun],
  );

  const showHeader =
    useSequence<MODAL_OPEN_SEGMENTS>(MODAL_OPEN_SEQUENCE).useSegment(
      "SHOW_PRESET_HEADER",
    );
  const controlsActivated = useSequence<MODAL_OPEN_SEGMENTS>(
    MODAL_OPEN_SEQUENCE,
  ).useSegment("INIT_CONTROLS_AND_PRESETS");

  const [shufflePresets, setShufflePresets] = useState(
    props.sketch.presetsShuffle === 1,
  );

  const i = useRef(0);
  useEffect(() => {
    if (shufflePresets) {
      const id = setInterval(() => {
        props.onApply(
          props.sketch.presets[++i.current % props.sketch.presets.length],
        );
      }, props.sketch.presetsShuffleInterval ?? 1200);

      return () => clearInterval(id);
    }
  }, [shufflePresets]);

  return (
    paramsCount > 0 &&
    segment.wasRun && (
      <SectionLayout
        header="Presets"
        showHeader={showHeader.wasRun}
        animationDuration={showHeader.duration}
      >
        <div className={styles.Presets}>
          {springs.map(({ x }, i) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            const p = props.sketch.presets?.[i]!;
            const isActive =
              controlsActivated.wasRun &&
              areParamsEqual(props.params, p.params);
            return (
              <animated.div
                tabIndex={1}
                key={i}
                className={styles.PresetButtonWrapper}
                style={{
                  opacity: x,
                  scale: x.to([0, 1], [0.9, 1]),
                }}
              >
                <OptionButton
                  label={p.name ?? i.toString()}
                  active={isActive}
                  onClick={() => props.onApply(p)}
                  animationDuration={controlsActivated.duration}
                />
              </animated.div>
            );
          })}
        </div>
        {(props.sketch.presetsShuffle ?? -1) > -1 && (
          <BooleanParamControl
            label={"Cycle presets"}
            value={shufflePresets}
            active={controlsActivated.wasRun}
            animationDuration={controlsActivated.duration}
            onChange={(x) => setShufflePresets(x)}
          />
        )}
      </SectionLayout>
    )
  );
}
