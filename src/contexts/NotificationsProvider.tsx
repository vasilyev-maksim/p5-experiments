import { useMemo, useState } from "react";
import {
  NotificationsContext,
  type Notification,
} from "./NotificationsContext";
import styles from "./NotificationsProvider.module.css";
import { generateUUID } from "@/utils/misc";
import { animated, useTransition } from "@react-spring/web";

const CLEAR_TIMEOUT = 1500;

// Not perfect but good enough 👍
// It sucks when pushing notification multiple times in a short period of time
// (before previous one is cleared)
export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const pushNotification = (
    text: Notification["text"],
    id?: Notification["id"],
  ) => {
    id ??= generateUUID();

    setNotifications((x) =>
      x.some((x) => x.id === id) ? x : [...x, { text, id }],
    );

    setTimeout(() => {
      setNotifications((arr) => arr.filter((x) => x.id !== id));
    }, CLEAR_TIMEOUT);
  };

  const transitions = useTransition(notifications, {
    from: { opacity: 0, translateY: 30 },
    enter: { opacity: 1, translateY: 0 },
    leave: { opacity: 0, translateY: -30 },
    config: {
      duration: 250,
    },
  });

  const contextValue = useMemo(
    () => ({
      notifications,
      pushNotification,
    }),
    [notifications],
  );

  return (
    <NotificationsContext.Provider value={contextValue}>
      {children}
      <div className={styles.Backdrop}>
        {transitions(({ opacity, translateY }, { text }) => (
          <animated.div
            style={{
              opacity,
              translateY,
            }}
            className={styles.Notification}
          >
            {text}
          </animated.div>
        ))}
      </div>
    </NotificationsContext.Provider>
  );
}
