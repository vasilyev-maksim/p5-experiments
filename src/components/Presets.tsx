import type { IControls, IPreset, IScenario } from "../models";
import styles from "./Presets.module.css";
import { areParamsEqual } from "@utils/sketch";
import { SectionLayout } from "./SectionLayout";
import { animated, easings, useSprings } from "@react-spring/web";
import { useSegment } from "../sequencer";
import {
  MODAL_OPEN_SEQUENCE,
  type MODAL_OPEN_SEGMENTS,
  type PresetsAnimationParams,
} from "../animations";
import { OptionButton } from "./OptionButton";
import { memo, useEffect, useRef, useState } from "react";
import { BooleanParamControl } from "./BooleanParamControl";
import { useActiveSketchContext } from "@/hooks/useActiveSketchContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { ENV } from "@/env";
import { checkExhaustiveness } from "@/utils/misc";

type ItemToRender =
  | {
      type: "shuffle";
    }
  | {
      type: "preset";
      preset: IPreset<IControls>;
    }
  | {
      type: "scenario";
      scenario: IScenario;
    };

export const Presets = memo(function Presets() {
  const segment = useSegment<MODAL_OPEN_SEGMENTS, PresetsAnimationParams>(
    MODAL_OPEN_SEQUENCE,
    "SHOW_PRESETS",
  );
  const { itemDelay, itemDuration } = segment.timingPayload;
  const showHeader = useSegment<MODAL_OPEN_SEGMENTS>(
    MODAL_OPEN_SEQUENCE,
    "SHOW_PRESET_HEADER",
  );
  const controlsActivated = useSegment<MODAL_OPEN_SEGMENTS>(
    MODAL_OPEN_SEQUENCE,
    "INIT_CONTROLS_AND_PRESETS",
  );

  const { activeSketch, params, applyPreset, playScenario } =
    useActiveSketchContext();
  const presetIndex = useRef(0);
  const [shufflePresets, setShufflePresets] = useState(
    activeSketch.shufflePresets === 1,
  );
  const shouldRenderShuffleControl = (activeSketch.shufflePresets ?? -1) > -1;
  const paramsCount = activeSketch.presets.length ?? 0;
  const itemsToRender = [
    ...activeSketch.presets.map((preset) => ({
      type: "preset",
      preset,
    })),
    ...((ENV.scenariosEnabled ? activeSketch.scenarios : null)?.map(
      (scenario) => ({
        type: "scenario",
        scenario,
      }),
    ) ?? []),
    ...(shouldRenderShuffleControl ? [{ type: "shuffle" }] : []),
  ] as ItemToRender[];

  const [springs] = useSprings(
    itemsToRender.length,
    (i) => ({
      from: { x: 0 },
      to: { x: segment.wasRun ? 1 : 0 },
      config: {
        duration: itemDuration,
        easing: easings.easeInOutCubic,
      },
      delay: i * itemDelay,
      onRest: async () => {
        if (i === itemsToRender.length - 1) {
          segment.complete();
        }
      },
    }),
    [segment.wasRun],
  );

  useEffect(() => {
    if (shufflePresets) {
      const id = setInterval(() => {
        const nextPreset =
          activeSketch.presets[
            ++presetIndex.current % activeSketch.presets.length
          ];

        applyPreset(nextPreset, { updateUrl: true });
      }, activeSketch.shufflePresetsInterval ?? 1200);

      return () => clearInterval(id);
    }
  }, [
    shufflePresets,
    activeSketch.shufflePresetsInterval,
    applyPreset,
    activeSketch.presets,
  ]);

  const { sendAnalyticsEvent } = useAnalytics();
  const handleClick = (preset: IPreset) => {
    applyPreset(preset, { updateUrl: true });
    sendAnalyticsEvent("preset applied", { preset });

    if (shufflePresets) {
      setShufflePresets(false);
    }
  };

  return (
    paramsCount > 0 &&
    segment.wasRun && (
      <SectionLayout
        header="Presets"
        showHeader={showHeader.wasRun}
        bodyClassName={styles.Presets}
        animationDuration={showHeader.duration}
      >
        {springs.map(({ x }, i) => {
          const item = itemsToRender[i];
          let body;

          switch (item.type) {
            case "preset": {
              const isActive =
                controlsActivated.wasRun &&
                areParamsEqual(params, item.preset.params);

              body = (
                <OptionButton
                  label={item.preset.name ?? i.toString()}
                  active={isActive}
                  onClick={() => handleClick(item.preset)}
                  animationDuration={controlsActivated.duration}
                />
              );
              break;
            }
            case "scenario": {
              body = (
                <OptionButton
                  label={"* " + (item.scenario.name ?? i.toString())}
                  active={false}
                  onClick={() => playScenario(item.scenario)}
                  animationDuration={controlsActivated.duration}
                />
              );
              break;
            }
            case "shuffle": {
              body = (
                <BooleanParamControl
                  label={"Shuffle presets"}
                  value={shufflePresets}
                  active={controlsActivated.wasRun}
                  animationDuration={controlsActivated.duration}
                  onChange={(x) => setShufflePresets(x)}
                  className={styles.ShufflePresetsControl}
                />
              );
              break;
            }
            default:
              checkExhaustiveness(item);
          }

          return (
            <animated.div
              key={i}
              className={styles.PresetButtonWrapper}
              style={{
                opacity: x,
                scale: x.to([0, 1], [0.9, 1]),
                flexBasis: item.type === "shuffle" ? "100%" : undefined,
              }}
            >
              {body}
            </animated.div>
          );
        })}
      </SectionLayout>
    )
  );
});
