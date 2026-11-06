'use strict';

/**
 * String pattern matching: find every occurrence of `pattern` in `text`.
 * Each function returns an array of start indices (empty pattern -> []).
 * n = text length, m = pattern length.
 *
 * Algorithm             Preprocessing   Search (typical)   Worst case
 * --------------------  --------------  -----------------  ----------
 * naiveSearch           none            O(n * m)           O(n * m)
 * kmpSearch             O(m)            O(n)               O(n + m)
 * rabinKarp             O(m)            O(n + m)           O(n * m)
 * zSearch               O(n + m)        O(n + m)           O(n + m)
 * horspool              O(m + alphabet) sub-linear in practice  O(n * m)
 */

// Try every alignment, compare character by character.
export function naiveSearch(text, pattern) {
  const matches = [];
  if (pattern.length === 0) return matches;
  for (let i = 0; i + pattern.length <= text.length; i++) {
    let j = 0;
    while (j < pattern.length && text[i + j] === pattern[j]) j++;
    if (j === pattern.length) matches.push(i);
  }
  return matches;
}

/**
 * Knuth-Morris-Pratt failure function ("LPS" table).
 * lps[i] = length of the longest proper prefix of pattern[0..i] that is also a
 * suffix of it. On a mismatch it tells us how far we can fall back WITHOUT
 * re-reading text characters - the text pointer never moves backwards.
 */
export function buildLPS(pattern) {
  const lps = new Array(pattern.length);
  if (pattern.length === 0) return lps;
  lps[0] = 0;
  let length = 0;
  for (let i = 1; i < pattern.length; i++) {
    while (length > 0 && pattern[i] !== pattern[length]) length = lps[length - 1];
    if (pattern[i] === pattern[length]) length++;
    lps[i] = length;
  }
  return lps;
}

export function kmpSearch(text, pattern) {
  const matches = [];
  if (pattern.length === 0) return matches;
  const lps = buildLPS(pattern);
  let j = 0; // characters of the pattern matched so far
  for (let i = 0; i < text.length; i++) {
    while (j > 0 && text[i] !== pattern[j]) j = lps[j - 1];
    if (text[i] === pattern[j]) j++;
    if (j === pattern.length) {
      matches.push(i - j + 1);
      j = lps[j - 1]; // keep going to find overlapping matches
    }
  }
  return matches;
}

/**
 * Rabin-Karp: compare rolling HASHES of each window instead of the characters.
 * Sliding one position is O(1): drop the leading character's contribution,
 * shift, add the new character. Hash equality is only a hint, so a hit is
 * confirmed by comparing the real substring.
 */
export function rabinKarp(text, pattern) {
  const matches = [];
  const m = pattern.length;
  if (m === 0 || m > text.length) return matches;
  const BASE = 31;
  const MOD = 1000000007;

  let highestPower = 1; // BASE^(m-1) mod MOD, the weight of the leading character
  for (let i = 0; i < m - 1; i++) highestPower = (highestPower * BASE) % MOD;

  let patternHash = 0;
  let windowHash = 0;
  for (let i = 0; i < m; i++) {
    patternHash = (patternHash * BASE + pattern.charCodeAt(i)) % MOD;
    windowHash = (windowHash * BASE + text.charCodeAt(i)) % MOD;
  }

  for (let i = 0; ; i++) {
    if (windowHash === patternHash && text.substr(i, m) === pattern) matches.push(i);
    if (i + m >= text.length) break;
    const leading = (text.charCodeAt(i) * highestPower) % MOD;
    windowHash = ((windowHash - leading + MOD) * BASE + text.charCodeAt(i + m)) % MOD;
  }
  return matches;
}

/**
 * Z-function: z[i] = length of the longest substring starting at i that is also
 * a prefix of s. Computed in O(n) by reusing the rightmost match window [l, r).
 */
export function zFunction(s) {
  const n = s.length;
  const z = new Array(n);
  for (let i = 0; i < n; i++) z[i] = 0;
  let l = 0;
  let r = 0;
  for (let i = 1; i < n; i++) {
    if (i < r) z[i] = Math.min(r - i, z[i - l]);
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
    if (i + z[i] > r) {
      l = i;
      r = i + z[i];
    }
  }
  if (n > 0) z[0] = n;
  return z;
}

// Pattern search via the Z-function on pattern + separator + text.
export function zSearch(text, pattern) {
  if (pattern.length === 0) return [];
  const separator = '\u0000'; // a character assumed not to appear in either string
  const z = zFunction(pattern + separator + text);
  const matches = [];
  for (let i = pattern.length + 1; i < z.length; i++) {
    if (z[i] === pattern.length) matches.push(i - pattern.length - 1);
  }
  return matches;
}

/**
 * Boyer-Moore-Horspool: compare the pattern right-to-left, and on a mismatch
 * skip ahead using a table of how far each character sits from the pattern's
 * end. Often skips most of the text, so it is very fast on long patterns.
 */
export function horspool(text, pattern) {
  const matches = [];
  const m = pattern.length;
  if (m === 0 || m > text.length) return matches;
  const shift = new Map();
  for (let i = 0; i < m - 1; i++) shift.set(pattern[i], m - 1 - i);
  let i = 0;
  while (i + m <= text.length) {
    let j = m - 1;
    while (j >= 0 && text[i + j] === pattern[j]) j--;
    if (j < 0) matches.push(i);
    const skip = shift.get(text[i + m - 1]);
    i += skip === undefined ? m : skip;
  }
  return matches;
}
