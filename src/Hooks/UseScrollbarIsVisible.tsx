import { MutableRefObject, useEffect, useState } from "react";

// Use the optional "dep" variable to specify a parameter that will
// trigger reevaluation of the scrollbarIsVisible variable

export default function useScrollbarIsVisible(
  elementRef: MutableRefObject<HTMLElement | null>, 
  dep?: any) { // eslint-disable-line @typescript-eslint/no-explicit-any

  const [scrollbarIsVisible, setScrollbarIsVisible] = useState(false);

  useEffect(() => {
    const checkAndSetScrollbar = () => {
      if (elementRef.current) {
        const scrollHeight = elementRef.current.scrollHeight;
        const clientHeight = elementRef.current.clientHeight;
        setScrollbarIsVisible(scrollHeight > clientHeight);
      }
    }
    window.addEventListener("resize", checkAndSetScrollbar);
    checkAndSetScrollbar();

    return () => {
      window.removeEventListener("resize", checkAndSetScrollbar);
    }
  }, [elementRef, dep])

  return scrollbarIsVisible;

}