import classNames from "classnames";
import { animated, easings, useSpring } from "@react-spring/web";

import styles from "./ColorOptionButton.module.css";

export const ColorOptionButton = (props: {
  active: boolean;
  onClick: () => void;
  colors: string[];
  animationDuration: number;
}) => {
  const { x } = useSpring({
    from: { x: 0 },
    to: { x: props.active ? 1 : 0 },
    config: {
      duration: props.animationDuration,
      easing: easings.linear,
    },
  });

  const bgStyle =
    props.colors.length === 1
      ? {
          backgroundColor: props.colors[0],
        }
      : props.colors.length === 2
        ? {
            backgroundImage: `linear-gradient(to right, ${props.colors.join(",")})`,
          }
        : props.colors.length > 2
          ? {
              backgroundImage: `linear-gradient(
                to right,
                ${props.colors.map((x, i, { length }) => `${x} 0, ${x} ${(100 * (i + 1)) / length}%`).join(",")})
              `,
            }
          : undefined;
  return (
    <button
      className={classNames(styles.Wrapper, { [styles.Active]: props.active })}
      onClick={props.onClick}
    >
      <animated.div
        className={styles.Frame}
        style={{
          opacity: x.to([0, 1], [0, 1]),
        }}
      />
      <div className={styles.Bg} style={bgStyle} />
    </button>
  );
};
