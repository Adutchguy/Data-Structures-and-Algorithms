import * as dc from './divide-and-conquer.js';
import { maxSubarray } from '../dynamic-programming/sequences.js';

const {
  quickSelect, countInversions, maxSubarrayDC, closestPair, karatsuba, hanoi, mergeKSortedArrays,
} = dc;

function lcg(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state;
  };
}

describe('quickSelect', () => {
  test('finds the k-th smallest element', () => {
    const data = [7, 10, 4, 3, 20, 15];
    expect([0, 1, 2, 3, 4, 5].map(k => quickSelect(data, k))).toEqual([3, 4, 7, 10, 15, 20]);
  });

  test('handles duplicates and does not mutate the input', () => {
    const data = [5, 1, 5, 1, 5, 3];
    expect(quickSelect(data, 2)).toBe(3);
    expect(quickSelect(data, 5)).toBe(5);
    expect(data).toEqual([5, 1, 5, 1, 5, 3]);
  });

  test('matches a full sort on random data', () => {
    const next = lcg(21);
    const data = Array.from({ length: 100 }, () => next() % 50);
    const sorted = data.slice().sort((a, b) => a - b);
    for (let k = 0; k < data.length; k++) expect(quickSelect(data, k)).toBe(sorted[k]);
  });

  test('rejects out-of-range k', () => {
    expect(() => quickSelect([1, 2], 2)).toThrow();
    expect(() => quickSelect([], 0)).toThrow();
  });
});

describe('countInversions', () => {
  test('counts out-of-order pairs', () => {
    expect(countInversions([2, 4, 1, 3, 5])).toBe(3);
    expect(countInversions([5, 4, 3, 2, 1])).toBe(10);
    expect(countInversions([1, 2, 3])).toBe(0);
    expect(countInversions([])).toBe(0);
    expect(countInversions([2, 2, 1])).toBe(2);
  });

  test('matches brute force', () => {
    const next = lcg(4);
    const data = Array.from({ length: 80 }, () => next() % 30);
    let expected = 0;
    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) if (data[i] > data[j]) expected++;
    }
    expect(countInversions(data)).toBe(expected);
  });
});

describe('maxSubarrayDC', () => {
  test('agrees with Kadane\'s algorithm', () => {
    const next = lcg(15);
    for (let t = 0; t < 30; t++) {
      const data = Array.from({ length: 25 }, () => (next() % 41) - 20);
      expect(maxSubarrayDC(data)).toBe(maxSubarray(data).sum);
    }
    expect(maxSubarrayDC([-2, 1, -3, 4, -1, 2, 1, -5, 4])).toBe(6);
    expect(maxSubarrayDC([])).toBe(0);
  });
});

describe('closestPair', () => {
  test('simple example', () => {
    const result = closestPair([[2, 3], [12, 30], [40, 50], [5, 1], [12, 10], [3, 4]]);
    expect(result.distance).toBeCloseTo(Math.sqrt(2), 10);
    expect(result.pair.map(p => p.join(',')).sort()).toEqual(['2,3', '3,4']);
  });

  test('matches brute force on random points', () => {
    const next = lcg(77);
    for (let t = 0; t < 20; t++) {
      const pts = Array.from({ length: 40 }, () => [next() % 200, next() % 200]);
      let best = Infinity;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          best = Math.min(best, Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]));
        }
      }
      expect(closestPair(pts).distance).toBeCloseTo(best, 9);
    }
  });

  test('too few points', () => {
    expect(closestPair([])).toBeNull();
    expect(closestPair([[1, 1]])).toBeNull();
    expect(closestPair([[0, 0], [3, 4]]).distance).toBe(5);
  });
});

describe('karatsuba', () => {
  test('multiplies correctly', () => {
    expect(karatsuba(12, 34)).toBe(408);
    expect(karatsuba(1234, 5678)).toBe(7006652);
    expect(karatsuba(0, 99)).toBe(0);
    expect(karatsuba(9, 9)).toBe(81);
    const next = lcg(2);
    for (let t = 0; t < 50; t++) {
      const x = next() % 60000000;
      const y = next() % 60000000;
      expect(karatsuba(x, y)).toBe(x * y);
    }
  });
});

describe('hanoi', () => {
  test('uses 2^n - 1 moves', () => {
    [0, 1, 2, 3, 5, 8].forEach(n => expect(hanoi(n).length).toBe(Math.pow(2, n) - 1));
    expect(hanoi(1)).toEqual([['A', 'C']]);
    expect(hanoi(2)).toEqual([['A', 'B'], ['A', 'C'], ['B', 'C']]);
  });

  test('moves are legal and end with every disk on the target peg', () => {
    const n = 5;
    const pegs = { A: [5, 4, 3, 2, 1], B: [], C: [] };
    hanoi(n).forEach(([from, to]) => {
      const disk = pegs[from].pop();
      const top = pegs[to][pegs[to].length - 1];
      expect(top === undefined || top > disk).toBe(true); // never a big disk on a small one
      pegs[to].push(disk);
    });
    expect(pegs.A).toEqual([]);
    expect(pegs.B).toEqual([]);
    expect(pegs.C).toEqual([5, 4, 3, 2, 1]);
  });
});

describe('mergeKSortedArrays', () => {
  test('merges sorted arrays', () => {
    expect(mergeKSortedArrays([[1, 4, 7], [2, 5, 8], [3, 6, 9]])).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(mergeKSortedArrays([[], [1], [], [0, 2]])).toEqual([0, 1, 2]);
    expect(mergeKSortedArrays([])).toEqual([]);
  });
});
