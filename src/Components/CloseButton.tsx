import { Button } from "@headlessui/react";
import { ButtonHTMLAttributes } from "react";

interface CloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  xClassName?: string;
}

export function CloseButton({ xClassName, ...props }: CloseButtonProps) {
  return (
    <Button 
      {...props}
      className={"flex justify-center items-center select-none cursor-pointer leading-none " + props.className}
    >
      <svg
        className={xClassName}
        viewBox="0 0 40.864025 40.864025"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 38.409207,38.606352 2.4548175,2.4404616 m 0,36.1658904 L 38.409207,2.4404616"
          strokeWidth="6" />
      </svg>
    </Button>
  )
}

export function CharacterDetailsInlineCloseButton({ xClassName, ...props }: CloseButtonProps) {
  return (
    <CloseButton 
      {...props}
      xClassName={"stroke-black " + xClassName}
      className={"bg-violet-200 border border-slate-500 \
        hover:bg-violet-300 transition-colors active:bg-violet-400 " + props.className} />
  )
}

export function CharacterDetailsDialogCloseButton({ xClassName, ...props }: CloseButtonProps) {
  return (
    <CloseButton
      {...props}
      xClassName={"stroke-black active:stroke-white " + xClassName}
      className={"border border-transparent transition-colors \
        hover:border-gray-500 hover:bg-orange-50 \
        active:bg-red-500 " + props.className} />
  )
}