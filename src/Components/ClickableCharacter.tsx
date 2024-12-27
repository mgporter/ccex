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
      className={"cursor-pointer mx-1 noto-serif-sc text-lg \
      hover:text-red-500 " + styles}>
      {char}
    </span>
  ) 
}

export function CharacterWithDetails({ char }: { char: string, styles?: string }) {
  return (
    <ClickableCharacter char={char} onClick={() => ccexDispatcher.dispatch("showCharDetails", char)} />
  )
}

export function CharacterWithTree({ char }: { char: string, styles?: string }) {
  return (
    <ClickableCharacter char={char} onClick={() => ccexDispatcher.dispatch("showCharTree", char)} />
  )
}