'use strict';

/**
 * Skip List
 *
 * A sorted linked list with "express lanes". Level 0 is an ordinary sorted
 * list; each higher level skips over more nodes. A node's height is chosen by
 * coin flips (each extra level with probability p), so on average half the
 * nodes reach level 1, a quarter reach level 2, and so on.
 *
 * Search starts at the top lane, moves right while the next value is smaller,
 * then drops down a level, and repeats - like binary search on a list.
 *
 * Complexity (expected): insert / contains / remove O(log n), space O(n).
 * It gives balanced-tree performance with much simpler code (no rotations) and
 * is used in practice by Redis sorted sets and LevelDB's memtable.
 *
 * `random` is injectable so tests can be deterministic.
 */

class SkipNode {
  constructor(value, level) {
    this.value = value;
    this.next = new Array(level);
    for (let i = 0; i < level; i++) this.next[i] = null;
  }
}

export default class SkipList {
  constructor({ maxLevel = 16, probability = 0.5, random = Math.random } = {}) {
    this.maxLevel = maxLevel;
    this.probability = probability;
    this._random = random;
    this._head = new SkipNode(null, maxLevel);
    this.level = 1; // number of lanes currently in use
    this.size = 0;
  }

  _randomLevel() {
    let level = 1;
    while (level < this.maxLevel && this._random() < this.probability) level++;
    return level;
  }

  // For each lane, the last node whose value is < `value`.
  _predecessors(value) {
    const update = new Array(this.maxLevel);
    let node = this._head;
    for (let i = this.level - 1; i >= 0; i--) {
      while (node.next[i] && node.next[i].value < value) node = node.next[i];
      update[i] = node;
    }
    return update;
  }

  contains(value) {
    let node = this._head;
    for (let i = this.level - 1; i >= 0; i--) {
      while (node.next[i] && node.next[i].value < value) node = node.next[i];
    }
    node = node.next[0];
    return !!node && node.value === value;
  }

  insert(value) {
    const update = this._predecessors(value);
    const candidate = update[0].next[0];
    if (candidate && candidate.value === value) return false;

    const level = this._randomLevel();
    if (level > this.level) {
      for (let i = this.level; i < level; i++) update[i] = this._head;
      this.level = level;
    }
    const node = new SkipNode(value, level);
    for (let i = 0; i < level; i++) {
      node.next[i] = update[i].next[i];
      update[i].next[i] = node;
    }
    this.size++;
    return true;
  }

  remove(value) {
    const update = this._predecessors(value);
    const target = update[0].next[0];
    if (!target || target.value !== value) return false;

    for (let i = 0; i < this.level; i++) {
      if (update[i].next[i] !== target) break;
      update[i].next[i] = target.next[i];
    }
    while (this.level > 1 && this._head.next[this.level - 1] === null) this.level--;
    this.size--;
    return true;
  }

  toArray() {
    const result = [];
    for (let node = this._head.next[0]; node; node = node.next[0]) result.push(node.value);
    return result;
  }
}
