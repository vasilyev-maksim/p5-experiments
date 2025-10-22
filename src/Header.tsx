import styles from "./Header.module.css";

export function Header() {
  return (
    <h1 className={styles.Header}>
      <a href="https://vasilyev-maksim.github.io/resume/" target="_blank">
        My
      </a>{" "}
      experiments with{" "}
      <a href="https://p5js.org/" target="_blank">
        p5.js
      </a>
    </h1>
  );
}
