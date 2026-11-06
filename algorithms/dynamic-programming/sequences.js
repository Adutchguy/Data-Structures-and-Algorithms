'use strict';

import { lowerBound } from '../searching/searching.js';

/**
 * Dynamic Programming on sequences and strings
 *
 * DP applies when a problem has
 *   1. overlapping subproblems  (the same sub-question is asked many times), and
 *   2. optimal substructure     (the best answer is built from best sub-answers).
 * Two styles:
 *   top-down  (memoization) - plain recursion + a cache.
 *   bottom-up (tabulation)  - fill a table from the smallest subproblem upward.
 *
 * Recipe: (1) define what dp[i] / dp[i][j] MEANS, (2) write the recurrence,
 * (3) set base cases, (4) pick the fill order, (5) read off the answer.
 */

// ---------------------------------------------------------------------------
// Fibonacci: the smallest example, in three styles.
// Naive recursion is O(2^n); every version below is O(n) time.
// ---------------------------------------------------------------------------

// Top-down: recursion + memo table. O(n) time, O(n) space.
export function fibMemo(n, memo = new Map()) {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);
  const value = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, value);
  return value;
}

// Bottom-up: fill a table. O(n) time, O(n) space.
export function fibTabulated(n) {
  if (n < 2) return n;
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
  return dp[n];
}

// Only the last two values are ever needed. O(n) time, O(1) space.
export function fibConstantSpace(n) {
  let a = 0;
  let b = 1;
  for (let i = 0; i < n; i++) [a, b] = [b, a + b];
  return a;
}

// Ways to climb n stairs taking 1 or 2 steps at a time (it's Fibonacci again).
export function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1;
  let b = 2;
  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
  return b;
}

// Cheapest way to reach the top (just past the last step), starting from step 0
// or 1 and climbing 1 or 2 steps; you pay cost[i] when leaving step i.
export function minCostClimbingStairs(cost) {
  let a = 0; // cheapest cost to stand on step i-2
  let b = 0; // cheapest cost to stand on step i-1
  for (let i = 2; i <= cost.length; i++) {
    const c = Math.min(b + cost[i - 1], a + cost[i - 2]);
    a = b;
    b = c;
  }
  return b;
}

// Max total from non-adjacent elements ("house robber").
// State per element: best sum if we take it vs. best sum if we skip it.
export function houseRobber(nums) {
  let take = 0;
  let skip = 0;
  nums.forEach(x => {
    [take, skip] = [skip + x, Math.max(take, skip)];
  });
  return Math.max(take, skip);
}

// ---------------------------------------------------------------------------
// Kadane's algorithm: maximum sum of a contiguous subarray. O(n), O(1) space.
// At each element, either extend the running subarray or start fresh here.
// Returns { sum, start, end } (inclusive indices), or null for an empty array.
// ---------------------------------------------------------------------------
export function maxSubarray(arr) {
  if (arr.length === 0) return null;
  let best = arr[0];
  let bestStart = 0;
  let bestEnd = 0;
  let current = arr[0];
  let currentStart = 0;
  for (let i = 1; i < arr.length; i++) {
    if (current < 0) {
      current = arr[i];
      currentStart = i;
    } else {
      current += arr[i];
    }
    if (current > best) {
      best = current;
      bestStart = currentStart;
      bestEnd = i;
    }
  }
  return { sum: best, start: bestStart, end: bestEnd };
}

// ---------------------------------------------------------------------------
// Longest Increasing Subsequence (strictly increasing, not necessarily contiguous)
// ---------------------------------------------------------------------------

// O(n log n). tails[k] = the smallest possible tail value of an increasing
// subsequence of length k+1. Each new value either extends the longest one or
// replaces the first tail >= it (found by binary search).
export function lisLength(arr) {
  const tails = [];
  arr.forEach(x => {
    tails[lowerBound(tails, x)] = x;
  });
  return tails.length;
}

