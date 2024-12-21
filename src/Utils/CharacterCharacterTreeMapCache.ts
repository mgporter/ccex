import { ChineseCharacterTreeMapDTO } from "../Api/types";
import { Cache } from "./Cache";

class ChineseCharacterTreeMapCache extends Cache<ChineseCharacterTreeMapDTO, string> {

  constructor() {
    super((e: ChineseCharacterTreeMapDTO) => e.char);
  }

}

export const chineseCharacterTreeMapCache = new ChineseCharacterTreeMapCache();