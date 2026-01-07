import classNames from "classnames";
import { PlayPauseButton } from "./PlayPauseButton";
import styles from "./PlaybackControls.module.css";
import { Slider } from "./Slider";

export function PlaybackControls(props: {
  onPlayPause: () => void;
  playing: boolean;
  onFullscreenToggle: () => void;
}) {
  return (
    <div className={styles.PlaybackControls}>
      <div className={styles.InnerWrapper}>
        <button
          className={classNames(styles.Fullscreen, styles.IconButton)}
          onClick={props.onFullscreenToggle}
        >
          <strong>⛶</strong>
        </button>
        <button className={styles.TextButton}>Capture</button>
      </div>
      <div className={styles.InnerWrapper}>
        <JumpNFramesButton n={-10} />
        <JumpNFramesButton n={-1} />
        <PlayPauseButton playing={props.playing} onClick={props.onPlayPause} />
        <JumpNFramesButton n={1} />
        <JumpNFramesButton n={10} />
      </div>
      <div className={styles.InnerWrapper}>
        <Slider
          value={50}
          min={0}
          max={100}
          step={1}
          onChange={function (): void {
            throw new Error("Function not implemented.");
          }}
          label={"Playback speed: x1"}
        />
      </div>
    </div>
  );
}

export function JumpNFramesButton(props: { n: number }) {
  const sign = Math.sign(props.n);
  const abs = Math.abs(props.n);
  return (
    <button className={styles.IconButton}>
      <svg
        width="25"
        height="20"
        viewBox="0 0 105 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: "var(--fontColor)" }}
      >
        <path
          d={
            sign > 0
              ? "M44.9855 0.238724C57.3723 -0.9758 69.7672 2.47341 79.7462 9.91158C84.8909 13.7464 89.2004 18.501 92.4962 23.8803L99.7296 20.3325C101.9 19.2674 104.375 21.0757 104.019 23.4672L100.428 47.5756C100.118 49.6523 97.8261 50.7765 95.9943 49.7504L74.7287 37.8393C72.6193 36.6577 72.7029 33.594 74.8732 32.5288L81.2101 29.4184C78.8278 25.7901 75.8151 22.5713 72.2755 19.9331C64.7912 14.3545 55.4953 11.7683 46.2052 12.6792C36.9151 13.5901 28.2984 17.9327 22.0402 24.8588C16.6801 30.791 13.3799 38.2528 12.5636 46.1372C12.3361 48.3346 10.5735 50.1373 8.3644 50.145L3.8644 50.1606C1.65559 50.1681 -0.157694 48.3805 0.0108795 46.1782C0.853969 35.1773 5.31875 24.7208 12.7658 16.479C21.11 7.24416 32.5987 1.45326 44.9855 0.238724Z"
              : "M59.0677 0.238729C46.6808 -0.975808 34.286 2.47341 24.3069 9.91158C19.1618 13.7466 14.8519 18.5015 11.5559 23.8813L4.32255 20.3325C2.15194 19.2678 -0.321772 21.0768 0.0344607 23.4682L3.62528 47.5756C3.93464 49.6524 6.22704 50.7775 8.05887 49.7514L29.3245 37.8393C31.4335 36.6576 31.3502 33.594 29.18 32.5288L22.8431 29.4194C25.2254 25.791 28.238 22.5724 31.7776 19.934C39.2619 14.3554 48.5578 11.7683 57.8479 12.6792C67.138 13.5901 75.7548 17.9328 82.013 24.8588C87.3731 30.791 90.6733 38.2536 91.4895 46.1381C91.7172 48.3352 93.479 50.137 95.6878 50.145L100.188 50.1606C102.397 50.1683 104.211 48.3809 104.042 46.1782C103.199 35.1772 98.7345 24.7208 91.2874 16.479C82.9431 7.24418 71.4545 1.45328 59.0677 0.238729Z"
          }
          fill="currentColor"
        />
        <text
          x="52.5"
          y="70"
          style={{
            font: "42px monospace",
            fontWeight: "1000",
            fill: "currentColor",
          }}
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {sign > 0 ? "+" : "-"}
          {abs}
        </text>
      </svg>
    </button>
  );
}
