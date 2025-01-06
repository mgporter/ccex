import { NavigatorHistoryCharacter } from "./ClickableCharacter";

interface ExplorerHistoryProps {
  history: string[];
  activeItem: string | null;
}

export default function ExplorerHistory({ history, activeItem }: ExplorerHistoryProps) {
  return (
    <div className="relative w-full bg-white/30 py-[2px] px-[1%] rounded-md
      lg:rounded-none">
      <div className="noto-serif-sc py-[1px] items-center justify-end whitespace-nowrap overflow-x-hidden overflow-ellipsis">
        {history.map(c => 
          <NavigatorHistoryCharacter key={c} chars={c} isActive={activeItem === c} />
        )}
      </div>
    </div>
  )
}