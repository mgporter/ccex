import { Button, Input, Label } from "@headlessui/react";
import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { filterChineseCharactersSearchParams } from "../Hooks/UseFetchChineseCharacterTreeMaps";

export default function Navigator() {

  const inputRef = useRef<HTMLInputElement>(null!);
  const [searchParams, setSearchParams] = useSearchParams();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const value = inputRef.current.value;

    const chars = filterChineseCharactersSearchParams(value);

    if (chars.length === 0 || chars === searchParams.get('chars')) return;

    if (chars.length > 0) {
      setSearchParams({
        ...Object.fromEntries(searchParams),
        chars: filterChineseCharactersSearchParams(value)
      });
    }
  }

  return (
    <div className="fixed z-[1000] flex justify-center top-0 left-0 w-full pointer-events-none">
      <div className="flex flex-col justify-center items-center w-80 px-6 py-2 gap-1
        bg-gradient-to-b from-blue-800 to-blue-500 ring-2 ring-blue-600
        pointer-events-auto rounded-b-2xl shadow-2xl border-x-2 border-b-2 border-blue-400">
        <p className="text-stone-100/80">Enter Chinese characters:</p>
        <form onSubmit={handleSubmit} className="flex h-[2.4rem] w-full">
          <Input ref={inputRef} name="charinput" type="text" className="grow h-full rounded-sm shadow-md border border-blue-700 bg-white px-2" maxLength={10} spellCheck="false" />
          <Button type="submit" className="h-full font-bold bg-amber-100 hover:bg-amber-200 active:bg-amber-400 border border-blue-600 shadow-md ml-2 rounded-sm px-2 data-[hover]">Go!</Button>
        </form>
      </div>
    </div>
  )
}