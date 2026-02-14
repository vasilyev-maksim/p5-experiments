import { OptionButton } from "./OptionButton";
import { OptionSelector } from "./OptionSelector";

const DEFAULT_OPTIONS = ["Nope", "Yeap"];

export const BooleanParamControl = (props: {
  label: string;
  value: boolean;
  active: boolean;
  animationDuration: number;
  onChange: (val: boolean) => void;
  className?: string;
  options?: [string, string];
}) => {
  const options = props.options || DEFAULT_OPTIONS;
  return (
    <OptionSelector
      className={props.className}
      active={props.active}
      valuesCount={2}
      title={props.label}
      value={props.value ? 1 : 0}
      onChange={(v) => props.onChange(v === 1)}
      renderOption={(value, active, onClick) => (
        <OptionButton
          mini
          active={active}
          onClick={onClick}
          label={options[value]}
          animationDuration={props.animationDuration}
        />
      )}
      gap={5}
    />
  );
};
