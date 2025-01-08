import { RefObject, useState } from "react";
import { useCCEXStore } from "../Hooks/UseCCEXExplorerStore";

interface DragScrollDivProps extends React.HTMLAttributes<HTMLDivElement> {
  container: RefObject<HTMLElement | null>;
}

export default function DragScrollDiv({ container, ...props }: DragScrollDivProps) {

  const [mousedown, setMouseDown] = useState(false);
  const { modalIsVisible } = useCCEXStore();

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (e.button === 0 && !modalIsVisible) {
      setMouseDown(true);
    }
  }

  function onMouseUp(e: React.MouseEvent<HTMLDivElement>) {
    if (e.button === 0) {
      setMouseDown(false);
    }
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!mousedown) return;

    // The container has to be present, otherwise this
    // element will not be rendered.
    container.current!.scrollBy({ 
      left: -e.movementX,
      top: -e.movementY
    });

  }

  return (
    <div
      {...props}
      className={"cursor-grab data-[indrag=true]:cursor-grabbing " + props.className}
      data-indrag={mousedown}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      { props.children }
    </div>
  )
}