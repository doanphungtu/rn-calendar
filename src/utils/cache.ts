export class LRUCache<K, V> {
  maxSize: number;
  map: Map<K, V>;
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.map = new Map();
  }
  get(key: K) {
    const v = this.map.get(key);
    if (v === undefined) return undefined;
    this.map.delete(key);
    this.map.set(key, v);
    return v;
  }
  set(key: K, value: V) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.maxSize) {
      const firstKey = this.map.keys().next().value;
      if (firstKey !== undefined) {
        this.map.delete(firstKey);
      }
    }
  }
}
