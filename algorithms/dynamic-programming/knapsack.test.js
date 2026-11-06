import * as ks from './knapsack.js';

const {
  knapsack01, knapsack01Items, unboundedKnapsack, rodCutting, coinChangeMin,
  coinChangeWays, subsetSum, canPartition, targetSumWays, perfectSquares,
} = ks;

describe('knapsack', () => {
  test('knapsack01', () => {
    expect(knapsack01([1, 3, 4, 5], [1, 4, 5, 7], 7)).toBe(9);
    expect(knapsack01([10, 20, 30], [60, 100, 120], 50)).toBe(220);
    expect(knapsack01([5], [10], 4)).toBe(0);
    expect(knapsack01([], [], 10)).toBe(0);
    expect(knapsack01([2, 3], [3, 4], 0)).toBe(0);
  });

  test('knapsack01Items reports which items to take', () => {
    const result = knapsack01Items([1, 3, 4, 5], [1, 4, 5, 7], 7);
    expect(result.value).toBe(9);
    expect(result.items).toEqual([1, 2]); // weights 3 + 4, values 4 + 5
    const weights = [10, 20, 30];
    const picked = knapsack01Items(weights, [60, 100, 120], 50);
    expect(picked.items.reduce((sum, i) => sum + weights[i], 0)).toBeLessThanOrEqual(50);
    expect(picked.value).toBe(220);
  });

  test('unboundedKnapsack allows reuse', () => {
    expect(unboundedKnapsack([1, 3, 4, 5], [10, 40, 50, 70], 8)).toBe(110);
    expect(unboundedKnapsack([2], [3], 7)).toBe(9);
  });

  test('rodCutting', () => {
    expect(rodCutting([1, 5, 8, 9, 10, 17, 17, 20], 8)).toBe(22);
    expect(rodCutting([3, 5, 8, 9, 10, 17, 17, 20], 8)).toBe(24);
    expect(rodCutting([1, 5, 8, 9], 0)).toBe(0);
  });
});

describe('coin change', () => {
  test('coinChangeMin', () => {
    expect(coinChangeMin([1, 2, 5], 11)).toBe(3);
    expect(coinChangeMin([2], 3)).toBe(-1);
    expect(coinChangeMin([1], 0)).toBe(0);
    expect(coinChangeMin([1, 3, 4], 6)).toBe(2); // 3 + 3, where greedy would pick 4 + 1 + 1
  });

  test('coinChangeWays counts combinations, not orderings', () => {
    expect(coinChangeWays([1, 2, 5], 5)).toBe(4);
    expect(coinChangeWays([2], 3)).toBe(0);
    expect(coinChangeWays([10], 10)).toBe(1);
    expect(coinChangeWays([1, 2, 3], 4)).toBe(4);
    expect(coinChangeWays([1, 2], 0)).toBe(1);
  });
});

describe('subset problems', () => {
  test('subsetSum', () => {
    expect(subsetSum([3, 34, 4, 12, 5, 2], 9)).toBe(true);
    expect(subsetSum([3, 34, 4, 12, 5, 2], 30)).toBe(false);
    expect(subsetSum([], 0)).toBe(true);
    expect(subsetSum([5], 3)).toBe(false);
  });

  test('canPartition', () => {
    expect(canPartition([1, 5, 11, 5])).toBe(true);
    expect(canPartition([1, 2, 3, 5])).toBe(false);
    expect(canPartition([1, 2, 5])).toBe(false);
    expect(canPartition([])).toBe(true);
  });

  test('targetSumWays', () => {
    expect(targetSumWays([1, 1, 1, 1, 1], 3)).toBe(5);
    expect(targetSumWays([1], 1)).toBe(1);
    expect(targetSumWays([1], 2)).toBe(0);
    expect(targetSumWays([0, 0, 1], 1)).toBe(4); // each zero can be + or -
  });

  test('perfectSquares', () => {
    expect(perfectSquares(12)).toBe(3);
    expect(perfectSquares(13)).toBe(2);
    expect(perfectSquares(1)).toBe(1);
    expect(perfectSquares(0)).toBe(0);
    expect(perfectSquares(7)).toBe(4);
  });
});
