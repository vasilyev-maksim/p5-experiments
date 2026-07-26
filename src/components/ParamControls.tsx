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
import { BooleanParamControl } from "./BooleanParamControl";
import { memo, type PropsWithChildren } from "react";
import { CoordinatesControl } from "./CoordinatesControl";
import { useActiveSketch } from "@hooks";

export const ParamControls = memo(function ParamControls() {
  const { params, activeSketch, changeParam } = useActiveSketch();
  const segment =
    useSequence<MODAL_OPEN_SEGMENTS>(
      MODAL_OPEN_SEQUENCE,
    ).useSegment<ControlsAnimationParams>("SHOW_CONTROLS");
  const { itemDelay, itemDuration } = segment.timingPayload;
  const entries = Object.entries(activeSketch.controls ?? {}).map(
    ([key, control]) => ({
      active: control.active?.(params) ?? true,
      key,
      control,
    }),
  );
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
      delay: entries[i].active ? i * itemDelay : 0,
      onRest: async () => {
        if (i === entriesCount - 1) {
          // await delay(150);
          segment.complete();
        }
      },
    }),
    [segment.wasRun, entriesCount],
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
        <ControlItemsGroup>
          {springs.map(({ x }, i) => {
            const { key, control, active } = entries[i];
            let body = null;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const value = params[key] as any;

            if (control.type === "range") {
              const valueStr =
                control.valueFormatter?.(value, control) ?? value;
              const label = control.label ?? key;
              body = (
                <Slider
                  label={label + ": " + valueStr}
                  value={value}
                  onChange={(val) => changeParam(key, val)}
                  max={control.max}
                  min={control.min}
                  step={control.step}
                  active={initControls.wasRun}
                  activationAnimationDuration={initControls.duration}
                />
              );
            } else if (control.type === "color") {
              body = (
                <ColorSelector
                  title={control.label + ": " + value}
                  colors={control.colors}
                  value={value}
                  onChange={(val) => changeParam(key, val)}
                  active={initControls.wasRun}
                  animationDuration={initControls.duration}
                  shuffle={control.shuffle}
                  shuffleSwitchLabel={control.shuffleSwitchLabel}
                />
              );
            } else if (control.type === "boolean") {
              body = (
                <BooleanParamControl
                  label={control.label}
                  value={value}
                  active={initControls.wasRun}
                  animationDuration={initControls.duration}
                  onChange={(val) => changeParam(key, val)}
                  options={control.options}
                />
              );
            } else if (control.type === "choice") {
              body = (
                <OptionSelector
                  valuesCount={control.options.length}
                  renderOption={(value, active, onClick) => (
                    <OptionButton
                      active={active}
                      onClick={onClick}
                      label={control.options[value]}
                      mini
                      animationDuration={initControls.duration}
                    />
                  )}
                  title={control.label}
                  value={value}
                  onChange={(val) => changeParam(key, val)}
                  active={initControls.wasRun}
                  gap={5}
                />
              );
            } else if (control.type === "coordinates") {
              body = (
                <CoordinatesControl
                  label={control.label}
                  value={value}
                  active={initControls.wasRun}
                  animationDuration={initControls.duration}
                  onChange={(val) => changeParam(key, val)}
                />
              );
            }

            return active ? (
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
            ) : null;
          })}
        </ControlItemsGroup>
      </SectionLayout>
    )
  );
});

export function ControlItemsGroup(props: PropsWithChildren) {
  return <div className={styles.ControlItemsLayout}>{props.children}</div>;
}
