import { Dispatcher } from "./Dispatcher";

export interface ShowCharTreeProps {
  chars: string | null | undefined;
  pushToHistory?: boolean;
}

interface CCEXEventMap {
  showCharDetails: string | null | undefined;
  showCharTree: ShowCharTreeProps;
}

const ccexDispatcher = new Dispatcher<CCEXEventMap>();

export { ccexDispatcher };