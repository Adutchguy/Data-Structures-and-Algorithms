import UnionFind from './union-find.js';

describe('UnionFind', () => {
  test('starts with every element in its own group', () => {
    const uf = new UnionFind([1, 2, 3, 4]);
    expect(uf.count).toBe(4);
    expect(uf.connected(1, 2)).toBe(false);
    expect(uf.sizeOf(1)).toBe(1);
  });

  test('union merges groups and reports whether anything changed', () => {
    const uf = new UnionFind([1, 2, 3, 4, 5]);
    expect(uf.union(1, 2)).toBe(true);
    expect(uf.union(3, 4)).toBe(true);
    expect(uf.union(2, 1)).toBe(false);
    expect(uf.count).toBe(3);
    expect(uf.connected(1, 2)).toBe(true);
    expect(uf.connected(1, 3)).toBe(false);
    uf.union(2, 3);
    expect(uf.connected(1, 4)).toBe(true);
    expect(uf.sizeOf(4)).toBe(4);
    expect(uf.count).toBe(2);
  });

  test('connectivity is transitive across a long chain', () => {
    const uf = new UnionFind();
    for (let i = 0; i < 1000; i++) uf.union(i, i + 1);
    expect(uf.count).toBe(1);
    expect(uf.connected(0, 1000)).toBe(true);
    expect(uf.sizeOf(500)).toBe(1001);
  });

  test('path compression flattens the tree', () => {
    const uf = new UnionFind();
    for (let i = 0; i < 50; i++) uf.union(i, i + 1);
    const root = uf.find(0);
    uf.find(25);
    expect(uf._parent.get(25)).toBe(root);
  });

  test('works with string elements and auto-adds unknown ones', () => {
    const uf = new UnionFind();
    uf.union('a', 'b');
    uf.union('c', 'd');
    expect(uf.count).toBe(2);
    expect(uf.connected('a', 'd')).toBe(false);
    expect(uf.connected('a', 'zzz')).toBe(false);
    expect(uf.count).toBe(3);
  });

  test('groups()', () => {
    const uf = new UnionFind([1, 2, 3, 4, 5, 6]);
    uf.union(1, 2);
    uf.union(2, 3);
    uf.union(5, 6);
    const groups = uf.groups().map(g => g.sort()).sort((a, b) => a[0] - b[0]);
    expect(groups).toEqual([[1, 2, 3], [4], [5, 6]]);
  });
});
