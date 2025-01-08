import { RefObject, useRef } from "react";

interface DragScrollDivProps extends React.HTMLAttributes<HTMLDivElement> {
  container: RefObject<HTMLElement | null>;
}

export default function DragScrollDiv({ container, ...props }: DragScrollDivProps) {

  const mousedown = useRef(false);

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (e.button === 0) {
      mousedown.current = true;
    }
  }

  function onMouseUp(e: React.MouseEvent<HTMLDivElement>) {
    if (e.button === 0) {
      mousedown.current = false;
    }
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!mousedown.current) return;

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
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      { props.children }
    </div>
  )
}