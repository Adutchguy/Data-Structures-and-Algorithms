'use strict';

import Queue from '../../data-structures/queue.js';

/**
 * Maximum Flow (Edmonds-Karp)
 *
 * Think of a directed graph as a pipe network where each edge weight is a
 * capacity. Max flow = the most you can push from `source` to `sink`.
 *
 * Ford-Fulkerson idea: while an "augmenting path" with spare capacity exists,
 * push as much as its bottleneck edge allows. Edmonds-Karp finds each path with
 * BFS (fewest edges), which bounds the work at O(V * E^2).
 *
 * The residual graph tracks remaining capacity. Pushing flow along u->v also
 * adds capacity on the reverse edge v->u, which lets later paths "undo" a bad
 * earlier choice.
 *
 * Max-flow min-cut theorem: the max flow equals the capacity of the cheapest
 * set of edges whose removal separates source from sink. Bipartite matching,
 * project selection and image segmentation all reduce to it.
 */

export default function maxFlow(graph, source, sink) {
  if (!graph.hasVertex(source) || !graph.hasVertex(sink)) {
    throw new Error('Source and sink must be vertices of the graph');
  }
  if (source === sink) return 0;

  // residual[u][v] = remaining capacity of u -> v
  const residual = new Map();
  graph.vertices().forEach(v => residual.set(v, new Map()));
  graph.vertices().forEach(u => {
    graph.edgesFrom(u).forEach(({ to, weight }) => {
      const row = residual.get(u);
      row.set(to, (row.get(to) || 0) + weight);
      if (!residual.get(to).has(u)) residual.get(to).set(u, 0); // reverse edge
    });
  });

  let total = 0;
  for (;;) {
    // BFS for a shortest augmenting path.
    const parent = new Map([[source, null]]);
    const queue = new Queue();
    queue.enqueue(source);
    while (!queue.isEmpty() && !parent.has(sink)) {
      const u = queue.dequeue();
      residual.get(u).forEach((capacity, v) => {
        if (capacity > 0 && !parent.has(v)) {
          parent.set(v, u);
          queue.enqueue(v);
        }
      });
    }
    if (!parent.has(sink)) return total; // no augmenting path left

    // Bottleneck = smallest residual capacity along the path.
    let bottleneck = Infinity;
    for (let v = sink; v !== source; v = parent.get(v)) {
      bottleneck = Math.min(bottleneck, residual.get(parent.get(v)).get(v));
    }
    for (let v = sink; v !== source; v = parent.get(v)) {
      const u = parent.get(v);
      residual.get(u).set(v, residual.get(u).get(v) - bottleneck);
      residual.get(v).set(u, residual.get(v).get(u) + bottleneck);
    }
    total += bottleneck;
  }
}
