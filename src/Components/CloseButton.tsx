import { Button } from "@headlessui/react";

interface CloseButtonProps {
  callback: () => void;
  className?: string;
  xClassName?: string;
}

export function CloseButton({ callback, className, xClassName }: CloseButtonProps) {
  return (
    <Button 
      className={"flex justify-center items-center select-none cursor-pointer leading-none " + className}
      onClick={callback}>
      <svg
        className={"" + xClassName}
        viewBox="0 0 40.864025 40.864025"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 38.409207,38.606352 2.4548175,2.4404616 m 0,36.1658904 L 38.409207,2.4404616"
          stroke-width="6" />
      </svg>
    </Button>
  )
}

export function CharacterDetailsInlineCloseButton({ callback, className, xClassName }: CloseButtonProps) {
  return (
    <CloseButton 
      xClassName={"stroke-black " + xClassName}
      callback={callback}
      className={"bg-violet-200 border border-slate-500 \
        hover:bg-violet-300 transition-colors active:bg-violet-400 " + className} />
  )
}

export function CharacterDetailsDialogCloseButton({ callback, className, xClassName }: CloseButtonProps) {
  return (
    <CloseButton 
      callback={callback}
      xClassName={"stroke-black active:stroke-white " + xClassName}
      className={"border border-transparent transition-colors \
        hover:border-gray-500 hover:bg-orange-50 \
        active:bg-red-500 " + className} />
  )
}