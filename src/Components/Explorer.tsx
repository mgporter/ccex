import { useEffect } from "react";
import useFetchChineseCharacters from "../Hooks/UseFetchChineseCharacters";
import CharacterTree from "./CharacterTree";
import { useSearchParams } from "react-router";


export default function Explorer() {

  const [searchParams] = useSearchParams();

  const { loading, error, data } = useFetchChineseCharacters(searchParams.get("chars"));

  useEffect(() => {

  }, []);

  return (
    <div id="explorer" className="flex items-center justify-center w-full min-h-[100vh]">
      <div id="row" className="flex items-start justify-center gap-24 mx-[150px] mt-[210px] mb-[100px]">
        {loading && <div>Content is loading...</div>}
        {error && <div>Error loading character data: {error}</div>}
        {data && data.map(cchar => (
          <CharacterTree key={cchar.char} chineseCharacter={cchar} />
        ))}
      </div>
    </div>
  )
}