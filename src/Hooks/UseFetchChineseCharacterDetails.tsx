import { useEffect, useState } from "react";
import { CHINESE_CHARACTER_DETAILS } from "../Api/endpoints";
import { ChineseCharacter } from "../Api/types";
import useFetch from "./UseFetch";
import { chineseCharacterCache } from "../Utils/CharacterCharacterCache";


interface CharacterDetailsDataInfo {
  hasPrimaryPinyin: boolean;
  hasSecondaryPinyin: boolean; 
  hasTraditional: boolean;
  frequencyMeterNumber: number;
  hasTradDescriptions: boolean;
  hasComponents: boolean;
  hasDerivatives: boolean;
  hasVariants: boolean;
}



function getInfo(cchar: ChineseCharacter | null): CharacterDetailsDataInfo {
  const info: CharacterDetailsDataInfo = { 
    hasPrimaryPinyin: false,
    hasSecondaryPinyin: false, 
    hasTraditional: false,
    frequencyMeterNumber: 0,
    hasTradDescriptions: false,
    hasComponents: false,
    hasDerivatives: false,
    hasVariants: false
  }

  if (cchar) {
    info.hasPrimaryPinyin = cchar.primaryPinyin.length > 0;
    info.hasSecondaryPinyin = cchar.secondaryPinyin.length > 0;
    info.hasTraditional = cchar.tradChars.length > 0;
    info.hasTradDescriptions = info.hasTraditional && cchar.tradChars[0].description != null;
    info.frequencyMeterNumber = cchar.frequency === 100 ? 9 : Math.floor(cchar.frequency / 10);
    info.hasComponents = cchar.components.length > 0;
    info.hasDerivatives = cchar.derivatives.length > 0;
    info.hasVariants = cchar.variants.length > 0;
  }

  return info;
}


export default function useFetchChineseCharacterDetails() {

  const { loading, error, data, setData, callFetch, reset } = useFetch<ChineseCharacter>();
  const [ char, setChar ] = useState("");

  function fetchData(char: string) {
    if (char.length === 0) return;

    // Just taking the first index of the string (char[0]) may not
    // give us all of the codepoints of the first character. Doing
    // [...char] will divide each character correctly, since a character
    // may consist of more than two charcodes.
    char = [...char][0];

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
    loading,
    error,
    data,
    fetchData,
    reset,
    char,
    info: getInfo(data),
    notFound: !loading && !error && !data
  }

}