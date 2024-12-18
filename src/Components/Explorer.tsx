import { useEffect, useState } from "react";
import useFetchChineseCharacterTreeMaps from "../Hooks/UseFetchChineseCharacterTreeMaps";
import CharacterTree from "./CharacterTree";
import { useSearchParams } from "react-router";
import CharacterDetailsModal from "./CharacterDetailsDialog";
import useFetchChineseCharacterDetails from "../Hooks/UseFetchChineseCharacterDetails";
import DialogModel from "./DialogModal";
import useMatchMediaQuery from "../Hooks/UseMatchMediaQuery";


export default function Explorer() {

  const [searchParams] = useSearchParams();

  const { treemapsLoading, treemapsError, treemapsData } = useFetchChineseCharacterTreeMaps(searchParams.get("chars"));
  const fetchDetailsHook = useFetchChineseCharacterDetails();
  // const { detailsLoading, detailsError, detailsData, fetchCharData } = fetchDetailsHook;

  const dialogOpenState = useState(false);
  const [dialogIsOpen, setDialogIsOpen] = dialogOpenState;

  const isSmallScreen = useMatchMediaQuery("(max-width: 1024px)");

  function componentClickHandler(e: React.MouseEvent) {

    if (e.target instanceof HTMLElement) {
      const componentBox = e.target.closest("div.component-box");
      const char = componentBox?.getAttribute("data-char");

      if (char) {
        fetchDetailsHook.fetchCharData(char);
        setDialogIsOpen(true);
      }
    }

  }

  return (
    <div id="explorer" className="flex items-center justify-center w-full min-h-[100vh]">
      <CharacterDetailsModal isOpenState={dialogOpenState} fetchDetailsHook={fetchDetailsHook} />
      <div id="row" onClick={componentClickHandler} className="flex items-start justify-center gap-24 mx-[150px] mt-[210px] mb-[100px]
        lg:flex-col lg:justify-start lg:items-center lg:mx-0">
        {treemapsLoading && <div>Content is loading...</div>}
        {treemapsError && <div>Error loading character data: {treemapsError}</div>}
        {treemapsData && treemapsData.map(cchar => (
          <CharacterTree key={cchar.char} chineseCharacter={cchar} />
        ))}
      </div>
    </div>
  )
}