import type { IColorControl } from "../models";
import { ColorOptionButton } from "./ColorOptionButton";
import { OptionSelector } from "./OptionSelector";

export function ColorSelector(props: {
  colors: IColorControl["colors"];
  value: number;
  onChange: (val: number) => void;
  title?: string;
  initDelay?: number;
}) {
  const { colors, ...rest } = props;
  return (
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
          />
        );
      }}
      {...rest}
    />
  );
}
