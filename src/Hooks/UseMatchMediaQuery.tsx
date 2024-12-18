import { setMaxIdleHTTPParsers } from "http";
import { useEffect, useState } from "react";

export default function useMatchMediaQuery(query: string) {

  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    const media = matchMedia(query);
    setIsMatch(media.matches);
    
    const callback = (e: MediaQueryListEvent) => {
      setIsMatch(e.matches);
    }
    media.addEventListener("change", callback);

    return () => {
      media.removeEventListener("change", callback);
    }
  }, [query])

  return isMatch;
}