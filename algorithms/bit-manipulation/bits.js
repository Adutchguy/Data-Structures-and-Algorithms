'use strict';

/**
 * Bit manipulation
 *
 * JavaScript bitwise operators work on 32-bit signed integers:
 *   &  AND     |  OR     ^  XOR     ~  NOT
 *   << shift left     >> arithmetic shift right (keeps sign)     >>> logical shift right
 * Use `x >>> 0` to view a result as an unsigned 32-bit number.
 *
 * Handy identities
 *   n & (n - 1)   clears the lowest set bit
 *   n & -n        isolates the lowest set bit
 *   x ^ x = 0,   x ^ 0 = x,   XOR is commutative and associative
 *   n << k  = n * 2^k,    n >> k = floor(n / 2^k)
 */

export const getBit = (n, i) => (n >> i) & 1;
export const setBit = (n, i) => n | (1 << i);
export const clearBit = (n, i) => n & ~(1 << i);
export const toggleBit = (n, i) => n ^ (1 << i);
export const updateBit = (n, i, on) => (on ? setBit(n, i) : clearBit(n, i));

export const isOdd = n => (n & 1) === 1;

// Powers of two have exactly one set bit, so n & (n - 1) clears it to zero.
export const isPowerOfTwo = n => n > 0 && (n & (n - 1)) === 0;

// Powers of four: a power of two whose single bit sits at an even position.
export const isPowerOfFour = n => isPowerOfTwo(n) && (n & 0x55555555) !== 0;

// Brian Kernighan's trick: each n & (n - 1) removes one set bit, so the loop
// runs once per SET bit rather than once per bit position.
export function countSetBits(n) {
  n >>>= 0;
  let count = 0;
  while (n !== 0) {
    n &= n - 1;
    count++;
  }
  return count;
}

export const lowestSetBit = n => n & -n;

// Number of bit positions where a and b differ.
export const hammingDistance = (a, b) => countSetBits(a ^ b);

// Reverse the 32 bits of an unsigned integer.
export function reverseBits(n) {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (n & 1);
    n >>>= 1;
  }
  return result >>> 0;
}

// Smallest power of two >= n (for 0 < n <= 2^30), by smearing the top bit downward.
export function nextPowerOfTwo(n) {
  if (n <= 1) return 1;
  n--;
  n |= n >> 1;
  n |= n >> 2;
  n |= n >> 4;
  n |= n >> 8;
  n |= n >> 16;
  return n + 1;
}

// Swap two integers with XOR, no temporary variable. (A curiosity - prefer a temp.)
export function xorSwap(a, b) {
  a ^= b;
  b ^= a;
  a ^= b;
  return [a, b];
}

// Every value appears twice except one. Pairs cancel under XOR, leaving the single one.
export function singleNumber(nums) {
  return nums.reduce((acc, x) => acc ^ x, 0);
}

// Two values appear once, the rest twice. XOR of everything = a ^ b. Any set bit in
// that result differs between a and b, so split the numbers by that bit.
export function twoSingleNumbers(nums) {
  const xor = nums.reduce((acc, x) => acc ^ x, 0);
  const bit = xor & -xor;
  let a = 0;
  let b = 0;
  nums.forEach(x => {
    if (x & bit) a ^= x;
    else b ^= x;
  });
  return a < b ? [a, b] : [b, a];
}

// nums holds 0..n with exactly one value missing. XOR all indices and all values.
export function missingNumber(nums) {
  let xor = nums.length;
  nums.forEach((x, i) => {
    xor ^= i ^ x;
  });
  return xor;
}

// Number of set bits for every integer 0..n in O(n): bits(i) = bits(i / 2) + (i mod 2).
export function countBitsUpTo(n) {
  const result = new Array(n + 1);
  result[0] = 0;
  for (let i = 1; i <= n; i++) result[i] = result[i >> 1] + (i & 1);
  return result;
}

// All subsets of an array using a bitmask: bit j of the mask says "include items[j]".
export function subsetsBitmask(items) {
  const results = [];
  for (let mask = 0; mask < (1 << items.length); mask++) {
    const subset = [];
    for (let j = 0; j < items.length; j++) {
      if (mask & (1 << j)) subset.push(items[j]);
    }
    results.push(subset);
  }
  return results;
}

// n-bit Gray code: consecutive values differ in exactly one bit.
export function grayCode(n) {
  const codes = [];
  for (let i = 0; i < (1 << n); i++) codes.push(i ^ (i >> 1));
  return codes;
}
