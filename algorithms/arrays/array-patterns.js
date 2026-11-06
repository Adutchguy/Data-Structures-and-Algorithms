'use strict';

import Deque from '../../data-structures/deque.js';

/**
 * Array patterns: two pointers, sliding window, prefix sums, in-place tricks.
 *
 * Most "brute force is O(n^2)" array problems fall to one of these:
 *   two pointers ..... walk inward from both ends, or a slow/fast pair; needs order
 *                      (sorted input) or a structure that lets you discard candidates.
 *   sliding window ... keep a contiguous range [left, right]; grow right, shrink left.
 *   prefix sums ...... precompute running totals so any range sum is one subtraction.
 *   hash map ......... trade O(n) space for O(1) "have I seen the complement?" lookups.
 * None of these functions mutate their input.
 */

// ---------------------------- two pointers ---------------------------------

// Indices of two numbers in a SORTED array that add up to target, or null.
export function twoSumSorted(arr, target) {
  let lo = 0;
  let hi = arr.length - 1;
  while (lo < hi) {
    const sum = arr[lo] + arr[hi];
    if (sum === target) return [lo, hi];
    if (sum < target) lo++;
    else hi--;
  }
  return null;
}

// Same for an unsorted array using a hash map of value -> index. O(n).
export function twoSum(arr, target) {
  const seen = new Map();
  for (let i = 0; i < arr.length; i++) {
    if (seen.has(target - arr[i])) return [seen.get(target - arr[i]), i];
    seen.set(arr[i], i);
  }
  return null;
}

// All unique triplets that sum to zero. Fix one number, two-pointer the rest. O(n^2).
export function threeSum(nums) {
  const sorted = nums.slice().sort((a, b) => a - b);
  const triplets = [];
  for (let i = 0; i < sorted.length - 2; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) continue; // skip duplicate anchors
    let lo = i + 1;
    let hi = sorted.length - 1;
    while (lo < hi) {
      const sum = sorted[i] + sorted[lo] + sorted[hi];
      if (sum === 0) {
        triplets.push([sorted[i], sorted[lo], sorted[hi]]);
        while (lo < hi && sorted[lo] === sorted[lo + 1]) lo++;
        while (lo < hi && sorted[hi] === sorted[hi - 1]) hi--;
        lo++;
        hi--;
      } else if (sum < 0) {
        lo++;
      } else {
        hi--;
      }
    }
  }
  return triplets;
}

// Two vertical lines + the x-axis form a container; find the max water area.
// Move the SHORTER wall inward - moving the taller one can never help.
export function containerWithMostWater(heights) {
  let lo = 0;
  let hi = heights.length - 1;
  let best = 0;
  while (lo < hi) {
    best = Math.max(best, Math.min(heights[lo], heights[hi]) * (hi - lo));
    if (heights[lo] < heights[hi]) lo++;
    else hi--;
  }
  return best;
}

// Trapping rain water: water above bar i = min(tallest to its left, tallest to its
// right) - height[i]. Two pointers track the running maximum from each side.
export function trapRainWater(heights) {
  let lo = 0;
  let hi = heights.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;
  while (lo < hi) {
    if (heights[lo] < heights[hi]) {
      leftMax = Math.max(leftMax, heights[lo]);
      water += leftMax - heights[lo];
      lo++;
    } else {
      rightMax = Math.max(rightMax, heights[hi]);
      water += rightMax - heights[hi];
      hi--;
    }
  }
  return water;
}

// Remove duplicates from a sorted array (slow pointer = write position).
export function removeDuplicatesSorted(arr) {
  const result = arr.slice();
  if (result.length === 0) return result;
  let write = 1;
  for (let read = 1; read < result.length; read++) {
    if (result[read] !== result[write - 1]) result[write++] = result[read];
  }
  result.length = write;
  return result;
}

// Move all zeros to the end, keeping the order of the other elements.
export function moveZeroes(arr) {
  const result = arr.slice();
  let write = 0;
  for (let read = 0; read < result.length; read++) {
    if (result[read] !== 0) result[write++] = result[read];
  }
  while (write < result.length) result[write++] = 0;
  return result;
}

// Dutch national flag: sort an array of 0s, 1s and 2s in one pass.
export function sortColors(arr) {
  const a = arr.slice();
  let low = 0;
  let mid = 0;
  let high = a.length - 1;
  while (mid <= high) {
    if (a[mid] === 0) {
      [a[low], a[mid]] = [a[mid], a[low]];
      low++;
      mid++;
    } else if (a[mid] === 1) {
      mid++;
    } else {
      [a[mid], a[high]] = [a[high], a[mid]];
      high--;
    }
  }
  return a;
}

// Rotate right by k using three reversals: reverse all, then each of the two parts.
export function rotateArray(arr, k) {
  const n = arr.length;
  if (n === 0) return [];
  k %= n;
  const a = arr.slice();
  const reverse = (lo, hi) => {
    while (lo < hi) {
      [a[lo], a[hi]] = [a[hi], a[lo]];
      lo++;
      hi--;
    }
  };
  reverse(0, n - 1);
  reverse(0, k - 1);
  reverse(k, n - 1);
  return a;
}

// Merge two sorted arrays.
export function mergeSortedArrays(a, b) {
  const merged = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) merged.push(a[i] <= b[j] ? a[i++] : b[j++]);
  return merged.concat(a.slice(i), b.slice(j));
}

