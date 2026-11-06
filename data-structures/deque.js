'use strict';

import DoublyLinkedList from './doubly-linked-list.js';

/**
 * Deque (double-ended queue, pronounced "deck")
 *
 * Add and remove from BOTH ends in O(1). It generalises stacks and queues:
 *   stack = pushBack/popBack,   queue = pushBack/popFront.
 * Uses: sliding-window maximum, palindrome checks, 0-1 BFS, work stealing.
 *
 * Backed by a doubly linked list so every end operation is O(1).
 */

export default class Deque {
  constructor() {
    this._list = new DoublyLinkedList();
  }

  pushFront(value) {
    this._list.prepend(value);
    return this;
  }

  pushBack(value) {
    this._list.append(value);
    return this;
  }

  popFront() {
    return this._list.shift();
  }

  popBack() {
    return this._list.pop();
  }

  peekFront() {
    return this._list.peekFirst();
  }

  peekBack() {
    return this._list.peekLast();
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
