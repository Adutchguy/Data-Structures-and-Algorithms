'use strict';

/**
 * Binary Heap
 *
 * A complete binary tree stored in an array where every parent is "smaller"
 * (min-heap) than its children. For the node at index i:
 *     parent = floor((i - 1) / 2)    left child = 2i + 1    right child = 2i + 2
 *
 * The comparator decides what "smaller" means, so one class gives you a
 * min-heap, a max-heap, or a heap of objects ordered by any field.
 *
 * Complexity
 *   peek ........ O(1)
 *   push / pop .. O(log n)
 *   Heap.from ... O(n)   (bottom-up heapify, faster than n pushes)
 */

const defaultCompare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

export class Heap {
  constructor(compare = defaultCompare) {
    this._items = [];
    this._compare = compare;
  }

  // Build a heap from an array in O(n).
  static from(values, compare) {
    const heap = new Heap(compare);
    heap._items = values.slice();
    for (let i = Math.floor(heap._items.length / 2) - 1; i >= 0; i--) {
      heap._siftDown(i);
    }
    return heap;
  }

  get size() {
    return this._items.length;
  }

  isEmpty() {
    return this._items.length === 0;
  }

  peek() {
    return this._items[0];
  }

  push(value) {
    this._items.push(value);
    this._siftUp(this._items.length - 1);
    return this;
  }

  pop() {
    if (this._items.length === 0) return undefined;
    const top = this._items[0];
    const last = this._items.pop();
    if (this._items.length > 0) {
      this._items[0] = last;
      this._siftDown(0);
    }
    return top;
  }

  // All values in heap order, smallest first, without modifying this heap.
  toSortedArray() {
    const copy = Heap.from(this._items, this._compare);
    const result = [];
    while (!copy.isEmpty()) result.push(copy.pop());
    return result;
  }

  _siftUp(index) {
    const items = this._items;
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (this._compare(items[index], items[parent]) >= 0) break;
      [items[index], items[parent]] = [items[parent], items[index]];
      index = parent;
    }
  }

  _siftDown(index) {
    const items = this._items;
    const n = items.length;
    for (;;) {
      const left = 2 * index + 1;
      const right = left + 1;
      let best = index;
      if (left < n && this._compare(items[left], items[best]) < 0) best = left;
      if (right < n && this._compare(items[right], items[best]) < 0) best = right;
      if (best === index) break;
      [items[index], items[best]] = [items[best], items[index]];
      index = best;
    }
  }
}

export class MinHeap extends Heap {
  constructor() {
    super(defaultCompare);
  }
}

export class MaxHeap extends Heap {
  constructor() {
    super((a, b) => defaultCompare(b, a));
  }
}

/**
 * Priority queue: dequeue() returns the value with the LOWEST priority number
 * first. Values with equal priority come out in the order they were added.
 */
export class PriorityQueue {
  constructor() {
    this._heap = new Heap((a, b) => (a.priority - b.priority) || (a.order - b.order));
    this._counter = 0;
  }

  enqueue(value, priority = 0) {
    this._heap.push({ value, priority, order: this._counter++ });
    return this;
  }

  dequeue() {
    const entry = this._heap.pop();
    return entry ? entry.value : undefined;
  }

  peek() {
    const entry = this._heap.peek();
    return entry ? entry.value : undefined;
  }

  get size() {
    return this._heap.size;
  }

  isEmpty() {
    return this._heap.isEmpty();
  }
}

/**
 * The k largest values, largest first. Keeps a min-heap of size k, so it runs
 * in O(n log k) and O(k) space - better than sorting when k is small.
 */
export function kLargest(values, k) {
  const heap = new MinHeap();
  values.forEach(value => {
    if (heap.size < k) {
      heap.push(value);
    } else if (value > heap.peek()) {
      heap.pop();
      heap.push(value);
    }
  });
  return heap.toSortedArray().reverse();
}

/**
 * Running median of a stream using two heaps:
 *   `low`  - a max-heap holding the smaller half
 *   `high` - a min-heap holding the larger half
 * add() is O(log n), median() is O(1).
 */
export class RunningMedian {
  constructor() {
    this._low = new MaxHeap();
    this._high = new MinHeap();
  }

  add(value) {
    if (this._low.isEmpty() || value <= this._low.peek()) this._low.push(value);
    else this._high.push(value);

    // Rebalance so the halves differ in size by at most one (low may be bigger).
    if (this._low.size > this._high.size + 1) this._high.push(this._low.pop());
    else if (this._high.size > this._low.size) this._low.push(this._high.pop());
    return this;
  }

  median() {
    if (this._low.isEmpty()) return undefined;
    if (this._low.size > this._high.size) return this._low.peek();
    return (this._low.peek() + this._high.peek()) / 2;
  }
}
