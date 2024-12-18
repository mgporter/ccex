import { Button, Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import useFetchChineseCharacterDetails from "../Hooks/UseFetchChineseCharacterDetails";
import { ChineseCharacter, TradCharacterStub } from "../Api/types";
import { useRef } from "react";
import useScrollbarIsVisible from "../Hooks/UseScrollbarIsVisible";

interface CharacterDetailsDialogProps {
  isOpenState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  fetchDetailsHook: ReturnType<typeof useFetchChineseCharacterDetails>;
}

export default function CharacterDetailsDialog({ isOpenState: [isOpen, setIsOpen], fetchDetailsHook }: CharacterDetailsDialogProps) {

  const { detailsLoading, detailsError, detailsData, char } = fetchDetailsHook;
  const contentRef = useRef<HTMLDivElement | null>(null); // nullable, since the content div is conditionally rendered
  const scrollbarIsVisible = useScrollbarIsVisible(contentRef, detailsData);

  let 
    hasPrimaryPinyin = false,
    hasSecondaryPinyin = false, 
    hasTraditional = false,
    frequencyMeterUrl = "",
    hasTradDescriptions = false,
    hasComponents = false,
    hasDerivatives = false,
    hasVariants = false;

  if (detailsData) {
    hasPrimaryPinyin = detailsData.primaryPinyin.length > 0;
    hasSecondaryPinyin = detailsData.secondaryPinyin.length > 0;
    hasTraditional = detailsData.tradChars.length > 0;
    hasTradDescriptions = hasTraditional && detailsData.tradChars[0].description != null;

    const freqSection = detailsData.frequency === 100 ? 9 : Math.floor(detailsData.frequency / 10);
    frequencyMeterUrl = `/frequency-meter/freq${freqSection}0.png`;

    hasComponents = detailsData.components.length > 0;
    hasDerivatives = detailsData.derivatives.length > 0;
    hasVariants = detailsData.variants.length > 0;
  }


  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-[2000]">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4
        lg:p-0">
        <DialogPanel className="character-details-dialog gap-4 relative min-w-[500px] min-h-[300px] max-w-[80%]
          p-2 bg-stone-100 rounded-lg border border-gray-500
          lg:min-w-min lg:w-full lg:max-w-full lg:min-h-min">

          <LargeCharDisplayWidget char={char} />

          <Button 
            className={`absolute top-2 px-[6px] text-2xl text-red-700/60 select-none cursor-pointer
              border border-transparent
              ${scrollbarIsVisible ? "right-6" : "right-2"}
              hover:text-red-700/80 hover:border-gray-500 rounded-full
              active:text-black active:bg-red-700/50`}
            onClick={() => setIsOpen(false)}>
            ✖
          </Button>

          {detailsLoading && (
            <div className="content mt-24 italic max-w-[400px] text-center">Loading...</div>
          )}

          {detailsError && (
            <div className="content mt-24 italic max-w-[400px] text-center">There was an error loading character data.</div>
          )}

          {detailsData && 
            <>
              <div ref={contentRef} className="content max-h-[80vh] overflow-y-auto p-2 pb-6
                lg:max-h-max">

                <PinyinWidget 
                  data={detailsData}
                  hasPrimaryPinyin={hasPrimaryPinyin}
                  hasSecondaryPinyin={hasSecondaryPinyin}
                />

                <MainContentWidget 
                  data={detailsData}
                  hasTradDescriptions={hasTradDescriptions}
                  hasComponents={hasComponents}
                  hasVariants={hasVariants}
                  hasDerivatives={hasDerivatives}
                />

              </div>

              <div className="aside flex flex-col gap-6 pb-4">
                <FrequencyWidget url={frequencyMeterUrl} frequency={detailsData.frequency} />
                <TraditionalCharsWidget tradChars={detailsData.tradChars} hasTraditional={hasTraditional} />
              </div>

            </>
          }
        </DialogPanel>
      </div>
    </Dialog>
  )
}

function FrequencyWidget({url, frequency}: {url: string, frequency: number}) {
  return (
    <div className="flex flex-col items-center">
      <p className="mb-2">Frequency</p>
      <div className="relative mr-4">
        <img src={url} className="w-[3rem]" />
        <p className="inline absolute left-8 bottom-0 text-3xl italic">{frequency}</p>
      </div>
    </div>
  )
}

interface MainContentProps {
  data: ChineseCharacter;
  hasTradDescriptions: boolean;
  hasComponents: boolean;
  hasVariants: boolean;
  hasDerivatives: boolean;
}

function MainContentWidget({data, hasTradDescriptions, hasComponents, hasVariants, hasDerivatives}: MainContentProps) {
  return (
    <>
      <div className="mb-2 mt-6 font-semibold">
        <h3>Meaning: {data.definition}</h3>
          {data.base && <h4>This character is a variant of {data.base.char}</h4>}
      </div>

      
      <p className="mb-4 ml-4">{data.description}</p>

      {hasTradDescriptions && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">This character is also the combination of traditional characters with different meanings:</h4>
          {data.tradChars.map(c => (
            <p key={c.char} className="ml-4"><span className="font-semibold">{c.char} ({c.definition}): </span>{c.description}</p>
          ))}
        </div>
      )}

      <p><span className="font-semibold">Components: </span>{hasComponents ? data.components.map(c => c.char).join(", ") : <span className="italic">no components</span>}</p>
      {hasVariants && <p><span className="font-semibold">Variants: </span>{data.variants.map(c => c.char).join(", ")}</p>}
      <p><span className="font-semibold">Derivative characters: </span>{hasDerivatives ? data.derivatives.map(c => c.char).join(", ") : <span className="italic">no derivatives</span>}</p>
    </>
  )
}

function TraditionalCharsWidget({tradChars, hasTraditional}: {tradChars: TradCharacterStub[], hasTraditional: boolean}) {
  return (
    <div className="flex flex-col gap-2 items-center">
      <p className="">Traditional</p>
      <div className="flex flex-wrap gap-3 justify-center">
        {hasTraditional ? (
          <>
            {tradChars.map(c => <TradCharacterStubBox key={c.char} char={c} />)}
          </>
          ) : (
            <p className="italic text-center text-sm">Same as simplified</p>
          )} 
      </div>
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
  data: ChineseCharacter;
  hasPrimaryPinyin: boolean;
  hasSecondaryPinyin: boolean;
}

function PinyinWidget({data, hasPrimaryPinyin, hasSecondaryPinyin}: PinyinWidgetProps) {
  return (
    <h2 className="text-3xl font-bold mb-1">
      {hasPrimaryPinyin ? data.primaryPinyin.join(", ") : <span className="italic font-normal">No pronunciation</span>} 
      {hasSecondaryPinyin && ` (also ${data.secondaryPinyin.join(", ")})`}
    </h2>  
  )
}

function LargeCharDisplayWidget({char}:{char: string}) {
  return (
    <div className="absolute size-32 top-[-20px] left-[-20px] flex justify-center items-center pb-[8px]
      bg-amber-500 bg-[url('/character-background.jpg')] bg-contain border border-orange-600 shadow-lg
        text-[4.6rem] rounded-sm
        md:static"
    >{char}</div>    
  )
}