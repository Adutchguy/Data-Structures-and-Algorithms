import * as sorting from './sorting.js';

const {
  isSorted, bubbleSort, selectionSort, insertionSort, shellSort,
  mergeSort, quickSort, heapSort, countingSort, radixSort, bucketSort,
} = sorting;

function lcg(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state;
  };
}

const ascending = (a, b) => a - b;

const comparisonSorts = {
  bubbleSort, selectionSort, insertionSort, shellSort, mergeSort, quickSort, heapSort,
};
const stableSorts = { bubbleSort, insertionSort, mergeSort };
const integerSorts = { countingSort, radixSort, bucketSort };

describe('isSorted', () => {
  test('detects order', () => {
    expect(isSorted([])).toBe(true);
    expect(isSorted([1, 2, 2, 3])).toBe(true);
    expect(isSorted([1, 3, 2])).toBe(false);
    expect(isSorted([3, 2, 1], (a, b) => b - a)).toBe(true);
  });
});

Object.keys(comparisonSorts).forEach(name => {
  const sort = comparisonSorts[name];

  describe(name, () => {
    test('handles empty and single-element arrays', () => {
      expect(sort([])).toEqual([]);
      expect(sort([7])).toEqual([7]);
    });

    test('sorts typical inputs', () => {
      expect(sort([5, 2, 9, 1, 5, 6])).toEqual([1, 2, 5, 5, 6, 9]);
      expect(sort([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
      expect(sort([4, 3, 2, 1])).toEqual([1, 2, 3, 4]);
      expect(sort([2, 2, 2, 2])).toEqual([2, 2, 2, 2]);
      expect(sort([-3, 0, -10, 5, 2])).toEqual([-10, -3, 0, 2, 5]);
    });

    test('sorts strings', () => {
      expect(sort(['pear', 'apple', 'fig', 'banana'])).toEqual(['apple', 'banana', 'fig', 'pear']);
    });

    test('does not mutate its input', () => {
      const input = [3, 1, 2];
      sort(input);
      expect(input).toEqual([3, 1, 2]);
    });

    test('supports a custom comparator (descending)', () => {
      expect(sort([3, 1, 2, 5, 4], (a, b) => b - a)).toEqual([5, 4, 3, 2, 1]);
    });

    test('matches Array.prototype.sort on random data', () => {
      const next = lcg(123);
      [10, 50, 200].forEach(n => {
        const data = Array.from({ length: n }, () => (next() % 200) - 100);
        expect(sort(data)).toEqual(data.slice().sort(ascending));
      });
    });

    test('copes with many duplicates and already-sorted input at scale', () => {
      const dups = Array.from({ length: 500 }, (_, i) => i % 3);
      expect(isSorted(sort(dups))).toBe(true);
      const sorted = Array.from({ length: 500 }, (_, i) => i);
      expect(sort(sorted)).toEqual(sorted);
    });
  });
});

Object.keys(stableSorts).forEach(name => {
  test(name + ' is stable', () => {
    const records = [
      { key: 2, id: 'a' }, { key: 1, id: 'b' }, { key: 2, id: 'c' },
      { key: 1, id: 'd' }, { key: 3, id: 'e' }, { key: 2, id: 'f' },
    ];
    const sorted = stableSorts[name](records, (x, y) => x.key - y.key);
    expect(sorted.map(r => r.id)).toEqual(['b', 'd', 'a', 'c', 'f', 'e']);
  });
});

Object.keys(integerSorts).forEach(name => {
  const sort = integerSorts[name];
  describe(name, () => {
    test('sorts integers', () => {
      expect(sort([])).toEqual([]);
      expect(sort([4])).toEqual([4]);
      expect(sort([170, 45, 75, 90, 802, 24, 2, 66])).toEqual([2, 24, 45, 66, 75, 90, 170, 802]);
      expect(sort([3, 3, 1, 1, 2])).toEqual([1, 1, 2, 3, 3]);
    });

    test('does not mutate its input', () => {
      const input = [3, 1, 2];
      sort(input);
      expect(input).toEqual([3, 1, 2]);
    });

    test('matches Array.prototype.sort on random non-negative data', () => {
      const next = lcg(9);
      const data = Array.from({ length: 300 }, () => next() % 1000);
      expect(sort(data)).toEqual(data.slice().sort(ascending));
    });
  });
});

describe('negative numbers', () => {
  test('countingSort and radixSort handle negatives', () => {
    const data = [5, -3, 0, -10, 8, -3, 2];
    const expected = data.slice().sort(ascending);
    expect(countingSort(data)).toEqual(expected);
    expect(radixSort(data)).toEqual(expected);
  });

  test('bucketSort handles negatives and decimals', () => {
    const data = [0.5, -2.25, 3.75, -0.5, 1.125, 0];
    expect(bucketSort(data)).toEqual(data.slice().sort(ascending));
  });
});
