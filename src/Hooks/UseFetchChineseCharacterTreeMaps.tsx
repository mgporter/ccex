import { useEffect, useState } from "react";
import { CHINESE_CHARACTER_TREEMAP } from "../Api/endpoints";
import { ChineseCharacterTreeMapDTO } from "../Api/types";
import useFetch from "./UseFetch";
import { chineseCharacterTreeMapCache } from "../Utils/CharacterCharacterTreeMapCache";

export function filterChineseCharactersSearchParams(chars: string): string[] {
  return chars.split("").filter(char => {
    const codePoint = char.codePointAt(0);
    return codePoint && codePoint >= 12032;
  });
}

export default function useFetchChineseCharacterTreeMaps(chars: string | undefined | null) {

  const { loading, error, data, callFetch, abortFetch, setData } = useFetch<ChineseCharacterTreeMapDTO[]>();
  const [ dataWithCache, setDataWithCache ] = useState<ChineseCharacterTreeMapDTO[] | null>(null);

  useEffect(() => {
    if (!chars) {
      setData([]);
      return;
    }
    
    const filteredChars = filterChineseCharactersSearchParams(chars);

    if (filteredChars.length === 0) return;

    chineseCharacterTreeMapCache.fetchMissing(
      filteredChars,
      (c: string[]) => callFetch(CHINESE_CHARACTER_TREEMAP, c.join(""))
    );

    return () => {
      abortFetch();
    }

  }, [chars, callFetch, abortFetch, setData])

  useEffect(() => {
    if (data && chars) {

      const dataMap: Record<string, ChineseCharacterTreeMapDTO> = {};

      for (const entity of data) {
        dataMap[entity.char] = entity;
      }

      const completeData = chars
        .split("")
        .map(c => dataMap[c] || chineseCharacterTreeMapCache.getFromCache(c))
        .filter(Boolean);

      chineseCharacterTreeMapCache.addAllToCache(completeData);

      setDataWithCache(completeData);
    }
  }, [chars, data])


  return {
    treemapsLoading: loading,
    treemapsError: error,
    treemapsData: dataWithCache
  }

}