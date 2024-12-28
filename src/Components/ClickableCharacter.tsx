import { ccexDispatcher } from "../Utils/CCEXDispatcher";

interface ClickableCharacterProps {
  char: string;
  onClick: () => void;
  styles?: string;
}

export function ClickableCharacter({ char, onClick, styles }: ClickableCharacterProps) {
  return (
    <span
      onClick={onClick}
      className={"cursor-pointer noto-serif-sc " + styles}>
      { char }
    </span>
  ) 
}

export function CharacterWithDetails({ char, styles }: { char: string, styles?: string }) {
  return (
    <ClickableCharacter char={char} styles={styles} onClick={() => ccexDispatcher.dispatch("showCharDetails", char)} />
  )
}

export function CharacterWithTree({ char, styles }: { char: string, styles?: string }) {
  return (
    <ClickableCharacter char={char} styles={styles} onClick={() => ccexDispatcher.dispatch("showCharTree", char)} />
  )
}

export function DetailsDialogCharacters({ char }: { char: string }) {
  return (
    <CharacterWithDetails char={char} styles="inline-block border border-transparent 
      text-lg min-w-7 min-h-7 text-center rounded-md transition-all
      hover:text-red-700 hover:shadow-[2px_2px_0px_1px_rgba(0,0,0,0.6)] hover:border-gray-700/20
      hover:translate-x-[-2px] hover:translate-y-[-2px]
      active:bg-gray-300 " />
  )
}

export function NavigatorHistoryCharacter({ char }: { char: string }) {
  return (
    <CharacterWithTree char={char} styles="mx-1
      hover:text-red-700" />
  )
}