'use strict';

/**
 * Connectivity algorithms
 *
 * tarjanSCC / kosaraju ... strongly connected components of a DIRECTED graph:
 *                          maximal groups where every vertex can reach every
 *                          other. Collapsing each group to a single node always
 *                          gives a DAG.                                O(V + E)
 * bridges ................ edges whose removal disconnects an UNDIRECTED graph.
 * articulationPoints ..... vertices whose removal disconnects it.     O(V + E)
 *
 * Bridges and articulation points rely on two DFS numbers per vertex:
 *   disc[v] - the time v was first visited
 *   low[v]  - the earliest discovery time reachable from v's DFS subtree using
 *             tree edges plus at most one back edge
 * A tree edge (u, v) is a bridge if low[v] > disc[u]: nothing in v's subtree
 * can climb back to u or above.
 *
 * (These use recursion for clarity; very deep graphs may need an explicit stack.)
 */

// Tarjan: one DFS, with a stack of vertices that are still "open".
// A vertex whose low-link equals its own index is the root of a component.
export function tarjanSCC(graph) {
  let counter = 0;
  const index = new Map();
  const low = new Map();
  const onStack = new Set();
  const stack = [];
  const components = [];

  const visit = v => {
    index.set(v, counter);
    low.set(v, counter);
    counter++;
    stack.push(v);
    onStack.add(v);

    graph.neighbors(v).forEach(w => {
      if (!index.has(w)) {
        visit(w);
        low.set(v, Math.min(low.get(v), low.get(w)));
      } else if (onStack.has(w)) {
        low.set(v, Math.min(low.get(v), index.get(w)));
      }
    });

    if (low.get(v) === index.get(v)) {
      const component = [];
      let w;
      do {
        w = stack.pop();
        onStack.delete(w);
        component.push(w);
      } while (w !== v);
      components.push(component);
    }
  };

  graph.vertices().forEach(v => {
    if (!index.has(v)) visit(v);
  });
  return components;
}

// Kosaraju: DFS to get finishing order, then DFS the TRANSPOSED graph in
// reverse finishing order - each DFS tree is one component.
export function kosaraju(graph) {
  const visited = new Set();
  const finishOrder = [];
  const firstPass = v => {
    visited.add(v);
    graph.neighbors(v).forEach(w => {
      if (!visited.has(w)) firstPass(w);
    });
    finishOrder.push(v);
  };
  graph.vertices().forEach(v => {
    if (!visited.has(v)) firstPass(v);
  });

  const reversed = graph.transpose();
  const assigned = new Set();
  const components = [];
  const secondPass = (v, component) => {
    assigned.add(v);
    component.push(v);
    reversed.neighbors(v).forEach(w => {
      if (!assigned.has(w)) secondPass(w, component);
    });
  };
  for (let i = finishOrder.length - 1; i >= 0; i--) {
    if (!assigned.has(finishOrder[i])) {
      const component = [];
      secondPass(finishOrder[i], component);
      components.push(component);
    }
  }
  return components;
}

// Edges [u, v] whose removal increases the number of connected components.
export function bridges(graph) {
  const disc = new Map();
  const low = new Map();
  const found = [];
  let time = 0;

  const visit = (u, parent) => {
    disc.set(u, time);
    low.set(u, time);
    time++;
    graph.neighbors(u).forEach(v => {
      if (v === parent) return;
      if (!disc.has(v)) {
        visit(v, u);
        low.set(u, Math.min(low.get(u), low.get(v)));
        if (low.get(v) > disc.get(u)) found.push([u, v]);
      } else {
        low.set(u, Math.min(low.get(u), disc.get(v)));
      }
    });
  };

  graph.vertices().forEach(v => {
    if (!disc.has(v)) visit(v, null);
  });
  return found;
}

// Vertices whose removal increases the number of connected components.
export function articulationPoints(graph) {
  const disc = new Map();
  const low = new Map();
  const points = new Set();
  let time = 0;

  const visit = (u, parent) => {
    disc.set(u, time);
    low.set(u, time);
    time++;
    let children = 0;
    graph.neighbors(u).forEach(v => {
      if (v === parent) return;
      if (!disc.has(v)) {
        children++;
        visit(v, u);
        low.set(u, Math.min(low.get(u), low.get(v)));
        // A non-root u is a cut vertex if some child's subtree can't climb above u.
        if (parent !== null && low.get(v) >= disc.get(u)) points.add(u);
      } else {
        low.set(u, Math.min(low.get(u), disc.get(v)));
      }
    });
    // The DFS root is a cut vertex only if it has 2+ DFS children.
    if (parent === null && children > 1) points.add(u);
  };

  graph.vertices().forEach(v => {
    if (!disc.has(v)) visit(v, null);
  });
  return Array.from(points);
}
