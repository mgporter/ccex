import { useState } from "react";
import useFetchChineseCharacterTreeMaps from "../Hooks/UseFetchChineseCharacterTreeMaps";
import CharacterTree from "./CharacterTree";
import CharacterDetailsDialogContainer from "./CharacterDetailsDialogContainer";
import CharacterDerivativeBox from "./CharacterDerivativeBox";
import React from "react";
import { useCCEXStore } from "../Hooks/UseCCEXExplorerStore";
import useSearchParamActions from "../Hooks/UseSearchParamActions";


export default function Explorer() {

  const { getSearchParamTreeMaps,  } = useSearchParamActions();
  const { treemapsLoading, treemapsError, treemapsData } = useFetchChineseCharacterTreeMaps(getSearchParamTreeMaps);
  const dialogOpenState = useState(false);
  const { showDerivatives } = useCCEXStore();

  const templateRows = treemapsData ? (showDerivatives ? 2 : 1) : 0;

  return (
    <div id="explorer" className="grid gap-x-24 px-[150px] pt-[210px] pb-[100px]
      content-start items-start justify-center
      w-full min-h-[100vh]
      lg:flex lg:flex-col lg:min-h-min lg:max-w-full lg:justify-start lg:items-center
      lg:px-0 lg:pt-0"
      style={{ gridTemplateRows: `repeat(${templateRows}, auto)`, gridAutoFlow: 'column' }}>

      <CharacterDetailsDialogContainer
        isOpenState={dialogOpenState} />

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