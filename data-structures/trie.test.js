import Trie from './trie.js';

describe('Trie', () => {
  let trie;
  beforeEach(() => {
    trie = Trie.fromWords(['car', 'card', 'care', 'cat', 'dog', 'do']);
  });

  test('search finds only complete words', () => {
    expect(trie.search('car')).toBe(true);
    expect(trie.search('ca')).toBe(false);
    expect(trie.search('cards')).toBe(false);
    expect(trie.search('do')).toBe(true);
  });

  test('startsWith', () => {
    expect(trie.startsWith('ca')).toBe(true);
    expect(trie.startsWith('d')).toBe(true);
    expect(trie.startsWith('x')).toBe(false);
    expect(trie.startsWith('')).toBe(true);
  });

  test('insert reports duplicates and size', () => {
    expect(trie.size).toBe(6);
    expect(trie.insert('car')).toBe(false);
    expect(trie.insert('cart')).toBe(true);
    expect(trie.size).toBe(7);
  });

  test('countWithPrefix', () => {
    expect(trie.countWithPrefix('car')).toBe(3);
    expect(trie.countWithPrefix('ca')).toBe(4);
    expect(trie.countWithPrefix('do')).toBe(2);
    expect(trie.countWithPrefix('z')).toBe(0);
    expect(trie.countWithPrefix('')).toBe(6);
  });

  test('wordsWithPrefix is alphabetical autocomplete', () => {
    expect(trie.wordsWithPrefix('car')).toEqual(['car', 'card', 'care']);
    expect(trie.wordsWithPrefix('c')).toEqual(['car', 'card', 'care', 'cat']);
    expect(trie.wordsWithPrefix('zzz')).toEqual([]);
  });

  test('remove keeps words that share a prefix', () => {
    expect(trie.remove('car')).toBe(true);
    expect(trie.search('car')).toBe(false);
    expect(trie.search('card')).toBe(true);
    expect(trie.startsWith('car')).toBe(true);
    expect(trie.remove('car')).toBe(false);
    expect(trie.size).toBe(5);
  });

  test('remove prunes unused branches', () => {
    expect(trie.remove('cat')).toBe(true);
    expect(trie.root.children.get('c').children.get('a').children.has('t')).toBe(false);
    trie.remove('dog');
    expect(trie.search('do')).toBe(true);
    expect(trie.root.children.get('d').children.get('o').children.has('g')).toBe(false);
  });

  test('handles unicode characters', () => {
    const t = Trie.fromWords(['café', 'cafe']);
    expect(t.search('café')).toBe(true);
    expect(t.wordsWithPrefix('caf')).toEqual(['cafe', 'café']);
  });
});
