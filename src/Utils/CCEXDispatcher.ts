import { Dispatcher } from "./dispatcher";

interface CCEXEventMap {
  showCharDetails: string;
}

const ccexDispatcher = new Dispatcher<CCEXEventMap>();

export { ccexDispatcher };