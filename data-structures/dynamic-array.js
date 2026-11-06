'use strict';

/**
 * Dynamic Array (a.k.a. vector / ArrayList)
 *
 * JavaScript arrays already grow automatically, but this class shows how that
 * works: values live in a fixed-size block of memory, and when the block fills
 * up we allocate one twice as large and copy everything over.
 *
 * Doubling makes push() *amortized* O(1): an occasional O(n) copy is paid for
 * by the many cheap pushes before it.
 *
 * Complexity
 *   get / set ......... O(1)
 *   push / pop ........ O(1) amortized
 *   insertAt / removeAt O(n)  (elements shift)
 */

export default class DynamicArray {
  constructor(initialCapacity = 4) {
    this.capacity = Math.max(1, initialCapacity);
    this.length = 0;
    this._data = new Array(this.capacity);
  }

  get(index) {
    this._checkIndex(index);
    return this._data[index];
  }

  set(index, value) {
    this._checkIndex(index);
    this._data[index] = value;
  }

  push(value) {
    if (this.length === this.capacity) this._resize(this.capacity * 2);
    this._data[this.length++] = value;
    return this.length;
  }

  pop() {
    if (this.length === 0) return undefined;
    const value = this._data[--this.length];
    this._data[this.length] = undefined;
    // Shrink when a quarter full so push/pop at the boundary can't thrash.
    if (this.capacity > 4 && this.length <= this.capacity / 4) {
      this._resize(Math.floor(this.capacity / 2));
    }
    return value;
  }

  insertAt(index, value) {
    if (index < 0 || index > this.length) throw new RangeError('Index out of bounds');
    if (this.length === this.capacity) this._resize(this.capacity * 2);
    for (let i = this.length; i > index; i--) this._data[i] = this._data[i - 1];
    this._data[index] = value;
    this.length++;
  }

  removeAt(index) {
    this._checkIndex(index);
    const value = this._data[index];
    for (let i = index; i < this.length - 1; i++) this._data[i] = this._data[i + 1];
    this._data[--this.length] = undefined;
    return value;
  }

  indexOf(value) {
    for (let i = 0; i < this.length; i++) {
      if (this._data[i] === value) return i;
    }
    return -1;
  }

  toArray() {
    return this._data.slice(0, this.length);
  }

  _resize(newCapacity) {
    const next = new Array(newCapacity);
    for (let i = 0; i < this.length; i++) next[i] = this._data[i];
    this._data = next;
    this.capacity = newCapacity;
  }

  _checkIndex(index) {
    if (index < 0 || index >= this.length) throw new RangeError('Index out of bounds');
  }
}
