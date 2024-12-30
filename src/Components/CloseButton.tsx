import { Button } from "@headlessui/react";

interface CloseButtonProps {
  callback: () => void;
  styles: string;
}

export function CloseButton({ callback, styles }: CloseButtonProps) {
  return (
    <Button 
      className={"text-2xl select-none cursor-pointer leading-none " + styles}
      onClick={callback}>
      ✖
    </Button>
  )
}

export function CharacterDetailsInlineCloseButton({ callback, styles }: CloseButtonProps) {
  return (
    <CloseButton 
      callback={callback}
      styles={"rounded-full text-black/70 shadow-md bg-violet-200 border border-slate-500 \
        hover:bg-violet-300 transition-colors active:bg-violet-400 " + styles} />
  )
}

export function CharacterDetailsDialogCloseButton({ callback, styles }: CloseButtonProps) {
  return (
    <CloseButton 
      callback={callback}
      styles={"text-red-600 border border-transparent pt-[5px] pb-[3px] transition-colors \
        hover:border-gray-500 hover:bg-orange-50 rounded-full \
        active:text-white active:bg-red-600 " + styles} />
  )
}