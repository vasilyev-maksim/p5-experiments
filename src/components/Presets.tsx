import type { IPreset } from "../models";
import styles from "./Presets.module.css";
import { areParamsEqual } from "@utils/sketch";
import { SectionLayout } from "./SectionLayout";
import { animated, easings, useSprings } from "react-spring";
import { useSequence } from "../sequencer";
import {
  MODAL_OPEN_SEQUENCE,
  type MODAL_OPEN_SEGMENTS,
  type PresetsAnimationParams,
} from "../animations";
import { OptionButton } from "./OptionButton";
import { memo, useEffect, useRef, useState } from "react";
import { BooleanParamControl } from "./BooleanParamControl";
import { useActiveSketch } from "@hooks";

export const Presets = memo(function Presets() {
  const { activeSketch, params, applyPreset } = useActiveSketch();
  const segment =
    useSequence<MODAL_OPEN_SEGMENTS>(
      MODAL_OPEN_SEQUENCE,
    ).useSegment<PresetsAnimationParams>("SHOW_PRESETS");
  const { itemDelay, itemDuration } = segment.timingPayload;
  const presets = activeSketch.presets;
  const paramsCount = presets.length ?? 0;
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

  const presetIndex = useRef(0);
  const [shufflePresets, setShufflePresets] = useState(
    activeSketch.shufflePresets === 1,
  );

  const handleClick = (preset: IPreset) => {
    applyPreset(preset, { updateUrl: true });

    if (shufflePresets) {
      setShufflePresets(false);
    }
  };

  useEffect(() => {
    if (shufflePresets) {
      const id = setInterval(() => {
        const nextPreset = presets[++presetIndex.current % presets.length];

        applyPreset(nextPreset, { updateUrl: true });
      }, activeSketch.shufflePresetsInterval ?? 1200);

      return () => clearInterval(id);
    }
  }, [
    shufflePresets,
    activeSketch.shufflePresetsInterval,
    applyPreset,
    presets,
  ]);

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
            const p = presets?.[i]!;
            const isActive =
              controlsActivated.wasRun && areParamsEqual(params, p.params);
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
                  onClick={() => handleClick(p)}
                  animationDuration={controlsActivated.duration}
                />
              </animated.div>
            );
          })}
        </div>
        {(activeSketch.shufflePresets ?? -1) > -1 && (
          <BooleanParamControl
            label={"Shuffle presets"}
            value={shufflePresets}
            active={controlsActivated.wasRun}
            animationDuration={controlsActivated.duration}
            onChange={(x) => setShufflePresets(x)}
            className={styles.ShufflePresetsControl}
          />
        )}
      </SectionLayout>
    )
  );
});
