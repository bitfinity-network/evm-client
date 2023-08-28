import { LRUCache } from "lru-cache";
import { Cache } from "./Interfaces";

class NodeCacheAdapter implements Cache {
  private lruCache: LRUCache<string, string>;

  constructor(maxItems: number) {
    this.lruCache = new LRUCache({
      max: maxItems,
    });
  }

  get(key: string): string | undefined {
    return this.lruCache.get(key);
  }

  set(key: string, value: string): void {
    this.lruCache.set(key, value);
  }
}

class BrowserCacheAdapter implements Cache {
  get(key: string): string | undefined {
    const serializedData = localStorage.getItem(key);
    return serializedData ?? undefined;
  }

  set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
}

export const createCache = (maxItems: number): Cache => {
  if (typeof window !== "undefined") {
    // Browser environment
    return new BrowserCacheAdapter();
  } else {
    // Node.js environment
    return new NodeCacheAdapter(maxItems);
  }
};

export class CacheManager {
  private cache: Cache;

  constructor(maxItems: number) {
    if (typeof window !== "undefined") {
      this.cache = new BrowserCacheAdapter();
    } else {
      this.cache = new NodeCacheAdapter(maxItems);
    }
  }

  get(key: string): string | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: string): void {
    this.cache.set(key, value);
  }
}
