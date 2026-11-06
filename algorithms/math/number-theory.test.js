import * as nt from './number-theory.js';
import { fibTabulated } from '../dynamic-programming/sequences.js';

const {
  isPrime, sieveOfEratosthenes, primeFactorization, divisors, eulerTotient, gcdOfArray,
  lcmOfArray, extendedGcd, mulMod, modPow, modInverse, fastPower, factorial, nCr,
  pascalsTriangle, fibFastDoubling, toBase, fromBase, digitalRoot, isPerfectSquare,
} = nt;

describe('primes', () => {
  test('isPrime', () => {
    [2, 3, 5, 7, 11, 13, 97, 7919, 1000003].forEach(p => expect(isPrime(p)).toBe(true));
    [-7, 0, 1, 4, 9, 15, 91, 7917, 1000001, 2.5].forEach(c => expect(isPrime(c)).toBe(false));
  });

  test('sieveOfEratosthenes', () => {
    expect(sieveOfEratosthenes(30)).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
    expect(sieveOfEratosthenes(1)).toEqual([]);
    expect(sieveOfEratosthenes(2)).toEqual([2]);
    expect(sieveOfEratosthenes(100).length).toBe(25);
    expect(sieveOfEratosthenes(10000).length).toBe(1229);
  });

  test('sieve and isPrime agree', () => {
    const primes = new Set(sieveOfEratosthenes(2000));
    for (let n = 0; n <= 2000; n++) expect(isPrime(n)).toBe(primes.has(n));
  });
});

describe('factors and divisors', () => {
  test('primeFactorization', () => {
    expect(primeFactorization(360)).toEqual([[2, 3], [3, 2], [5, 1]]);
    expect(primeFactorization(97)).toEqual([[97, 1]]);
    expect(primeFactorization(1)).toEqual([]);
    expect(primeFactorization(2 * 3 * 5 * 7 * 11 * 13)).toEqual([[2, 1], [3, 1], [5, 1], [7, 1], [11, 1], [13, 1]]);
  });

  test('divisors', () => {
    expect(divisors(28)).toEqual([1, 2, 4, 7, 14, 28]);
    expect(divisors(36)).toEqual([1, 2, 3, 4, 6, 9, 12, 18, 36]);
    expect(divisors(1)).toEqual([1]);
    expect(divisors(13)).toEqual([1, 13]);
  });

  test('eulerTotient', () => {
    expect([1, 2, 9, 10, 13, 36].map(eulerTotient)).toEqual([1, 1, 6, 4, 12, 12]);
  });

  test('gcd / lcm of arrays (uses the repo\'s existing gcd and lcm)', () => {
    expect(gcdOfArray([12, 18, 24])).toBe(6);
    expect(lcmOfArray([4, 6, 8])).toBe(24);
    expect(lcmOfArray([1, 2, 3, 4, 5])).toBe(60);
  });
});

describe('modular arithmetic', () => {
  test('extendedGcd satisfies Bezout\'s identity', () => {
    [[30, 18], [35, 15], [17, 5], [240, 46]].forEach(([a, b]) => {
      const { gcd, x, y } = extendedGcd(a, b);
      expect(a * x + b * y).toBe(gcd);
    });
    expect(extendedGcd(30, 18).gcd).toBe(6);
  });

  test('mulMod avoids overflow', () => {
    // 123456789 * 987654321 = 121932631112635269, far above 2^53; the true remainder is 259106859
    expect(mulMod(123456789, 987654321, 1000000007)).toBe(259106859);
    expect(mulMod(3, 4, 5)).toBe(2);
  });

  test('modPow', () => {
    expect(modPow(2, 10, 1000)).toBe(24);
    expect(modPow(3, 200, 13)).toBe(9);
    expect(modPow(5, 0, 7)).toBe(1);
    expect(modPow(7, 5, 1)).toBe(0);
    // Fermat's little theorem: a^(p-1) = 1 (mod p) for prime p
    const p = 1000000007;
    [2, 3, 123456789, 999999999].forEach(a => expect(modPow(a, p - 1, p)).toBe(1));
  });

  test('modInverse', () => {
    expect(modInverse(3, 11)).toBe(4);
    expect(modInverse(10, 17)).toBe(12);
    expect(modInverse(2, 4)).toBeNull();
    expect(modInverse(-3, 11)).toBe(7);
    [1, 2, 5, 9, 12].forEach(a => expect((a * modInverse(a, 13)) % 13).toBe(1));
  });
});

describe('powers and combinatorics', () => {
  test('fastPower', () => {
    expect(fastPower(2, 10)).toBe(1024);
    expect(fastPower(2, -2)).toBe(0.25);
    expect(fastPower(5, 0)).toBe(1);
    expect(fastPower(3, 13)).toBe(1594323);
  });

  test('factorial', () => {
    expect([0, 1, 5, 10].map(factorial)).toEqual([1, 1, 120, 3628800]);
    expect(() => factorial(-1)).toThrow();
    expect(() => factorial(2.5)).toThrow();
  });

  test('nCr', () => {
    expect(nCr(5, 2)).toBe(10);
    expect(nCr(10, 0)).toBe(1);
    expect(nCr(10, 10)).toBe(1);
    expect(nCr(52, 5)).toBe(2598960);
    expect(nCr(5, 6)).toBe(0);
    expect(nCr(30, 15)).toBe(155117520);
  });

  test('pascalsTriangle', () => {
    expect(pascalsTriangle(5)).toEqual([[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]);
    expect(pascalsTriangle(0)).toEqual([]);
    pascalsTriangle(10).forEach((row, n) => row.forEach((v, k) => expect(v).toBe(nCr(n, k))));
  });

  test('fibFastDoubling matches the DP version', () => {
    for (let n = 0; n <= 70; n++) expect(fibFastDoubling(n)).toBe(fibTabulated(n));
  });
});

describe('number bases and misc', () => {
  test('toBase / fromBase', () => {
    expect(toBase(255, 2)).toBe('11111111');
    expect(toBase(255, 16)).toBe('ff');
    expect(toBase(0, 2)).toBe('0');
    expect(toBase(-10, 2)).toBe('-1010');
    expect(fromBase('ff', 16)).toBe(255);
    expect(fromBase('-1010', 2)).toBe(-10);
    expect(fromBase('zz', 36)).toBe(1295);
    expect(() => fromBase('12', 2)).toThrow();
    expect(() => toBase(5, 1)).toThrow();
    for (let n = 0; n < 500; n += 7) expect(fromBase(toBase(n, 7), 7)).toBe(n);
  });

  test('digitalRoot', () => {
    expect(digitalRoot(493193)).toBe(2);
    expect(digitalRoot(0)).toBe(0);
    expect(digitalRoot(9)).toBe(9);
    expect(digitalRoot(38)).toBe(2);
  });

  test('isPerfectSquare', () => {
    expect([0, 1, 4, 9, 144, 1000000].every(isPerfectSquare)).toBe(true);
    expect([2, 3, 10, 143, -4].some(isPerfectSquare)).toBe(false);
  });
});
