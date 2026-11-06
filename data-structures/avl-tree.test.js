import AVLTree from './avl-tree.js';

function lcg(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state;
  };
}

describe('AVLTree rotations', () => {
  test('left-left case', () => {
    const tree = AVLTree.fromArray([3, 2, 1]);
    expect(tree.root.value).toBe(2);
    expect(tree.isBalanced()).toBe(true);
  });

  test('right-right case', () => {
    const tree = AVLTree.fromArray([1, 2, 3]);
    expect(tree.root.value).toBe(2);
    expect(tree.isBalanced()).toBe(true);
  });

  test('left-right case', () => {
    const tree = AVLTree.fromArray([3, 1, 2]);
    expect(tree.root.value).toBe(2);
    expect(tree.root.left.value).toBe(1);
    expect(tree.root.right.value).toBe(3);
  });

  test('right-left case', () => {
    const tree = AVLTree.fromArray([1, 3, 2]);
    expect(tree.root.value).toBe(2);
    expect(tree.root.left.value).toBe(1);
    expect(tree.root.right.value).toBe(3);
  });
});

describe('AVLTree', () => {
  test('stays balanced on sorted input (where a plain BST becomes a chain)', () => {
    const tree = new AVLTree();
    for (let i = 1; i <= 1000; i++) tree.insert(i);
    expect(tree.size).toBe(1000);
    expect(tree.isBalanced()).toBe(true);
    // AVL height bound: 1.44 * log2(n + 2)
    expect(tree.height).toBeLessThanOrEqual(Math.ceil(1.44 * Math.log2(1002)));
    expect(tree.inOrder()).toEqual(Array.from({ length: 1000 }, (_, i) => i + 1));
  });

  test('insert ignores duplicates; contains / min / max', () => {
    const tree = AVLTree.fromArray([5, 2, 8, 2, 5]);
    expect(tree.size).toBe(3);
    expect(tree.contains(8)).toBe(true);
    expect(tree.contains(7)).toBe(false);
    expect(tree.min()).toBe(2);
    expect(tree.max()).toBe(8);
    expect(new AVLTree().min()).toBeUndefined();
  });

  test('remove keeps the tree balanced', () => {
    const tree = AVLTree.fromArray(Array.from({ length: 100 }, (_, i) => i));
    for (let i = 0; i < 100; i += 2) {
      expect(tree.remove(i)).toBe(true);
      expect(tree.isBalanced()).toBe(true);
    }
    expect(tree.remove(0)).toBe(false);
    expect(tree.size).toBe(50);
    expect(tree.inOrder()).toEqual(Array.from({ length: 50 }, (_, i) => 2 * i + 1));
  });

  test('random inserts and deletes agree with a Set and keep invariants', () => {
    const next = lcg(99);
    const tree = new AVLTree();
    const model = new Set();
    for (let i = 0; i < 1500; i++) {
      const v = next() % 300;
      if (next() % 3 === 0) {
        expect(tree.remove(v)).toBe(model.delete(v));
      } else {
        tree.insert(v);
        model.add(v);
      }
      expect(tree.size).toBe(model.size);
    }
    expect(tree.isBalanced()).toBe(true);
    expect(tree.inOrder()).toEqual(Array.from(model).sort((a, b) => a - b));
  });
});