// O(n^2) DP that can also recover one actual subsequence.
// dp[i] = length of the longest increasing subsequence ending at i.
export function lisSequence(arr) {
  const n = arr.length;
  if (n === 0) return [];
  const dp = new Array(n);
  const prev = new Array(n);
  let bestEnd = 0;
  for (let i = 0; i < n; i++) {
    dp[i] = 1;
    prev[i] = -1;
    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        prev[i] = j;
      }
    }
    if (dp[i] > dp[bestEnd]) bestEnd = i;
  }
  const sequence = [];
  for (let i = bestEnd; i !== -1; i = prev[i]) sequence.push(arr[i]);
  return sequence.reverse();
}

// ---------------------------------------------------------------------------
// Two-string DP: dp[i][j] answers the question for a[0..i) and b[0..j).
// ---------------------------------------------------------------------------

function makeTable(rows, cols, fill = 0) {
  const table = [];
  for (let i = 0; i < rows; i++) {
    table.push(new Array(cols));
    for (let j = 0; j < cols; j++) table[i][j] = fill;
  }
  return table;
}

// Longest Common Subsequence. O(m*n) time and space. Returns the subsequence itself.
export function longestCommonSubsequence(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = makeTable(m + 1, n + 1);
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  // Walk back through the table to recover the actual characters.
  const chars = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      chars.push(a[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return chars.reverse().join('');
}

// Longest common CONTIGUOUS run of characters.
export function longestCommonSubstring(a, b) {
  const dp = makeTable(a.length + 1, b.length + 1);
  let bestLength = 0;
  let bestEnd = 0; // end index in `a`, exclusive
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        if (dp[i][j] > bestLength) {
          bestLength = dp[i][j];
          bestEnd = i;
        }
      }
    }
  }
  return a.slice(bestEnd - bestLength, bestEnd);
}

// Levenshtein distance: fewest single-character insertions, deletions and
// substitutions to turn a into b. Used in spell-check and fuzzy search.
export function editDistance(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = makeTable(m + 1, n + 1);
  for (let i = 0; i <= m; i++) dp[i][0] = i; // delete everything
  for (let j = 0; j <= n; j++) dp[0][j] = j; // insert everything
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j], // delete from a
          dp[i][j - 1], // insert into a
          dp[i - 1][j - 1] // substitute
        );
      }
    }
  }
  return dp[m][n];
}

// Length of the longest subsequence of s that reads the same both ways.
// dp[i][j] covers the substring s[i..j].
export function longestPalindromicSubsequence(s) {
  const n = s.length;
  if (n === 0) return 0;
  const dp = makeTable(n, n);
  for (let i = n - 1; i >= 0; i--) {
    dp[i][i] = 1;
    for (let j = i + 1; j < n; j++) {
      dp[i][j] = s[i] === s[j]
        ? dp[i + 1][j - 1] + 2
        : Math.max(dp[i + 1][j], dp[i][j - 1]);
    }
  }
  return dp[0][n - 1];
}

// Can s be split into a sequence of words from the dictionary? dp[i] = can the
// first i characters be segmented?
export function wordBreak(s, dictionary) {
  const words = new Set(dictionary);
  const dp = new Array(s.length + 1);
  for (let i = 0; i <= s.length; i++) dp[i] = false;
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && words.has(s.slice(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}

// How many ways can a digit string be decoded if 'A'=1 ... 'Z'=26?
export function numDecodings(s) {
  if (s.length === 0 || s[0] === '0') return 0;
  let prev2 = 1; // ways for the string two characters back
  let prev1 = 1; // ways for the string one character back
  for (let i = 1; i < s.length; i++) {
    let ways = 0;
    if (s[i] !== '0') ways += prev1; // decode s[i] alone
    const pair = Number(s.slice(i - 1, i + 1));
    if (s[i - 1] !== '0' && pair >= 10 && pair <= 26) ways += prev2; // decode s[i-1..i]
    prev2 = prev1;
    prev1 = ways;
  }
  return prev1;
}
