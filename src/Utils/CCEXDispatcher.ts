import { Dispatcher } from "./Dispatcher";

interface CCEXEventMap {
  showCharDetails: string;
}

const ccexDispatcher = new Dispatcher<CCEXEventMap>();

export { ccexDispatcher };