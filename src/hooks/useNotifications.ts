import { NotificationsContext } from "@/contexts/NotificationsContext";
import { useContext } from "react";

export function useNotifications() {
  return useContext(NotificationsContext);
}
