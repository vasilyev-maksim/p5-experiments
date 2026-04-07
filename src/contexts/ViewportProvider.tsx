import { useEffect, useState } from "react";
import { ViewportContext } from "./ViewportContext";

export function ViewportProvider({ children }: { children: React.ReactNode }) {
  const [sizes, setSizes] = useState({
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setSizes({
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ViewportContext.Provider value={sizes}>
      {children}
    </ViewportContext.Provider>
  );
}
