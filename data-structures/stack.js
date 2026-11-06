'use strict';

/**
 * Stack (LIFO - last in, first out)
 *
 * Think of a stack of plates: you only touch the top one.
 * Uses: undo history, function call stack, expression parsing, DFS, backtracking.
 *
 * Complexity: push / pop / peek are all O(1).
 */

export default class Stack {
  constructor() {
    this._items = [];
  }

  push(value) {
    this._items.push(value);
    return this;
  }

  pop() {
    return this._items.pop();
  }

  peek() {
    return this._items[this._items.length - 1];
  }

  isEmpty() {
    return this._items.length === 0;
  }

  get size() {
    return this._items.length;
  }

  // Bottom-to-top.
  toArray() {
    return this._items.slice();
  }
}

/**
 * MinStack - a stack that also reports its minimum in O(1).
 * Trick: alongside each value, remember the minimum of everything beneath it.
 */
export class MinStack {
  constructor() {
    this._values = [];
    this._mins = [];
  }

  push(value) {
    const currentMin = this._mins.length ? this._mins[this._mins.length - 1] : value;
    this._values.push(value);
    this._mins.push(value < currentMin ? value : currentMin);
    return this;
  }

  pop() {
    this._mins.pop();
    return this._values.pop();
  }

  peek() {
    return this._values[this._values.length - 1];
  }

  min() {
    return this._mins[this._mins.length - 1];
  }

  get size() {
    return this._values.length;
  }

  isEmpty() {
    return this._values.length === 0;
  }
}
