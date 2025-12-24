import classNames from "classnames";
import { useSpring, easings, animated } from "react-spring";
import styles from "./ColorButton.module.css";

export const ColorButton = (props: {
  active: boolean;
  color1: string;
  color2: string;
  onClick: () => void;
}) => {
  const { x } = useSpring({
    from: { x: props.active ? 0 : 1 },
    to: { x: props.active ? 1 : 0 },
    config: { duration: 200, easing: easings.easeInOutCubic },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      props.onClick();
    }
  };

  return (
    <div
      className={classNames(styles.Wrapper, { [styles.Active]: props.active })}
      tabIndex={3}
      onClick={props.onClick}
      onKeyDown={handleKeyDown}
    >
      <animated.div
        className={styles.Frame}
        style={{
          height: x.to([0, 1], [0, 100]).to((x) => x + "%"),
          width: x.to([0, 1], [0, 100]).to((x) => x + "%"),
        }}
      />
      <div
        className={styles.Bg}
        style={{
          backgroundImage: `linear-gradient(to right, ${props.color1}, ${
            props.color2 ?? props.color1
          })`,
        }}
      />
    </div>
  );
};
