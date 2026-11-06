'use strict';

/**
 * Sorting algorithms
 *
 * Every function returns a NEW sorted array and leaves its input untouched.
 * Comparison sorts accept an optional comparator `(a, b) => negative | 0 | positive`
 * (default: ascending). Counting, radix and bucket sort work on numbers only.
 *
 * Algorithm        Best        Average     Worst       Space     Stable
 * --------------   ---------   ---------   ---------   -------   ------
 * bubble           O(n)        O(n^2)      O(n^2)      O(1)      yes
 * selection        O(n^2)      O(n^2)      O(n^2)      O(1)      no
 * insertion        O(n)        O(n^2)      O(n^2)      O(1)      yes
 * shell            O(n log n)  ~O(n^1.3)   O(n^2)      O(1)      no
 * merge            O(n log n)  O(n log n)  O(n log n)  O(n)      yes
 * quick (3-way)    O(n)        O(n log n)  O(n^2)      O(log n)  no
 * heap             O(n log n)  O(n log n)  O(n log n)  O(1)      no
 * counting         O(n + k)    O(n + k)    O(n + k)    O(k)      yes    (k = value range)
 * radix (LSD)      O(d(n+b))   O(d(n+b))   O(d(n+b))   O(n + b)  yes    (d digits, base b)
 * bucket           O(n + k)    O(n + k)    O(n^2)      O(n + k)  yes
 *
 * "Stable" means equal elements keep their original relative order.
 * Any comparison-based sort needs Omega(n log n) comparisons in the worst case.
 */

const defaultCompare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

function swap(a, i, j) {
  const tmp = a[i];
  a[i] = a[j];
  a[j] = tmp;
}

export function isSorted(arr, compare = defaultCompare) {
  for (let i = 1; i < arr.length; i++) {
    if (compare(arr[i - 1], arr[i]) > 0) return false;
  }
  return true;
}

// Repeatedly swap adjacent out-of-order pairs; the largest value "bubbles" to
// the end each pass. Stops early if a pass makes no swaps.
export function bubbleSort(arr, compare = defaultCompare) {
  const a = arr.slice();
  for (let end = a.length - 1; end > 0; end--) {
    let swapped = false;
    for (let i = 0; i < end; i++) {
      if (compare(a[i], a[i + 1]) > 0) {
        swap(a, i, i + 1);
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return a;
}

// Find the smallest remaining element and put it next. Always O(n^2) compares
// but only O(n) swaps.
export function selectionSort(arr, compare = defaultCompare) {
  const a = arr.slice();
  for (let i = 0; i < a.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) {
      if (compare(a[j], a[min]) < 0) min = j;
    }
    if (min !== i) swap(a, i, min);
  }
  return a;
}

// Grow a sorted prefix by inserting each element into its place, like sorting
// playing cards in your hand. Excellent on small or nearly-sorted input.
export function insertionSort(arr, compare = defaultCompare) {
  const a = arr.slice();
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && compare(a[j], key) > 0) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}

// Insertion sort over shrinking gaps: far-apart elements move early, so the
// final gap-1 pass has very little left to do.
export function shellSort(arr, compare = defaultCompare) {
  const a = arr.slice();
  for (let gap = Math.floor(a.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < a.length; i++) {
      const key = a[i];
      let j = i;
      while (j >= gap && compare(a[j - gap], key) > 0) {
        a[j] = a[j - gap];
        j -= gap;
      }
      a[j] = key;
    }
  }
  return a;
}

// Divide and conquer: split in half, sort each half, merge the two sorted halves.
export function mergeSort(arr, compare = defaultCompare) {
  if (arr.length <= 1) return arr.slice();
  const mid = arr.length >> 1;
  const left = mergeSort(arr.slice(0, mid), compare);
  const right = mergeSort(arr.slice(mid), compare);
  const merged = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    // `<= 0` takes from the left on ties, which is what makes the sort stable.
    if (compare(left[i], right[j]) <= 0) merged.push(left[i++]);
    else merged.push(right[j++]);
  }
  while (i < left.length) merged.push(left[i++]);
  while (j < right.length) merged.push(right[j++]);
  return merged;
}

