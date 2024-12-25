import { useEffect } from "react";
import useFetchChineseCharacterDetails from "../Hooks/UseFetchChineseCharacterDetails";
import CharacterDetailsDialog, { CharacterDetailsInline } from "./CharacterDetailsDialog";
import DialogModel from "./DialogModal";
import { ChineseCharacterBasicDTO, ComponentStub, DerivativeStub } from "../Api/types";
import { createContext } from "react";

export const CharacterDetailsContext = createContext<ReturnType<typeof useFetchChineseCharacterDetails>>(null!);

interface CharacterDetailsDialogProps {
  isOpenState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  fetchDetailsHook: ReturnType<typeof useFetchChineseCharacterDetails>;
  isSmallScreen: boolean;
}

// export interface CharacterDetailsDataInfo {
//   hasPrimaryPinyin: boolean;
//   hasSecondaryPinyin: boolean; 
//   hasTraditional: boolean;
//   frequencyMeterNumber: number;
//   hasTradDescriptions: boolean;
//   hasComponents: boolean;
//   hasDerivatives: boolean;
//   hasVariants: boolean;
// }

type ObjectWithChar = { char: string }

function ensureUniqueChar<T extends ObjectWithChar>(arr: T[]): T[] {
  const map = new Map<string, T>();

  for (const obj of arr) {
    map.set(obj.char, obj);
  }

  return [...map.values()];
}

export default function CharacterDetailsDialogContainer({isOpenState, fetchDetailsHook, isSmallScreen}: CharacterDetailsDialogProps) {

  useEffect(() => {
    if (isSmallScreen) {
      window.scrollTo({top: 0, behavior: "instant"})
    }
  }, [fetchDetailsHook, isSmallScreen])

  // const info: CharacterDetailsDataInfo = { 
  //   hasPrimaryPinyin: false,
  //   hasSecondaryPinyin: false, 
  //   hasTraditional: false,
  //   frequencyMeterNumber: 0,
  //   hasTradDescriptions: false,
  //   hasComponents: false,
  //   hasDerivatives: false,
  //   hasVariants: false
  // }

  const data = fetchDetailsHook.data;

  if (data) {
    // info.hasPrimaryPinyin = data.primaryPinyin.length > 0;
    // info.hasSecondaryPinyin = data.secondaryPinyin.length > 0;
    // info.hasTraditional = data.tradChars.length > 0;
    // info.hasTradDescriptions = info.hasTraditional && data.tradChars[0].description != null;
    // info.frequencyMeterNumber = data.frequency === 100 ? 9 : Math.floor(data.frequency / 10);
    // info.hasComponents = data.components.length > 0;
    // info.hasDerivatives = data.derivatives.length > 0;
    // info.hasVariants = data.variants.length > 0;

    data.components = ensureUniqueChar<ComponentStub>(data.components);
    data.variants = ensureUniqueChar<ChineseCharacterBasicDTO>(data.variants);
    data.derivatives = ensureUniqueChar<DerivativeStub>(data.derivatives);
  }

  return (
    <CharacterDetailsContext.Provider value={fetchDetailsHook}>
      {isSmallScreen ? (
        <CharacterDetailsInline isOpenState={isOpenState} />
      ) : (
        <DialogModel isOpenState={isOpenState}>
          <CharacterDetailsDialog isOpenState={isOpenState} />
        </DialogModel>  
      )}
    </CharacterDetailsContext.Provider>
  )

}