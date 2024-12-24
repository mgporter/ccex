import useFetchChineseCharacterDetails from "../Hooks/UseFetchChineseCharacterDetails";
import { ChineseCharacter, TradCharacterStub } from "../Api/types";
import { useRef } from "react";
import useScrollbarIsVisible from "../Hooks/UseScrollbarIsVisible";
import CloseButton from "./CloseButton";
import { CharacterDetailsDataInfo } from "./CharacterDetailsDialogContainer";

import freq00 from '/frequency-meter/freq00.png';
import freq10 from '/frequency-meter/freq10.png';
import freq20 from '/frequency-meter/freq20.png';
import freq30 from '/frequency-meter/freq30.png';
import freq40 from '/frequency-meter/freq40.png';
import freq50 from '/frequency-meter/freq50.png';
import freq60 from '/frequency-meter/freq60.png';
import freq70 from '/frequency-meter/freq70.png';
import freq80 from '/frequency-meter/freq80.png';
import freq90 from '/frequency-meter/freq90.png';
import { ccexDispatcher } from "../Utils/CCEXDispatcher";

const frequencyMeterUrls: Record<number, string> = {
  0: freq00,
  1: freq10,
  2: freq20,
  3: freq30,
  4: freq40,
  5: freq50,
  6: freq60,
  7: freq70,
  8: freq80,
  9: freq90,
};

interface CharacterDetailsDialogAndInlineProps {
  isOpenState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  fetchDetailsHook: ReturnType<typeof useFetchChineseCharacterDetails>;
  info: CharacterDetailsDataInfo;
}

export default function CharacterDetailsDialog({ isOpenState, fetchDetailsHook, info }: CharacterDetailsDialogAndInlineProps) {

  const { detailsError, detailsData, char } = fetchDetailsHook;
  const contentRef = useRef<HTMLDivElement | null>(null); // nullable, since the content div is conditionally rendered
  const scrollbarIsVisible = useScrollbarIsVisible(contentRef, detailsData);
  const setIsOpen = isOpenState[1];

  return (
    <div className="character-details-dialog gap-4 p-2">
      <LargeCharDisplayWidget char={char} size={128} styles="absolute top-[-20px] left-[-20px]" />

      <CloseButton callback={() => setIsOpen(false)} styles={`absolute top-2 px-[6px] ${scrollbarIsVisible ? "right-6" : "right-2"}`} />

      {detailsError && (
        <div className="content mt-24 italic max-w-[400px] text-center">There was an error loading character data.</div>
      )}

      {!detailsError && 
        <>
          <div ref={contentRef} className="content max-h-[80vh] overflow-y-auto p-2 pb-6">

            <PinyinWidget 
              data={detailsData}
              info={info}
            />

            <MainContentWidget 
              data={detailsData}
              info={info}
            />

          </div>

          <div className="aside flex flex-col gap-6 pb-4">
            <FrequencyWidget 
              meterNumber={info.frequencyMeterNumber} 
              data={detailsData} />
            <TraditionalCharsWidget 
              data={detailsData}
              info={info} />
          </div>

        </>
      }
    </div>
  )
}

export function CharacterDetailsInline({isOpenState, fetchDetailsHook, info}: CharacterDetailsDialogAndInlineProps) {

  const { detailsLoading, detailsError, detailsData, char } = fetchDetailsHook;
  const [isOpen, setIsOpen] = isOpenState;

  return (
    <aside className={`character-details-inline flex flex-col px-2 py-8 bg-slate-200 border-y border-slate-400
      ${isOpen ? "" : "hidden"}`}>
      <div className="flex gap-4 justify-evenly items-center">

        <div className="flex flex-col items-center">
          <LargeCharDisplayWidget char={char} size={96} />
          {detailsData && 
            <PinyinWidget 
              data={detailsData} 
              info={info}
              styles="text-center mt-2" />}
        </div>

        {detailsData && 
          <>
            <FrequencyWidget 
              meterNumber={info.frequencyMeterNumber} 
              data={detailsData} />
            <TraditionalCharsWidget 
              data={detailsData}
              info={info} />       
          </>}

      </div>


      {detailsLoading && (
        <div className="content italic max-w-[400px] text-center">Loading...</div>
      )}

      {detailsError && (
        <div className="content italic max-w-[400px] text-center">There was an error loading character data.</div>
      )}

      {detailsData && 
        <MainContentWidget 
          data={detailsData}
          info={info}
        />
      }

      <CloseButton 
        callback={() => setIsOpen(false)} 
        styles={`w-full mt-12 bg-red-100 h-12 border-slate-500/50`} 
      />

    </aside>
  )
}


interface FrequencyWidgetProps {
  meterNumber: number;
  data: ChineseCharacter | null;
}

