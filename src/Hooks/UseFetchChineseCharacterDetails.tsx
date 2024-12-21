import { useEffect, useState } from "react";
import { CHINESE_CHARACTER_DETAILS } from "../Api/endpoints";
import { ChineseCharacter } from "../Api/types";
import useFetch from "./UseFetch";
import { chineseCharacterCache } from "../Utils/CharacterCharacterCache";


export default function useFetchChineseCharacterDetails() {

  const { loading, error, data, setData, callFetch, reset } = useFetch<ChineseCharacter>();
  const [ char, setChar ] = useState("");

  function fetchCharData(char: string) {
    if (char.length === 0) return;
    char = char[0];
    setChar(char);

    chineseCharacterCache.getFromCacheOrFetch(
      char,
      setData,
      () => callFetch(CHINESE_CHARACTER_DETAILS, char)
    );

  }

  useEffect(() => {
    if (data) {
      chineseCharacterCache.addToCache(data);
    }
  }, [data])

  return {
    detailsLoading: loading,
    detailsError: error,
    detailsData: data,
    fetchCharData,
    detailsReset: reset,
    char
  }

}