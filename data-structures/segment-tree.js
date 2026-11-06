'use strict';

/**
 * Segment Tree
 *
 * Answers "combine all elements in range [l, r]" (sum, min, max, gcd, ...) and
 * supports point updates, both in O(log n). Build is O(n).
 *
 * SegmentTree ........ iterative bottom-up version. Leaves live at tree[n .. 2n-1];
 *                      tree[i] = combine(tree[2i], tree[2i+1]). Works with any
 *                      associative `combine` (even non-commutative ones).
 * LazySegmentTree .... adds O(log n) *range* updates (add a value to every element
 *                      in [l, r]) by postponing work with "lazy" tags.
 *
 * Compared with a Fenwick tree: more general (min/max/gcd, not just sums) but
 * more memory and code.
 */

export default class SegmentTree {
  // combine must be associative; identity is the value with combine(identity, x) === x.
  constructor(values, combine = (a, b) => a + b, identity = 0) {
    this.n = values.length;
    this._combine = combine;
    this._identity = identity;
    this._tree = new Array(2 * this.n);
    for (let i = 0; i < this.n; i++) this._tree[this.n + i] = values[i];
    for (let i = this.n - 1; i >= 1; i--) {
      this._tree[i] = combine(this._tree[2 * i], this._tree[2 * i + 1]);
    }
  }

  // Replace the element at `index` with `value`.
  update(index, value) {
    this._check(index);
    let pos = index + this.n;
    this._tree[pos] = value;
    while (pos > 1) {
      pos >>= 1;
      this._tree[pos] = this._combine(this._tree[2 * pos], this._tree[2 * pos + 1]);
    }
  }

  // Combine of elements [left .. right] inclusive, in left-to-right order.
  query(left, right) {
    this._check(left);
    this._check(right);
    if (left > right) return this._identity;
    let resultLeft = this._identity;
    let resultRight = this._identity;
    let l = left + this.n;
    let r = right + this.n + 1; // half-open [l, r)
    while (l < r) {
      if (l & 1) resultLeft = this._combine(resultLeft, this._tree[l++]);
      if (r & 1) resultRight = this._combine(this._tree[--r], resultRight);
      l >>= 1;
      r >>= 1;
    }
    return this._combine(resultLeft, resultRight);
  }

  get(index) {
    this._check(index);
    return this._tree[index + this.n];
  }

  _check(index) {
    if (index < 0 || index >= this.n) throw new RangeError('Index out of bounds');
  }
}

/**
 * Range-add / range-sum segment tree with lazy propagation.
 *
 * `lazy[node]` holds an addition that has been applied to node's sum but NOT yet
 * pushed down to its children. We push it down only when a later operation needs
 * to descend through that node.
 */
export class LazySegmentTree {
  constructor(values) {
    this.n = values.length;
    this._sum = new Array(4 * this.n + 4);
    this._lazy = new Array(4 * this.n + 4);
    for (let i = 0; i < this._sum.length; i++) {
      this._sum[i] = 0;
      this._lazy[i] = 0;
    }
    if (this.n > 0) this._build(1, 0, this.n - 1, values);
  }

  _build(node, lo, hi, values) {
    if (lo === hi) {
      this._sum[node] = values[lo];
      return;
    }
    const mid = (lo + hi) >> 1;
    this._build(2 * node, lo, mid, values);
    this._build(2 * node + 1, mid + 1, hi, values);
    this._sum[node] = this._sum[2 * node] + this._sum[2 * node + 1];
  }

  _apply(node, lo, hi, delta) {
    this._sum[node] += delta * (hi - lo + 1);
    this._lazy[node] += delta;
  }

  _push(node, lo, hi) {
    if (this._lazy[node] !== 0) {
      const mid = (lo + hi) >> 1;
      this._apply(2 * node, lo, mid, this._lazy[node]);
      this._apply(2 * node + 1, mid + 1, hi, this._lazy[node]);
      this._lazy[node] = 0;
    }
  }

  // Add `delta` to every element in [left, right].
  rangeAdd(left, right, delta) {
    this._check(left, right);
    this._add(1, 0, this.n - 1, left, right, delta);
  }

  _add(node, lo, hi, left, right, delta) {
    if (right < lo || hi < left) return;
    if (left <= lo && hi <= right) {
      this._apply(node, lo, hi, delta);
      return;
    }
    this._push(node, lo, hi);
    const mid = (lo + hi) >> 1;
    this._add(2 * node, lo, mid, left, right, delta);
    this._add(2 * node + 1, mid + 1, hi, left, right, delta);
    this._sum[node] = this._sum[2 * node] + this._sum[2 * node + 1];
  }

  // Sum of elements [left, right].
  rangeSum(left, right) {
    this._check(left, right);
    return this._query(1, 0, this.n - 1, left, right);
  }

  _query(node, lo, hi, left, right) {
    if (right < lo || hi < left) return 0;
    if (left <= lo && hi <= right) return this._sum[node];
    this._push(node, lo, hi);
    const mid = (lo + hi) >> 1;
    return this._query(2 * node, lo, mid, left, right) +
      this._query(2 * node + 1, mid + 1, hi, left, right);
  }

  _check(left, right) {
    if (left < 0 || right >= this.n || left > right) throw new RangeError('Invalid range');
  }
}
