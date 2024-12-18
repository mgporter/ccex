import { Button } from "@headlessui/react";

interface CloseButtonProps {
  callback: () => void;
  styles: string;
}

export default function CloseButton({ callback, styles }: CloseButtonProps) {
  return (
    <Button 
      className={"text-2xl text-red-700/60 select-none cursor-pointer border border-transparent \
        hover:text-red-700/80 hover:border-gray-500 rounded-full \
        active:text-black active:bg-red-700/50 " + styles}
      onClick={callback}>
      ✖
    </Button>
  )
}