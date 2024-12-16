import useFetchChineseCharacters from "../Hooks/UseFetchChineseCharacters";
import CharacterTree from "./CharacterTree";
import { useSearchParams } from "react-router";


export default function Explorer() {

  const [searchParams] = useSearchParams();

  const { loading, error, data } = useFetchChineseCharacters(searchParams.get("chars"));

  return (
    <div id="explorer" className="flex items-center w-full min-h-[100vh] bg-stone-50">
      <div id="row" className="flex items-start justify-center min-h-[300px] gap-24 w-full">
        {loading && <div>Content is loading...</div>}
        {error && <div>Error loading character data: {error}</div>}
        {data && data.map(cchar => (
          <CharacterTree key={cchar.char} chineseCharacter={cchar} />
        ))}
      </div>
    </div>
  )
}