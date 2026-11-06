'use strict';

/**
 * Classic string problems.
 * (See also ../../Strings/string-manipulation.js for the original exercises and
 * ./pattern-matching.js for substring search algorithms.)
 */

// Palindrome check that ignores case and non-alphanumeric characters. Two pointers.
export function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let lo = 0;
  let hi = clean.length - 1;
  while (lo < hi) {
    if (clean[lo++] !== clean[hi--]) return false;
  }
  return true;
}

// Longest palindromic substring by expanding around each possible centre.
// O(n^2) time, O(1) space.
export function longestPalindromicSubstring(s) {
  if (s.length < 2) return s;
  let start = 0;
  let maxLength = 1;
  const expand = (lo, hi) => {
    while (lo >= 0 && hi < s.length && s[lo] === s[hi]) {
      lo--;
      hi++;
    }
    const length = hi - lo - 1;
    if (length > maxLength) {
      maxLength = length;
      start = lo + 1;
    }
  };
  for (let i = 0; i < s.length; i++) {
    expand(i, i); // odd-length palindromes
    expand(i, i + 1); // even-length palindromes
  }
  return s.substr(start, maxLength);
}

/**
 * Manacher's algorithm: longest palindromic substring in O(n).
 * Insert '#' between characters so every palindrome has odd length, then keep
 * the palindrome radius at each centre, reusing mirror information from the
 * palindrome that reaches furthest right.
 */
export function manacher(s) {
  if (s.length < 2) return s;
  const t = '#' + s.split('').join('#') + '#';
  const radius = new Array(t.length);
  for (let i = 0; i < t.length; i++) radius[i] = 0;
  let center = 0;
  let right = 0;
  let bestCenter = 0;
  for (let i = 0; i < t.length; i++) {
    if (i < right) radius[i] = Math.min(right - i, radius[2 * center - i]);
    while (i - radius[i] - 1 >= 0 && i + radius[i] + 1 < t.length &&
           t[i - radius[i] - 1] === t[i + radius[i] + 1]) {
      radius[i]++;
    }
    if (i + radius[i] > right) {
      center = i;
      right = i + radius[i];
    }
    if (radius[i] > radius[bestCenter]) bestCenter = i;
  }
  const start = (bestCenter - radius[bestCenter]) / 2;
  return s.substr(start, radius[bestCenter]);
}

// Do two strings contain exactly the same letters? Compare character counts. O(n).
export function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const counts = new Map();
  for (let i = 0; i < a.length; i++) counts.set(a[i], (counts.get(a[i]) || 0) + 1);
  for (let i = 0; i < b.length; i++) {
    if (!counts.get(b[i])) return false;
    counts.set(b[i], counts.get(b[i]) - 1);
  }
  return true;
}

// Group words that are anagrams of each other. The sorted letters form the key.
export function groupAnagrams(words) {
  const groups = new Map();
  words.forEach(word => {
    const key = word.split('').sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(word);
  });
  return Array.from(groups.values());
}

// Longest substring with no repeated characters. Sliding window: remember the last
// index of each character and jump the window's left edge past a repeat. O(n).
export function longestUniqueSubstring(s) {
  const lastSeen = new Map();
  let left = 0;
  let best = '';
  for (let right = 0; right < s.length; right++) {
    if (lastSeen.has(s[right]) && lastSeen.get(s[right]) >= left) {
      left = lastSeen.get(s[right]) + 1;
    }
    lastSeen.set(s[right], right);
    if (right - left + 1 > best.length) best = s.slice(left, right + 1);
  }
  return best;
}

/**
 * Smallest window of s containing every character of t (with multiplicity).
 * Sliding window: grow the right edge until the window is valid, then shrink
 * the left edge as far as it stays valid. O(n + m).
 */
export function minWindowSubstring(s, t) {
  if (t.length === 0) return '';
  const need = new Map();
  for (let i = 0; i < t.length; i++) need.set(t[i], (need.get(t[i]) || 0) + 1);
  let missing = t.length;
  let left = 0;
  let bestStart = 0;
  let bestLength = Infinity;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (need.has(c)) {
      if (need.get(c) > 0) missing--;
      need.set(c, need.get(c) - 1);
    }
    while (missing === 0) {
      if (right - left + 1 < bestLength) {
        bestLength = right - left + 1;
        bestStart = left;
      }
      const lc = s[left];
      if (need.has(lc)) {
        need.set(lc, need.get(lc) + 1);
        if (need.get(lc) > 0) missing++;
      }
      left++;
    }
  }
  return bestLength === Infinity ? '' : s.substr(bestStart, bestLength);
}

export function longestCommonPrefix(strings) {
  if (strings.length === 0) return '';
  let prefix = strings[0];
  for (let i = 1; i < strings.length; i++) {
    while (strings[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1);
      if (prefix === '') return '';
    }
  }
  return prefix;
}

// Index of the first character that appears exactly once, or -1.
export function firstUniqueChar(s) {
  const counts = new Map();
  for (let i = 0; i < s.length; i++) counts.set(s[i], (counts.get(s[i]) || 0) + 1);
  for (let i = 0; i < s.length; i++) {
    if (counts.get(s[i]) === 1) return i;
  }
  return -1;
}

// Is `sub` a subsequence of `s` (same order, gaps allowed)? Two pointers.
export function isSubsequence(sub, s) {
  let i = 0;
  for (let j = 0; j < s.length && i < sub.length; j++) {
    if (s[j] === sub[i]) i++;
  }
  return i === sub.length;
}

// 'aaabcc' -> 'a3b1c2'
export function runLengthEncode(s) {
  let result = '';
  for (let i = 0; i < s.length; ) {
    let j = i;
    while (j < s.length && s[j] === s[i]) j++;
    result += s[i] + (j - i);
    i = j;
  }
  return result;
}

// 'a3b1c2' -> 'aaabcc'  (counts may have several digits)
export function runLengthDecode(s) {
  let result = '';
  const pattern = /(\D)(\d+)/g;
  let match = pattern.exec(s);
  while (match) {
    result += match[1].repeat(Number(match[2]));
    match = pattern.exec(s);
  }
  return result;
}

const ROMAN = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
  [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

export function intToRoman(n) {
  let result = '';
  ROMAN.forEach(([value, symbol]) => {
    while (n >= value) {
      result += symbol;
      n -= value;
    }
  });
  return result;
}

export function romanToInt(s) {
  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    // a smaller numeral before a larger one is subtracted (IV = 4)
    if (i + 1 < s.length && values[s[i]] < values[s[i + 1]]) total -= values[s[i]];
    else total += values[s[i]];
  }
  return total;
}
