'use strict';

/**
 * Hash Table
 *
 * Maps keys to values in O(1) average time. A hash function turns a key into a
 * bucket index; collisions (two keys, same bucket) must be handled. Two classic
 * strategies are implemented here:
 *
 *   HashTable ................... separate chaining: each bucket is a small list.
 *   OpenAddressingHashTable ..... linear probing: on a collision, try the next slot.
 *
 * Both resize (double) when they get too full so chains/probe runs stay short.
 * Keys are compared by their string form, so 1 and '1' are the same key.
 *
 * Complexity (average): set / get / has / delete O(1). Worst case O(n) if every
 * key lands in the same bucket.
 */

// djb2-style string hash -> unsigned 32-bit integer.
export function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash * 33) ^ str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export default class HashTable {
  constructor(capacity = 8) {
    this._buckets = HashTable._makeBuckets(capacity);
    this.size = 0;
  }

  static _makeBuckets(n) {
    const buckets = new Array(n);
    for (let i = 0; i < n; i++) buckets[i] = [];
    return buckets;
  }

  get capacity() {
    return this._buckets.length;
  }

  get loadFactor() {
    return this.size / this._buckets.length;
  }

  _index(key) {
    return hashString(String(key)) % this._buckets.length;
  }

  set(key, value) {
    const bucket = this._buckets[this._index(key)];
    const skey = String(key);
    for (let i = 0; i < bucket.length; i++) {
      if (String(bucket[i][0]) === skey) {
        bucket[i][1] = value;
        return this;
      }
    }
    bucket.push([key, value]);
    this.size++;
    if (this.loadFactor > 0.75) this._resize(this._buckets.length * 2);
    return this;
  }

  get(key) {
    const skey = String(key);
    const bucket = this._buckets[this._index(key)];
    for (let i = 0; i < bucket.length; i++) {
      if (String(bucket[i][0]) === skey) return bucket[i][1];
    }
    return undefined;
  }

  has(key) {
    const skey = String(key);
    return this._buckets[this._index(key)].some(entry => String(entry[0]) === skey);
  }

  delete(key) {
    const skey = String(key);
    const bucket = this._buckets[this._index(key)];
    for (let i = 0; i < bucket.length; i++) {
      if (String(bucket[i][0]) === skey) {
        bucket.splice(i, 1);
        this.size--;
        return true;
      }
    }
    return false;
  }

  entries() {
    const result = [];
    this._buckets.forEach(bucket => bucket.forEach(entry => result.push([entry[0], entry[1]])));
    return result;
  }

  keys() {
    return this.entries().map(entry => entry[0]);
  }

  values() {
    return this.entries().map(entry => entry[1]);
  }

  _resize(newCapacity) {
    const old = this.entries();
    this._buckets = HashTable._makeBuckets(newCapacity);
    this.size = 0;
    old.forEach(entry => this.set(entry[0], entry[1]));
  }
}

const EMPTY = 0;
const USED = 1;
const TOMBSTONE = 2;

/**
 * Open addressing with linear probing.
 *
 * Deleting can't just empty a slot - that would break the probe sequence of
 * keys that collided past it. Instead we leave a TOMBSTONE marker: lookups skip
 * over it, inserts may reuse it. We rehash once used + tombstone slots exceed
 * half the table.
 */
export class OpenAddressingHashTable {
  constructor(capacity = 8) {
    this._init(capacity);
  }

  _init(capacity) {
    this._capacity = capacity;
    this._keys = new Array(capacity);
    this._values = new Array(capacity);
    this._state = new Array(capacity);
    for (let i = 0; i < capacity; i++) this._state[i] = EMPTY;
    this.size = 0;
    this._tombstones = 0;
  }

  get capacity() {
    return this._capacity;
  }

  _find(key) {
    const skey = String(key);
    let i = hashString(skey) % this._capacity;
    for (let probes = 0; probes < this._capacity; probes++) {
      if (this._state[i] === EMPTY) return -1;
      if (this._state[i] === USED && String(this._keys[i]) === skey) return i;
      i = (i + 1) % this._capacity;
    }
    return -1;
  }

  set(key, value) {
    const existing = this._find(key);
    if (existing !== -1) {
      this._values[existing] = value;
      return this;
    }
    if ((this.size + this._tombstones + 1) * 2 > this._capacity) this._rehash();

    let i = hashString(String(key)) % this._capacity;
    let firstTombstone = -1;
    while (this._state[i] !== EMPTY) {
      if (this._state[i] === TOMBSTONE && firstTombstone === -1) firstTombstone = i;
      i = (i + 1) % this._capacity;
    }
    if (firstTombstone !== -1) {
      i = firstTombstone;
      this._tombstones--;
    }
    this._keys[i] = key;
    this._values[i] = value;
    this._state[i] = USED;
    this.size++;
    return this;
  }

  get(key) {
    const i = this._find(key);
    return i === -1 ? undefined : this._values[i];
  }

  has(key) {
    return this._find(key) !== -1;
  }

  delete(key) {
    const i = this._find(key);
    if (i === -1) return false;
    this._state[i] = TOMBSTONE;
    this._keys[i] = undefined;
    this._values[i] = undefined;
    this.size--;
    this._tombstones++;
    return true;
  }

  entries() {
    const result = [];
    for (let i = 0; i < this._capacity; i++) {
      if (this._state[i] === USED) result.push([this._keys[i], this._values[i]]);
    }
    return result;
  }

  _rehash() {
    const old = this.entries();
    let capacity = this._capacity;
    while ((old.length + 1) * 2 > capacity) capacity *= 2;
    this._init(capacity);
    old.forEach(entry => this.set(entry[0], entry[1]));
  }
}
