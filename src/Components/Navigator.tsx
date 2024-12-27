import { Button, Field, Input, Label } from "@headlessui/react";
import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useCCEXStore } from "../Hooks/UseCCEXExplorerStore";
import { getChineseCharactersRange } from "../Utils/CharacterUtils";
import { generateRandomChinese } from "../Utils/RandomButton";
import useSearchHistory from "../Hooks/UseSearchHistory";
import { CharacterWithTree } from "./ClickableCharacter";
import { ccexDispatcher } from "../Utils/CCEXDispatcher";

export default function Navigator() {

  const inputRef = useRef<HTMLInputElement>(null!);
  const [searchParams, setSearchParams] = useSearchParams();
  const { showDerivatives, toggleShowDerivatives } = useCCEXStore();
  const { history, addToHistory } = useSearchHistory();

  const fetchCharacterTrees = useCallback((chars: string): void => {
    const filteredChars = getChineseCharactersRange(chars).join("");

    if (filteredChars.length === 0) return;

    addToHistory(filteredChars);

    setSearchParams(prev => {
      prev.delete("details");
      return {
        ...Object.fromEntries(prev),
        chars: filteredChars,
      }
    });
  }, [addToHistory, setSearchParams]);

  useEffect(() => {
    const charsParam = searchParams.get('chars');
    if (charsParam && inputRef.current.value !== charsParam) {
      inputRef.current.value = charsParam;
    }

  }, [searchParams])

  useEffect(() => {
    const unsubscribe = ccexDispatcher.subscribe("showCharTree", (chars: string | null | undefined) => {
      if (chars) fetchCharacterTrees(chars);
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
        lg:w-full lg:rounded-none lg:shadow-none lg:border-x-0">
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
        <div className="noto-serif-sc text-left w-[20rem] whitespace-nowrap overflow-hidden overflow-ellipsis">
          {history.map(c => 
            <CharacterWithTree key={c} char={c} />
          )}
        </div>
      </div>
    </div>
  )
}