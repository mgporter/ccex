import { Button, Field, Input, Label } from "@headlessui/react";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { filterChineseCharactersSearchParams } from "../Hooks/UseFetchChineseCharacterTreeMaps";
import { useCCEXStore } from "../Hooks/UseCCEXExplorerStore";

export default function Navigator() {

  const inputRef = useRef<HTMLInputElement>(null!);
  const [searchParams, setSearchParams] = useSearchParams();
  const { showDerivatives, toggleShowDerivatives } = useCCEXStore();

  useEffect(() => {
    const charsParam = searchParams.get('chars');
    if (charsParam && inputRef.current.value !== charsParam) {
      inputRef.current.value = charsParam;
    }

  }, [searchParams])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const value = inputRef.current.value;

    const filteredChars = filterChineseCharactersSearchParams(value).join("");

    if (filteredChars.length === 0) return;

    setSearchParams({
      ...Object.fromEntries(searchParams),
      chars: filteredChars
    });

  }

  return (
    <div className="fixed z-[1000] flex justify-center top-0 left-0 w-full pointer-events-none
      lg:sticky ">
      <div className="flex flex-col justify-center items-center w-80 px-6 py-2 gap-1
        bg-gradient-to-b from-blue-800 to-blue-500 ring-2 ring-blue-600
        pointer-events-auto rounded-b-2xl shadow-2xl border-x-2 border-b-2 border-blue-400
        text-stone-200
        lg:w-full lg:rounded-none lg:shadow-none">
        <p>Enter Chinese characters:</p>
        <form onSubmit={handleSubmit} className="flex h-[2.4rem] w-full justify-center text-black
          lg:h-[3.6rem]">
          <Input ref={inputRef} name="charinput" type="text" className="grow h-full rounded-md shadow-md border border-blue-700 bg-white px-2
            lg:text-2xl lg:max-w-[70vw]" maxLength={10} spellCheck="false" />
          <Button type="submit" className="h-full font-bold bg-amber-100 hover:bg-amber-200 active:bg-amber-400 border border-blue-600 shadow-md ml-2 rounded-md px-2
            lg:text-xl">Go!</Button>
        </form>
        <Field className="flex items-center gap-1">
          <Label>Show derivative characters</Label>
          <Input type="checkbox" className="size-3" checked={showDerivatives} onChange={toggleShowDerivatives} />
        </Field>
      </div>
    </div>
  )
}