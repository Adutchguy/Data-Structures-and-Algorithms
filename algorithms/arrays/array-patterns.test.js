import * as ap from './array-patterns.js';

const {
  twoSumSorted, twoSum, threeSum, containerWithMostWater, trapRainWater, removeDuplicatesSorted,
  moveZeroes, sortColors, rotateArray, mergeSortedArrays, maxSumSubarrayOfSizeK,
  smallestSubarrayWithSum, maxSlidingWindow, buildPrefixSums, rangeSum, subarraySumEqualsK,
  productExceptSelf, longestConsecutive, majorityElement, findDuplicate, nextPermutation,
  spiralOrder, rotateMatrix,
} = ap;

function lcg(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state;
  };
}

describe('two pointers', () => {
  test('twoSumSorted', () => {
    expect(twoSumSorted([2, 7, 11, 15], 9)).toEqual([0, 1]);
    expect(twoSumSorted([1, 2, 3, 4, 6], 6)).toEqual([1, 3]);
    expect(twoSumSorted([1, 2, 3], 100)).toBeNull();
    expect(twoSumSorted([], 1)).toBeNull();
  });

  test('twoSum (unsorted)', () => {
    expect(twoSum([3, 2, 4], 6)).toEqual([1, 2]);
    expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
    expect(twoSum([3, 3], 6)).toEqual([0, 1]);
    expect(twoSum([1, 2], 10)).toBeNull();
  });

  test('threeSum returns unique triplets', () => {
    expect(threeSum([-1, 0, 1, 2, -1, -4])).toEqual([[-1, -1, 2], [-1, 0, 1]]);
    expect(threeSum([0, 0, 0, 0])).toEqual([[0, 0, 0]]);
    expect(threeSum([1, 2, 3])).toEqual([]);
    expect(threeSum([])).toEqual([]);
  });

  test('containerWithMostWater', () => {
    expect(containerWithMostWater([1, 8, 6, 2, 5, 4, 8, 3, 7])).toBe(49);
    expect(containerWithMostWater([1, 1])).toBe(1);
    expect(containerWithMostWater([5])).toBe(0);
  });

  test('trapRainWater', () => {
    expect(trapRainWater([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])).toBe(6);
    expect(trapRainWater([4, 2, 0, 3, 2, 5])).toBe(9);
    expect(trapRainWater([1, 2, 3])).toBe(0);
    expect(trapRainWater([])).toBe(0);
  });

  test('removeDuplicatesSorted, moveZeroes, sortColors', () => {
    expect(removeDuplicatesSorted([0, 0, 1, 1, 1, 2, 2, 3, 3, 4])).toEqual([0, 1, 2, 3, 4]);
    expect(removeDuplicatesSorted([])).toEqual([]);
    expect(moveZeroes([0, 1, 0, 3, 12])).toEqual([1, 3, 12, 0, 0]);
    expect(moveZeroes([0, 0])).toEqual([0, 0]);
    expect(sortColors([2, 0, 2, 1, 1, 0])).toEqual([0, 0, 1, 1, 2, 2]);
    expect(sortColors([1])).toEqual([1]);
  });

  test('rotateArray', () => {
    expect(rotateArray([1, 2, 3, 4, 5, 6, 7], 3)).toEqual([5, 6, 7, 1, 2, 3, 4]);
    expect(rotateArray([1, 2], 5)).toEqual([2, 1]);
    expect(rotateArray([1, 2, 3], 0)).toEqual([1, 2, 3]);
    expect(rotateArray([], 3)).toEqual([]);
  });

  test('mergeSortedArrays', () => {
    expect(mergeSortedArrays([1, 3, 5], [2, 4, 6, 8])).toEqual([1, 2, 3, 4, 5, 6, 8]);
    expect(mergeSortedArrays([], [1])).toEqual([1]);
  });

  test('functions do not mutate their input', () => {
    const data = [3, 1, 2, 0, 0];
    moveZeroes(data);
    sortColors(data);
    rotateArray(data, 2);
    nextPermutation(data);
    threeSum(data);
    expect(data).toEqual([3, 1, 2, 0, 0]);
  });
});

