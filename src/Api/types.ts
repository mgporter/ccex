export interface ChineseCharacter {
  id: number,
  char: string,
  tradChars: TradCharacterStub[],
  components: ComponentStub[],
  derivatives: DerivativeStub[],
  variants: ChineseCharacterBasicDTO[],
  base: ChineseCharacterBasicDTO | null,
  primaryPinyin: string[],
  secondaryPinyin: string[],
  definition: string,
  description: string,
  frequency: number,
}

export interface TradCharacterStub {
  char: string,
  pinyin: string[],
  definition: string | null,
  description: string | null,
}

export interface ComponentStub {
  char: string,
  pinyin: string[],
  frequency: number,
  parent: string,
}

export interface DerivativeStub {
  char: string,
  pinyin: string[],
  frequency: number,
}

export interface ChineseCharacterBasicDTO {
  id: number,
  char: string,
  frequency: number,
}

export interface ChineseCharacterTreeMapDTO {
  id: number,
  char: string,
  components: ComponentStub[],
  derivatives: DerivativeStub[],
  primaryPinyin: string[],
  frequency: number,
}

export interface Pinyin {
  id: number,
  syllable: string,
  toneNumber: number,
  syllableWithToneMark: string,
  chars: ChineseCharacterBasicDTO[],
}