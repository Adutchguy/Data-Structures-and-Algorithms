import SkipList from './skip-list.js';

function seededRandom(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

describe('SkipList', () => {
  test('keeps values sorted regardless of insert order', () => {
    const list = new SkipList({ random: seededRandom(1) });
    [5, 1, 9, 3, 7, 2, 8].forEach(v => list.insert(v));
    expect(list.toArray()).toEqual([1, 2, 3, 5, 7, 8, 9]);
    expect(list.size).toBe(7);
  });

  test('contains', () => {
    const list = new SkipList({ random: seededRandom(2) });
    [10, 20, 30].forEach(v => list.insert(v));
    expect(list.contains(20)).toBe(true);
    expect(list.contains(25)).toBe(false);
    expect(list.contains(5)).toBe(false);
    expect(list.contains(99)).toBe(false);
  });

  test('insert ignores duplicates', () => {
    const list = new SkipList({ random: seededRandom(3) });
    expect(list.insert(4)).toBe(true);
    expect(list.insert(4)).toBe(false);
    expect(list.size).toBe(1);
  });

  test('remove', () => {
    const list = new SkipList({ random: seededRandom(4) });
    [1, 2, 3, 4, 5].forEach(v => list.insert(v));
    expect(list.remove(3)).toBe(true);
    expect(list.remove(3)).toBe(false);
    expect(list.remove(99)).toBe(false);
    expect(list.toArray()).toEqual([1, 2, 4, 5]);
    expect(list.contains(3)).toBe(false);
    expect(list.size).toBe(4);
  });

  test('uses multiple lanes and shrinks them again when emptied', () => {
    const list = new SkipList({ random: seededRandom(5) });
    for (let i = 0; i < 500; i++) list.insert(i);
    expect(list.level).toBeGreaterThan(1);
    for (let i = 0; i < 500; i++) expect(list.remove(i)).toBe(true);
    expect(list.size).toBe(0);
    expect(list.level).toBe(1);
    expect(list.toArray()).toEqual([]);
  });

  test('agrees with a Set under random operations', () => {
    const rand = seededRandom(6);
    const list = new SkipList({ random: seededRandom(7) });
    const model = new Set();
    for (let i = 0; i < 2000; i++) {
      const v = Math.floor(rand() * 200);
      if (rand() < 0.35) {
        expect(list.remove(v)).toBe(model.delete(v));
      } else {
        list.insert(v);
        model.add(v);
      }
    }
    expect(list.toArray()).toEqual(Array.from(model).sort((a, b) => a - b));
    expect(list.size).toBe(model.size);
  });

  test('works with strings', () => {
    const list = new SkipList({ random: seededRandom(8) });
    ['pear', 'apple', 'fig'].forEach(v => list.insert(v));
    expect(list.toArray()).toEqual(['apple', 'fig', 'pear']);
  });
});
