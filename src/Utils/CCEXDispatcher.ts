import { Dispatcher } from "./Dispatcher";

interface CCEXEventMap {
  showCharDetails: string | null | undefined;
}

const ccexDispatcher = new Dispatcher<CCEXEventMap>();

export { ccexDispatcher };