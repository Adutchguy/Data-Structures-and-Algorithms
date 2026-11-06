import * as grids from './grids.js';

const {
  uniquePaths, uniquePathsWithObstacles, minPathSum, triangleMinPath,
  maximalSquare, matrixChainOrder,
} = grids;

describe('grid path counting', () => {
  test('uniquePaths', () => {
    expect(uniquePaths(3, 7)).toBe(28);
    expect(uniquePaths(3, 2)).toBe(3);
    expect(uniquePaths(1, 5)).toBe(1);
    expect(uniquePaths(10, 10)).toBe(48620); // C(18, 9)
  });

  test('uniquePathsWithObstacles', () => {
    expect(uniquePathsWithObstacles([[0, 0, 0], [0, 1, 0], [0, 0, 0]])).toBe(2);
    expect(uniquePathsWithObstacles([[0, 1], [0, 0]])).toBe(1);
    expect(uniquePathsWithObstacles([[1, 0]])).toBe(0);
    expect(uniquePathsWithObstacles([[0, 0], [0, 1]])).toBe(0);
    expect(uniquePathsWithObstacles([])).toBe(0);
  });
});

describe('grid optimisation', () => {
  test('minPathSum', () => {
    expect(minPathSum([[1, 3, 1], [1, 5, 1], [4, 2, 1]])).toBe(7);
    expect(minPathSum([[1, 2, 3], [4, 5, 6]])).toBe(12);
    expect(minPathSum([[5]])).toBe(5);
    expect(minPathSum([])).toBe(0);
  });

  test('triangleMinPath', () => {
    expect(triangleMinPath([[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]])).toBe(11);
    expect(triangleMinPath([[-10]])).toBe(-10);
    expect(triangleMinPath([])).toBe(0);
  });

  test('maximalSquare returns the area', () => {
    expect(maximalSquare([
      ['1', '0', '1', '0', '0'],
      ['1', '0', '1', '1', '1'],
      ['1', '1', '1', '1', '1'],
      ['1', '0', '0', '1', '0'],
    ])).toBe(4);
    expect(maximalSquare([[0, 1], [1, 0]])).toBe(1);
    expect(maximalSquare([[0]])).toBe(0);
    expect(maximalSquare([[1, 1, 1], [1, 1, 1], [1, 1, 1]])).toBe(9);
    expect(maximalSquare([])).toBe(0);
  });
});

describe('matrixChainOrder', () => {
  test('finds the cheapest parenthesisation', () => {
    expect(matrixChainOrder([10, 30, 5, 60])).toEqual({ cost: 4500, order: '((A1A2)A3)' });
    expect(matrixChainOrder([40, 20, 30, 10, 30]).cost).toBe(26000);
    expect(matrixChainOrder([40, 20, 30, 10, 30]).order).toBe('((A1(A2A3))A4)');
  });

  test('trivial cases', () => {
    expect(matrixChainOrder([5, 10])).toEqual({ cost: 0, order: 'A1' });
    expect(matrixChainOrder([5])).toEqual({ cost: 0, order: '' });
    expect(matrixChainOrder([10, 20, 30]).cost).toBe(6000);
  });
});
