import type { ISketch, IParams } from "../models";
import { SectionLayout } from "./SectionLayout";
import styles from "./ParamControls.module.css";
import { Slider } from "./Slider";
import { animated, easings, useSprings } from "react-spring";
import { useSequence } from "../sequencer";
import {
  MODAL_OPEN_SEQUENCE,
  type MODAL_OPEN_SEGMENTS,
  type ControlsAnimationParams,
} from "../animations";
import { ColorSelector } from "./ColorSelector";
import { OptionSelector } from "./OptionSelector";
import { OptionButton } from "./OptionButton";

export function ParamControls(props: {
  sketch: ISketch<string>;
  params: IParams;
  onParamChange: (key: string, value: number) => void;
}) {
  const segment =
    useSequence<MODAL_OPEN_SEGMENTS>(
      MODAL_OPEN_SEQUENCE,
    ).useSegment<ControlsAnimationParams>("SHOW_CONTROLS");
  const { itemDelay, itemDuration } = segment.timingPayload;
  const entries = Object.entries(props.sketch.controls ?? {});
  const entriesCount = entries.length;
  const [springs] = useSprings(
    entriesCount,
    (i) => ({
      from: { x: 0 },
      to: { x: segment.wasRun ? 1 : 0 },
      config: {
        duration: itemDuration,
        easing: easings.easeInOutCubic,
      },
      delay: i * itemDelay,
      onRest: async () => {
        if (i === entriesCount - 1) {
          // await delay(150);
          segment.complete();
        }
      },
    }),
    [segment.wasRun],
  );
  const showHeader = useSequence<MODAL_OPEN_SEGMENTS>(
    MODAL_OPEN_SEQUENCE,
  ).useSegment("SHOW_CONTROLS_HEADER");
  const initControls = useSequence<MODAL_OPEN_SEGMENTS>(
    MODAL_OPEN_SEQUENCE,
  ).useSegment("INIT_CONTROLS_AND_PRESETS");

  return (
    segment.wasRun && (
      <SectionLayout
        header="Parameters"
        className={styles.Controls}
        bodyClassName={styles.ItemsWrapper}
        showHeader={showHeader.wasRun}
        animationDuration={showHeader.duration}
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
                active={initControls.wasRun}
                activationAnimationDuration={initControls.duration}
              />
            );
          } else if (c.type === "color") {
            body = (
              <ColorSelector
                title={c.label}
                colors={c.colors}
                value={props.params[key]}
                onChange={(val) => props.onParamChange(key, val)}
                active={initControls.wasRun}
                animationDuration={initControls.duration}
              />
            );
          } else if (c.type === "boolean") {
            body = (
              <OptionSelector
                active={initControls.wasRun}
                valuesCount={2}
                title={c.label}
                value={props.params[key]}
                onChange={(val) => props.onParamChange(key, val)}
                renderOption={(value, active, onClick) => (
                  <OptionButton
                    mini
                    active={active}
                    onClick={onClick}
                    label={["Nope", "Yeap"][value]}
                    animationDuration={initControls.duration}
                  />
                )}
                gap={5}
              />
            );
          } else if (c.type === "choice") {
            body = (
              <OptionSelector
                valuesCount={c.options.length}
                renderOption={(value, active, onClick) => (
                  <OptionButton
                    active={active}
                    onClick={onClick}
                    label={c.options[value].label}
                    mini
                    animationDuration={initControls.duration}
                  />
                )}
                title={c.label}
                value={props.params[key]}
                onChange={(val) => props.onParamChange(key, val)}
                active={initControls.wasRun}
                gap={5}
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