// ---------------------------- sliding window --------------------------------

// Largest sum of any k consecutive elements. Slide: add the new, subtract the old.
export function maxSumSubarrayOfSizeK(arr, k) {
  if (k <= 0 || k > arr.length) return 0;
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += arr[i];
  let best = windowSum;
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    best = Math.max(best, windowSum);
  }
  return best;
}

// Length of the shortest contiguous subarray with sum >= target (positive numbers); 0 if none.
export function smallestSubarrayWithSum(arr, target) {
  let left = 0;
  let sum = 0;
  let best = Infinity;
  for (let right = 0; right < arr.length; right++) {
    sum += arr[right];
    while (sum >= target) {
      best = Math.min(best, right - left + 1);
      sum -= arr[left++];
    }
  }
  return best === Infinity ? 0 : best;
}

// Maximum of every window of size k, in O(n) with a monotonic deque of indices:
// values in the deque are kept in decreasing order, so the front is always the max.
export function maxSlidingWindow(nums, k) {
  const result = [];
  const deque = new Deque();
  for (let i = 0; i < nums.length; i++) {
    if (!deque.isEmpty() && deque.peekFront() <= i - k) deque.popFront(); // left the window
    while (!deque.isEmpty() && nums[deque.peekBack()] <= nums[i]) deque.popBack(); // dominated
    deque.pushBack(i);
    if (i >= k - 1) result.push(nums[deque.peekFront()]);
  }
  return result;
}

// ------------------------------ prefix sums ---------------------------------

// prefix[i] = sum of the first i elements, so sum(l..r) = prefix[r+1] - prefix[l].
export function buildPrefixSums(arr) {
  const prefix = [0];
  arr.forEach(x => prefix.push(prefix[prefix.length - 1] + x));
  return prefix;
}

export function rangeSum(prefix, left, right) {
  return prefix[right + 1] - prefix[left];
}

// Number of contiguous subarrays whose sum equals k (negatives allowed).
// If prefix[j] - prefix[i] = k then prefix[i] = prefix[j] - k: count earlier prefixes.
export function subarraySumEqualsK(nums, k) {
  const seen = new Map([[0, 1]]);
  let prefix = 0;
  let count = 0;
  nums.forEach(x => {
    prefix += x;
    count += seen.get(prefix - k) || 0;
    seen.set(prefix, (seen.get(prefix) || 0) + 1);
  });
  return count;
}

// product[i] = product of all other elements, without division: (prefix product) * (suffix product).
export function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n);
  let running = 1;
  for (let i = 0; i < n; i++) {
    result[i] = running;
    running *= nums[i];
  }
  running = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= running;
    running *= nums[i];
  }
  return result;
}

// ------------------------------ misc classics -------------------------------

// Length of the longest run of consecutive integers (order in the array ignored). O(n).
// Only start counting from numbers that begin a run (n - 1 is absent).
export function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  set.forEach(n => {
    if (set.has(n - 1)) return;
    let length = 1;
    while (set.has(n + length)) length++;
    best = Math.max(best, length);
  });
  return best;
}

// Boyer-Moore voting: the element that appears more than n/2 times (assumed to exist).
export function majorityElement(nums) {
  let candidate;
  let count = 0;
  nums.forEach(x => {
    if (count === 0) candidate = x;
    count += x === candidate ? 1 : -1;
  });
  return candidate;
}

// n + 1 numbers in 1..n contain one duplicate. Treat value -> index as a linked list
// and find the cycle entrance with Floyd's tortoise and hare. O(n) time, O(1) space.
export function findDuplicate(nums) {
  let slow = nums[0];
  let fast = nums[0];
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);
  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}

// Next lexicographically greater permutation (wraps to the smallest).
// Find the rightmost ascent, swap with the next larger value on its right, reverse the tail.
export function nextPermutation(arr) {
  const a = arr.slice();
  let i = a.length - 2;
  while (i >= 0 && a[i] >= a[i + 1]) i--;
  if (i >= 0) {
    let j = a.length - 1;
    while (a[j] <= a[i]) j--;
    [a[i], a[j]] = [a[j], a[i]];
  }
  let lo = i + 1;
  let hi = a.length - 1;
  while (lo < hi) {
    [a[lo], a[hi]] = [a[hi], a[lo]];
    lo++;
    hi--;
  }
  return a;
}

// Read a matrix in a clockwise spiral.
export function spiralOrder(matrix) {
  const result = [];
  if (matrix.length === 0) return result;
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) result.push(matrix[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) result.push(matrix[r][right]);
    right--;
    if (top <= bottom) {
      for (let c = right; c >= left; c--) result.push(matrix[bottom][c]);
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) result.push(matrix[r][left]);
      left++;
    }
  }
  return result;
}

// Rotate a matrix 90 degrees clockwise (returns a new matrix; works for non-square too).
export function rotateMatrix(matrix) {
  const rows = matrix.length;
  if (rows === 0) return [];
  const cols = matrix[0].length;
  const result = [];
  for (let c = 0; c < cols; c++) {
    result.push(new Array(rows));
    for (let r = 0; r < rows; r++) result[c][rows - 1 - r] = matrix[r][c];
  }
  return result;
}
