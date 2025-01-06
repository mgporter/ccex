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

export function CharacterWithTree({ chars, styles, pushToHistory }: { chars: string, styles?: string, pushToHistory?: boolean }) {
  return (
    <ClickableCharacter char={chars} styles={styles} onClick={() => ccexDispatcher.dispatch("showCharTree", { chars, pushToHistory } )} />
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

export function NavigatorHistoryCharacter({ chars, isActive }: { chars: string, isActive: boolean }) {
  const common = "border rounded-sm px-[2px] lg:select-none "
  const styles = isActive
    ? "text-black border-indigo-800 bg-orange-500/10 "
    : "text-blue-950 hover:border-indigo-800 hover:text-black border-transparent"
  return (
    <CharacterWithTree 
      chars={chars} 
      pushToHistory={false}
      styles={ common + styles } />
  )
}