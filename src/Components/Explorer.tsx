import { useState } from "react";
import useFetchChineseCharacterTreeMaps from "../Hooks/UseFetchChineseCharacterTreeMaps";
import CharacterTree from "./CharacterTree";
import CharacterDetailsDialogContainer from "./CharacterDetailsDialogContainer";
import CharacterDerivativeBox from "./CharacterDerivativeBox";
import React from "react";
import { useCCEXStore } from "../Hooks/UseCCEXExplorerStore";
import useSearchParamActions from "../Hooks/UseSearchParamActions";
import AppInfoBox from "./AppInfoBox";
import DragScrollDiv from "./DragScrollDiv";

export default function Explorer() {

  const { getSearchParamTreeMaps,  } = useSearchParamActions();
  const { treemapsLoading, treemapsError, treemapsData } = useFetchChineseCharacterTreeMaps(getSearchParamTreeMaps);
  const dialogOpenState = useState(false);
  const { showDerivatives } = useCCEXStore();

  const templateRows = treemapsData ? (showDerivatives ? 2 : 1) : 0;

  const { appContainer } = useCCEXStore();


  return (
    <DragScrollDiv 
      id="explorer"
      container={appContainer}
      className="relative flex flex-col gap-8 justify-between pt-[210px] pb-[20px] z-1 w-fit min-w-full min-h-full
        lg:self-center lg:pt-0 lg:gap-0 lg:min-h-[calc(100%-12rem)] cursor-grab">

      <CharacterDetailsDialogContainer
        isOpenState={dialogOpenState} />

      <div id="explorer-row"
        className="relative grid px-[150px] gap-x-24 content-start items-start justify-center min-w-max
        lg:flex lg:flex-col lg:min-h-min lg:min-w-24 lg:max-w-full lg:justify-start lg:items-center
        lg:px-0"
        style={{ gridTemplateRows: `repeat(${templateRows}, auto)`, gridAutoFlow: 'column' }}>
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

      <AppInfoBox />

    </DragScrollDiv>
  )
}