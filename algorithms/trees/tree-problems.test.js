import * as tp from './tree-problems.js';
import { isValidBST } from '../../data-structures/binary-search-tree.js';

const {
  buildTree, inorder, preorder, postorder, levelOrder, zigzagLevelOrder, rightSideView,
  maxDepth, minDepth, countNodes, diameter, isHeightBalanced, maxPathSum, isSameTree,
  isSymmetric, invertTree, hasPathSum, rootToLeafPaths, lowestCommonAncestor, serialize,
  deserialize, buildTreeFromTraversals, sortedArrayToBST,
} = tp;

const sample = () => buildTree([3, 9, 20, null, null, 15, 7]);

describe('buildTree and traversals', () => {
  test('buildTree from level-order notation', () => {
    const t = sample();
    expect(t.value).toBe(3);
    expect(t.left.value).toBe(9);
    expect(t.right.left.value).toBe(15);
    expect(t.left.left).toBeNull();
    expect(buildTree([])).toBeNull();
    expect(buildTree([null])).toBeNull();
    expect(buildTree([1, null, 2]).right.value).toBe(2);
  });

  test('depth-first orders', () => {
    const t = buildTree([1, 2, 3, 4, 5]);
    expect(inorder(t)).toEqual([4, 2, 5, 1, 3]);
    expect(preorder(t)).toEqual([1, 2, 4, 5, 3]);
    expect(postorder(t)).toEqual([4, 5, 2, 3, 1]);
  });

  test('level-based views', () => {
    expect(levelOrder(sample())).toEqual([[3], [9, 20], [15, 7]]);
    expect(zigzagLevelOrder(sample())).toEqual([[3], [20, 9], [15, 7]]);
    expect(rightSideView(sample())).toEqual([3, 20, 7]);
    expect(rightSideView(buildTree([1, 2, 3, 4]))).toEqual([1, 3, 4]);
    expect(levelOrder(null)).toEqual([]);
  });
});

describe('measurements', () => {
  test('maxDepth, minDepth, countNodes', () => {
    expect(maxDepth(sample())).toBe(3);
    expect(minDepth(sample())).toBe(2);
    expect(countNodes(sample())).toBe(5);
    expect(maxDepth(null)).toBe(0);
    // a missing child doesn't count as a leaf
    expect(minDepth(buildTree([1, 2, null, 3]))).toBe(3);
  });

  test('diameter counts edges on the longest path', () => {
    expect(diameter(buildTree([1, 2, 3, 4, 5]))).toBe(3);
    expect(diameter(buildTree([1, 2]))).toBe(1);
    expect(diameter(buildTree([1]))).toBe(0);
    expect(diameter(null)).toBe(0);
    // longest path need not pass through the root
    expect(diameter(buildTree([1, 2, null, 3, 4, 5, null, 6, null, null, 7]))).toBeGreaterThanOrEqual(4);
  });

  test('isHeightBalanced', () => {
    expect(isHeightBalanced(sample())).toBe(true);
    expect(isHeightBalanced(buildTree([1, 2, 2, 3, 3, null, null, 4, 4]))).toBe(false);
    expect(isHeightBalanced(null)).toBe(true);
  });

  test('maxPathSum', () => {
    expect(maxPathSum(buildTree([1, 2, 3]))).toBe(6);
    expect(maxPathSum(buildTree([-10, 9, 20, null, null, 15, 7]))).toBe(42);
    expect(maxPathSum(buildTree([-3]))).toBe(-3);
    expect(maxPathSum(buildTree([2, -1]))).toBe(2);
  });
});

describe('comparisons and transformations', () => {
  test('isSameTree', () => {
    expect(isSameTree(buildTree([1, 2, 3]), buildTree([1, 2, 3]))).toBe(true);
    expect(isSameTree(buildTree([1, 2]), buildTree([1, null, 2]))).toBe(false);
    expect(isSameTree(null, null)).toBe(true);
  });

  test('isSymmetric', () => {
    expect(isSymmetric(buildTree([1, 2, 2, 3, 4, 4, 3]))).toBe(true);
    expect(isSymmetric(buildTree([1, 2, 2, null, 3, null, 3]))).toBe(false);
    expect(isSymmetric(null)).toBe(true);
  });

  test('invertTree', () => {
    const inverted = invertTree(buildTree([4, 2, 7, 1, 3, 6, 9]));
    expect(levelOrder(inverted)).toEqual([[4], [7, 2], [9, 6, 3, 1]]);
    expect(invertTree(null)).toBeNull();
  });
});

describe('paths and ancestors', () => {
  const pathTree = () => buildTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]);

  test('hasPathSum', () => {
    expect(hasPathSum(pathTree(), 22)).toBe(true);
    expect(hasPathSum(pathTree(), 26)).toBe(true);
    expect(hasPathSum(pathTree(), 5)).toBe(false);
    expect(hasPathSum(null, 0)).toBe(false);
  });

  test('rootToLeafPaths', () => {
    expect(rootToLeafPaths(buildTree([1, 2, 3, null, 5]))).toEqual([[1, 2, 5], [1, 3]]);
    expect(rootToLeafPaths(null)).toEqual([]);
  });

  test('lowestCommonAncestor in a general binary tree', () => {
    const t = buildTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
    expect(lowestCommonAncestor(t, 5, 1).value).toBe(3);
    expect(lowestCommonAncestor(t, 5, 4).value).toBe(5);
    expect(lowestCommonAncestor(t, 7, 4).value).toBe(2);
    expect(lowestCommonAncestor(t, 6, 8).value).toBe(3);
  });
});

describe('serialisation and construction', () => {
  test('serialize / deserialize round trip', () => {
    const t = buildTree([1, 2, 3, null, null, 4, 5]);
    expect(serialize(t)).toBe('1,2,#,#,3,4,#,#,5,#,#');
    expect(isSameTree(deserialize(serialize(t)), t)).toBe(true);
    expect(serialize(null)).toBe('#');
    expect(deserialize('#')).toBeNull();
    const negatives = buildTree([-1, -2, 3]);
    expect(isSameTree(deserialize(serialize(negatives)), negatives)).toBe(true);
  });

  test('buildTreeFromTraversals', () => {
    const t = buildTreeFromTraversals([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]);
    expect(levelOrder(t)).toEqual([[3], [9, 20], [15, 7]]);
    expect(buildTreeFromTraversals([], [])).toBeNull();
    const original = buildTree([1, 2, 3, 4, 5, 6, 7]);
    const rebuilt = buildTreeFromTraversals(preorder(original), inorder(original));
    expect(isSameTree(original, rebuilt)).toBe(true);
  });

  test('sortedArrayToBST makes a valid, height-balanced BST', () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const t = sortedArrayToBST(values);
    expect(inorder(t)).toEqual(values);
    expect(isValidBST(t)).toBe(true);
    expect(isHeightBalanced(t)).toBe(true);
    expect(sortedArrayToBST([])).toBeNull();
  });
});
