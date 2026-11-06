import * as bt from './backtracking.js';

const {
  permutations, permutationsUnique, subsets, subsetsWithDup, combinations, combinationSum,
  generateParentheses, letterCombinations, palindromePartitions, nQueens, countNQueens,
  drawBoard, solveSudoku, wordSearch,
} = bt;

const sortLists = lists => lists.map(l => l.slice()).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

describe('permutations and subsets', () => {
  test('permutations', () => {
    expect(permutations([1, 2, 3])).toEqual([
      [1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1],
    ]);
    expect(permutations([])).toEqual([[]]);
    expect(permutations([1, 2, 3, 4, 5]).length).toBe(120);
  });

  test('permutationsUnique skips duplicate orderings', () => {
    expect(permutationsUnique([1, 1, 2])).toEqual([[1, 1, 2], [1, 2, 1], [2, 1, 1]]);
    expect(permutationsUnique([2, 2, 2])).toEqual([[2, 2, 2]]);
  });

  test('subsets returns the full power set', () => {
    const result = subsets([1, 2, 3]);
    expect(result.length).toBe(8);
    expect(sortLists(result)).toEqual(sortLists([[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]));
    expect(subsets([])).toEqual([[]]);
  });

  test('subsetsWithDup', () => {
    expect(sortLists(subsetsWithDup([1, 2, 2]))).toEqual(
      sortLists([[], [1], [2], [1, 2], [2, 2], [1, 2, 2]])
    );
  });

  test('combinations', () => {
    expect(combinations(4, 2)).toEqual([[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]);
    expect(combinations(5, 3).length).toBe(10);
    expect(combinations(3, 3)).toEqual([[1, 2, 3]]);
    expect(combinations(3, 0)).toEqual([[]]);
  });

  test('combinationSum', () => {
    expect(combinationSum([2, 3, 6, 7], 7)).toEqual([[2, 2, 3], [7]]);
    expect(combinationSum([2, 3, 5], 8)).toEqual([[2, 2, 2, 2], [2, 3, 3], [3, 5]]);
    expect(combinationSum([2], 1)).toEqual([]);
  });
});

describe('string backtracking', () => {
  test('generateParentheses', () => {
    expect(generateParentheses(3).sort()).toEqual(['((()))', '(()())', '(())()', '()(())', '()()()']);
    expect(generateParentheses(0)).toEqual(['']);
    expect(generateParentheses(5).length).toBe(42); // Catalan(5)
  });

  test('letterCombinations', () => {
    expect(letterCombinations('23')).toEqual(['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf']);
    expect(letterCombinations('')).toEqual([]);
    expect(letterCombinations('79').length).toBe(16);
  });

  test('palindromePartitions', () => {
    expect(palindromePartitions('aab')).toEqual([['a', 'a', 'b'], ['aa', 'b']]);
    expect(palindromePartitions('a')).toEqual([['a']]);
    expect(palindromePartitions('aaa').length).toBe(4);
  });
});

describe('nQueens', () => {
  test('known solution counts', () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8].map(countNQueens)).toEqual([1, 0, 0, 2, 10, 4, 40, 92]);
  });

  test('n = 4 solutions', () => {
    expect(nQueens(4)).toEqual([[1, 3, 0, 2], [2, 0, 3, 1]]);
  });

  test('every solution is valid', () => {
    nQueens(6).forEach(sol => {
      for (let i = 0; i < sol.length; i++) {
        for (let j = i + 1; j < sol.length; j++) {
          expect(sol[i]).not.toBe(sol[j]);
          expect(Math.abs(sol[i] - sol[j])).not.toBe(j - i);
        }
      }
    });
  });

  test('drawBoard', () => {
    expect(drawBoard([1, 3, 0, 2])).toEqual(['.Q..', '...Q', 'Q...', '..Q.']);
  });
});

describe('solveSudoku', () => {
  const puzzle = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ];

  test('solves a classic puzzle', () => {
    const solved = solveSudoku(puzzle);
    expect(solved[0]).toEqual([5, 3, 4, 6, 7, 8, 9, 1, 2]);
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 9; i++) {
      expect(solved[i].slice().sort()).toEqual(digits);
      expect(solved.map(row => row[i]).sort()).toEqual(digits);
      const box = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) box.push(solved[3 * Math.floor(i / 3) + r][3 * (i % 3) + c]);
      }
      expect(box.sort()).toEqual(digits);
    }
    // given digits are preserved
    puzzle.forEach((row, r) => row.forEach((v, c) => {
      if (v !== 0) expect(solved[r][c]).toBe(v);
    }));
  });

  test('does not mutate the input and detects unsolvable puzzles', () => {
    const copy = puzzle.map(row => row.slice());
    solveSudoku(puzzle);
    expect(puzzle).toEqual(copy);
    const bad = puzzle.map(row => row.slice());
    bad[0][2] = 5; // two 5s in the first row
    bad[1][1] = 0;
    expect(solveSudoku(bad)).toBeNull();
  });
});

describe('wordSearch', () => {
  const board = () => [
    ['A', 'B', 'C', 'E'],
    ['S', 'F', 'C', 'S'],
    ['A', 'D', 'E', 'E'],
  ];

  test('finds words as paths of adjacent cells', () => {
    expect(wordSearch(board(), 'ABCCED')).toBe(true);
    expect(wordSearch(board(), 'SEE')).toBe(true);
    expect(wordSearch(board(), 'ABCB')).toBe(false); // would reuse the B
    expect(wordSearch(board(), 'XYZ')).toBe(false);
  });

  test('leaves the board unchanged', () => {
    const b = board();
    wordSearch(b, 'ABCCED');
    expect(b).toEqual(board());
  });
});
