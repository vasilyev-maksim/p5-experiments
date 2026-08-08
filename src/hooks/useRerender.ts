import { useState, useCallback } from "react";

export function useRerender() {
  const [, setRerenderCounter] = useState(0);
  return useCallback(() => setRerenderCounter((x) => x + 1), []);
}
