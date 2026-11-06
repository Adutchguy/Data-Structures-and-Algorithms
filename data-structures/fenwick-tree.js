'use strict';

/**
 * Fenwick Tree (Binary Indexed Tree)
 *
 * Maintains prefix sums of an array under point updates. A plain prefix-sum
 * array makes queries O(1) but updates O(n); a plain array is the reverse.
 * A Fenwick tree balances both at O(log n) using very little code.
 *
 * Trick: index i (1-based) stores the sum of the `lowbit(i)` elements ending at
 * i, where lowbit(i) = i & -i is the value of i's lowest set bit.
 *   - To query a prefix, repeatedly strip the lowest set bit: i -= i & -i
 *   - To update, repeatedly add the lowest set bit:          i += i & -i
 *
 * This class uses 0-based indices in its public API.
 *
 * Complexity: update / prefixSum / rangeSum O(log n); build from array O(n).
 */

export default class FenwickTree {
  constructor(n) {
    this.n = n;
    this._tree = new Array(n + 1);
    for (let i = 0; i <= n; i++) this._tree[i] = 0;
  }

  // O(n) construction: push each partial sum up to its parent once.
  static fromArray(values) {
    const fw = new FenwickTree(values.length);
    for (let i = 1; i <= fw.n; i++) {
      fw._tree[i] += values[i - 1];
      const parent = i + (i & -i);
      if (parent <= fw.n) fw._tree[parent] += fw._tree[i];
    }
    return fw;
  }

  // Add `delta` to the element at `index`.
  update(index, delta) {
    this._check(index);
    for (let i = index + 1; i <= this.n; i += i & -i) this._tree[i] += delta;
  }

  // Sum of elements [0 .. index] inclusive. prefixSum(-1) is 0.
  prefixSum(index) {
    if (index < 0) return 0;
    this._check(index);
    let sum = 0;
    for (let i = index + 1; i > 0; i -= i & -i) sum += this._tree[i];
    return sum;
  }

  // Sum of elements [left .. right] inclusive.
  rangeSum(left, right) {
    return this.prefixSum(right) - this.prefixSum(left - 1);
  }

  _check(index) {
    if (index < 0 || index >= this.n) throw new RangeError('Index out of bounds');
  }
}
