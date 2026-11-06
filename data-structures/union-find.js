'use strict';

/**
 * Union-Find (Disjoint Set Union, DSU)
 *
 * Tracks a collection of non-overlapping groups and answers two questions fast:
 *   find(x)       - which group is x in? (returns the group's representative)
 *   union(a, b)   - merge the groups containing a and b
 *
 * Two optimisations make it practically O(1):
 *   path compression - after find(x), point x (and everything on its path)
 *                      straight at the root
 *   union by size    - hang the smaller tree under the larger one
 * Together they give O(alpha(n)) amortized per operation, where alpha is the
 * inverse Ackermann function (< 5 for any input that fits in the universe).
 *
 * Uses: Kruskal's MST, connected components, cycle detection in undirected
 * graphs, grouping equivalent items.
 */

export default class UnionFind {
  // `elements` is optional; unknown elements are added automatically.
  constructor(elements = []) {
    this._parent = new Map();
    this._size = new Map();
    this._count = 0;
    elements.forEach(e => this.add(e));
  }

  // Number of separate groups.
  get count() {
    return this._count;
  }

  add(x) {
    if (!this._parent.has(x)) {
      this._parent.set(x, x);
      this._size.set(x, 1);
      this._count++;
    }
    return this;
  }

  // Representative of x's group (iterative, with path compression).
  find(x) {
    this.add(x);
    let root = x;
    while (this._parent.get(root) !== root) root = this._parent.get(root);
    while (this._parent.get(x) !== root) {
      const next = this._parent.get(x);
      this._parent.set(x, root);
      x = next;
    }
    return root;
  }

  // Merge the groups of a and b. Returns false if they were already together.
  union(a, b) {
    let rootA = this.find(a);
    let rootB = this.find(b);
    if (rootA === rootB) return false;
    if (this._size.get(rootA) < this._size.get(rootB)) [rootA, rootB] = [rootB, rootA];
    this._parent.set(rootB, rootA);
    this._size.set(rootA, this._size.get(rootA) + this._size.get(rootB));
    this._count--;
    return true;
  }

  connected(a, b) {
    return this.find(a) === this.find(b);
  }

  // Size of the group containing x.
  sizeOf(x) {
    return this._size.get(this.find(x));
  }

  // [[members of group 1], [members of group 2], ...]
  groups() {
    const byRoot = new Map();
    Array.from(this._parent.keys()).forEach(x => {
      const root = this.find(x);
      if (!byRoot.has(root)) byRoot.set(root, []);
      byRoot.get(root).push(x);
    });
    return Array.from(byRoot.values());
  }
}
