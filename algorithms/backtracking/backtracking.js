'use strict';

/**
 * Backtracking
 *
 * Build a solution one decision at a time. After each choice, recurse; when the
 * recursion returns, UNDO the choice and try the next option. Whenever a partial
 * solution can no longer lead to a valid answer, abandon ("prune") that branch
 * immediately instead of exploring it.
 *
 *   function explore(partial):
 *       if partial is a complete solution: record it
 *       for each choice available:
 *           if choice is valid: make it; explore(partial); undo it
 *
 * Typical cost is exponential (n!, 2^n) - pruning is what makes it practical.
 */

// All orderings of the elements. n! results.
export function permutations(items) {
  const results = [];
  const used = new Array(items.length);
  for (let i = 0; i < used.length; i++) used[i] = false;
  const current = [];
  const explore = () => {
    if (current.length === items.length) {
      results.push(current.slice());
      return;
    }
    for (let i = 0; i < items.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      current.push(items[i]);
      explore();
      current.pop();
      used[i] = false;
    }
  };
  explore();
  return results;
}

// Distinct orderings when the input contains duplicates.
// Sort first, then skip a duplicate unless its identical predecessor is in use.
export function permutationsUnique(items) {
  const sorted = items.slice().sort();
  const results = [];
  const used = new Array(sorted.length);
  for (let i = 0; i < used.length; i++) used[i] = false;
  const current = [];
  const explore = () => {
    if (current.length === sorted.length) {
      results.push(current.slice());
      return;
    }
    for (let i = 0; i < sorted.length; i++) {
      if (used[i]) continue;
      if (i > 0 && sorted[i] === sorted[i - 1] && !used[i - 1]) continue;
      used[i] = true;
      current.push(sorted[i]);
      explore();
      current.pop();
      used[i] = false;
    }
  };
  explore();
  return results;
}

// Power set: every subset. 2^n results. For each element: include it or not.
export function subsets(items) {
  const results = [];
  const current = [];
  const explore = index => {
    if (index === items.length) {
      results.push(current.slice());
      return;
    }
    explore(index + 1); // exclude
    current.push(items[index]);
    explore(index + 1); // include
    current.pop();
  };
  explore(0);
  return results;
}

// Subsets of a list that may contain duplicates, without duplicate subsets.
export function subsetsWithDup(items) {
  const sorted = items.slice().sort();
  const results = [];
  const current = [];
  const explore = start => {
    results.push(current.slice());
    for (let i = start; i < sorted.length; i++) {
      if (i > start && sorted[i] === sorted[i - 1]) continue; // skip duplicate at this depth
      current.push(sorted[i]);
      explore(i + 1);
      current.pop();
    }
  };
  explore(0);
  return results;
}

// All k-element combinations of the numbers 1..n.
export function combinations(n, k) {
  const results = [];
  const current = [];
  const explore = start => {
    if (current.length === k) {
      results.push(current.slice());
      return;
    }
    // prune: not enough numbers left to fill the combination
    for (let i = start; i <= n - (k - current.length) + 1; i++) {
      current.push(i);
      explore(i + 1);
      current.pop();
    }
  };
  explore(1);
  return results;
}

// Combinations of candidates (each reusable) that sum to target.
export function combinationSum(candidates, target) {
  const sorted = candidates.slice().sort((a, b) => a - b);
  const results = [];
  const current = [];
  const explore = (start, remaining) => {
    if (remaining === 0) {
      results.push(current.slice());
      return;
    }
    for (let i = start; i < sorted.length; i++) {
      if (sorted[i] > remaining) break; // sorted, so nothing later fits either
      current.push(sorted[i]);
      explore(i, remaining - sorted[i]); // i, not i+1: reuse allowed
      current.pop();
    }
  };
  explore(0, target);
  return results;
}

// All well-formed strings with n pairs of parentheses (Catalan(n) of them).
// Prune: only add '(' while some remain, only add ')' while it closes an open one.
export function generateParentheses(n) {
  const results = [];
  const explore = (current, open, close) => {
    if (current.length === 2 * n) {
      results.push(current);
      return;
    }
    if (open < n) explore(current + '(', open + 1, close);
    if (close < open) explore(current + ')', open, close + 1);
  };
  explore('', 0, 0);
  return results;
}

