import { useEffect, useState } from "react";
import { ViewportContext } from "./hooks";

export function ViewportProvider({ children }: { children: React.ReactNode }) {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    function handleResize() {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ViewportContext.Provider
      value={{
        viewportHeight,
        viewportWidth,
      }}
    >
      {children}
    </ViewportContext.Provider>
  );
}
