import { useLongPress } from "@hooks";
import { JumpNFramesIcon } from "./Icons";

const HOLD_TIMEOUT = 500;

export function JumpNFramesButton(props: {
  n: number;
  onClick: () => void;
  onLongPress: () => void;
  onLongPressRelease: () => void;
  className?: string;
}) {
  const { handlePress, handleRelease } = useLongPress(
    HOLD_TIMEOUT,
    props.onLongPress,
    props.onLongPressRelease,
  );

  return (
    <button
      className={props.className}
      onClick={props.onClick}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
    >
      <JumpNFramesIcon n={props.n} />
    </button>
  );
}
