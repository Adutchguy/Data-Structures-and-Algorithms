'use strict';

/**
 * LRU Cache (Least Recently Used)
 *
 * A fixed-capacity key/value cache. When it is full, adding a new entry evicts
 * the entry that has gone unused the longest. Both get() and put() are O(1).
 *
 * The classic design combines two structures:
 *   - a hash map: key -> node          (O(1) lookup)
 *   - a doubly linked list of nodes     (O(1) "move to front" / "evict from back")
 * The front of the list is the most recently used entry, the back is the
 * least recently used. Sentinel head/tail nodes remove all the null-checks.
 */

class CacheNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

export default class LRUCache {
  constructor(capacity) {
    if (!(capacity > 0)) throw new RangeError('Capacity must be positive');
    this.capacity = capacity;
    this._map = new Map();
    this._head = new CacheNode(null, null); // sentinel: most-recent side
    this._tail = new CacheNode(null, null); // sentinel: least-recent side
    this._head.next = this._tail;
    this._tail.prev = this._head;
  }

  get size() {
    return this._map.size;
  }

  // Returns the value (and marks it most recently used), or undefined.
  get(key) {
    const node = this._map.get(key);
    if (!node) return undefined;
    this._unlink(node);
    this._pushFront(node);
    return node.value;
  }

  // Does NOT count as a "use".
  has(key) {
    return this._map.has(key);
  }

  put(key, value) {
    let node = this._map.get(key);
    if (node) {
      node.value = value;
      this._unlink(node);
      this._pushFront(node);
      return this;
    }
    node = new CacheNode(key, value);
    this._map.set(key, node);
    this._pushFront(node);
    if (this._map.size > this.capacity) {
      const lru = this._tail.prev;
      this._unlink(lru);
      this._map.delete(lru.key);
    }
    return this;
  }

  // Keys from most to least recently used.
  keys() {
    const result = [];
    for (let node = this._head.next; node !== this._tail; node = node.next) result.push(node.key);
    return result;
  }

  _unlink(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _pushFront(node) {
    node.next = this._head.next;
    node.prev = this._head;
    this._head.next.prev = node;
    this._head.next = node;
  }
}
