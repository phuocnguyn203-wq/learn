class TypedCache<Key, Value> {
  map: Map<Key, Value>
  constructor() {
    this.map = new Map();
  }

  set(key: Key, value: Value) {
    this.map.set(key, value);
  }

  get(key: Key) {
    return this.map.get(key);
  }

  getOrSet(key: Key, factory: () => Value) {
    if (this.map.get(key)) {
      return this.map.get(key);
    }

    this.map.set(key, factory());
    return this.map.get(key);
  }
}

