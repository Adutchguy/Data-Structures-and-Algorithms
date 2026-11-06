'use strict';

/**
 * Dynamic Programming on grids and intervals
 *
 * The state is usually a cell (r, c) or a range [i, j]; the answer for a state
 * depends only on a few neighbouring states that were already computed.
 */

function makeTable(rows, cols, fill = 0) {
  const table = [];
  for (let i = 0; i < rows; i++) {
    table.push(new Array(cols));
    for (let j = 0; j < cols; j++) table[i][j] = fill;
  }
  return table;
}

// Paths from top-left to bottom-right moving only right or down. O(m*n).
// paths(r, c) = paths(r-1, c) + paths(r, c-1)
export function uniquePaths(m, n) {
  const row = new Array(n);
  for (let c = 0; c < n; c++) row[c] = 1;
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) row[c] += row[c - 1];
  }
  return row[n - 1];
}

// Same, but cells containing 1 are blocked.
export function uniquePathsWithObstacles(grid) {
  const m = grid.length;
  if (m === 0) return 0;
  const n = grid[0].length;
  const dp = new Array(n);
  for (let c = 0; c < n; c++) dp[c] = 0;
  dp[0] = grid[0][0] === 1 ? 0 : 1;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 1) dp[c] = 0;
      else if (c > 0) dp[c] += dp[c - 1];
    }
  }
  return dp[n - 1];
}

// Minimum sum along a right/down path from top-left to bottom-right.
export function minPathSum(grid) {
  const m = grid.length;
  if (m === 0) return 0;
  const n = grid[0].length;
  const dp = makeTable(m, n);
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (r === 0 && c === 0) dp[r][c] = grid[r][c];
      else if (r === 0) dp[r][c] = dp[r][c - 1] + grid[r][c];
      else if (c === 0) dp[r][c] = dp[r - 1][c] + grid[r][c];
      else dp[r][c] = Math.min(dp[r - 1][c], dp[r][c - 1]) + grid[r][c];
    }
  }
  return dp[m - 1][n - 1];
}

// Minimum top-to-bottom path in a triangle, moving to an adjacent number below.
// Work from the bottom row upward so there is always a "row below" to look at.
export function triangleMinPath(triangle) {
  if (triangle.length === 0) return 0;
  const dp = triangle[triangle.length - 1].slice();
  for (let r = triangle.length - 2; r >= 0; r--) {
    for (let c = 0; c <= r; c++) {
      dp[c] = triangle[r][c] + Math.min(dp[c], dp[c + 1]);
    }
  }
  return dp[0];
}

// Area of the largest all-1s square in a binary matrix ('1' or 1 counts as set).
// dp[r][c] = side of the biggest square whose bottom-right corner is (r, c).
export function maximalSquare(matrix) {
  if (matrix.length === 0) return 0;
  const rows = matrix.length;
  const cols = matrix[0].length;
  const dp = makeTable(rows + 1, cols + 1);
  let best = 0;
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const cell = matrix[r - 1][c - 1];
      if (cell === 1 || cell === '1') {
        dp[r][c] = 1 + Math.min(dp[r - 1][c], dp[r][c - 1], dp[r - 1][c - 1]);
        best = Math.max(best, dp[r][c]);
      }
    }
  }
  return best * best;
}

/**
 * Matrix chain multiplication (interval DP).
 * Multiplying matrices is associative, but the PARENTHESISATION changes the cost.
 * Matrix i has dimensions dims[i] x dims[i+1]. Multiplying (p x q) by (q x r)
 * costs p*q*r scalar multiplications.
 * cost[i][j] = cheapest way to multiply matrices i..j, trying every split point k.
 * O(n^3) time. Returns { cost, order } where order looks like "((A1A2)A3)".
 */
export function matrixChainOrder(dims) {
  const n = dims.length - 1;
  if (n < 1) return { cost: 0, order: '' };
  const cost = makeTable(n, n);
  const split = makeTable(n, n);
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      cost[i][j] = Infinity;
      for (let k = i; k < j; k++) {
        const c = cost[i][k] + cost[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
        if (c < cost[i][j]) {
          cost[i][j] = c;
          split[i][j] = k;
        }
      }
    }
  }
  const build = (i, j) => (i === j
    ? 'A' + (i + 1)
    : '(' + build(i, split[i][j]) + build(split[i][j] + 1, j) + ')');
  return { cost: cost[0][n - 1], order: build(0, n - 1) };
}
