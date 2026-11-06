'use strict';

import { Heap } from '../../data-structures/heap.js';
import UnionFind from '../../data-structures/union-find.js';

/**
 * Minimum Spanning Tree (MST)
 *
 * Given a connected, weighted, undirected graph, pick the V-1 edges that connect
 * every vertex with the smallest possible total weight (no cycles).
 *
 * kruskal ... sort all edges by weight; add the cheapest edge that doesn't form a
 *             cycle (checked with Union-Find). Works on disconnected graphs too,
 *             returning a minimum spanning FOREST.            O(E log E)
 * prim ...... grow one tree outward from a start vertex, always adding the
 *             cheapest edge leaving the tree (min-heap).       O(E log V)
 *
 * Both are greedy and both are correct because of the "cut property": the
 * cheapest edge crossing any cut belongs to some MST.
 */

export function kruskal(graph) {
  const edges = graph.edges().sort((a, b) => a.weight - b.weight);
  const sets = new UnionFind(graph.vertices());
  const tree = [];
  let totalWeight = 0;
  for (let i = 0; i < edges.length; i++) {
    const { from, to, weight } = edges[i];
    if (sets.union(from, to)) {
      tree.push({ from, to, weight });
      totalWeight += weight;
    }
  }
  return { edges: tree, totalWeight };
}

// MST of the component containing `start` (default: the first vertex).
export function prim(graph, start = graph.vertices()[0]) {
  if (graph.size === 0) return { edges: [], totalWeight: 0 };
  const inTree = new Set([start]);
  const heap = new Heap((a, b) => a.weight - b.weight);
  const pushEdgesFrom = v => {
    graph.edgesFrom(v).forEach(({ to, weight }) => {
      if (!inTree.has(to)) heap.push({ from: v, to, weight });
    });
  };
  pushEdgesFrom(start);

  const tree = [];
  let totalWeight = 0;
  while (!heap.isEmpty()) {
    const edge = heap.pop();
    if (inTree.has(edge.to)) continue; // would form a cycle
    inTree.add(edge.to);
    tree.push(edge);
    totalWeight += edge.weight;
    pushEdgesFrom(edge.to);
  }
  return { edges: tree, totalWeight };
}
