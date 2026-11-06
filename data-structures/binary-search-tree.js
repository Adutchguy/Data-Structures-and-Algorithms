'use strict';

/**
 * Binary Search Tree (BST)
 *
 * Every node's left subtree holds smaller values and its right subtree holds
 * larger values, so search can discard half the remaining tree at each step.
 *
 * Complexity (h = height of the tree)
 *   insert / contains / remove ... O(h)   -> O(log n) if balanced, O(n) if the
 *                                            tree degenerates into a list
 *   traversals ................... O(n)
 *
 * A plain BST does nothing to stay balanced: inserting 1,2,3,4,5 in order gives
 * a lopsided chain. See avl-tree.js for a self-balancing version.
 * Duplicate values are ignored.
 */

export class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

const defaultCompare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

export default class BinarySearchTree {
  constructor(compare = defaultCompare) {
    this.root = null;
    this._compare = compare;
    this._size = 0;
  }

  static fromArray(values, compare) {
    const tree = new BinarySearchTree(compare);
    values.forEach(value => tree.insert(value));
    return tree;
  }

  get size() {
    return this._size;
  }

  isEmpty() {
    return this._size === 0;
  }

  // Returns true if inserted, false if the value was already present.
  insert(value) {
    const node = new TreeNode(value);
    if (!this.root) {
      this.root = node;
      this._size++;
      return true;
    }
    let current = this.root;
    for (;;) {
      const c = this._compare(value, current.value);
      if (c === 0) return false;
      const side = c < 0 ? 'left' : 'right';
      if (!current[side]) {
        current[side] = node;
        this._size++;
        return true;
      }
      current = current[side];
    }
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

  /**
   * Remove a value. Three cases:
   *   1. leaf ................ just drop it
   *   2. one child ........... replace the node with that child
   *   3. two children ........ copy in the in-order successor (smallest value
   *                            in the right subtree), then delete that successor
   */
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
      return node;
    };
    this.root = del(this.root, value);
    if (removed) this._size--;
    return removed;
  }

  min() {
    if (!this.root) return undefined;
    let node = this.root;
    while (node.left) node = node.left;
    return node.value;
  }

  max() {
    if (!this.root) return undefined;
    let node = this.root;
    while (node.right) node = node.right;
    return node.value;
  }

  // Number of edges on the longest root-to-leaf path. Empty tree = -1.
  height() {
    const h = node => (node ? 1 + Math.max(h(node.left), h(node.right)) : -1);
    return h(this.root);
  }

  // left, node, right -> values come out sorted. Iterative, using an explicit stack.
  inOrder() {
    const result = [];
    const stack = [];
    let current = this.root;
    while (current || stack.length) {
      while (current) {
        stack.push(current);
        current = current.left;
      }
      current = stack.pop();
      result.push(current.value);
      current = current.right;
    }
    return result;
  }

  // node, left, right -> useful for copying/serialising a tree.
  preOrder() {
    const result = [];
    const visit = node => {
      if (!node) return;
      result.push(node.value);
      visit(node.left);
      visit(node.right);
    };
    visit(this.root);
    return result;
  }

  // left, right, node -> children before parents (e.g. for deleting a tree).
  postOrder() {
    const result = [];
    const visit = node => {
      if (!node) return;
      visit(node.left);
      visit(node.right);
      result.push(node.value);
    };
    visit(this.root);
    return result;
  }

  // Breadth-first: returns one array per depth level.
  levelOrder() {
    if (!this.root) return [];
    const levels = [];
    let frontier = [this.root];
    while (frontier.length) {
      levels.push(frontier.map(node => node.value));
      const next = [];
      frontier.forEach(node => {
        if (node.left) next.push(node.left);
        if (node.right) next.push(node.right);
      });
      frontier = next;
    }
    return levels;
  }

  // Smallest value strictly greater than `value` (value need not be in the tree).
  successor(value) {
    let current = this.root;
    let best;
    while (current) {
      if (this._compare(value, current.value) < 0) {
        best = current.value;
        current = current.left;
      } else {
        current = current.right;
      }
    }
    return best;
  }

  // k is 1-based. Stops the in-order walk as soon as the k-th value is reached.
  kthSmallest(k) {
    const stack = [];
    let current = this.root;
    while (current || stack.length) {
      while (current) {
        stack.push(current);
        current = current.left;
      }
      current = stack.pop();
      if (--k === 0) return current.value;
      current = current.right;
    }
    return undefined;
  }

  // Lowest common ancestor of two values (both must be in the tree).
  lowestCommonAncestor(a, b) {
    if (!this.contains(a) || !this.contains(b)) return undefined;
    let current = this.root;
    while (current) {
      if (this._compare(a, current.value) < 0 && this._compare(b, current.value) < 0) {
        current = current.left;
      } else if (this._compare(a, current.value) > 0 && this._compare(b, current.value) > 0) {
        current = current.right;
      } else {
        return current.value;
      }
    }
    return undefined;
  }
}

/**
 * Validate that a tree really is a BST: every node must lie strictly between
 * the bounds inherited from its ancestors (checking only parent/child pairs is
 * a common bug). Works on any {value, left, right} nodes. O(n).
 */
export function isValidBST(node, min = null, max = null) {
  if (!node) return true;
  if (min !== null && node.value <= min) return false;
  if (max !== null && node.value >= max) return false;
  return isValidBST(node.left, min, node.value) && isValidBST(node.right, node.value, max);
}
