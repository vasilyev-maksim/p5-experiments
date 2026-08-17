import styles from "./Test.module.css";

export function Test() {
  return (
    <>
      <div className={styles.Test} onMouseEnter={() => console.log("enter")}>
        PARENT
      </div>
      <div
        className={styles.Child}
        onMouseEnter={(e) => {
          e.stopPropagation();
        }}
      >
        CHILD
      </div>
    </>
  );
}
