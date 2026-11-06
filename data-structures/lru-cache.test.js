import LRUCache from './lru-cache.js';

describe('LRUCache', () => {
  test('stores and retrieves values', () => {
    const cache = new LRUCache(2);
    cache.put('a', 1).put('b', 2);
    expect(cache.get('a')).toBe(1);
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBeUndefined();
    expect(cache.size).toBe(2);
  });

  test('evicts the least recently used entry when full', () => {
    const cache = new LRUCache(2);
    cache.put('a', 1).put('b', 2);
    cache.put('c', 3); // evicts a
    expect(cache.has('a')).toBe(false);
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBe(3);
  });

  test('get refreshes recency', () => {
    const cache = new LRUCache(2);
    cache.put('a', 1).put('b', 2);
    cache.get('a'); // a is now most recent, b is least
    cache.put('c', 3); // evicts b
    expect(cache.has('b')).toBe(false);
    expect(cache.has('a')).toBe(true);
    expect(cache.keys()).toEqual(['c', 'a']);
  });

  test('put on an existing key updates the value and refreshes recency', () => {
    const cache = new LRUCache(2);
    cache.put('a', 1).put('b', 2).put('a', 100);
    expect(cache.size).toBe(2);
    cache.put('c', 3); // evicts b, not a
    expect(cache.get('a')).toBe(100);
    expect(cache.has('b')).toBe(false);
  });

  test('has does not change recency', () => {
    const cache = new LRUCache(2);
    cache.put('a', 1).put('b', 2);
    cache.has('a');
    cache.put('c', 3); // a was still the least recently used
    expect(cache.has('a')).toBe(false);
  });

  test('capacity of one and invalid capacity', () => {
    const cache = new LRUCache(1);
    cache.put('a', 1).put('b', 2);
    expect(cache.keys()).toEqual(['b']);
    expect(() => new LRUCache(0)).toThrow();
  });
});
