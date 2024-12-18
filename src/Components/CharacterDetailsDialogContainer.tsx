import { useEffect, useRef } from "react";
import useFetchChineseCharacterDetails from "../Hooks/UseFetchChineseCharacterDetails";
import useMatchMediaQuery from "../Hooks/UseMatchMediaQuery";
import CharacterDetailsDialog, { CharacterDetailsInline } from "./CharacterDetailsDialog";
import DialogModel from "./DialogModal";

interface CharacterDetailsDialogProps {
  isOpenState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  fetchDetailsHook: ReturnType<typeof useFetchChineseCharacterDetails>;
}

export interface CharacterDetailsDataInfo {
  hasPrimaryPinyin: boolean;
  hasSecondaryPinyin: boolean; 
  hasTraditional: boolean;
  frequencyMeterUrl: string;
  hasTradDescriptions: boolean;
  hasComponents: boolean;
  hasDerivatives: boolean;
  hasVariants: boolean;
}

export default function CharacterDetailsDialogContainer({isOpenState, fetchDetailsHook}: CharacterDetailsDialogProps) {
  
  const isSmallScreen = useMatchMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    if (isSmallScreen) {
      window.scrollTo({top: 0, behavior: "instant"})
    }
  }, [fetchDetailsHook, isSmallScreen])

  const info: CharacterDetailsDataInfo = { 
    hasPrimaryPinyin: false,
    hasSecondaryPinyin: false, 
    hasTraditional: false,
    frequencyMeterUrl: "",
    hasTradDescriptions: false,
    hasComponents: false,
    hasDerivatives: false,
    hasVariants: false
  }

  const data = fetchDetailsHook.detailsData;

  if (data) {
    info.hasPrimaryPinyin = data.primaryPinyin.length > 0;
    info.hasSecondaryPinyin = data.secondaryPinyin.length > 0;
    info.hasTraditional = data.tradChars.length > 0;
    info.hasTradDescriptions = info.hasTraditional && data.tradChars[0].description != null;

    const freqSection = data.frequency === 100 ? 9 : Math.floor(data.frequency / 10);
    info.frequencyMeterUrl = `/frequency-meter/freq${freqSection}0.png`;

    info.hasComponents = data.components.length > 0;
    info.hasDerivatives = data.derivatives.length > 0;
    info.hasVariants = data.variants.length > 0;
  }

  if (isSmallScreen) {
    return (
      <CharacterDetailsInline isOpenState={isOpenState} fetchDetailsHook={fetchDetailsHook} info={info} />
    )
  } else {
    return (
      <DialogModel isOpenState={isOpenState}>
        <CharacterDetailsDialog isOpenState={isOpenState} fetchDetailsHook={fetchDetailsHook} info={info} />
      </DialogModel>  
    )
  }
}