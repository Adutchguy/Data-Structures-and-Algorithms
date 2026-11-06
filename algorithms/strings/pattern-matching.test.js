import * as pm from './pattern-matching.js';

const { naiveSearch, kmpSearch, rabinKarp, zSearch, horspool, buildLPS, zFunction } = pm;

function lcg(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state;
  };
}

describe('helper tables', () => {
  test('buildLPS', () => {
    expect(buildLPS('ABABCABAB')).toEqual([0, 0, 1, 2, 0, 1, 2, 3, 4]);
    expect(buildLPS('AAAA')).toEqual([0, 1, 2, 3]);
    expect(buildLPS('ABCD')).toEqual([0, 0, 0, 0]);
  });

  test('zFunction', () => {
    expect(zFunction('aabxaab')).toEqual([7, 1, 0, 0, 3, 1, 0]);
    expect(zFunction('aaaa')).toEqual([4, 3, 2, 1]);
    expect(zFunction('')).toEqual([]);
  });
});

const searchers = { naiveSearch, kmpSearch, rabinKarp, zSearch, horspool };

Object.keys(searchers).forEach(name => {
  const search = searchers[name];
  describe(name, () => {
    test('finds all occurrences, including overlapping ones', () => {
      expect(search('AABAACAADAABAABA', 'AABA')).toEqual([0, 9, 12]);
      expect(search('aaaaa', 'aa')).toEqual([0, 1, 2, 3]);
      expect(search('abababab', 'abab')).toEqual([0, 2, 4]);
    });

    test('no match', () => {
      expect(search('hello world', 'xyz')).toEqual([]);
      expect(search('abc', 'abcd')).toEqual([]);
      expect(search('', 'a')).toEqual([]);
    });

    test('empty pattern yields no matches', () => {
      expect(search('abc', '')).toEqual([]);
    });

    test('pattern equal to the text, and at the very ends', () => {
      expect(search('abc', 'abc')).toEqual([0]);
      expect(search('xxabc', 'abc')).toEqual([2]);
      expect(search('abcxx', 'abc')).toEqual([0]);
      expect(search('a', 'a')).toEqual([0]);
    });

    test('agrees with the naive search on random strings', () => {
      const next = lcg(314);
      const randomString = n => Array.from({ length: n }, () => 'abc'[next() % 3]).join('');
      for (let t = 0; t < 40; t++) {
        const text = randomString(60);
        const pattern = randomString(1 + (next() % 4));
        expect(search(text, pattern)).toEqual(naiveSearch(text, pattern));
      }
    });
  });
});