// Letter combinations for a phone keypad string such as "23".
export function letterCombinations(digits) {
  if (digits.length === 0) return [];
  const keys = {
    2: 'abc', 3: 'def', 4: 'ghi', 5: 'jkl', 6: 'mno', 7: 'pqrs', 8: 'tuv', 9: 'wxyz',
  };
  const results = [];
  const explore = (index, current) => {
    if (index === digits.length) {
      results.push(current);
      return;
    }
    keys[digits[index]].split('').forEach(letter => explore(index + 1, current + letter));
  };
  explore(0, '');
  return results;
}

// Every way to split s into palindromic pieces.
export function palindromePartitions(s) {
  const isPal = (lo, hi) => {
    while (lo < hi) {
      if (s[lo++] !== s[hi--]) return false;
    }
    return true;
  };
  const results = [];
  const current = [];
  const explore = start => {
    if (start === s.length) {
      results.push(current.slice());
      return;
    }
    for (let end = start; end < s.length; end++) {
      if (isPal(start, end)) {
        current.push(s.slice(start, end + 1));
        explore(end + 1);
        current.pop();
      }
    }
  };
  explore(0);
  return results;
}

/**
 * N-Queens: place n queens on an n x n board so none attack each other.
 * One queen per row; track which columns and diagonals are taken so each
 * placement check is O(1). Each solution is an array where solution[row] = column.
 */
export function nQueens(n) {
  const solutions = [];
  const cols = new Set();
  const diagDown = new Set(); // row - col is constant along "\" diagonals
  const diagUp = new Set(); // row + col is constant along "/" diagonals
  const placement = [];
  const explore = row => {
    if (row === n) {
      solutions.push(placement.slice());
      return;
    }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diagDown.has(row - col) || diagUp.has(row + col)) continue;
      cols.add(col);
      diagDown.add(row - col);
      diagUp.add(row + col);
      placement.push(col);
      explore(row + 1);
      placement.pop();
      cols.delete(col);
      diagDown.delete(row - col);
      diagUp.delete(row + col);
    }
  };
  explore(0);
  return solutions;
}

export function countNQueens(n) {
  return nQueens(n).length;
}

// Render an nQueens solution as strings: 'Q' for a queen, '.' for empty.
export function drawBoard(solution) {
  return solution.map(col => '.'.repeat(col) + 'Q' + '.'.repeat(solution.length - col - 1));
}

/**
 * Sudoku solver. `board` is a 9x9 array of numbers, 0 for blanks.
 * Returns a solved COPY, or null if there is no solution.
 */
export function solveSudoku(board) {
  const grid = board.map(row => row.slice());
  const fits = (r, c, value) => {
    for (let i = 0; i < 9; i++) {
      if (grid[r][i] === value || grid[i][c] === value) return false;
    }
    const boxRow = r - (r % 3);
    const boxCol = c - (c % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[boxRow + i][boxCol + j] === value) return false;
      }
    }
    return true;
  };
  const solve = () => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] !== 0) continue;
        for (let value = 1; value <= 9; value++) {
          if (fits(r, c, value)) {
            grid[r][c] = value;
            if (solve()) return true;
            grid[r][c] = 0; // undo
          }
        }
        return false; // no digit fits this cell: backtrack
      }
    }
    return true; // no empty cells left
  };
  return solve() ? grid : null;
}

// Does `word` appear in the board as a path of adjacent cells (no cell reused)?
export function wordSearch(board, word) {
  const rows = board.length;
  const cols = rows ? board[0].length : 0;
  const explore = (r, c, index) => {
    if (index === word.length) return true;
    if (r < 0 || c < 0 || r >= rows || c >= cols || board[r][c] !== word[index]) return false;
    const saved = board[r][c];
    board[r][c] = '#'; // mark visited
    const found = explore(r + 1, c, index + 1) || explore(r - 1, c, index + 1) ||
      explore(r, c + 1, index + 1) || explore(r, c - 1, index + 1);
    board[r][c] = saved; // undo
    return found;
  };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (explore(r, c, 0)) return true;
    }
  }
  return false;
}
