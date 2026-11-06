'use strict';

/**
 * Graph (adjacency list)
 *
 * A set of vertices connected by edges. Stored as Map<vertex, Map<neighbor, weight>>:
 * for each vertex, the neighbours it can reach and the cost of each edge.
 *
 *   directed   - an edge A->B does NOT imply B->A
 *   undirected - an edge A-B can be walked both ways (stored as two entries)
 *
 * Why an adjacency list? It uses O(V + E) space and iterating a vertex's
 * neighbours is proportional to its degree. An adjacency matrix uses O(V^2)
 * space but answers "is there an edge A-B?" in O(1) - this structure answers
 * that in O(1) too, thanks to the inner Map.
 *
 * Vertices can be any value usable as a Map key (numbers, strings).
 * The graph algorithms in algorithms/graph/ all operate on this class.
 */

export default class Graph {
  constructor({ directed = false } = {}) {
    this.directed = directed;
    this._adj = new Map();
    this._order = new Map(); // insertion order of vertices (to list undirected edges once)
  }

  // edges: [[from, to], [from, to, weight], ...]
  static fromEdges(edges, { directed = false } = {}) {
    const graph = new Graph({ directed });
    edges.forEach(([from, to, weight]) => graph.addEdge(from, to, weight));
    return graph;
  }

  get size() {
    return this._adj.size;
  }

  addVertex(v) {
    if (!this._adj.has(v)) {
      this._order.set(v, this._order.size);
      this._adj.set(v, new Map());
    }
    return this;
  }

  addEdge(from, to, weight = 1) {
    this.addVertex(from);
    this.addVertex(to);
    this._adj.get(from).set(to, weight);
    if (!this.directed) this._adj.get(to).set(from, weight);
    return this;
  }

  removeEdge(from, to) {
    if (!this.hasEdge(from, to)) return false;
    this._adj.get(from).delete(to);
    if (!this.directed) this._adj.get(to).delete(from);
    return true;
  }

  removeVertex(v) {
    if (!this._adj.has(v)) return false;
    this._adj.delete(v);
    this._order.delete(v);
    this._adj.forEach(neighbors => neighbors.delete(v));
    return true;
  }

  hasVertex(v) {
    return this._adj.has(v);
  }

  hasEdge(from, to) {
    return this._adj.has(from) && this._adj.get(from).has(to);
  }

  getWeight(from, to) {
    return this.hasEdge(from, to) ? this._adj.get(from).get(to) : undefined;
  }

  vertices() {
    return Array.from(this._adj.keys());
  }

  neighbors(v) {
    return this._adj.has(v) ? Array.from(this._adj.get(v).keys()) : [];
  }

  // [{ to, weight }, ...] for edges leaving v.
  edgesFrom(v) {
    if (!this._adj.has(v)) return [];
    return Array.from(this._adj.get(v).entries()).map(([to, weight]) => ({ to, weight }));
  }

  // [{ from, to, weight }, ...]. Undirected edges are listed once.
  edges() {
    const result = [];
    this._adj.forEach((neighbors, from) => {
      neighbors.forEach((weight, to) => {
        if (this.directed || this._order.get(from) <= this._order.get(to)) {
          result.push({ from, to, weight });
        }
      });
    });
    return result;
  }

  // Number of edges leaving v (for undirected graphs: its degree).
  outDegree(v) {
    return this._adj.has(v) ? this._adj.get(v).size : 0;
  }

  inDegree(v) {
    let count = 0;
    this._adj.forEach(neighbors => {
      if (neighbors.has(v)) count++;
    });
    return count;
  }

  // New graph with every edge direction flipped (directed graphs).
  transpose() {
    const flipped = new Graph({ directed: this.directed });
    this.vertices().forEach(v => flipped.addVertex(v));
    this.edges().forEach(({ from, to, weight }) => flipped.addEdge(to, from, weight));
    return flipped;
  }
}
