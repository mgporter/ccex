// Just taking the first index of the string (str[0]) may not
// give us all of the codepoints of the first character. Doing
// [...str] will divide each character correctly, since a character
// may consist of more than two charcodes.
export function stringToUnicodeList(str: string): string[] {
  return [...str];
}

export function getChineseCharacterAt(str: string, index: number): string {
  return stringToUnicodeList(str).filter(c => isChinese(c))[index];
}

export function getChineseCharactersRange(str: string, start?: number, end?: number): string[] {
  return stringToUnicodeList(str).filter(c => isChinese(c)).slice(start, end);
}

export function isChinese(char: string): boolean {
  const cp = char.codePointAt(0);
  if (!cp) return false;
  return isCommonSet(cp) || isRadicalSet(cp) || isRareSet(cp) || isCustomSet(cp);
}

function isCommonSet(unicode: number): boolean {
  return unicode >= 0x4E00 && unicode <= 0x9FFF;
}

function isRareSet(unicode: number): boolean {
  return (unicode >= 0x3400 && unicode <= 0x4DBF) || (unicode >= 0x20000 && unicode <= 0x323AF);
}

function isRadicalSet(unicode: number): boolean {
  return unicode >= 0x2E80 && unicode <= 0x2FDF;
}

const customChineseSet = new Set<number>([
  0x3022,   // 〢
  0x31d6,   // ㇖
  0x31c0,   // ㇀
  0x30b3,   // コ
  0x31cf,   // ㇏
]);

function isCustomSet(unicode: number): boolean {
  return customChineseSet.has(unicode);
}