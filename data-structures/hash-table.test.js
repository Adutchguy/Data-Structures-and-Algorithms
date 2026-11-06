import HashTable, { OpenAddressingHashTable, hashString } from './hash-table.js';

function lcg(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state;
  };
}

test('hashString is deterministic and non-negative', () => {
  expect(hashString('hello')).toBe(hashString('hello'));
  expect(hashString('hello')).not.toBe(hashString('world'));
  expect(hashString('')).toBeGreaterThanOrEqual(0);
});

[['HashTable (chaining)', HashTable], ['OpenAddressingHashTable', OpenAddressingHashTable]].forEach(([name, Impl]) => {
  describe(name, () => {
    test('set, get, has', () => {
      const table = new Impl();
      table.set('apple', 1).set('banana', 2);
      expect(table.get('apple')).toBe(1);
      expect(table.get('banana')).toBe(2);
      expect(table.get('cherry')).toBeUndefined();
      expect(table.has('apple')).toBe(true);
      expect(table.has('cherry')).toBe(false);
      expect(table.size).toBe(2);
    });

    test('set on an existing key overwrites without growing', () => {
      const table = new Impl();
      table.set('k', 1).set('k', 2);
      expect(table.get('k')).toBe(2);
      expect(table.size).toBe(1);
    });

    test('delete removes keys and reports whether anything was removed', () => {
      const table = new Impl();
      table.set('a', 1).set('b', 2);
      expect(table.delete('a')).toBe(true);
      expect(table.delete('a')).toBe(false);
      expect(table.has('a')).toBe(false);
      expect(table.get('b')).toBe(2);
      expect(table.size).toBe(1);
    });

    test('grows past its initial capacity and keeps every key', () => {
      const table = new Impl(4);
      for (let i = 0; i < 200; i++) table.set('key' + i, i);
      expect(table.size).toBe(200);
      expect(table.capacity).toBeGreaterThan(4);
      for (let i = 0; i < 200; i++) expect(table.get('key' + i)).toBe(i);
    });

    test('numeric and string keys with the same text are the same key', () => {
      const table = new Impl();
      table.set(1, 'one');
      expect(table.get('1')).toBe('one');
    });

    test('behaves like a Map under random inserts and deletes', () => {
      const next = lcg(2024);
      const table = new Impl(4);
      const model = new Map();
      for (let i = 0; i < 2000; i++) {
        const key = 'k' + (next() % 60);
        if (next() % 3 === 0) {
          expect(table.delete(key)).toBe(model.delete(key));
        } else {
          const value = next() % 1000;
          table.set(key, value);
          model.set(key, value);
        }
        expect(table.size).toBe(model.size);
      }
      model.forEach((value, key) => expect(table.get(key)).toBe(value));
      expect(table.entries().length).toBe(model.size);
    });
  });
});

describe('HashTable extras', () => {
  test('keys, values, entries', () => {
    const table = new HashTable();
    table.set('x', 1).set('y', 2);
    expect(table.keys().sort()).toEqual(['x', 'y']);
    expect(table.values().sort()).toEqual([1, 2]);
    expect(table.entries().length).toBe(2);
  });

  test('load factor stays at or below 0.75', () => {
    const table = new HashTable(2);
    for (let i = 0; i < 100; i++) {
      table.set(i, i);
      expect(table.loadFactor).toBeLessThanOrEqual(0.75);
    }
  });
});

describe('OpenAddressingHashTable extras', () => {
  test('tombstones do not break lookups of colliding keys', () => {
    const table = new OpenAddressingHashTable(8);
    const keys = [];
    for (let i = 0; i < 50; i++) keys.push('c' + i);
    keys.forEach((k, i) => table.set(k, i));
    // delete every other key, then make sure the survivors are still reachable
    keys.forEach((k, i) => {
      if (i % 2 === 0) table.delete(k);
    });
    keys.forEach((k, i) => {
      expect(table.get(k)).toBe(i % 2 === 0 ? undefined : i);
    });
    // and deleted slots can be reused
    table.set('c0', 'back');
    expect(table.get('c0')).toBe('back');
  });
});
