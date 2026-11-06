import BinarySearchTree, { TreeNode, isValidBST } from './binary-search-tree.js';

//        8
//      /   \
//     3     10
//    / \      \
//   1   6      14
//      / \    /
//     4   7  13
const VALUES = [8, 3, 10, 1, 6, 14, 4, 7, 13];

describe('BinarySearchTree', () => {
  let tree;
  beforeEach(() => {
    tree = BinarySearchTree.fromArray(VALUES);
  });

  test('insert ignores duplicates and tracks size', () => {
    expect(tree.size).toBe(9);
    expect(tree.insert(8)).toBe(false);
    expect(tree.insert(100)).toBe(true);
    expect(tree.size).toBe(10);
  });

  test('contains', () => {
    VALUES.forEach(v => expect(tree.contains(v)).toBe(true));
    expect(tree.contains(2)).toBe(false);
    expect(new BinarySearchTree().contains(1)).toBe(false);
  });

  test('traversals', () => {
    expect(tree.inOrder()).toEqual([1, 3, 4, 6, 7, 8, 10, 13, 14]);
    expect(tree.preOrder()).toEqual([8, 3, 1, 6, 4, 7, 10, 14, 13]);
    expect(tree.postOrder()).toEqual([1, 4, 7, 6, 3, 13, 14, 10, 8]);
    expect(tree.levelOrder()).toEqual([[8], [3, 10], [1, 6, 14], [4, 7, 13]]);
  });

  test('min, max, height', () => {
    expect(tree.min()).toBe(1);
    expect(tree.max()).toBe(14);
    expect(tree.height()).toBe(3);
    const empty = new BinarySearchTree();
    expect(empty.min()).toBeUndefined();
    expect(empty.height()).toBe(-1);
  });

  test('remove a leaf', () => {
    expect(tree.remove(4)).toBe(true);
    expect(tree.inOrder()).toEqual([1, 3, 6, 7, 8, 10, 13, 14]);
  });

  test('remove a node with one child', () => {
    expect(tree.remove(10)).toBe(true);
    expect(tree.inOrder()).toEqual([1, 3, 4, 6, 7, 8, 13, 14]);
    expect(tree.root.right.value).toBe(14);
  });

  test('remove a node with two children (including the root)', () => {
    expect(tree.remove(3)).toBe(true);
    expect(isValidBST(tree.root)).toBe(true);
    expect(tree.remove(8)).toBe(true);
    expect(tree.root.value).toBe(10);
    expect(tree.inOrder()).toEqual([1, 4, 6, 7, 10, 13, 14]);
    expect(tree.size).toBe(7);
  });

  test('remove a missing value does nothing', () => {
    expect(tree.remove(999)).toBe(false);
    expect(tree.size).toBe(9);
  });

  test('successor', () => {
    expect(tree.successor(1)).toBe(3);
    expect(tree.successor(7)).toBe(8);
    expect(tree.successor(5)).toBe(6);
    expect(tree.successor(14)).toBeUndefined();
  });

  test('kthSmallest', () => {
    expect(tree.kthSmallest(1)).toBe(1);
    expect(tree.kthSmallest(5)).toBe(7);
    expect(tree.kthSmallest(9)).toBe(14);
    expect(tree.kthSmallest(10)).toBeUndefined();
  });

  test('lowestCommonAncestor', () => {
    expect(tree.lowestCommonAncestor(4, 7)).toBe(6);
    expect(tree.lowestCommonAncestor(1, 7)).toBe(3);
    expect(tree.lowestCommonAncestor(4, 13)).toBe(8);
    expect(tree.lowestCommonAncestor(3, 7)).toBe(3);
    expect(tree.lowestCommonAncestor(3, 99)).toBeUndefined();
  });

  test('a sorted insert order degenerates into a chain', () => {
    const chain = BinarySearchTree.fromArray([1, 2, 3, 4, 5]);
    expect(chain.height()).toBe(4);
  });

  test('accepts a custom comparator', () => {
    const byLength = BinarySearchTree.fromArray(['ccc', 'a', 'bb'], (x, y) => x.length - y.length);
    expect(byLength.inOrder()).toEqual(['a', 'bb', 'ccc']);
  });
});

describe('isValidBST', () => {
  test('accepts a valid tree', () => {
    expect(isValidBST(BinarySearchTree.fromArray(VALUES).root)).toBe(true);
    expect(isValidBST(null)).toBe(true);
  });

  test('rejects a tree that only looks valid parent-to-child', () => {
    //     5
    //    / \
    //   1   6
    //      / \
    //     3   7     <- 3 is left of 6 but also left of 5, so it's invalid
    const root = new TreeNode(5);
    root.left = new TreeNode(1);
    root.right = new TreeNode(6);
    root.right.left = new TreeNode(3);
    root.right.right = new TreeNode(7);
    expect(isValidBST(root)).toBe(false);
  });
});
