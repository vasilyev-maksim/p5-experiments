import styles from "./Header.module.css";

export function Header() {
  return (
    <h1 className={styles.Header}>
      <a
        href="https://vasilyev-maksim.github.io/resume/"
        className={styles.MeLink}
        target="_blank"
      >
        My
        {/* <div className={styles.SwapWrapper}>
          <div className={styles.Swap}>
            My <br /> Me
          </div>
        </div> */}
      </a>{" "}
      experiments with{" "}
      <a href="https://p5js.org/" target="_blank">
        p5.js
      </a>
    </h1>
  );
}
