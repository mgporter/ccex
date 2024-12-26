import { Dispatcher } from "./Dispatcher";

interface CCEXEventMap {
  showCharDetails: string | null;
}

const ccexDispatcher = new Dispatcher<CCEXEventMap>();

export { ccexDispatcher };