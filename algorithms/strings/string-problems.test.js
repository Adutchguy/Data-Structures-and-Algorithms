import * as sp from './string-problems.js';

const {
  isPalindrome, longestPalindromicSubstring, manacher, isAnagram, groupAnagrams,
  longestUniqueSubstring, minWindowSubstring, longestCommonPrefix, firstUniqueChar,
  isSubsequence, runLengthEncode, runLengthDecode, intToRoman, romanToInt,
} = sp;

function lcg(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state;
  };
}

describe('palindromes', () => {
  test('isPalindrome ignores case and punctuation', () => {
    expect(isPalindrome('A man, a plan, a canal: Panama')).toBe(true);
    expect(isPalindrome('race a car')).toBe(false);
    expect(isPalindrome('')).toBe(true);
    expect(isPalindrome('.,')).toBe(true);
  });

  [['longestPalindromicSubstring', longestPalindromicSubstring], ['manacher', manacher]].forEach(([name, fn]) => {
    test(name, () => {
      expect(['bab', 'aba']).toContain(fn('babad'));
      expect(fn('cbbd')).toBe('bb');
      expect(fn('a')).toBe('a');
      expect(fn('')).toBe('');
      expect(fn('forgeeksskeegfor')).toBe('geeksskeeg');
      expect(fn('abcde').length).toBe(1);
    });
  });

  test('manacher agrees with expand-around-center on random strings', () => {
    const next = lcg(8);
    for (let t = 0; t < 50; t++) {
      const s = Array.from({ length: 30 }, () => 'ab'[next() % 2]).join('');
      expect(manacher(s).length).toBe(longestPalindromicSubstring(s).length);
      expect(isPalindrome(manacher(s))).toBe(true);
    }
  });
});

describe('anagrams', () => {
  test('isAnagram', () => {
    expect(isAnagram('listen', 'silent')).toBe(true);
    expect(isAnagram('rat', 'car')).toBe(false);
    expect(isAnagram('aab', 'abb')).toBe(false);
    expect(isAnagram('', '')).toBe(true);
    expect(isAnagram('a', 'ab')).toBe(false);
  });

  test('groupAnagrams', () => {
    const groups = groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']);
    expect(groups).toEqual([['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]);
  });
});

describe('sliding window problems', () => {
  test('longestUniqueSubstring', () => {
    expect(longestUniqueSubstring('abcabcbb')).toBe('abc');
    expect(longestUniqueSubstring('bbbbb')).toBe('b');
    expect(longestUniqueSubstring('pwwkew')).toBe('wke');
    expect(longestUniqueSubstring('abba')).toBe('ab');
    expect(longestUniqueSubstring('')).toBe('');
  });

  test('minWindowSubstring', () => {
    expect(minWindowSubstring('ADOBECODEBANC', 'ABC')).toBe('BANC');
    expect(minWindowSubstring('a', 'a')).toBe('a');
    expect(minWindowSubstring('a', 'aa')).toBe('');
    expect(minWindowSubstring('abc', '')).toBe('');
    expect(minWindowSubstring('aaflslflsldkalskaaa', 'aaa')).toBe('aaa');
  });
});

describe('misc string problems', () => {
  test('longestCommonPrefix', () => {
    expect(longestCommonPrefix(['flower', 'flow', 'flight'])).toBe('fl');
    expect(longestCommonPrefix(['dog', 'racecar', 'car'])).toBe('');
    expect(longestCommonPrefix(['same'])).toBe('same');
    expect(longestCommonPrefix([])).toBe('');
  });

  test('firstUniqueChar', () => {
    expect(firstUniqueChar('leetcode')).toBe(0);
    expect(firstUniqueChar('loveleetcode')).toBe(2);
    expect(firstUniqueChar('aabb')).toBe(-1);
  });

  test('isSubsequence', () => {
    expect(isSubsequence('ace', 'abcde')).toBe(true);
    expect(isSubsequence('aec', 'abcde')).toBe(false);
    expect(isSubsequence('', 'abc')).toBe(true);
  });

  test('run-length encoding round trip', () => {
    expect(runLengthEncode('aaabcc')).toBe('a3b1c2');
    expect(runLengthEncode('')).toBe('');
    expect(runLengthDecode('a3b1c2')).toBe('aaabcc');
    const long = 'x'.repeat(12) + 'y';
    expect(runLengthEncode(long)).toBe('x12y1');
    expect(runLengthDecode('x12y1')).toBe(long);
  });

  test('roman numerals', () => {
    expect(intToRoman(1994)).toBe('MCMXCIV');
    expect(intToRoman(58)).toBe('LVIII');
    expect(intToRoman(4)).toBe('IV');
    expect(romanToInt('MCMXCIV')).toBe(1994);
    expect(romanToInt('LVIII')).toBe(58);
    for (let n = 1; n <= 3999; n += 37) expect(romanToInt(intToRoman(n))).toBe(n);
  });
});
