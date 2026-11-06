import * as dp from './sequences.js';

const {
  fibMemo, fibTabulated, fibConstantSpace, climbStairs, minCostClimbingStairs, houseRobber,
  maxSubarray, lisLength, lisSequence, longestCommonSubsequence, longestCommonSubstring,
  editDistance, longestPalindromicSubsequence, wordBreak, numDecodings,
} = dp;

// Is `sub` a subsequence of `full`?
function isSubsequence(sub, full) {
  let i = 0;
  for (let j = 0; j < full.length && i < sub.length; j++) {
    if (full[j] === sub[i]) i++;
  }
  return i === sub.length;
}

describe('fibonacci', () => {
  const expected = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
  [['fibMemo', fibMemo], ['fibTabulated', fibTabulated], ['fibConstantSpace', fibConstantSpace]].forEach(([name, fib]) => {
    test(name, () => {
      expected.forEach((v, n) => expect(fib(n)).toBe(v));
      expect(fib(50)).toBe(12586269025);
    });
  });
});

describe('stairs and houses', () => {
  test('climbStairs', () => {
    expect([1, 2, 3, 4, 5, 10].map(climbStairs)).toEqual([1, 2, 3, 5, 8, 89]);
  });

  test('minCostClimbingStairs', () => {
    expect(minCostClimbingStairs([10, 15, 20])).toBe(15);
    expect(minCostClimbingStairs([1, 100, 1, 1, 1, 100, 1, 1, 100, 1])).toBe(6);
  });

  test('houseRobber', () => {
    expect(houseRobber([])).toBe(0);
    expect(houseRobber([5])).toBe(5);
    expect(houseRobber([1, 2, 3, 1])).toBe(4);
    expect(houseRobber([2, 7, 9, 3, 1])).toBe(12);
    expect(houseRobber([2, 1, 1, 2])).toBe(4);
  });
});

describe('maxSubarray (Kadane)', () => {
  test('finds the sum and the location', () => {
    expect(maxSubarray([-2, 1, -3, 4, -1, 2, 1, -5, 4])).toEqual({ sum: 6, start: 3, end: 6 });
    expect(maxSubarray([1, 2, 3])).toEqual({ sum: 6, start: 0, end: 2 });
  });

  test('all negative: the single largest element', () => {
    expect(maxSubarray([-5, -2, -8])).toEqual({ sum: -2, start: 1, end: 1 });
  });

  test('empty array', () => {
    expect(maxSubarray([])).toBeNull();
  });
});

describe('longest increasing subsequence', () => {
  const cases = [
    [[10, 9, 2, 5, 3, 7, 101, 18], 4],
    [[0, 1, 0, 3, 2, 3], 4],
    [[7, 7, 7, 7], 1],
    [[], 0],
    [[5, 4, 3, 2, 1], 1],
    [[1, 2, 3, 4, 5], 5],
  ];

  test('lisLength (O(n log n))', () => {
    cases.forEach(([arr, len]) => expect(lisLength(arr)).toBe(len));
  });

  test('lisSequence returns a valid strictly increasing subsequence of that length', () => {
    cases.forEach(([arr, len]) => {
      const seq = lisSequence(arr);
      expect(seq.length).toBe(len);
      for (let i = 1; i < seq.length; i++) expect(seq[i]).toBeGreaterThan(seq[i - 1]);
      expect(isSubsequence(seq, arr)).toBe(true);
    });
  });
});

describe('two-string DP', () => {
  test('longestCommonSubsequence', () => {
    expect(longestCommonSubsequence('AGGTAB', 'GXTXAYB')).toBe('GTAB');
    expect(longestCommonSubsequence('abc', 'def')).toBe('');
    expect(longestCommonSubsequence('', 'abc')).toBe('');
    const lcs = longestCommonSubsequence('ABCBDAB', 'BDCABA');
    expect(lcs.length).toBe(4);
    expect(isSubsequence(lcs, 'ABCBDAB')).toBe(true);
    expect(isSubsequence(lcs, 'BDCABA')).toBe(true);
  });

  test('longestCommonSubstring', () => {
    expect(longestCommonSubstring('abcdxyz', 'xyzabcd')).toBe('abcd');
    expect(longestCommonSubstring('abc', 'xyz')).toBe('');
  });

  test('editDistance', () => {
    expect(editDistance('kitten', 'sitting')).toBe(3);
    expect(editDistance('horse', 'ros')).toBe(3);
    expect(editDistance('intention', 'execution')).toBe(5);
    expect(editDistance('', 'abc')).toBe(3);
    expect(editDistance('abc', 'abc')).toBe(0);
  });

  test('longestPalindromicSubsequence', () => {
    expect(longestPalindromicSubsequence('bbbab')).toBe(4);
    expect(longestPalindromicSubsequence('cbbd')).toBe(2);
    expect(longestPalindromicSubsequence('a')).toBe(1);
    expect(longestPalindromicSubsequence('')).toBe(0);
  });
});

describe('string segmentation / decoding', () => {
  test('wordBreak', () => {
    expect(wordBreak('leetcode', ['leet', 'code'])).toBe(true);
    expect(wordBreak('applepenapple', ['apple', 'pen'])).toBe(true);
    expect(wordBreak('catsandog', ['cats', 'dog', 'sand', 'and', 'cat'])).toBe(false);
    expect(wordBreak('', ['a'])).toBe(true);
  });

  test('numDecodings', () => {
    expect(numDecodings('12')).toBe(2);
    expect(numDecodings('226')).toBe(3);
    expect(numDecodings('06')).toBe(0);
    expect(numDecodings('0')).toBe(0);
    expect(numDecodings('10')).toBe(1);
    expect(numDecodings('2101')).toBe(1);
    expect(numDecodings('11106')).toBe(2);
  });
});
