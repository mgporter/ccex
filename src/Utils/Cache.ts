export class Cache<ENTITY, KEY extends string | number> {

  private cache: Record<KEY, ENTITY>;
  private key: (e: ENTITY) => KEY;

  constructor(key: (e: ENTITY) => KEY) {
    this.cache = {} as Record<KEY, ENTITY>;
    this.key = key;
  }

  public addToCache(e: ENTITY): void {
    this.cache[this.key(e)] = e;
  }

  public addAllToCache(e_array: ENTITY[]): void {
    for (const e of e_array) {
      this.addToCache(e);
    }
  }

  public getFromCache(k: KEY): ENTITY | undefined {
    return this.cache[k];
  }

  /**
   * Call for single entity fetches. This function checks if the entity is in the cache,
   * and if so, calls the setDataAction with the entity from the cache. If not, then it 
   * calls the fetchAction.
   */
  public getFromCacheOrFetch(key: KEY, setDataAction: (e: ENTITY) => void, fetchAction: () => void): void {
    const cachedEntity = this.getFromCache(key);
    if (cachedEntity != undefined) {
      setDataAction(cachedEntity);
    } else {
      fetchAction();
    }
  }

  /**
   * Call for strings of multiple characters. This function only calls the fetchAction
   * callback for the characters in the passed in string that are missing from the
   * cache. It does not set any of the data: this must be done manually by the caller.
   */
  public fetchMissing(keys: KEY[], fetchAction: (c: KEY[]) => void) {
    const missingEntities = keys.filter(k => !this.getFromCache(k));
    if (missingEntities.length > 0) {
      fetchAction(missingEntities);
    }
  }

}