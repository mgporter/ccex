import { Button, Input } from "@headlessui/react";
import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { filterChineseCharactersSearchParams } from "../Hooks/UseFetchChineseCharacters";

export default function Navigator() {

  const inputRef = useRef<HTMLInputElement>(null!);
  const [searchParams, setSearchParams] = useSearchParams();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const value = inputRef.current.value;
    
    if (value.length === 0 || value === searchParams.get('chars')) return;

    const chars = filterChineseCharactersSearchParams(value);

    if (chars.length > 0) {
      setSearchParams({
        ...Object.fromEntries(searchParams),
        chars: filterChineseCharactersSearchParams(value)
      });
    }
  }

  return (
    <div className="fixed flex justify-center top-0 left-0 w-full h-16 pointer-events-none">
      <div className="flex justify-center items-center h-full w-80 
        bg-gradient-to-b from-blue-800 to-blue-500 ring-2 ring-blue-600
        pointer-events-auto rounded-b-2xl shadow-2xl border-x-2 border-b-2 border-blue-400">
        <form onSubmit={handleSubmit} className="h-[2.4rem]">
          <Input ref={inputRef} name="chars" type="text" className="h-full rounded-sm shadow-md border border-blue-700 bg-white px-2 data-[focus]:bg-white" maxLength={10} />
          <Button type="submit" className="h-full font-bold bg-amber-100 border border-blue-600 shadow-md ml-2 rounded-sm px-2 data-[hover]">Go!</Button>
        </form>
      </div>
    </div>
  )
}