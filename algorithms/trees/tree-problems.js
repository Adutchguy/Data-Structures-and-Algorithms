'use strict';

import { TreeNode } from '../../data-structures/binary-search-tree.js';

/**
 * Binary tree problems
 *
 * Almost all of these are one recursive idea: solve for the left subtree, solve
 * for the right subtree, combine with the current node. Think about what each
 * call RETURNS (a height? a boolean? a node?) and what it needs to carry down.
 *
 * Nodes are plain { value, left, right } objects (the TreeNode class from
 * data-structures/binary-search-tree.js). buildTree() makes them from the
 * level-order array notation used on most coding sites, where null = missing child.
 */

// buildTree([3, 9, 20, null, null, 15, 7])
//        3
//       / \
//      9   20
//         /  \
//        15   7
export function buildTree(values) {
  if (values.length === 0 || values[0] === null) return null;
  const root = new TreeNode(values[0]);
  const queue = [root];
  let head = 0;
  let i = 1;
  while (head < queue.length && i < values.length) {
    const node = queue[head++];
    if (i < values.length && values[i] !== null) {
      node.left = new TreeNode(values[i]);
      queue.push(node.left);
    }
    i++;
    if (i < values.length && values[i] !== null) {
      node.right = new TreeNode(values[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

// ------------------------------ traversals ----------------------------------

export function inorder(root) {
  const result = [];
  const visit = node => {
    if (!node) return;
    visit(node.left);
    result.push(node.value);
    visit(node.right);
  };
  visit(root);
  return result;
}

export function preorder(root) {
  const result = [];
  const visit = node => {
    if (!node) return;
    result.push(node.value);
    visit(node.left);
    visit(node.right);
  };
  visit(root);
  return result;
}

export function postorder(root) {
  const result = [];
  const visit = node => {
    if (!node) return;
    visit(node.left);
    visit(node.right);
    result.push(node.value);
  };
  visit(root);
  return result;
}

// Breadth-first, one array per level.
export function levelOrder(root) {
  const levels = [];
  let frontier = root ? [root] : [];
  while (frontier.length) {
    levels.push(frontier.map(n => n.value));
    const next = [];
    frontier.forEach(n => {
      if (n.left) next.push(n.left);
      if (n.right) next.push(n.right);
    });
    frontier = next;
  }
  return levels;
}

// Left-to-right on level 0, right-to-left on level 1, and so on.
export function zigzagLevelOrder(root) {
  return levelOrder(root).map((level, i) => (i % 2 === 1 ? level.reverse() : level));
}

// What you'd see looking at the tree from the right: the last node of every level.
export function rightSideView(root) {
  return levelOrder(root).map(level => level[level.length - 1]);
}

// ------------------------------ measurements --------------------------------

// Number of nodes on the longest root-to-leaf path.
export function maxDepth(root) {
  return root ? 1 + Math.max(maxDepth(root.left), maxDepth(root.right)) : 0;
}

// Number of nodes on the shortest root-to-LEAF path.
export function minDepth(root) {
  if (!root) return 0;
  if (!root.left) return 1 + minDepth(root.right); // a missing child is not a leaf
  if (!root.right) return 1 + minDepth(root.left);
  return 1 + Math.min(minDepth(root.left), minDepth(root.right));
}

export function countNodes(root) {
  return root ? 1 + countNodes(root.left) + countNodes(root.right) : 0;
}

// Longest path between ANY two nodes, measured in edges. At each node the best path
// "bending" there is leftHeight + rightHeight; track the maximum while computing heights.
export function diameter(root) {
  let best = 0;
  const height = node => {
    if (!node) return 0;
    const left = height(node.left);
    const right = height(node.right);
    best = Math.max(best, left + right);
    return 1 + Math.max(left, right);
  };
  height(root);
  return best;
}

// Height-balanced: at every node the subtree heights differ by at most 1.
// Returns -1 from the helper to signal "unbalanced" so we can stop early. O(n).
export function isHeightBalanced(root) {
  const check = node => {
    if (!node) return 0;
    const left = check(node.left);
    if (left === -1) return -1;
    const right = check(node.right);
    if (right === -1 || Math.abs(left - right) > 1) return -1;
    return 1 + Math.max(left, right);
  };
  return check(root) !== -1;
}

// Maximum sum over any path (it may start and end at any node, but each node is
// used at most once). A path through a node uses at most one downward branch on
// each side; ignore branches with negative sums.
export function maxPathSum(root) {
  let best = -Infinity;
  const gain = node => {
    if (!node) return 0;
    const left = Math.max(0, gain(node.left));
    const right = Math.max(0, gain(node.right));
    best = Math.max(best, node.value + left + right);
    return node.value + Math.max(left, right); // can only extend ONE side upward
  };
  gain(root);
  return best;
}

// ------------------------------ comparisons ---------------------------------

export function isSameTree(a, b) {
  if (!a && !b) return true;
  if (!a || !b || a.value !== b.value) return false;
  return isSameTree(a.left, b.left) && isSameTree(a.right, b.right);
}

// Is the tree a mirror image of itself?
export function isSymmetric(root) {
  const mirror = (a, b) => {
    if (!a && !b) return true;
    if (!a || !b || a.value !== b.value) return false;
    return mirror(a.left, b.right) && mirror(a.right, b.left);
  };
  return !root || mirror(root.left, root.right);
}

// Swap left and right children everywhere (returns the same, now inverted, tree).
export function invertTree(root) {
  if (!root) return null;
  const left = invertTree(root.left);
  const right = invertTree(root.right);
  root.left = right;
  root.right = left;
  return root;
}

// ------------------------------ paths ---------------------------------------

// Is there a root-to-leaf path whose values add up to target?
export function hasPathSum(root, target) {
  if (!root) return false;
  if (!root.left && !root.right) return root.value === target;
  return hasPathSum(root.left, target - root.value) || hasPathSum(root.right, target - root.value);
}

export function rootToLeafPaths(root) {
  const paths = [];
  const current = [];
  const walk = node => {
    if (!node) return;
    current.push(node.value);
    if (!node.left && !node.right) paths.push(current.slice());
    walk(node.left);
    walk(node.right);
    current.pop();
  };
  walk(root);
  return paths;
}

// Lowest common ancestor in an ordinary binary tree (values a and b both present).
// If a and b are found in different subtrees, the current node is the split point.
export function lowestCommonAncestor(root, a, b) {
  if (!root || root.value === a || root.value === b) return root;
  const left = lowestCommonAncestor(root.left, a, b);
  const right = lowestCommonAncestor(root.right, a, b);
  if (left && right) return root;
  return left || right;
}

// ------------------------------ construction --------------------------------

// Preorder text with '#' for null children: '1,2,#,#,3,#,#'.
export function serialize(root) {
  const parts = [];
  const walk = node => {
    if (!node) {
      parts.push('#');
      return;
    }
    parts.push(String(node.value));
    walk(node.left);
    walk(node.right);
  };
  walk(root);
  return parts.join(',');
}

export function deserialize(text) {
  const tokens = text.split(',');
  let index = 0;
  const build = () => {
    const token = tokens[index++];
    if (token === '#' || token === undefined) return null;
    const node = new TreeNode(Number(token));
    node.left = build();
    node.right = build();
    return node;
  };
  return build();
}

// Rebuild a tree from its preorder and inorder traversals (values must be unique).
// The first preorder value is the root; its position in inorder splits left from right.
export function buildTreeFromTraversals(preorderValues, inorderValues) {
  const inorderIndex = new Map();
  inorderValues.forEach((v, i) => inorderIndex.set(v, i));
  let pre = 0;
  const build = (lo, hi) => {
    if (lo > hi) return null;
    const node = new TreeNode(preorderValues[pre++]);
    const mid = inorderIndex.get(node.value);
    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  };
  return build(0, inorderValues.length - 1);
}

// Height-balanced BST from a sorted array: the middle element becomes the root.
export function sortedArrayToBST(sorted) {
  const build = (lo, hi) => {
    if (lo > hi) return null;
    const mid = (lo + hi) >> 1;
    const node = new TreeNode(sorted[mid]);
    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  };
  return build(0, sorted.length - 1);
}
