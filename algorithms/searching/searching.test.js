import * as search from './searching.js';

const {
  linearSearch, binarySearch, binarySearchRecursive, lowerBound, upperBound,
  countOccurrences, firstOccurrence, lastOccurrence, jumpSearch, interpolationSearch,
  exponentialSearch, ternarySearchMax, searchRotated, findMinRotated, findPeak,
  sqrtFloor, shipWithinDays,
} = search;

const sorted = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];

const finders = { linearSearch, binarySearch, binarySearchRecursive, jumpSearch, interpolationSearch, exponentialSearch };

Object.keys(finders).forEach(name => {
  const find = finders[name];
  describe(name, () => {
    test('finds every element of a sorted array', () => {
      sorted.forEach((v, i) => expect(find(sorted, v)).toBe(i));
    });

    test('returns -1 for missing values', () => {
      [0, 2, 8, 20, 22, 100, -5].forEach(v => expect(find(sorted, v)).toBe(-1));
    });

    test('handles empty and one-element arrays', () => {
      expect(find([], 3)).toBe(-1);
      expect(find([3], 3)).toBe(0);
      expect(find([3], 4)).toBe(-1);
    });

    test('works on larger arrays', () => {
      const big = Array.from({ length: 1000 }, (_, i) => i * 3);
      expect(find(big, 0)).toBe(0);
      expect(find(big, 2997)).toBe(999);
      expect(find(big, 1500)).toBe(500);
      expect(find(big, 1501)).toBe(-1);
    });
  });
});

describe('bounds and counting', () => {
  const arr = [1, 2, 2, 2, 3, 5, 5, 8];

  test('lowerBound and upperBound', () => {
    expect(lowerBound(arr, 2)).toBe(1);
    expect(upperBound(arr, 2)).toBe(4);
    expect(lowerBound(arr, 4)).toBe(5);
    expect(upperBound(arr, 4)).toBe(5);
    expect(lowerBound(arr, 0)).toBe(0);
    expect(lowerBound(arr, 100)).toBe(8);
    expect(upperBound(arr, 8)).toBe(8);
  });

  test('countOccurrences', () => {
    expect(countOccurrences(arr, 2)).toBe(3);
    expect(countOccurrences(arr, 5)).toBe(2);
    expect(countOccurrences(arr, 4)).toBe(0);
  });

  test('firstOccurrence and lastOccurrence', () => {
    expect(firstOccurrence(arr, 2)).toBe(1);
    expect(lastOccurrence(arr, 2)).toBe(3);
    expect(firstOccurrence(arr, 4)).toBe(-1);
    expect(lastOccurrence(arr, 100)).toBe(-1);
    expect(lastOccurrence(arr, 0)).toBe(-1);
  });
});

describe('interpolationSearch', () => {
  test('handles runs of equal values', () => {
    expect(interpolationSearch([4, 4, 4, 4], 4)).toBeGreaterThanOrEqual(0);
    expect(interpolationSearch([4, 4, 4, 4], 5)).toBe(-1);
  });
});

describe('ternarySearchMax', () => {
  test('finds the peak of a parabola', () => {
    const x = ternarySearchMax(v => -(v - 3) * (v - 3) + 10, -100, 100);
    expect(x).toBeCloseTo(3, 5);
  });
});

describe('rotated array searches', () => {
  const rotated = [4, 5, 6, 7, 0, 1, 2];

  test('searchRotated', () => {
    rotated.forEach((v, i) => expect(searchRotated(rotated, v)).toBe(i));
    expect(searchRotated(rotated, 3)).toBe(-1);
    expect(searchRotated([], 1)).toBe(-1);
    expect(searchRotated([1], 1)).toBe(0);
  });

  test('findMinRotated', () => {
    expect(findMinRotated(rotated)).toBe(0);
    expect(findMinRotated([1, 2, 3])).toBe(1);
    expect(findMinRotated([3, 1, 2])).toBe(1);
    expect(findMinRotated([5])).toBe(5);
  });
});

describe('findPeak', () => {
  test('returns the index of a local maximum', () => {
    [[1, 2, 3, 1], [1, 3, 2, 5, 4], [5, 4, 3], [1, 2, 3], [7]].forEach(arr => {
      const i = findPeak(arr);
      const left = i === 0 ? -Infinity : arr[i - 1];
      const right = i === arr.length - 1 ? -Infinity : arr[i + 1];
      expect(arr[i]).toBeGreaterThan(left);
      expect(arr[i]).toBeGreaterThan(right);
    });
    expect(findPeak([])).toBe(-1);
  });
});

describe('binary search on the answer', () => {
  test('sqrtFloor', () => {
    [0, 1, 2, 3, 4, 8, 9, 15, 16, 17, 99, 100, 1000000, 2147395600].forEach(n => {
      expect(sqrtFloor(n)).toBe(Math.floor(Math.sqrt(n)));
    });
    expect(() => sqrtFloor(-1)).toThrow();
  });

  test('shipWithinDays', () => {
    expect(shipWithinDays([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5)).toBe(15);
    expect(shipWithinDays([3, 2, 2, 4, 1, 4], 3)).toBe(6);
    expect(shipWithinDays([1, 2, 3, 1, 1], 4)).toBe(3);
    expect(shipWithinDays([10], 1)).toBe(10);
  });
});
