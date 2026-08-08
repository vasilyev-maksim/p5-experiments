export function useGlobalDrag(
  onMouseDown: (e: Pick<MouseEvent, "clientX" | "clientY">) => void,
) {
  const handleMouseDown = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    document.body.style.userSelect = "none";
    onMouseDown(e);

    const removeHandlers = () => {
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMouseDown);
      window.removeEventListener("mouseup", removeHandlers);
    };

    window.addEventListener("mousemove", onMouseDown);
    window.addEventListener("mouseup", removeHandlers);
  };

  return { handleMouseDown };
}
