import { OptionButton } from "./OptionButton";
import { OptionSelector } from "./OptionSelector";

export const BooleanParamControl = (props: {
  label: string;
  value: boolean;
  active: boolean;
  animationDuration: number;
  onChange: (val: boolean) => void;
  className?: string;
}) => {
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
          label={["Nope", "Yeap"][value]}
          animationDuration={props.animationDuration}
        />
      )}
      gap={5}
    />
  );
};
