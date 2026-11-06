'use strict';

import Queue from '../../data-structures/queue.js';

/**
 * Graph traversal and basic graph properties
 *
 * All functions take a Graph from data-structures/graph.js.
 * V = number of vertices, E = number of edges.
 *
 *   bfs ........................ visit level by level (nearest first)    O(V + E)
 *   dfs / dfsRecursive ......... dive as deep as possible, then backtrack O(V + E)
 *   shortestPathUnweighted ..... fewest-edges path (BFS + parent links)   O(V + E)
 *   connectedComponents ........ groups of mutually reachable vertices   O(V + E)
 *   hasCycle ................... undirected or directed cycle detection   O(V + E)
 *   topologicalSort ............ Kahn's algorithm for DAGs                O(V + E)
 *   isBipartite ................ can the vertices be 2-coloured?          O(V + E)
 *   numIslands / floodFill / shortestPathGrid ... the same ideas on a 2D grid
 */

// Breadth-first search: explores all vertices at distance 1, then 2, ... Returns visit order.
export function bfs(graph, start) {
  if (!graph.hasVertex(start)) return [];
  const visited = new Set([start]);
  const order = [];
  const queue = new Queue();
  queue.enqueue(start);
  while (!queue.isEmpty()) {
    const v = queue.dequeue();
    order.push(v);
    graph.neighbors(v).forEach(n => {
      if (!visited.has(n)) {
        visited.add(n); // mark when ENQUEUED so nothing is queued twice
        queue.enqueue(n);
      }
    });
  }
  return order;
}

// Depth-first search using an explicit stack. Returns visit (pre-)order.
export function dfs(graph, start) {
  if (!graph.hasVertex(start)) return [];
  const visited = new Set();
  const order = [];
  const stack = [start];
  while (stack.length) {
    const v = stack.pop();
    if (visited.has(v)) continue;
    visited.add(v);
    order.push(v);
    // push in reverse so the first neighbour is explored first
    const neighbors = graph.neighbors(v);
    for (let i = neighbors.length - 1; i >= 0; i--) {
      if (!visited.has(neighbors[i])) stack.push(neighbors[i]);
    }
  }
  return order;
}

export function dfsRecursive(graph, start) {
  if (!graph.hasVertex(start)) return [];
  const visited = new Set();
  const order = [];
  const visit = v => {
    visited.add(v);
    order.push(v);
    graph.neighbors(v).forEach(n => {
      if (!visited.has(n)) visit(n);
    });
  };
  visit(start);
  return order;
}

// Fewest-edges path from start to goal as an array of vertices, or null.
export function shortestPathUnweighted(graph, start, goal) {
  if (!graph.hasVertex(start) || !graph.hasVertex(goal)) return null;
  const parent = new Map([[start, null]]);
  const queue = new Queue();
  queue.enqueue(start);
  while (!queue.isEmpty()) {
    const v = queue.dequeue();
    if (v === goal) {
      const path = [];
      for (let at = goal; at !== null; at = parent.get(at)) path.push(at);
      return path.reverse();
    }
    graph.neighbors(v).forEach(n => {
      if (!parent.has(n)) {
        parent.set(n, v);
        queue.enqueue(n);
      }
    });
  }
  return null;
}

// Connected components of an undirected graph: an array of vertex arrays.
export function connectedComponents(graph) {
  const seen = new Set();
  const components = [];
  graph.vertices().forEach(v => {
    if (seen.has(v)) return;
    const component = bfs(graph, v);
    component.forEach(u => seen.add(u));
    components.push(component);
  });
  return components;
}

// Does the graph contain a cycle? Works for both directed and undirected graphs.
export function hasCycle(graph) {
  return graph.directed ? directedCycle(graph) : undirectedCycle(graph);
}

// Undirected: a cycle exists if DFS reaches an already-visited vertex that is
// not the one we just came from.
function undirectedCycle(graph) {
  const visited = new Set();
  const visit = (v, parent) => {
    visited.add(v);
    const neighbors = graph.neighbors(v);
    for (let i = 0; i < neighbors.length; i++) {
      const n = neighbors[i];
      if (n === v) return true; // self-loop
      if (!visited.has(n)) {
        if (visit(n, v)) return true;
      } else if (n !== parent) {
        return true;
      }
    }
    return false;
  };
  const vertices = graph.vertices();
  for (let i = 0; i < vertices.length; i++) {
    if (!visited.has(vertices[i]) && visit(vertices[i], null)) return true;
  }
  return false;
}

// Directed: a cycle exists if DFS finds an edge back to a vertex that is still
// "in progress" (on the current DFS path). Colours: 0 = unvisited, 1 = in progress, 2 = done.
function directedCycle(graph) {
  const color = new Map();
  graph.vertices().forEach(v => color.set(v, 0));
  const visit = v => {
    color.set(v, 1);
    const neighbors = graph.neighbors(v);
    for (let i = 0; i < neighbors.length; i++) {
      const n = neighbors[i];
      if (color.get(n) === 1) return true;
      if (color.get(n) === 0 && visit(n)) return true;
    }
    color.set(v, 2);
    return false;
  };
  const vertices = graph.vertices();
  for (let i = 0; i < vertices.length; i++) {
    if (color.get(vertices[i]) === 0 && visit(vertices[i])) return true;
  }
  return false;
}

