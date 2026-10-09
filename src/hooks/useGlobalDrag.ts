export function useGlobalDrag(
  onMove: (e: Pick<PointerEvent, "clientX" | "clientY">) => void,
) {
  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    document.body.style.userSelect = "none";
    onMove(e);

    const pointerId = e.pointerId;
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerId === pointerId) onMove(e);
    };
    const removeHandlers = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;

      document.body.style.userSelect = "";

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", removeHandlers);
      window.removeEventListener("pointercancel", removeHandlers);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", removeHandlers);
    window.addEventListener("pointercancel", removeHandlers);
  };

  return { handlePointerDown };
}
