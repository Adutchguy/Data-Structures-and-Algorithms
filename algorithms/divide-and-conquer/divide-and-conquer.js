'use strict';

import { Heap } from '../../data-structures/heap.js';

/**
 * Divide and conquer
 *
 *   1. DIVIDE the problem into smaller independent subproblems,
 *   2. CONQUER each recursively (base case: small enough to solve directly),
 *   3. COMBINE the sub-answers.
 *
 * Running time follows a recurrence T(n) = a*T(n/b) + f(n). The Master Theorem
 * compares f(n) with n^(log_b a):
 *   merge sort:   T(n) = 2T(n/2) + O(n)      -> O(n log n)
 *   binary search T(n) =  T(n/2) + O(1)      -> O(log n)
 *   Karatsuba:    T(n) = 3T(n/2) + O(n)      -> O(n^1.585)
 *   Hanoi:        T(n) = 2T(n-1) + 1         -> O(2^n)
 * (See also sorting/sorting.js for merge sort and quick sort.)
 */

function swap(a, i, j) {
  const tmp = a[i];
  a[i] = a[j];
  a[j] = tmp;
}

/**
 * Quickselect: the k-th smallest element (0-based) in expected O(n).
 * Like quicksort, but after partitioning around a pivot we recurse into only the
 * side that contains position k. Iterative here.
 */
export function quickSelect(arr, k) {
  if (k < 0 || k >= arr.length) throw new RangeError('k out of range');
  const a = arr.slice();
  let lo = 0;
  let hi = a.length - 1;
  for (;;) {
    const pivot = a[lo + ((hi - lo) >> 1)];
    let lt = lo;
    let i = lo;
    let gt = hi;
    while (i <= gt) {
      if (a[i] < pivot) swap(a, lt++, i++);
      else if (a[i] > pivot) swap(a, i, gt--);
      else i++;
    }
    // a[lt..gt] are all equal to the pivot and in their final positions
    if (k < lt) hi = lt - 1;
    else if (k > gt) lo = gt + 1;
    else return pivot;
  }
}

/**
 * Count inversions (pairs i < j with arr[i] > arr[j]) with a modified merge sort.
 * While merging, every time a right-half element is placed before remaining
 * left-half elements, it forms an inversion with each of them. O(n log n).
 */
export function countInversions(arr) {
  let inversions = 0;
  const sort = a => {
    if (a.length <= 1) return a;
    const mid = a.length >> 1;
    const left = sort(a.slice(0, mid));
    const right = sort(a.slice(mid));
    const merged = [];
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        merged.push(left[i++]);
      } else {
        merged.push(right[j++]);
        inversions += left.length - i;
      }
    }
    return merged.concat(left.slice(i), right.slice(j));
  };
  sort(arr);
  return inversions;
}

/**
 * Maximum subarray sum, divide and conquer: the best subarray lies entirely in the
 * left half, entirely in the right half, or crosses the middle. O(n log n).
 * (Kadane's algorithm in dynamic-programming/sequences.js does it in O(n).)
 */
export function maxSubarrayDC(arr, lo = 0, hi = arr.length - 1) {
  if (arr.length === 0) return 0;
  if (lo === hi) return arr[lo];
  const mid = (lo + hi) >> 1;
  let leftBest = -Infinity;
  let sum = 0;
  for (let i = mid; i >= lo; i--) {
    sum += arr[i];
    leftBest = Math.max(leftBest, sum);
  }
  let rightBest = -Infinity;
  sum = 0;
  for (let i = mid + 1; i <= hi; i++) {
    sum += arr[i];
    rightBest = Math.max(rightBest, sum);
  }
  return Math.max(maxSubarrayDC(arr, lo, mid), maxSubarrayDC(arr, mid + 1, hi), leftBest + rightBest);
}

/**
 * Closest pair of points in the plane. points: [[x, y], ...].
 * Sort by x, split at the median, solve both halves, then check only the narrow
 * vertical strip around the dividing line: within it, each point needs to be compared
 * with just a handful of neighbours in y-order. Returns { distance, pair } or null.
 */
export function closestPair(points) {
  if (points.length < 2) return null;
  const dist = (p, q) => Math.sqrt((p[0] - q[0]) * (p[0] - q[0]) + (p[1] - q[1]) * (p[1] - q[1]));
  const solve = pts => {
    const n = pts.length;
    if (n <= 3) {
      let best = { distance: Infinity, pair: null };
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const d = dist(pts[i], pts[j]);
          if (d < best.distance) best = { distance: d, pair: [pts[i], pts[j]] };
        }
      }
      return best;
    }
    const mid = n >> 1;
    const midX = pts[mid][0];
    const left = solve(pts.slice(0, mid));
    const right = solve(pts.slice(mid));
    let best = left.distance <= right.distance ? left : right;
    const strip = pts.filter(p => Math.abs(p[0] - midX) < best.distance).sort((a, b) => a[1] - b[1]);
    for (let i = 0; i < strip.length; i++) {
      for (let j = i + 1; j < strip.length && strip[j][1] - strip[i][1] < best.distance; j++) {
        const d = dist(strip[i], strip[j]);
        if (d < best.distance) best = { distance: d, pair: [strip[i], strip[j]] };
      }
    }
    return best;
  };
  const sorted = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return solve(sorted);
}

/**
 * Karatsuba multiplication: 3 recursive multiplications instead of 4.
 *   x = a*10^m + b,  y = c*10^m + d
 *   x*y = ac*10^2m + ((a+b)(c+d) - ac - bd)*10^m + bd
 * Shown here on JS numbers (inputs < 2^26 so the result stays exact); real big-number
 * libraries apply the same idea to arrays of digits.
 */
export function karatsuba(x, y) {
  if (x < 10 || y < 10) return x * y;
  const digits = Math.max(String(x).length, String(y).length);
  const m = Math.floor(digits / 2);
  const base = Math.pow(10, m);
  const a = Math.floor(x / base);
  const b = x % base;
  const c = Math.floor(y / base);
  const d = y % base;
  const ac = karatsuba(a, c);
  const bd = karatsuba(b, d);
  const cross = karatsuba(a + b, c + d) - ac - bd;
  return ac * base * base + cross * base + bd;
}

// Towers of Hanoi: move n disks from `from` to `to` using `via`. Returns the list of moves
// as [fromPeg, toPeg]. Always 2^n - 1 moves: move n-1 aside, move the big disk, move n-1 back.
export function hanoi(n, from = 'A', to = 'C', via = 'B') {
  if (n === 0) return [];
  return hanoi(n - 1, from, via, to)
    .concat([[from, to]])
    .concat(hanoi(n - 1, via, to, from));
}

// Merge k sorted arrays into one sorted array with a min-heap holding one
// "cursor" per array. O(N log k) for N total elements.
export function mergeKSortedArrays(arrays) {
  const heap = new Heap((a, b) => a.value - b.value);
  arrays.forEach((array, arrayIndex) => {
    if (array.length) heap.push({ value: array[0], arrayIndex, position: 0 });
  });
  const result = [];
  while (!heap.isEmpty()) {
    const { value, arrayIndex, position } = heap.pop();
    result.push(value);
    if (position + 1 < arrays[arrayIndex].length) {
      heap.push({ value: arrays[arrayIndex][position + 1], arrayIndex, position: position + 1 });
    }
  }
  return result;
}
