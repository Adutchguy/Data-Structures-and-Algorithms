'use strict';

/**
 * Dynamic Programming: the knapsack family
 *
 * "Choose items under a budget" problems. dp[w] (or dp[i][w]) = the best result
 * using capacity/target w.
 *
 * Loop direction is the key detail for the 1-D versions:
 *   iterate w DOWNWARD ... each item is used at most once  (0/1)
 *   iterate w UPWARD ..... an item can be reused           (unbounded)
 */

// 0/1 knapsack: each item once. Returns the maximum total value that fits. O(n * W).
export function knapsack01(weights, values, capacity) {
  const dp = new Array(capacity + 1);
  for (let w = 0; w <= capacity; w++) dp[w] = 0;
  for (let i = 0; i < weights.length; i++) {
    for (let w = capacity; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  return dp[capacity];
}

// Same problem, but also report WHICH items were chosen (needs the full 2-D table).
export function knapsack01Items(weights, values, capacity) {
  const n = weights.length;
  const dp = [];
  for (let i = 0; i <= n; i++) {
    dp.push(new Array(capacity + 1));
    for (let w = 0; w <= capacity; w++) dp[i][w] = 0;
  }
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
      }
    }
  }
  const items = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) { // value changed, so item i-1 was taken
      items.push(i - 1);
      w -= weights[i - 1];
    }
  }
  return { value: dp[n][capacity], items: items.reverse() };
}

// Unbounded knapsack: unlimited copies of every item.
export function unboundedKnapsack(weights, values, capacity) {
  const dp = new Array(capacity + 1);
  for (let w = 0; w <= capacity; w++) dp[w] = 0;
  for (let w = 1; w <= capacity; w++) {
    for (let i = 0; i < weights.length; i++) {
      if (weights[i] <= w) dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  return dp[capacity];
}

// Rod cutting: prices[i] is the price of a piece of length i + 1.
// Best revenue from a rod of length n (unbounded knapsack in disguise).
export function rodCutting(prices, n) {
  const best = new Array(n + 1);
  best[0] = 0;
  for (let length = 1; length <= n; length++) {
    best[length] = 0;
    for (let cut = 1; cut <= Math.min(length, prices.length); cut++) {
      best[length] = Math.max(best[length], prices[cut - 1] + best[length - cut]);
    }
  }
  return best[n];
}

// Fewest coins that sum to `amount` (coins reusable), or -1 if impossible.
export function coinChangeMin(coins, amount) {
  const dp = new Array(amount + 1);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    dp[a] = Infinity;
    for (let i = 0; i < coins.length; i++) {
      if (coins[i] <= a && dp[a - coins[i]] + 1 < dp[a]) dp[a] = dp[a - coins[i]] + 1;
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// Number of distinct COMBINATIONS (order ignored) of coins that sum to amount.
// Looping coins on the OUTSIDE is what stops [1,2] and [2,1] counting twice.
export function coinChangeWays(coins, amount) {
  const dp = new Array(amount + 1);
  for (let a = 0; a <= amount; a++) dp[a] = 0;
  dp[0] = 1;
  coins.forEach(coin => {
    for (let a = coin; a <= amount; a++) dp[a] += dp[a - coin];
  });
  return dp[amount];
}

// Can some subset of nums add up to exactly target? (non-negative integers)
export function subsetSum(nums, target) {
  const dp = new Array(target + 1);
  for (let t = 0; t <= target; t++) dp[t] = false;
  dp[0] = true;
  nums.forEach(num => {
    for (let t = target; t >= num; t--) {
      if (dp[t - num]) dp[t] = true;
    }
  });
  return dp[target];
}

// Can the array be split into two subsets with equal sums?
export function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  return total % 2 === 0 && subsetSum(nums, total / 2);
}

// Count the ways to put + or - in front of every number so they total `target`.
// Let P = sum of the '+' group: P - (total - P) = target  =>  P = (total + target) / 2
// so this is "count subsets that sum to P".
export function targetSumWays(nums, target) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (Math.abs(target) > total || (total + target) % 2 !== 0) return 0;
  const goal = (total + target) / 2;
  const dp = new Array(goal + 1);
  for (let s = 0; s <= goal; s++) dp[s] = 0;
  dp[0] = 1;
  nums.forEach(num => {
    for (let s = goal; s >= num; s--) dp[s] += dp[s - num];
  });
  return dp[goal];
}

// Fewest perfect squares (1, 4, 9, 16, ...) that add up to n.
export function perfectSquares(n) {
  const dp = new Array(n + 1);
  dp[0] = 0;
  for (let i = 1; i <= n; i++) {
    dp[i] = Infinity;
    for (let s = 1; s * s <= i; s++) dp[i] = Math.min(dp[i], dp[i - s * s] + 1);
  }
  return dp[n];
}
