import { createContext, useContext } from "react";
import useFetchChineseCharacterDetails from "./UseFetchChineseCharacterDetails";

export const CharacterDetailsContext = createContext<ReturnType<typeof useFetchChineseCharacterDetails>>(null!);

export default function useCharacterDetailsContext() {
  return useContext(CharacterDetailsContext);
}