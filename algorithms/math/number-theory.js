'use strict';

import gcd from '../euclid-gcd.js';
import lcm from '../lcm.js';

/**
 * Number theory and math algorithms
 *
 * Builds on the repo's existing euclid-gcd.js and lcm.js.
 * All functions work on JavaScript numbers (doubles), so results are exact only
 * up to Number.MAX_SAFE_INTEGER (2^53 - 1).
 */

export function isPrime(n) {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  // every prime > 3 has the form 6k +/- 1, so test only those divisors up to sqrt(n)
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

/**
 * Sieve of Eratosthenes: all primes <= n in O(n log log n).
 * Start with everything marked prime; for each prime p, cross out its multiples
 * (starting at p*p, since smaller multiples were crossed out by smaller primes).
 */
export function sieveOfEratosthenes(n) {
  if (n < 2) return [];
  const composite = new Uint8Array(n + 1);
  const primes = [];
  for (let i = 2; i <= n; i++) {
    if (composite[i]) continue;
    primes.push(i);
    for (let multiple = i * i; multiple <= n; multiple += i) composite[multiple] = 1;
  }
  return primes;
}

// Prime factorisation as [[prime, exponent], ...]: 360 -> [[2,3],[3,2],[5,1]]. O(sqrt n).
export function primeFactorization(n) {
  const factors = [];
  for (let p = 2; p * p <= n; p++) {
    if (n % p === 0) {
      let exponent = 0;
      while (n % p === 0) {
        n /= p;
        exponent++;
      }
      factors.push([p, exponent]);
    }
  }
  if (n > 1) factors.push([n, 1]); // whatever is left is a single prime
  return factors;
}

// All positive divisors in ascending order. Pairs up d with n/d. O(sqrt n).
export function divisors(n) {
  const small = [];
  const large = [];
  for (let d = 1; d * d <= n; d++) {
    if (n % d === 0) {
      small.push(d);
      if (d !== n / d) large.push(n / d);
    }
  }
  return small.concat(large.reverse());
}

// Euler's totient: how many integers in 1..n are coprime to n.
// phi(n) = n * product over distinct primes p of (1 - 1/p)
export function eulerTotient(n) {
  let result = n;
  primeFactorization(n).forEach(([p]) => {
    result -= result / p;
  });
  return result;
}

export function gcdOfArray(nums) {
  return nums.reduce((a, b) => gcd(a, b));
}

export function lcmOfArray(nums) {
  return nums.reduce((a, b) => lcm(a, b));
}

// Extended Euclid: returns { gcd, x, y } with a*x + b*y = gcd(a, b).
export function extendedGcd(a, b) {
  if (b === 0) return { gcd: a, x: 1, y: 0 };
  const next = extendedGcd(b, a % b);
  return { gcd: next.gcd, x: next.y, y: next.x - Math.floor(a / b) * next.y };
}

// (a * b) % m without exceeding 2^53 even when a * b would. Double-and-add.
export function mulMod(a, b, m) {
  a %= m;
  b %= m;
  if (a * b <= Number.MAX_SAFE_INTEGER) return (a * b) % m;
  let result = 0;
  while (b > 0) {
    if (b % 2 === 1) result = (result + a) % m;
    a = (a + a) % m;
    b = Math.floor(b / 2);
  }
  return result;
}

/**
 * Modular exponentiation by repeated squaring: (base ^ exp) % mod in O(log exp).
 * Writes exp in binary; each bit costs one squaring (and maybe one multiply).
 * Backbone of RSA, Diffie-Hellman and primality tests.
 */
export function modPow(base, exp, mod) {
  if (mod === 1) return 0;
  let result = 1;
  base %= mod;
  while (exp > 0) {
    if (exp % 2 === 1) result = mulMod(result, base, mod);
    base = mulMod(base, base, mod);
    exp = Math.floor(exp / 2);
  }
  return result;
}

// Multiplicative inverse of a modulo m (x with a*x = 1 mod m), or null if it doesn't exist.
export function modInverse(a, m) {
  const { gcd: g, x } = extendedGcd(((a % m) + m) % m, m);
  if (g !== 1) return null;
  return ((x % m) + m) % m;
}

// Plain fast exponentiation (supports negative exponents). O(log |exp|).
export function fastPower(base, exp) {
  if (exp < 0) return 1 / fastPower(base, -exp);
  if (exp === 0) return 1;
  const half = fastPower(base, Math.floor(exp / 2));
  return exp % 2 === 0 ? half * half : half * half * base;
}

export function factorial(n) {
  if (!Number.isInteger(n) || n < 0) throw new RangeError('n must be a non-negative integer');
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

// Binomial coefficient "n choose r", computed without huge intermediate factorials.
// After step i, `result` equals C(n - r + i, i), always an exact integer.
export function nCr(n, r) {
  if (r < 0 || r > n) return 0;
  r = Math.min(r, n - r);
  let result = 1;
  for (let i = 1; i <= r; i++) result = (result * (n - r + i)) / i;
  return Math.round(result);
}

// First `rows` rows of Pascal's triangle. Each entry = the two above it added.
export function pascalsTriangle(rows) {
  const triangle = [];
  for (let r = 0; r < rows; r++) {
    const row = [1];
    for (let c = 1; c < r; c++) row.push(triangle[r - 1][c - 1] + triangle[r - 1][c]);
    if (r > 0) row.push(1);
    triangle.push(row);
  }
  return triangle;
}

// Fibonacci in O(log n) with the fast-doubling identities
//   F(2k)   = F(k) * (2*F(k+1) - F(k))
//   F(2k+1) = F(k)^2 + F(k+1)^2
// Exact up to F(78) because of double precision.
export function fibFastDoubling(n) {
  const pair = k => {
    if (k === 0) return [0, 1];
    const [a, b] = pair(Math.floor(k / 2)); // F(m), F(m+1)
    const c = a * (2 * b - a);
    const d = a * a + b * b;
    return k % 2 === 0 ? [c, d] : [d, c + d];
  };
  return pair(n)[0];
}

const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';

// Convert an integer to a string in the given base (2..36).
export function toBase(n, base) {
  if (base < 2 || base > 36) throw new RangeError('base must be between 2 and 36');
  if (n === 0) return '0';
  const negative = n < 0;
  n = Math.abs(n);
  let result = '';
  while (n > 0) {
    result = DIGITS[n % base] + result;
    n = Math.floor(n / base);
  }
  return negative ? '-' + result : result;
}

export function fromBase(str, base) {
  if (base < 2 || base > 36) throw new RangeError('base must be between 2 and 36');
  const negative = str[0] === '-';
  let result = 0;
  for (let i = negative ? 1 : 0; i < str.length; i++) {
    const digit = DIGITS.indexOf(str[i].toLowerCase());
    if (digit === -1 || digit >= base) throw new Error('Invalid digit: ' + str[i]);
    result = result * base + digit;
  }
  return negative ? -result : result;
}

// Repeatedly sum digits until one digit remains: closed form 1 + (n - 1) % 9.
export function digitalRoot(n) {
  return n === 0 ? 0 : 1 + ((n - 1) % 9);
}

export function isPerfectSquare(n) {
  if (n < 0) return false;
  const root = Math.round(Math.sqrt(n));
  return root * root === n;
}
