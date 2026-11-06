'use strict';

import LinkedList from './linked-list.js';

/**
 * Queue (FIFO - first in, first out)
 *
 * Think of a line at a store. Uses: BFS, task scheduling, buffering, level-order
 * traversal.
 *
 * Backed by a linked list so enqueue (append at tail) and dequeue (remove at
 * head) are both O(1). Using Array.shift() for dequeue would be O(n).
 */

export default class Queue {
  constructor() {
    this._list = new LinkedList();
  }

  enqueue(value) {
    this._list.append(value);
    return this;
  }

  dequeue() {
    if (this._list.isEmpty()) return undefined;
    return this._list.removeAt(0);
  }

  peek() {
    return this._list.head ? this._list.head.value : undefined;
  }

  isEmpty() {
    return this._list.isEmpty();
  }

  get size() {
    return this._list.length;
  }

  toArray() {
    return this._list.toArray();
  }
}

/**
 * Queue built from two stacks (a classic interview question).
 *
 * New items go onto `inbox`. When `outbox` is empty we pour the whole inbox
 * into it, which reverses the order so the oldest item ends up on top.
 * Each item is moved at most once, so dequeue is amortized O(1).
 */
export class QueueFromStacks {
  constructor() {
    this._inbox = [];
    this._outbox = [];
  }

  enqueue(value) {
    this._inbox.push(value);
    return this;
  }

  _shift() {
    if (this._outbox.length === 0) {
      while (this._inbox.length) this._outbox.push(this._inbox.pop());
    }
  }

  dequeue() {
    this._shift();
    return this._outbox.pop();
  }

  peek() {
    this._shift();
    return this._outbox[this._outbox.length - 1];
  }

  get size() {
    return this._inbox.length + this._outbox.length;
  }

  isEmpty() {
    return this.size === 0;
  }
}
