import { useEffect } from "react";
import { CHINESE_CHARACTER_TREEMAP } from "../Api/endpoints";
import { ChineseCharacterTreeMapDTO } from "../Api/types";
import useFetch from "./UseFetch";

export function filterChineseCharactersSearchParams(chars: string) {
  return chars.split("").filter(char => {
    const codePoint = char.codePointAt(0);
    return codePoint && codePoint >= 12032;
  }).join("");
}

export default function useFetchChineseCharacterTreeMaps(chars: string | undefined | null) {

  const { loading, error, data, callFetch, abortFetch, setData } = useFetch<ChineseCharacterTreeMapDTO[]>();

  useEffect(() => {
    if (!chars) {
      setData([]);
      return;
    }
    
    const filteredChars = filterChineseCharactersSearchParams(chars);

    if (filteredChars.length === 0) return;

    callFetch(CHINESE_CHARACTER_TREEMAP, filteredChars);

    return () => {
      abortFetch();
    }

  }, [chars, callFetch, abortFetch, setData])


  return {
    treemapsLoading: loading,
    treemapsError: error,
    treemapsData: data
  }

}