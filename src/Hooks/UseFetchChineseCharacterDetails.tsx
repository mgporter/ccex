import { useState } from "react";
import { CHINESE_CHARACTER_DETAILS } from "../Api/endpoints";
import { ChineseCharacter } from "../Api/types";
import useFetch from "./UseFetch";

export default function useFetchChineseCharacterDetails() {

  const { loading, error, data, callFetch, reset } = useFetch<ChineseCharacter>();
  const [ char, setChar ] = useState("");

  function fetchCharData(char: string) {
    setChar(char);
    callFetch(CHINESE_CHARACTER_DETAILS, char);
  }

  return {
    detailsLoading: loading,
    detailsError: error,
    detailsData: data,
    fetchCharData,
    detailsReset: reset,
    char
  }

}