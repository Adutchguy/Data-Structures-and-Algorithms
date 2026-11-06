import SegmentTree, { LazySegmentTree } from './segment-tree.js';

function lcg(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state;
  };
}

describe('SegmentTree', () => {
  test('range sum (default combine)', () => {
    const st = new SegmentTree([1, 3, 5, 7, 9, 11]);
    expect(st.query(0, 5)).toBe(36);
    expect(st.query(1, 3)).toBe(15);
    expect(st.query(4, 4)).toBe(9);
  });

  test('point update', () => {
    const st = new SegmentTree([1, 3, 5, 7, 9, 11]);
    st.update(1, 10);
    expect(st.get(1)).toBe(10);
    expect(st.query(0, 2)).toBe(16);
    expect(st.query(0, 5)).toBe(43);
  });

  test('range minimum and maximum', () => {
    const values = [5, 2, 8, 1, 9, 3, 7];
    const min = new SegmentTree(values, Math.min, Infinity);
    const max = new SegmentTree(values, Math.max, -Infinity);
    expect(min.query(0, 6)).toBe(1);
    expect(min.query(4, 6)).toBe(3);
    expect(max.query(0, 2)).toBe(8);
    min.update(3, 100);
    expect(min.query(0, 6)).toBe(2);
  });

  test('works with a non-commutative combine (string concatenation)', () => {
    const letters = 'abcdefg'.split('');
    const st = new SegmentTree(letters, (a, b) => a + b, '');
    expect(st.query(0, 6)).toBe('abcdefg');
    expect(st.query(2, 4)).toBe('cde');
    st.update(3, 'X');
    expect(st.query(1, 5)).toBe('bcXef');
  });

  test('matches brute force for many sizes (including non powers of two)', () => {
    const next = lcg(11);
    [1, 2, 3, 5, 7, 8, 13, 31, 50].forEach(n => {
      const model = Array.from({ length: n }, () => next() % 100);
      const st = new SegmentTree(model.slice(), Math.min, Infinity);
      for (let step = 0; step < 100; step++) {
        if (next() % 2) {
          const i = next() % n;
          const v = next() % 100;
          model[i] = v;
          st.update(i, v);
        }
        const l = next() % n;
        const r = l + (next() % (n - l));
        expect(st.query(l, r)).toBe(Math.min.apply(null, model.slice(l, r + 1)));
      }
    });
  });

  test('bounds checking', () => {
    const st = new SegmentTree([1, 2, 3]);
    expect(() => st.query(0, 3)).toThrow();
    expect(() => st.update(-1, 0)).toThrow();
    expect(st.query(2, 1)).toBe(0);
  });
});

describe('LazySegmentTree', () => {
  test('range add then range sum', () => {
    const st = new LazySegmentTree([1, 2, 3, 4, 5]);
    expect(st.rangeSum(0, 4)).toBe(15);
    st.rangeAdd(1, 3, 10);
    expect(st.rangeSum(0, 4)).toBe(45);
    expect(st.rangeSum(2, 2)).toBe(13);
    st.rangeAdd(0, 4, 1);
    expect(st.rangeSum(0, 0)).toBe(2);
    expect(st.rangeSum(0, 4)).toBe(50);
  });

  test('matches brute force on random operations', () => {
    const next = lcg(31);
    const n = 40;
    const model = Array.from({ length: n }, () => next() % 20);
    const st = new LazySegmentTree(model.slice());
    for (let step = 0; step < 400; step++) {
      const l = next() % n;
      const r = l + (next() % (n - l));
      if (next() % 2) {
        const delta = (next() % 21) - 10;
        for (let k = l; k <= r; k++) model[k] += delta;
        st.rangeAdd(l, r, delta);
      } else {
        let expected = 0;
        for (let k = l; k <= r; k++) expected += model[k];
        expect(st.rangeSum(l, r)).toBe(expected);
      }
    }
  });

  test('rejects invalid ranges', () => {
    const st = new LazySegmentTree([1, 2, 3]);
    expect(() => st.rangeSum(2, 1)).toThrow();
    expect(() => st.rangeAdd(0, 3, 1)).toThrow();
  });
});
