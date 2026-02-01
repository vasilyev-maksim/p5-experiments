import { useEffect, useState } from "react";
import type { IColorControl } from "../models";
import { BooleanParamControl } from "./BooleanParamControl";
import { ColorOptionButton } from "./ColorOptionButton";
import { OptionSelector } from "./OptionSelector";
import { ControlItemsGroup } from "./ParamControls";

const SHUFFLE_INTERVAL = 4000;

export function ColorSelector(props: {
  colors: IColorControl["colors"];
  value: number;
  onChange: (val: number) => void;
  title?: string;
  active: boolean;
  animationDuration: number;
  shuffle: IColorControl["shuffle"];
  shuffleSwitchLabel?: string;
}) {
  const { colors, ...rest } = props;
  const [autoCycleActive, setAutoCycleActive] = useState(props.shuffle === 1);

  const handleManualColorChange = (val: number) => {
    setAutoCycleActive(false);
    props.onChange(val);
  };

  useEffect(() => {
    if (autoCycleActive) {
      const id = setInterval(() => {
        props.onChange((props.value + 1) % colors.length);
      }, SHUFFLE_INTERVAL);
      return () => clearInterval(id);
    }
  }, [autoCycleActive, props.value, colors.length]);

  return (
    <ControlItemsGroup>
      <OptionSelector
        valuesCount={colors.length}
        renderOption={(value, active, onClick) => {
          const [colorA, colorB] = colors[value];
          return (
            <ColorOptionButton
              active={active}
              onClick={onClick}
              colorA={colorA}
              colorB={colorB}
              animationDuration={props.animationDuration}
            />
          );
        }}
        {...rest}
        onChange={handleManualColorChange}
      />
      {(props.shuffle ?? -1) > -1 && (
        <BooleanParamControl
          label={props.shuffleSwitchLabel ?? "Shuffle colors"}
          value={autoCycleActive}
          active={props.active}
          animationDuration={props.animationDuration}
          onChange={setAutoCycleActive}
        />
      )}
    </ControlItemsGroup>
  );
}