// Pick a pivot, partition into (< pivot) (== pivot) (> pivot), recurse on the
// outer parts. The 3-way partition makes arrays with many duplicates fast, and
// recursing into the smaller side first keeps the call stack O(log n).
export function quickSort(arr, compare = defaultCompare) {
  const a = arr.slice();
  const sort = (lo, hi) => {
    while (lo < hi) {
      const pivot = a[lo + ((hi - lo) >> 1)];
      let lt = lo;
      let i = lo;
      let gt = hi;
      while (i <= gt) {
        const c = compare(a[i], pivot);
        if (c < 0) swap(a, lt++, i++);
        else if (c > 0) swap(a, i, gt--);
        else i++;
      }
      // Now a[lo..lt-1] < pivot, a[lt..gt] == pivot, a[gt+1..hi] > pivot.
      if (lt - lo < hi - gt) {
        sort(lo, lt - 1);
        lo = gt + 1;
      } else {
        sort(gt + 1, hi);
        hi = lt - 1;
      }
    }
  };
  sort(0, a.length - 1);
  return a;
}

// Build a max-heap in place, then repeatedly swap the max to the end and
// restore the heap on the shrunken front part.
export function heapSort(arr, compare = defaultCompare) {
  const a = arr.slice();
  const siftDown = (start, end) => {
    let root = start;
    for (;;) {
      let child = 2 * root + 1;
      if (child > end) return;
      if (child + 1 <= end && compare(a[child], a[child + 1]) < 0) child++;
      if (compare(a[root], a[child]) >= 0) return;
      swap(a, root, child);
      root = child;
    }
  };
  for (let start = (a.length >> 1) - 1; start >= 0; start--) siftDown(start, a.length - 1);
  for (let end = a.length - 1; end > 0; end--) {
    swap(a, 0, end);
    siftDown(0, end - 1);
  }
  return a;
}

// Not comparison-based: count how many times each integer occurs, then write
// them out in order. Great when the value range k is small relative to n.
export function countingSort(arr) {
  if (arr.length === 0) return [];
  let min = arr[0];
  let max = arr[0];
  arr.forEach(v => {
    if (v < min) min = v;
    if (v > max) max = v;
  });
  const counts = new Array(max - min + 1);
  for (let i = 0; i < counts.length; i++) counts[i] = 0;
  arr.forEach(v => counts[v - min]++);
  const result = [];
  counts.forEach((count, offset) => {
    for (let c = 0; c < count; c++) result.push(offset + min);
  });
  return result;
}

// LSD radix sort: stable-sort by the ones digit, then tens, then hundreds...
// Handles negative integers by sorting their absolute values separately.
export function radixSort(arr) {
  const sortNonNegative = values => {
    if (values.length === 0) return [];
    let max = values[0];
    values.forEach(v => {
      if (v > max) max = v;
    });
    let result = values.slice();
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      const buckets = [[], [], [], [], [], [], [], [], [], []];
      result.forEach(v => buckets[Math.floor(v / exp) % 10].push(v));
      result = [].concat.apply([], buckets);
    }
    return result;
  };
  const negatives = sortNonNegative(arr.filter(v => v < 0).map(v => -v)).reverse().map(v => -v);
  const positives = sortNonNegative(arr.filter(v => v >= 0));
  return negatives.concat(positives);
}

// Spread values over buckets by magnitude, sort each small bucket, concatenate.
// Fast when input is roughly uniformly distributed.
export function bucketSort(arr, bucketCount = Math.max(1, Math.floor(Math.sqrt(arr.length)))) {
  if (arr.length <= 1) return arr.slice();
  let min = arr[0];
  let max = arr[0];
  arr.forEach(v => {
    if (v < min) min = v;
    if (v > max) max = v;
  });
  if (min === max) return arr.slice();
  const buckets = [];
  for (let i = 0; i < bucketCount; i++) buckets.push([]);
  const range = max - min;
  arr.forEach(v => {
    const index = Math.min(bucketCount - 1, Math.floor(((v - min) / range) * bucketCount));
    buckets[index].push(v);
  });
  return [].concat.apply([], buckets.map(bucket => insertionSort(bucket)));
}
