import { ChineseCharacterTreeMapDTO, DerivativeStub } from "../Api/types";
import { ccexDispatcher } from "../Utils/CCEXDispatcher";

export interface CharacterDerivativeBoxProps {
  chineseCharacter: ChineseCharacterTreeMapDTO;
}

function stubsToNodes(stubs: DerivativeStub[]): React.ReactNode[] {
  return stubs.map(c => <DerivativeBox key={c.char} char={c.char} />)
}

function reorderBoxes(stubs: DerivativeStub[], maxPerRow: number) {
  const boxes: React.ReactNode[] = stubsToNodes(stubs);
  const remainder = boxes.length % maxPerRow;
  const rowCount = remainder === 0 ? Math.floor(boxes.length / maxPerRow) : Math.floor(boxes.length / maxPerRow) + 1;
  const newBoxRows: React.ReactNode[][] = [];

  for (let i = (rowCount - 1) * maxPerRow; i >= 0; i -= maxPerRow) {
    const slice = boxes.slice(i, i + maxPerRow);
    while (slice.length < maxPerRow) {
      slice.push(<DerivativeBox key={slice.length} />);
    }
    newBoxRows.push(slice);
  }

  return newBoxRows.flatMap(x => x);

}

export default function CharacterDerivativeBox({ chineseCharacter }: CharacterDerivativeBoxProps) {
  
  let maxPerRow = 4;
  let reorderedCharacters;

  // If the number of derivatives is less than the maxPerRow number,
  // then just render that many boxes with that many columns, so that
  // they appear centered.
  // Otherwise, reorder the boxes so that the first ones (most frequent)
  // appear on the bottom rows.
  if (chineseCharacter.derivatives.length < maxPerRow) {
    reorderedCharacters = stubsToNodes(chineseCharacter.derivatives);
    maxPerRow = chineseCharacter.derivatives.length;
  } else {
    reorderedCharacters = reorderBoxes(chineseCharacter.derivatives, maxPerRow);
  }

  return (
    <div className="self-end justify-self-center mb-6 grid gap-1
      lg:gap-1 lg:self-auto lg:first-of-type:mt-24"
      style={{ gridTemplateColumns: `repeat(${maxPerRow}, auto)`}}>
      {reorderedCharacters}
    </div>
  )
}

function DerivativeBox({ char }: {char?: string}) {
  return (
    <div data-char={char} className="component-box flex items-center justify-center text-[1.3rem] border-2 size-[2.4rem] select-none cursor-pointer noto-serif-sc
      border-stone-400 bg-stone-100 active:border-stone-700 active:bg-stone-400
      opacity-50 hover:opacity-100"
      style={{ visibility: char ? "visible" : "hidden"}}
      onClick={() => ccexDispatcher.dispatch("showCharDetails", char)}>
      <p>{char}</p>
    </div>
  )
}