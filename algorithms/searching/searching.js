'use strict';

/**
 * Searching algorithms
 *
 * Algorithm            Requires sorted?  Time                 Notes
 * -------------------  ----------------  -------------------  ---------------------------
 * linearSearch         no                O(n)                 works on anything
 * binarySearch         yes               O(log n)             the workhorse
 * lowerBound/upperBound yes              O(log n)             insertion points, counts
 * jumpSearch           yes               O(sqrt n)            jump ahead in blocks
 * interpolationSearch  yes (uniform)     O(log log n) avg     guesses position from value
 * exponentialSearch    yes               O(log i)             good for unbounded/huge lists
 *
 * Binary search is more than "find x in a sorted array": any time you can
 * answer a yes/no question that flips exactly once from false to true as the
 * input grows, you can binary search for the flip point. The later functions
 * (rotated array, shipping capacity, sqrt) show that pattern.
 */

export function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// Iterative binary search on an ascending array. Returns an index or -1.
export function binarySearch(arr, target) {
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1); // avoids overflow in languages with fixed-size ints
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

export function binarySearchRecursive(arr, target, lo = 0, hi = arr.length - 1) {
  if (lo > hi) return -1;
  const mid = lo + ((hi - lo) >> 1);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, hi);
  return binarySearchRecursive(arr, target, lo, mid - 1);
}

// First index whose value is >= target (arr.length if none).
// This is where `target` would be inserted to keep the array sorted.
export function lowerBound(arr, target) {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// First index whose value is > target (arr.length if none).
export function upperBound(arr, target) {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (arr[mid] <= target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// How many times does `target` appear in a sorted array? O(log n).
export function countOccurrences(arr, target) {
  return upperBound(arr, target) - lowerBound(arr, target);
}

// Index of the first / last occurrence of target, or -1.
export function firstOccurrence(arr, target) {
  const i = lowerBound(arr, target);
  return i < arr.length && arr[i] === target ? i : -1;
}

export function lastOccurrence(arr, target) {
  const i = upperBound(arr, target) - 1;
  return i >= 0 && arr[i] === target ? i : -1;
}

// Jump ahead sqrt(n) at a time until we overshoot, then scan the last block.
export function jumpSearch(arr, target) {
  const n = arr.length;
  if (n === 0) return -1;
  const step = Math.max(1, Math.floor(Math.sqrt(n)));
  let prev = 0;
  let next = step;
  while (prev < n && arr[Math.min(next, n) - 1] < target) {
    prev = next;
    next += step;
  }
  for (let i = prev; i < Math.min(next, n); i++) {
    if (arr[i] === target) return i;
    if (arr[i] > target) break;
  }
  return -1;
}

// Like looking up a name in a phone book: guess where the value should be by
// linear interpolation between the ends. Fast on uniformly distributed numbers.
export function interpolationSearch(arr, target) {
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
    if (arr[hi] === arr[lo]) return arr[lo] === target ? lo : -1;
    const pos = lo + Math.floor(((target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo]));
    if (arr[pos] === target) return pos;
    if (arr[pos] < target) lo = pos + 1;
    else hi = pos - 1;
  }
  return -1;
}

// Double the probe index until we pass the target, then binary search that range.
export function exponentialSearch(arr, target) {
  const n = arr.length;
  if (n === 0) return -1;
  if (arr[0] === target) return 0;
  let bound = 1;
  while (bound < n && arr[bound] <= target) bound *= 2;
  let lo = bound >> 1;
  let hi = Math.min(bound, n - 1);
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

/**
 * Ternary search for the maximum of a function that rises then falls
 * (unimodal) on [lo, hi]. Each round discards a third of the interval.
 */
export function ternarySearchMax(f, lo, hi, iterations = 200) {
  for (let i = 0; i < iterations; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (f(m1) < f(m2)) lo = m1;
    else hi = m2;
  }
  return (lo + hi) / 2;
}

/**
 * Search a sorted array (distinct values) that was rotated at an unknown pivot,
 * e.g. [4,5,6,7,0,1,2]. At every step one half is still sorted - use it to
 * decide which half the target can be in. O(log n).
 */
export function searchRotated(arr, target) {
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (arr[mid] === target) return mid;
    if (arr[lo] <= arr[mid]) {
      // left half is sorted
      if (arr[lo] <= target && target < arr[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else if (arr[mid] < target && target <= arr[hi]) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return -1;
}

// Minimum of a rotated sorted array with distinct values. O(log n).
export function findMinRotated(arr) {
  let lo = 0;
  let hi = arr.length - 1;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (arr[mid] > arr[hi]) lo = mid + 1;
    else hi = mid;
  }
  return arr[lo];
}

// Index of any peak (an element greater than its neighbours). O(log n):
// always walk uphill - a peak must exist in that direction.
export function findPeak(arr) {
  let lo = 0;
  let hi = arr.length - 1;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (arr[mid] < arr[mid + 1]) lo = mid + 1;
    else hi = mid;
  }
  return arr.length ? lo : -1;
}

// Integer square root (floor) via binary search on the answer.
export function sqrtFloor(n) {
  if (n < 0) throw new RangeError('n must be non-negative');
  let lo = 0;
  let hi = n;
  let answer = 0;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (mid * mid <= n) {
      answer = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return answer;
}

/**
 * "Binary search on the answer": the smallest ship capacity that delivers all
 * packages, in order, within `days` days. Larger capacity can only help, so
 * feasibility flips from false to true exactly once - search for that point.
 */
export function shipWithinDays(weights, days) {
  const canShip = capacity => {
    let needed = 1;
    let load = 0;
    for (let i = 0; i < weights.length; i++) {
      if (load + weights[i] > capacity) {
        needed++;
        load = 0;
      }
      load += weights[i];
    }
    return needed <= days;
  };
  let lo = Math.max.apply(null, weights); // must fit the heaviest package
  let hi = weights.reduce((a, b) => a + b, 0); // everything in one day
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (canShip(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
