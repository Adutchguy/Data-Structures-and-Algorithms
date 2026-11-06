'use strict';

/**
 * AVL Tree - a self-balancing binary search tree
 *
 * Invariant: for every node, the heights of its left and right subtrees differ
 * by at most 1 (the "balance factor" is -1, 0 or +1). After an insert or
 * delete breaks that, we repair it with rotations on the way back up.
 *
 * That guarantees height <= ~1.44 * log2(n), so insert / contains / remove are
 * all O(log n) in the WORST case, even for sorted input (where a plain BST
 * degrades to O(n)).
 *
 * The four imbalance cases:
 *   Left-Left   (leaning left, left child leans left or even) ... rotate right
 *   Right-Right (mirror image) ................................... rotate left
 *   Left-Right  (left child leans right) ... rotate left child left, then right
 *   Right-Left  (right child leans left) ... rotate right child right, then left
 */

class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1; // height counted in nodes; a leaf has height 1
  }
}

const defaultCompare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const heightOf = node => (node ? node.height : 0);
const updateHeight = node => {
  node.height = 1 + Math.max(heightOf(node.left), heightOf(node.right));
};
const balanceFactor = node => (node ? heightOf(node.left) - heightOf(node.right) : 0);

//       y                x
//      / \              / \
//     x   C    ==>     A   y
//    / \                  / \
//   A   B                B   C
function rotateRight(y) {
  const x = y.left;
  y.left = x.right;
  x.right = y;
  updateHeight(y);
  updateHeight(x);
  return x;
}

//     x                    y
//    / \                  / \
//   A   y      ==>       x   C
//      / \              / \
//     B   C            A   B
function rotateLeft(x) {
  const y = x.right;
  x.right = y.left;
  y.left = x;
  updateHeight(x);
  updateHeight(y);
  return y;
}

function rebalance(node) {
  updateHeight(node);
  const bf = balanceFactor(node);
  if (bf > 1) {
    if (balanceFactor(node.left) < 0) node.left = rotateLeft(node.left); // left-right case
    return rotateRight(node);
  }
  if (bf < -1) {
    if (balanceFactor(node.right) > 0) node.right = rotateRight(node.right); // right-left case
    return rotateLeft(node);
  }
  return node;
}

export default class AVLTree {
  constructor(compare = defaultCompare) {
    this.root = null;
    this._compare = compare;
    this._size = 0;
  }

  static fromArray(values, compare) {
    const tree = new AVLTree(compare);
    values.forEach(value => tree.insert(value));
    return tree;
  }

  get size() {
    return this._size;
  }

  // Height in nodes (empty tree = 0, single node = 1).
  get height() {
    return heightOf(this.root);
  }

  insert(value) {
    let inserted = false;
    const add = node => {
      if (!node) {
        inserted = true;
        return new AVLNode(value);
      }
      const c = this._compare(value, node.value);
      if (c < 0) node.left = add(node.left);
      else if (c > 0) node.right = add(node.right);
      else return node; // duplicate
      return rebalance(node);
    };
    this.root = add(this.root);
    if (inserted) this._size++;
    return inserted;
  }

  remove(value) {
    let removed = false;
    const del = (node, v) => {
      if (!node) return null;
      const c = this._compare(v, node.value);
      if (c < 0) {
        node.left = del(node.left, v);
      } else if (c > 0) {
        node.right = del(node.right, v);
      } else {
        removed = true;
        if (!node.left) return node.right;
        if (!node.right) return node.left;
        let successor = node.right;
        while (successor.left) successor = successor.left;
        node.value = successor.value;
        node.right = del(node.right, successor.value);
      }
      return rebalance(node);
    };
    this.root = del(this.root, value);
    if (removed) this._size--;
    return removed;
  }

  contains(value) {
    let current = this.root;
    while (current) {
      const c = this._compare(value, current.value);
      if (c === 0) return true;
      current = c < 0 ? current.left : current.right;
    }
    return false;
  }

  min() {
    let node = this.root;
    if (!node) return undefined;
    while (node.left) node = node.left;
    return node.value;
  }

  max() {
    let node = this.root;
    if (!node) return undefined;
    while (node.right) node = node.right;
    return node.value;
  }

  inOrder() {
    const result = [];
    const visit = node => {
      if (!node) return;
      visit(node.left);
      result.push(node.value);
      visit(node.right);
    };
    visit(this.root);
    return result;
  }

  // Verifies the AVL invariants (useful in tests and when debugging rotations):
  // stored heights are correct, every balance factor is within [-1, 1], and the
  // BST ordering holds.
  isBalanced() {
    const check = (node, lo, hi) => {
      if (!node) return true;
      if (lo !== undefined && this._compare(node.value, lo) <= 0) return false;
      if (hi !== undefined && this._compare(node.value, hi) >= 0) return false;
      const expectedHeight = 1 + Math.max(heightOf(node.left), heightOf(node.right));
      if (node.height !== expectedHeight) return false;
      if (Math.abs(balanceFactor(node)) > 1) return false;
      return check(node.left, lo, node.value) && check(node.right, node.value, hi);
    };
    return check(this.root);
  }
}
