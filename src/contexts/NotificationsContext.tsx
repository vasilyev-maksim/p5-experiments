import { noop } from "@/utils/misc";
import { createContext } from "react";

export type Notification = {
  text: string;
  id: string;
  // clearTimeoutInMs?: number;
  // position: "center" | "corner";
};

export const NotificationsContext = createContext<{
  notifications: Notification[];
  pushNotification: (
    text: Notification["text"],
    id?: Notification["id"],
  ) => void;
}>({
  notifications: [],
  pushNotification: noop,
});
