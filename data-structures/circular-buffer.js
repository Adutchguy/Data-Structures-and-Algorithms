'use strict';

/**
 * Circular Buffer (ring buffer)
 *
 * A fixed-size queue stored in one array. Two indices chase each other around
 * the array, wrapping with modulo, so nothing is ever shifted or reallocated.
 * Uses: streaming data, audio buffers, keeping "the last N" log lines.
 *
 * By default writing to a full buffer throws; pass { overwrite: true } to
 * silently drop the oldest value instead (a "sliding window of the last N").
 *
 * Complexity: write / read / peek are O(1).
 */

export default class CircularBuffer {
  constructor(capacity, { overwrite = false } = {}) {
    if (!(capacity > 0)) throw new RangeError('Capacity must be positive');
    this.capacity = capacity;
    this.overwrite = overwrite;
    this._data = new Array(capacity);
    this._start = 0; // index of the oldest element
    this._size = 0;
  }

  get size() {
    return this._size;
  }

  isEmpty() {
    return this._size === 0;
  }

  isFull() {
    return this._size === this.capacity;
  }

  write(value) {
    if (this.isFull()) {
      if (!this.overwrite) throw new Error('Buffer is full');
      // Replace the oldest element and advance the start.
      this._data[this._start] = value;
      this._start = (this._start + 1) % this.capacity;
      return this;
    }
    this._data[(this._start + this._size) % this.capacity] = value;
    this._size++;
    return this;
  }

  read() {
    if (this.isEmpty()) return undefined;
    const value = this._data[this._start];
    this._data[this._start] = undefined;
    this._start = (this._start + 1) % this.capacity;
    this._size--;
    return value;
  }

  peek() {
    return this.isEmpty() ? undefined : this._data[this._start];
  }

  // Oldest to newest.
  toArray() {
    const result = [];
    for (let i = 0; i < this._size; i++) {
      result.push(this._data[(this._start + i) % this.capacity]);
    }
    return result;
  }
}
