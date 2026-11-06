'use strict';

/**
 * Sparse Table
 *
 * Static range queries in O(1) after O(n log n) preprocessing - for operations
 * that are IDEMPOTENT (applying them to overlapping ranges doesn't change the
 * answer): min, max, gcd, bitwise AND/OR. It cannot do sums (overlap would
 * double-count) and it does not support updates.
 *
 * table[k][i] = op over the 2^k elements starting at i.
 * To answer [l, r], pick k = floor(log2(length)) and combine two overlapping
 * blocks of size 2^k: one starting at l and one ending at r.
 */

export default class SparseTable {
  constructor(values, op = Math.min) {
    this._op = op;
    this.n = values.length;
    this._log = new Array(this.n + 2);
    this._log[1] = 0;
    for (let i = 2; i <= this.n + 1; i++) this._log[i] = this._log[i >> 1] + 1;

    this._table = [values.slice()];
    for (let k = 1; (1 << k) <= this.n; k++) {
      const prev = this._table[k - 1];
      const row = [];
      for (let i = 0; i + (1 << k) <= this.n; i++) {
        row.push(op(prev[i], prev[i + (1 << (k - 1))]));
      }
      this._table.push(row);
    }
  }

  // Combine of elements [left .. right] inclusive, in O(1).
  query(left, right) {
    if (left < 0 || right >= this.n || left > right) throw new RangeError('Invalid range');
    const k = this._log[right - left + 1];
    return this._op(this._table[k][left], this._table[k][right - (1 << k) + 1]);
  }
}
