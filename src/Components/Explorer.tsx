import { useEffect, useState } from "react";
import useFetchChineseCharacterTreeMaps from "../Hooks/UseFetchChineseCharacterTreeMaps";
import CharacterTree from "./CharacterTree";
import { useSearchParams } from "react-router";
import useFetchChineseCharacterDetails from "../Hooks/UseFetchChineseCharacterDetails";
import CharacterDetailsDialogContainer from "./CharacterDetailsDialogContainer";
import CharacterDerivativeBox from "./CharacterDerivativeBox";
import { ccexDispatcher } from "../Utils/CCEXDispatcher";
import React from "react";
import useMatchSmallScreenQuery from "../Hooks/UseMatchSmallScreenQuery";
import { useCCEXStore } from "../Hooks/UseCCEXExplorerStore";


export default function Explorer() {

  const [searchParams] = useSearchParams();

  const { treemapsLoading, treemapsError, treemapsData } = useFetchChineseCharacterTreeMaps(searchParams.get("chars"));
  const fetchDetailsHook = useFetchChineseCharacterDetails();

  const dialogOpenState = useState(false);
  const setDialogIsOpen = dialogOpenState[1];

  const isSmallScreen = useMatchSmallScreenQuery();
  const { showDerivatives } = useCCEXStore();

  useEffect(() => {
    setDialogIsOpen(false);
  }, [setDialogIsOpen, searchParams])

  useEffect(() => {
    const unsubscribe = ccexDispatcher.subscribe("showCharDetails", (char: string) => {
      fetchDetailsHook.fetchData(char);
      setDialogIsOpen(true);
    });

    return unsubscribe;
  }, [fetchDetailsHook, setDialogIsOpen])

  // This will target any element with the classname "character-with-details"
  function characterClickHandler(e: React.MouseEvent) {

    if (e.target instanceof HTMLElement) {
      const componentBox = e.target.closest(".character-with-details");
      const char = componentBox?.getAttribute("data-char");

      if (char) {
        fetchDetailsHook.fetchData(char);
        setDialogIsOpen(true);
      }
    }

  }

  // If the data is available, then:
  //  for small screens, we need one row per character
  //  for large screens, we only need one row for everything
  //  if we want to show derivatives, we then need to double the number of rows
  const templateRows = !treemapsData ? 0 : 
    (showDerivatives ? 2 : 1) * (isSmallScreen ? treemapsData.length : 1)

  return (
    <div id="explorer" className="grid gap-x-24 px-[150px] pt-[210px] pb-[100px]
      content-start items-start justify-center
      w-full min-h-[100vh]
      lg:flex lg:flex-col lg:min-h-min lg:max-w-full lg:justify-start lg:items-center
      lg:px-0 lg:pt-0"
      style={{ gridTemplateRows: `repeat(${templateRows}, auto)`, gridAutoFlow: 'column' }}
      onClick={characterClickHandler}>

      <CharacterDetailsDialogContainer
        isOpenState={dialogOpenState} 
        fetchDetailsHook={fetchDetailsHook}
        isSmallScreen={isSmallScreen} />

      {treemapsLoading && <div>Content is loading...</div>}
      {treemapsError && <div>Error loading character data: {treemapsError}</div>}

      {treemapsData && (
        <>
          {treemapsData.map((cchar, i) => (
            <React.Fragment key={`${cchar.char}-${i}`}>
              {showDerivatives && <CharacterDerivativeBox chineseCharacter={cchar} />}
              <CharacterTree chineseCharacter={cchar} />
            </React.Fragment>
          ))}
        </>
      )}

    </div>
  )
}