function FrequencyWidget({meterNumber, data}: FrequencyWidgetProps) {
  return (
    <div className="flex flex-col items-center">
      <p className="mb-2">Frequency</p>
      {data ? (
        <div className="relative mr-4">
          <img src={frequencyMeterUrls[meterNumber]} className="w-[3rem]" />
          <p className="inline absolute left-8 bottom-0 text-3xl italic">{data.frequency}</p>
        </div>
      ) : (
        <div className="loading-pulse w-[5rem] h-[3.4rem] bg-gray-200 rounded-md" />
      )}
    </div>
  )
}

interface MainContentProps {
  data: ChineseCharacter | null;
  info: CharacterDetailsDataInfo;
}

function MainContentWidget({ data, info }: MainContentProps) {
  if (data) {
    return (
      <>
        <div className="mb-2 mt-6 font-semibold">
          <h3>Meaning: {data.definition}</h3>
            {data.base && <h4>This character is a variant of {data.base.char}</h4>}
        </div>

        
        <p className="mb-4 ml-4">{data.description}</p>

        {info.hasTradDescriptions && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">This character is also the combination of traditional characters with different meanings:</h4>
            {data.tradChars.map(c => (
              <p key={c.char} className="ml-4"><span className="font-semibold">{c.char} ({c.definition}): </span>{c.description}</p>
            ))}
          </div>
        )}

        <p>
          <span className="font-semibold">Components: </span>
          {info.hasComponents ? data.components.map(c => <CharacterWithDispatch key={c.char} char={c.char} />) : <span className="italic">no components</span>}
        </p>

        {info.hasVariants && <p>
          <span className="font-semibold">Variants: </span>{data.variants.map(c => <CharacterWithDispatch key={c.char} char={c.char} />)}
        </p>}

        <p>
          <span className="font-semibold">Derivative characters: </span>
          {info.hasDerivatives ? data.derivatives.map(c => <CharacterWithDispatch key={c.char} char={c.char} />) : <span className="italic">no derivatives</span>}
        </p>
      </>
    )
  } else {
    return (
      <div className="loading-pulse">
        <div className="mb-2 mt-6 h-[1.8rem] w-[8rem] bg-gray-200 rounded-md" />    
        <div className="mb-4 ml-4 h-[6rem] w-[90%] bg-gray-200 rounded-md" />    
        <div className="mb-2 h-[1.4rem] w-[60%] bg-gray-200 rounded-md" />    
        <div className="h-[1.4rem] w-[60%] bg-gray-200 rounded-md" />    
      </div>      
    )
  }
}

interface TraditionalCharsWidgetProps {
  data: ChineseCharacter | null;
  info: CharacterDetailsDataInfo;
}

function TraditionalCharsWidget({ data, info }: TraditionalCharsWidgetProps) {
  return (
    <div className="flex flex-col gap-2 items-center">
      <p className="">Traditional</p>
      {data ? (
        <div className="flex flex-wrap gap-3 justify-center">
        {info.hasTraditional ? (
          <>
            {data.tradChars.map(c => <TradCharacterStubBox key={c.char} char={c} />)}
          </>
          ) : (
            <p className="italic text-center text-sm">Same as simplified</p>
          )} 
      </div>
      ) : (
        <div className="h-[3.6rem] w-[4rem] bg-gray-200 rounded-md"></div>
      )}
    </div>
  )
}

function TradCharacterStubBox({char}: {char: TradCharacterStub}) {

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center bg-[url('/character-background.jpg')] bg-contain 
        items-center size-10 border border-slate-700 rounded-sm text-2xl pb-[1px]">{char.char}</div>
      <div className="text-sm text-center">{char.pinyin.join(", ")}</div>
    </div>
  )
}

interface PinyinWidgetProps {
  data: ChineseCharacter | null;
  info: CharacterDetailsDataInfo;
  styles?: string;
}

function PinyinWidget({data, info, styles}: PinyinWidgetProps) {

  return (
    data ? (
      <h2 className={"text-3xl font-bold mb-1 " + styles}>
        {info.hasPrimaryPinyin ? data.primaryPinyin.join(", ") : <span className="italic font-normal">No pronunciation</span>} 
        {info.hasSecondaryPinyin && ` (also ${data.secondaryPinyin.join(", ")})`}
      </h2>  
    ) : (
      <div className="h-[2.2rem] w-[6rem] bg-gray-200 rounded-md"></div>
    )
  )
}


function LargeCharDisplayWidget({ char, styles, size }:{char: string, size:number, styles?: string}) {
  return (
    <div className={"flex justify-center items-center pb-[0%] \
      bg-amber-500 bg-[url('/character-background.jpg')] bg-contain border border-orange-600 shadow-lg \
        rounded-sm " + styles}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size / 27.8261}rem`,
      }}
    >{char}</div>    
  )
}


function CharacterWithDispatch({ char }: { char: string }) {
  return (
    <span
      onClick={() => ccexDispatcher.dispatch("showCharDetails", char)}
      className="cursor-pointer mx-1
      hover:text-red-500">
      {char}
    </span>
  )
}