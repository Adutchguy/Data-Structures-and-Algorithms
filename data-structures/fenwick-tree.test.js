import FenwickTree from './fenwick-tree.js';

function lcg(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state;
  };
}

describe('FenwickTree', () => {
  test('prefix and range sums from an array', () => {
    const fw = FenwickTree.fromArray([3, 2, -1, 6, 5, 4, -3, 3, 7, 2]);
    expect(fw.prefixSum(0)).toBe(3);
    expect(fw.prefixSum(3)).toBe(10);
    expect(fw.prefixSum(9)).toBe(28);
    expect(fw.rangeSum(2, 5)).toBe(14);
    expect(fw.rangeSum(4, 4)).toBe(5);
    expect(fw.prefixSum(-1)).toBe(0);
  });

  test('point updates', () => {
    const fw = FenwickTree.fromArray([1, 2, 3, 4, 5]);
    fw.update(2, 10); // 3 -> 13
    expect(fw.rangeSum(0, 4)).toBe(25);
    expect(fw.rangeSum(2, 2)).toBe(13);
    fw.update(0, -1);
    expect(fw.prefixSum(1)).toBe(2);
  });

  test('empty-built tree behaves like an array of zeros', () => {
    const fw = new FenwickTree(5);
    fw.update(1, 4);
    fw.update(3, 6);
    expect(fw.rangeSum(0, 4)).toBe(10);
    expect(fw.rangeSum(2, 3)).toBe(6);
  });

  test('bounds checking', () => {
    const fw = new FenwickTree(3);
    expect(() => fw.update(3, 1)).toThrow();
    expect(() => fw.update(-1, 1)).toThrow();
    expect(() => fw.prefixSum(3)).toThrow();
  });

  test('matches brute force on random operations', () => {
    const next = lcg(5);
    const n = 64;
    const model = new Array(n).fill(0);
    const fw = new FenwickTree(n);
    for (let step = 0; step < 500; step++) {
      const i = next() % n;
      const delta = (next() % 21) - 10;
      model[i] += delta;
      fw.update(i, delta);
      const l = next() % n;
      const r = l + (next() % (n - l));
      let expected = 0;
      for (let k = l; k <= r; k++) expected += model[k];
      expect(fw.rangeSum(l, r)).toBe(expected);
    }
  });

  test('fromArray equals building by repeated updates', () => {
    const values = [5, -2, 7, 1, 0, 9, -4, 3];
    const built = FenwickTree.fromArray(values);
    const incremental = new FenwickTree(values.length);
    values.forEach((v, i) => incremental.update(i, v));
    for (let i = 0; i < values.length; i++) {
      expect(built.prefixSum(i)).toBe(incremental.prefixSum(i));
    }
  });
});
