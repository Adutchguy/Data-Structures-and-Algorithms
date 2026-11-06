'use strict';

import { Heap } from '../../data-structures/heap.js';

/**
 * Greedy algorithms
 *
 * Make the locally best choice at every step and never look back. Greedy is fast
 * and simple, but it is only CORRECT when the problem has the "greedy-choice
 * property" - and that must be argued (usually with an exchange argument), not
 * assumed. coinChangeGreedy below shows a case where it fails.
 *
 * Typical shape: sort by the right key, then sweep once. Cost is dominated by
 * the sort, O(n log n).
 */

// Activity selection / interval scheduling: pick the maximum number of
// non-overlapping activities. Greedy rule: always take the one that FINISHES
// earliest - it leaves the most room for the rest.
// activities: [{ start, end }, ...]
export function activitySelection(activities) {
  const sorted = activities.slice().sort((a, b) => a.end - b.end);
  const chosen = [];
  let lastEnd = -Infinity;
  sorted.forEach(activity => {
    if (activity.start >= lastEnd) {
      chosen.push(activity);
      lastEnd = activity.end;
    }
  });
  return chosen;
}

// Fewest intervals to delete so the rest don't overlap (touching ends are fine).
export function minRemovalsForNonOverlap(intervals) {
  const kept = activitySelection(intervals.map(([start, end]) => ({ start, end })));
  return intervals.length - kept.length;
}

// Fractional knapsack: items can be split, so take the best value-per-weight first.
// (The 0/1 version is NOT greedy-solvable; see dynamic-programming/knapsack.js.)
// items: [{ weight, value }, ...]
export function fractionalKnapsack(items, capacity) {
  const sorted = items.slice().sort((a, b) => b.value / b.weight - a.value / a.weight);
  let remaining = capacity;
  let total = 0;
  for (let i = 0; i < sorted.length && remaining > 0; i++) {
    const take = Math.min(sorted[i].weight, remaining);
    total += (take / sorted[i].weight) * sorted[i].value;
    remaining -= take;
  }
  return total;
}

// Merge overlapping intervals: [[1,3],[2,6],[8,10]] -> [[1,6],[8,10]]
export function mergeIntervals(intervals) {
  if (intervals.length === 0) return [];
  const sorted = intervals.map(i => i.slice()).sort((a, b) => a[0] - b[0]);
  const merged = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    if (sorted[i][0] <= last[1]) last[1] = Math.max(last[1], sorted[i][1]);
    else merged.push(sorted[i]);
  }
  return merged;
}

// How many rooms are needed so that no two overlapping meetings share one?
// Sweep the sorted start and end times: a start before the earliest end needs a new room.
export function minMeetingRooms(intervals) {
  const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
  const ends = intervals.map(i => i[1]).sort((a, b) => a - b);
  let rooms = 0;
  let endIndex = 0;
  for (let i = 0; i < starts.length; i++) {
    if (starts[i] < ends[endIndex]) rooms++;
    else endIndex++; // a meeting ended, reuse its room
  }
  return rooms;
}

// Jump game: nums[i] is the farthest you can jump from i. Can you reach the end?
// Track the farthest reachable index.
export function canJump(nums) {
  let farthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) return false;
    farthest = Math.max(farthest, i + nums[i]);
  }
  return true;
}

// Fewest jumps to reach the last index (-1 if impossible). Greedy BFS by "layers":
// everything reachable with k jumps is one layer; the next layer ends at the
// farthest index any of them can reach.
export function minJumps(nums) {
  const n = nums.length;
  if (n <= 1) return 0;
  let jumps = 0;
  let layerEnd = 0;
  let farthest = 0;
  for (let i = 0; i < n - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === layerEnd) {
      if (farthest <= i) return -1; // stuck
      jumps++;
      layerEnd = farthest;
      if (layerEnd >= n - 1) break;
    }
  }
  return layerEnd >= n - 1 ? jumps : -1;
}

// Gas station: gas[i] fuel is available at station i, and driving to the next
// station costs cost[i]. Return the starting index that completes the circuit, or -1.
// If total gas >= total cost an answer exists; start right after the point where
// the running tank last went negative.
export function canCompleteCircuit(gas, cost) {
  let total = 0;
  let tank = 0;
  let start = 0;
  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i] - cost[i];
    total += diff;
    tank += diff;
    if (tank < 0) {
      start = i + 1;
      tank = 0;
    }
  }
  return total >= 0 ? start : -1;
}

// Make change by always taking the largest coin that fits. Optimal for "canonical"
// systems like US coins, but NOT in general: coins [4,3,1], amount 6 gives
// 4+1+1 (3 coins) while 3+3 (2 coins) is better. Use coinChangeMin (DP) then.
export function coinChangeGreedy(coins, amount) {
  const sorted = coins.slice().sort((a, b) => b - a);
  const used = [];
  let remaining = amount;
  sorted.forEach(coin => {
    while (remaining >= coin) {
      used.push(coin);
      remaining -= coin;
    }
  });
  return remaining === 0 ? used : null;
}

/**
 * Huffman coding: build an optimal prefix-free binary code. Frequent characters
 * get short codes, rare ones get long codes. Greedy rule: repeatedly merge the
 * two least-frequent nodes into a parent.
 * Returns { codes: { char: '0101' }, root }.
 */
export function huffman(text) {
  if (text.length === 0) return { codes: {}, root: null };
  const frequencies = new Map();
  for (let i = 0; i < text.length; i++) {
    frequencies.set(text[i], (frequencies.get(text[i]) || 0) + 1);
  }

  let order = 0; // tie-breaker so the result is deterministic
  const heap = new Heap((a, b) => (a.freq - b.freq) || (a.order - b.order));
  frequencies.forEach((freq, char) => {
    heap.push({ char, freq, order: order++, left: null, right: null });
  });

  if (heap.size === 1) {
    const only = heap.pop();
    const codes = {};
    codes[only.char] = '0';
    return { codes, root: only };
  }

  while (heap.size > 1) {
    const a = heap.pop();
    const b = heap.pop();
    heap.push({ char: null, freq: a.freq + b.freq, order: order++, left: a, right: b });
  }
  const root = heap.pop();

  const codes = {};
  const walk = (node, prefix) => {
    if (!node.left && !node.right) {
      codes[node.char] = prefix;
      return;
    }
    walk(node.left, prefix + '0');
    walk(node.right, prefix + '1');
  };
  walk(root, '');
  return { codes, root };
}

export function huffmanEncode(text, codes) {
  let bits = '';
  for (let i = 0; i < text.length; i++) bits += codes[text[i]];
  return bits;
}

export function huffmanDecode(bits, root) {
  if (!root) return '';
  if (!root.left && !root.right) return root.char.repeat(bits.length); // single-symbol text
  let text = '';
  let node = root;
  for (let i = 0; i < bits.length; i++) {
    node = bits[i] === '0' ? node.left : node.right;
    if (!node.left && !node.right) {
      text += node.char;
      node = root;
    }
  }
  return text;
}
