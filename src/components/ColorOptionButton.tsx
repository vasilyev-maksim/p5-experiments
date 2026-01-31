import classNames from "classnames";
import { useSpring, easings, animated } from "react-spring";
import styles from "./ColorOptionButton.module.css";

export const ColorOptionButton = (props: {
  active: boolean;
  onClick: () => void;
  colorA: string;
  colorB: string;
  animationDuration: number;
}) => {
  const { x } = useSpring({
    from: { x: 0 },
    to: { x: props.active ? 1 : 0 },
    config: {
      duration: props.animationDuration,
      easing: easings.easeInOutCubic,
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      props.onClick();
    }
  };

  return (
    <div
      className={classNames(styles.Wrapper, { [styles.Active]: props.active })}
      tabIndex={3} // TODO: fix
      onClick={props.onClick}
      onKeyDown={handleKeyDown}
    >
      <animated.div
        className={styles.Frame}
        style={{
          height: x.to([0, 1], [0, 100]).to((x) => x + "%"),
          width: x.to([0, 1], [0, 100]).to((x) => x + "%"),
          opacity: x.to([0, 1], [0, 1]),
        }}
      />
      <div
        className={styles.Bg}
        style={{
          backgroundImage: `linear-gradient(to right, ${props.colorA}, ${
            props.colorB ?? props.colorA
          })`,
        }}
      />
    </div>
  );
};
