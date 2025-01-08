import { HTMLAttributes, useLayoutEffect, useRef, useState } from "react";

interface DynamicScrollDivProps extends HTMLAttributes<HTMLDivElement> {
  container?: HTMLElement | null;
  maxHeightPercent?: number;
}

/** 
 * This component creates a scrollable div that is either
 * as small as the inner content or as large as a certain
 * percentage of the container. If a fixed size scrollable
 * div is needed, don't use this component: instead just set
 * the size on the div. Additionally, if the container is
 * just the entire viewport, than using vh units for height
 * would likely suffice instead of this component.
 * 
 * It is not necessary to set any other height on this
 * element other than the maxHeightPercent.
*/
export default function DynamicScrollDiv({ maxHeightPercent = 100, container = document.body, ...props }: DynamicScrollDivProps) {

  const [contentHeight, setContentHeight] = useState("");
  const contentRef = useRef<HTMLDivElement>(null!);

  useLayoutEffect(() => {
    if (container && contentRef.current) {

      const callback = () => {
        contentRef.current.style.height = "";
        const maxHeight = container.clientHeight * maxHeightPercent / 100;
        setContentHeight(`${Math.min(maxHeight, contentRef.current.scrollHeight)}px`);
      }

      callback();

      window.addEventListener("resize", callback);

      return () => {
        window.removeEventListener("resize", callback);
      }

    }
  }, [container, maxHeightPercent])

  return (
    <div {...props} ref={contentRef} style={{ ...props.style, height: contentHeight }}>
      {props.children}
    </div>
  )
}