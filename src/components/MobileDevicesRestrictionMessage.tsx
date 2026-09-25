import { LaptopIcon } from "./Icons";
import styles from "./MobileDevicesRestrictionMessage.module.css";
import { useEffect } from "react";

export function MobileDevicesRestrictionMessage() {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className={styles.MobileDevicesRestrictionMessage}>
      <LaptopIcon />
      <br />
      For&nbsp;the&nbsp;best&nbsp;experience,
      please&nbsp;visit&nbsp;on&nbsp;computer
    </div>
  );
}
