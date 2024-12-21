import { ChineseCharacter } from "../Api/types";
import { Cache } from "./Cache";

class ChineseCharacterCache extends Cache<ChineseCharacter, string> {

  constructor() {
    super((e: ChineseCharacter) => e.char);
  }

}

export const chineseCharacterCache = new ChineseCharacterCache();