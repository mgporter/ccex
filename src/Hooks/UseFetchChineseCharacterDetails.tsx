import { useEffect, useState } from "react";
import { CHINESE_CHARACTER_DETAILS } from "../Api/endpoints";
import { ChineseCharacter } from "../Api/types";
import useFetch from "./UseFetch";
import { chineseCharacterCache } from "../Utils/CharacterCharacterCache";
import { getChineseCharacterAt } from "../Utils/CharacterUtils";


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


export default function useFetchChineseCharacterDetails(char: string | undefined | null) {

  const { loading, error, data, setData, callFetch, reset, abortFetch } = useFetch<ChineseCharacter>();
  const [ controlledChar, setControlledChar ] = useState("");

  // useEffect(() => {
  //   if (char && char.length > 0) {

  //     const firstChar = getChineseCharacterAt(char, 0);
  
  //     chineseCharacterCache.getFromCacheOrFetch(
  //       firstChar,
  //       setData,
  //       () => callFetch(CHINESE_CHARACTER_DETAILS, char)
  //     );
  //   } else {
  //     setData(null);
  //   }
  // }, [char, callFetch, setData])

  useEffect(() => {

    if (!char) {
      setData(null);
      return;
    }

    const firstChar = getChineseCharacterAt(char, 0);

    if (!firstChar) return;

    setControlledChar(char);

    chineseCharacterCache.getFromCacheOrFetch(
      firstChar,
      setData,
      () => callFetch(CHINESE_CHARACTER_DETAILS, firstChar)
    );

    return () => {
      abortFetch();
    }

  }, [char, callFetch, abortFetch, setData])


  useEffect(() => {
    if (data) {
      chineseCharacterCache.addToCache(data);
    }
  }, [data])

  return {
    loading,
    error,
    data,
    reset,
    char: controlledChar,
    info: getInfo(data),
    notFound: !loading && !error && !data
  }

}