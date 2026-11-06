import SparseTable from './sparse-table.js';
import gcd from '../algorithms/euclid-gcd.js';

function lcg(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state;
  };
}

describe('SparseTable', () => {
  test('range minimum', () => {
    const st = new SparseTable([4, 6, 1, 5, 7, 3]);
    expect(st.query(0, 5)).toBe(1);
    expect(st.query(3, 5)).toBe(3);
    expect(st.query(1, 1)).toBe(6);
  });

  test('range maximum', () => {
    const st = new SparseTable([4, 6, 1, 5, 7, 3], Math.max);
    expect(st.query(0, 5)).toBe(7);
    expect(st.query(0, 2)).toBe(6);
  });

  test('range gcd (reuses the repo\'s euclid-gcd)', () => {
    const st = new SparseTable([12, 18, 24, 36, 5], gcd);
    expect(st.query(0, 3)).toBe(6);
    expect(st.query(2, 3)).toBe(12);
    expect(st.query(0, 4)).toBe(1);
  });

  test('matches brute force for every range of random arrays', () => {
    const next = lcg(77);
    [1, 2, 3, 8, 17].forEach(n => {
      const values = Array.from({ length: n }, () => next() % 50);
      const st = new SparseTable(values, Math.min);
      for (let l = 0; l < n; l++) {
        for (let r = l; r < n; r++) {
          expect(st.query(l, r)).toBe(Math.min.apply(null, values.slice(l, r + 1)));
        }
      }
    });
  });

  test('rejects invalid ranges', () => {
    const st = new SparseTable([1, 2, 3]);
    expect(() => st.query(2, 1)).toThrow();
    expect(() => st.query(0, 3)).toThrow();
  });
});
