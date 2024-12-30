import { Button, Field, Input, Label } from "@headlessui/react";
import { useCallback, useEffect, useRef } from "react";
import { useCCEXStore } from "../Hooks/UseCCEXExplorerStore";
import { getChineseCharactersRange } from "../Utils/CharacterUtils";
import { generateRandomChinese } from "../Utils/RandomButton";
import useSearchHistory from "../Hooks/UseSearchHistory";
import { NavigatorHistoryCharacter } from "./ClickableCharacter";
import { ccexDispatcher, ShowCharTreeProps } from "../Utils/CCEXDispatcher";
import useSearchParamActions from "../Hooks/UseSearchParamActions";

export default function Navigator() {

  const inputRef = useRef<HTMLInputElement>(null!);
  const { setSearchParamTreeMaps, getSearchParamTreeMaps } = useSearchParamActions();
  const { showDerivatives, toggleShowDerivatives } = useCCEXStore();
  const { history, addToHistory } = useSearchHistory();

  const fetchCharacterTrees = useCallback((chars: string, pushToHistory: boolean = true): void => {
    const filteredChars = getChineseCharactersRange(chars).join("");

    if (filteredChars.length === 0) return;

    if (pushToHistory) addToHistory(filteredChars);

    setSearchParamTreeMaps(filteredChars);

  }, [addToHistory, setSearchParamTreeMaps]);

  useEffect(() => {
    if (getSearchParamTreeMaps && inputRef.current.value !== getSearchParamTreeMaps) {
      inputRef.current.value = getSearchParamTreeMaps;
    }
  }, [getSearchParamTreeMaps])

  useEffect(() => {
    const unsubscribe = ccexDispatcher.subscribe("showCharTree", ({chars, pushToHistory}: ShowCharTreeProps) => {
      if (chars) fetchCharacterTrees(chars, pushToHistory);
    })

    return unsubscribe;
  }, [fetchCharacterTrees])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchCharacterTrees(inputRef.current.value);
  }

  function handleRandom() {
    fetchCharacterTrees(generateRandomChinese(3));
  }



  return (
    <div className="fixed z-[1000] flex justify-center top-0 left-0 w-full pointer-events-none
      lg:sticky ">
      <div className="flex flex-col justify-center items-center min-w-[16rem] max-w-[24rem] px-3 py-2 gap-1 backdrop-blur-[1px]
        bg-gradient-to-b from-blue-400/70 to-blue-200/70 ring-1 ring-blue-600/60
        pointer-events-auto rounded-b-2xl shadow-2xl border-x-2 border-b-1 border-blue-300
        lg:w-full lg:max-w-full lg:rounded-none lg:shadow-none lg:border-x-0">
        <p>Enter Chinese characters:</p>
        <Field as="form" onSubmit={handleSubmit} className="flex h-[2.4rem] w-full justify-center text-black
          lg:h-[3.6rem]">
          <Input ref={inputRef} name="charinput" type="text" className="grow rounded-md shadow-md border border-blue-700 bg-white px-2 pt-1
            lg:text-2xl lg:max-w-[70vw] lg:min-w-12" maxLength={50} spellCheck="false" />
          <Button type="submit" className="font-bold bg-amber-100 hover:bg-amber-200 active:bg-amber-400 border border-blue-600 shadow-md ml-2 rounded-md px-2
            lg:text-xl">Go!</Button>
          <Button type="button" onClick={handleRandom}
            className="text-sm font-bold bg-green-100 hover:bg-green-200 active:bg-green-400 border border-blue-600 shadow-md ml-2 rounded-md px-2
            lg:text-base">Random</Button>
        </Field>
        <Field className="flex items-center gap-1">
          <Label>Show derivative characters</Label>
          <Input type="checkbox" className="size-4" checked={showDerivatives} onChange={toggleShowDerivatives} />
        </Field>
        {history.length > 0 && (
          <div className="relative w-full bg-white/30 py-[1px] px-[4px] rounded-md
            lg:rounded-none">
            <div className="noto-serif-sc py-[1px] items-center justify-end whitespace-nowrap overflow-hidden overflow-ellipsis">
              {history.map(c => 
                <NavigatorHistoryCharacter key={c} chars={c} isActive={getSearchParamTreeMaps === c} />
              )}
            </div>
            {/* <div className="absolute select-none top-[-0.8rem] left-[0px] italic text-[0.7rem] font-sans opacity-70">history</div>  */}
          </div>
        )}
      </div>
    </div>
  )
}