/**
 * Topological sort (Kahn's algorithm): order the vertices of a directed acyclic
 * graph so every edge points forward. Repeatedly remove a vertex with no
 * remaining incoming edges. Returns null if the graph has a cycle.
 * Uses: build/dependency ordering, course prerequisites, task scheduling.
 */
export function topologicalSort(graph) {
  const inDegree = new Map();
  graph.vertices().forEach(v => inDegree.set(v, 0));
  graph.vertices().forEach(v => {
    graph.neighbors(v).forEach(n => inDegree.set(n, inDegree.get(n) + 1));
  });
  const queue = new Queue();
  graph.vertices().forEach(v => {
    if (inDegree.get(v) === 0) queue.enqueue(v);
  });
  const order = [];
  while (!queue.isEmpty()) {
    const v = queue.dequeue();
    order.push(v);
    graph.neighbors(v).forEach(n => {
      inDegree.set(n, inDegree.get(n) - 1);
      if (inDegree.get(n) === 0) queue.enqueue(n);
    });
  }
  return order.length === graph.size ? order : null;
}

// A graph is bipartite iff it has no odd-length cycle. Try to 2-colour it with BFS.
export function isBipartite(graph) {
  const color = new Map();
  const vertices = graph.vertices();
  for (let i = 0; i < vertices.length; i++) {
    if (color.has(vertices[i])) continue;
    color.set(vertices[i], 0);
    const queue = new Queue();
    queue.enqueue(vertices[i]);
    while (!queue.isEmpty()) {
      const v = queue.dequeue();
      const neighbors = graph.neighbors(v);
      for (let j = 0; j < neighbors.length; j++) {
        const n = neighbors[j];
        if (!color.has(n)) {
          color.set(n, 1 - color.get(v));
          queue.enqueue(n);
        } else if (color.get(n) === color.get(v)) {
          return false;
        }
      }
    }
  }
  return true;
}

// ---------------------------------------------------------------------------
// Grid versions: treat each cell as a vertex connected to its 4 neighbours.
// ---------------------------------------------------------------------------

const DIRECTIONS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

const inBounds = (grid, r, c) => r >= 0 && r < grid.length && c >= 0 && c < grid[r].length;

// Count connected groups of land cells ("islands"). Land is 1 or '1'.
export function numIslands(grid) {
  const seen = grid.map(row => row.map(() => false));
  const isLand = (r, c) => grid[r][c] === 1 || grid[r][c] === '1';
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (!isLand(r, c) || seen[r][c]) continue;
      count++;
      const stack = [[r, c]];
      seen[r][c] = true;
      while (stack.length) {
        const [cr, cc] = stack.pop();
        DIRECTIONS.forEach(([dr, dc]) => {
          const nr = cr + dr;
          const nc = cc + dc;
          if (inBounds(grid, nr, nc) && isLand(nr, nc) && !seen[nr][nc]) {
            seen[nr][nc] = true;
            stack.push([nr, nc]);
          }
        });
      }
    }
  }
  return count;
}

// "Paint bucket": recolour the connected region containing (r, c). Returns a new grid.
export function floodFill(grid, r, c, newColor) {
  const result = grid.map(row => row.slice());
  const oldColor = result[r][c];
  if (oldColor === newColor) return result;
  const stack = [[r, c]];
  result[r][c] = newColor;
  while (stack.length) {
    const [cr, cc] = stack.pop();
    DIRECTIONS.forEach(([dr, dc]) => {
      const nr = cr + dr;
      const nc = cc + dc;
      if (inBounds(result, nr, nc) && result[nr][nc] === oldColor) {
        result[nr][nc] = newColor;
        stack.push([nr, nc]);
      }
    });
  }
  return result;
}

// Fewest steps through a maze (0 = open, 1 = wall), moving up/down/left/right.
// Returns -1 if the end can't be reached.
export function shortestPathGrid(grid, start, end) {
  const [sr, sc] = start;
  const [er, ec] = end;
  if (!inBounds(grid, sr, sc) || !inBounds(grid, er, ec)) return -1;
  if (grid[sr][sc] === 1 || grid[er][ec] === 1) return -1;
  const dist = grid.map(row => row.map(() => -1));
  dist[sr][sc] = 0;
  const queue = new Queue();
  queue.enqueue([sr, sc]);
  while (!queue.isEmpty()) {
    const [r, c] = queue.dequeue();
    if (r === er && c === ec) return dist[r][c];
    DIRECTIONS.forEach(([dr, dc]) => {
      const nr = r + dr;
      const nc = c + dc;
      if (inBounds(grid, nr, nc) && grid[nr][nc] === 0 && dist[nr][nc] === -1) {
        dist[nr][nc] = dist[r][c] + 1;
        queue.enqueue([nr, nc]);
      }
    });
  }
  return -1;
}