describe('sliding window', () => {
  test('maxSumSubarrayOfSizeK', () => {
    expect(maxSumSubarrayOfSizeK([2, 1, 5, 1, 3, 2], 3)).toBe(9);
    expect(maxSumSubarrayOfSizeK([2, 3, 4, 1, 5], 2)).toBe(7);
    expect(maxSumSubarrayOfSizeK([1, 2], 5)).toBe(0);
  });

  test('smallestSubarrayWithSum', () => {
    expect(smallestSubarrayWithSum([2, 1, 5, 2, 3, 2], 7)).toBe(2);
    expect(smallestSubarrayWithSum([2, 1, 5, 2, 8], 7)).toBe(1);
    expect(smallestSubarrayWithSum([3, 4, 1, 1, 6], 8)).toBe(3);
    expect(smallestSubarrayWithSum([1, 1], 10)).toBe(0);
  });

  test('maxSlidingWindow', () => {
    expect(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)).toEqual([3, 3, 5, 5, 6, 7]);
    expect(maxSlidingWindow([1], 1)).toEqual([1]);
    expect(maxSlidingWindow([9, 8, 7, 6], 2)).toEqual([9, 8, 7]);
    expect(maxSlidingWindow([], 3)).toEqual([]);
  });

  test('maxSlidingWindow matches brute force', () => {
    const next = lcg(6);
    const nums = Array.from({ length: 60 }, () => (next() % 50) - 25);
    [1, 2, 5, 10].forEach(k => {
      const expected = [];
      for (let i = 0; i + k <= nums.length; i++) expected.push(Math.max.apply(null, nums.slice(i, i + k)));
      expect(maxSlidingWindow(nums, k)).toEqual(expected);
    });
  });
});

describe('prefix sums', () => {
  test('buildPrefixSums / rangeSum', () => {
    const prefix = buildPrefixSums([3, 1, 4, 1, 5, 9]);
    expect(prefix).toEqual([0, 3, 4, 8, 9, 14, 23]);
    expect(rangeSum(prefix, 0, 5)).toBe(23);
    expect(rangeSum(prefix, 2, 4)).toBe(10);
    expect(rangeSum(prefix, 3, 3)).toBe(1);
  });

  test('subarraySumEqualsK', () => {
    expect(subarraySumEqualsK([1, 1, 1], 2)).toBe(2);
    expect(subarraySumEqualsK([1, 2, 3], 3)).toBe(2);
    expect(subarraySumEqualsK([1, -1, 0], 0)).toBe(3);
    expect(subarraySumEqualsK([], 0)).toBe(0);
  });

  test('productExceptSelf', () => {
    expect(productExceptSelf([1, 2, 3, 4])).toEqual([24, 12, 8, 6]);
    expect(productExceptSelf([1, 0, 3])).toEqual([0, 3, 0]);
    expect(productExceptSelf([0, 0])).toEqual([0, 0]);
  });
});

describe('misc classics', () => {
  test('longestConsecutive', () => {
    expect(longestConsecutive([100, 4, 200, 1, 3, 2])).toBe(4);
    expect(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])).toBe(9);
    expect(longestConsecutive([])).toBe(0);
  });

  test('majorityElement', () => {
    expect(majorityElement([2, 2, 1, 1, 1, 2, 2])).toBe(2);
    expect(majorityElement([3, 2, 3])).toBe(3);
    expect(majorityElement([7])).toBe(7);
  });

  test('findDuplicate', () => {
    expect(findDuplicate([1, 3, 4, 2, 2])).toBe(2);
    expect(findDuplicate([3, 1, 3, 4, 2])).toBe(3);
    expect(findDuplicate([2, 2, 2, 2, 2])).toBe(2);
  });

  test('nextPermutation', () => {
    expect(nextPermutation([1, 2, 3])).toEqual([1, 3, 2]);
    expect(nextPermutation([3, 2, 1])).toEqual([1, 2, 3]);
    expect(nextPermutation([1, 1, 5])).toEqual([1, 5, 1]);
    expect(nextPermutation([1, 3, 2])).toEqual([2, 1, 3]);
    expect(nextPermutation([])).toEqual([]);
  });

  test('spiralOrder', () => {
    expect(spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]])).toEqual([1, 2, 3, 6, 9, 8, 7, 4, 5]);
    expect(spiralOrder([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])).toEqual([1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]);
    expect(spiralOrder([[1], [2], [3]])).toEqual([1, 2, 3]);
    expect(spiralOrder([])).toEqual([]);
  });

  test('rotateMatrix rotates 90 degrees clockwise', () => {
    expect(rotateMatrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]])).toEqual([[7, 4, 1], [8, 5, 2], [9, 6, 3]]);
    expect(rotateMatrix([[1, 2, 3], [4, 5, 6]])).toEqual([[4, 1], [5, 2], [6, 3]]);
    expect(rotateMatrix([])).toEqual([]);
    const m = [[1, 2], [3, 4]];
    expect(rotateMatrix(rotateMatrix(rotateMatrix(rotateMatrix(m))))).toEqual(m);
  });
});
