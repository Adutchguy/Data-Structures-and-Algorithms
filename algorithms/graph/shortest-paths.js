'use strict';

import { Heap } from '../../data-structures/heap.js';

/**
 * Shortest-path algorithms on a weighted Graph (data-structures/graph.js)
 *
 * Algorithm        Handles negative edges?  Finds                  Time
 * ---------------  -----------------------  ---------------------  ----------------
 * dijkstra         no                       one source -> all      O((V + E) log V)
 * bellmanFord      yes (detects neg cycles) one source -> all      O(V * E)
 * floydWarshall    yes (detects neg cycles) all pairs              O(V^3)
 * aStar            no                       one source -> one goal O(E) .. depends on heuristic
 *
 * Rule of thumb: Dijkstra is the default; reach for Bellman-Ford when edges can
 * be negative; Floyd-Warshall when you need every pair on a small graph; A* when
 * you have a good "distance to goal" estimate (maps, grids, puzzles).
 */

function requireVertex(graph, v) {
  if (!graph.hasVertex(v)) throw new Error('Unknown vertex: ' + v);
}

// Walk the `previous` links back from target to source. Returns null if unreachable.
export function reconstructPath(previous, source, target) {
  if (source !== target && !previous.has(target)) return null;
  const path = [];
  for (let at = target; at !== undefined; at = previous.get(at)) {
    path.push(at);
    if (at === source) break;
  }
  return path[path.length - 1] === source ? path.reverse() : null;
}

/**
 * Dijkstra: repeatedly settle the unsettled vertex with the smallest known
 * distance and relax its outgoing edges. A min-heap picks that vertex quickly.
 * We allow stale heap entries and skip them when popped ("lazy deletion").
 * Requires non-negative weights.
 * Returns { distances: Map, previous: Map }. Unreachable vertices have Infinity.
 */
export function dijkstra(graph, source) {
  requireVertex(graph, source);
  const distances = new Map();
  const previous = new Map();
  graph.vertices().forEach(v => distances.set(v, Infinity));
  distances.set(source, 0);

  const heap = new Heap((a, b) => a[0] - b[0]);
  heap.push([0, source]);
  while (!heap.isEmpty()) {
    const [dist, u] = heap.pop();
    if (dist > distances.get(u)) continue; // stale entry
    graph.edgesFrom(u).forEach(({ to, weight }) => {
      if (weight < 0) throw new Error('Dijkstra does not support negative edge weights');
      const candidate = dist + weight;
      if (candidate < distances.get(to)) {
        distances.set(to, candidate);
        previous.set(to, u);
        heap.push([candidate, to]);
      }
    });
  }
  return { distances, previous };
}

// Shortest path between two vertices: { distance, path } or null if unreachable.
export function shortestPath(graph, source, target) {
  requireVertex(graph, target);
  const { distances, previous } = dijkstra(graph, source);
  if (distances.get(target) === Infinity) return null;
  return { distance: distances.get(target), path: reconstructPath(previous, source, target) };
}

/**
 * Bellman-Ford: relax EVERY edge V-1 times. After i rounds all shortest paths
 * using <= i edges are correct. If a V-th round still improves something, a
 * negative cycle is reachable from the source.
 * Returns { distances, previous, hasNegativeCycle }.
 */
export function bellmanFord(graph, source) {
  requireVertex(graph, source);
  const vertices = graph.vertices();
  const distances = new Map();
  const previous = new Map();
  vertices.forEach(v => distances.set(v, Infinity));
  distances.set(source, 0);

  const relaxAll = () => {
    let changed = false;
    vertices.forEach(u => {
      if (distances.get(u) === Infinity) return;
      graph.edgesFrom(u).forEach(({ to, weight }) => {
        if (distances.get(u) + weight < distances.get(to)) {
          distances.set(to, distances.get(u) + weight);
          previous.set(to, u);
          changed = true;
        }
      });
    });
    return changed;
  };

  for (let i = 0; i < vertices.length - 1; i++) {
    if (!relaxAll()) break; // converged early
  }
  const hasNegativeCycle = relaxAll();
  return { distances, previous, hasNegativeCycle };
}

/**
 * Floyd-Warshall: dynamic programming over "allowed intermediate vertices".
 *   dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])   for each k in turn
 * Returns { distances: Map<from, Map<to, number>>, hasNegativeCycle }.
 */
export function floydWarshall(graph) {
  const vertices = graph.vertices();
  const n = vertices.length;
  const index = new Map();
  vertices.forEach((v, i) => index.set(v, i));

  const dist = [];
  for (let i = 0; i < n; i++) {
    dist.push(new Array(n));
    for (let j = 0; j < n; j++) dist[i][j] = i === j ? 0 : Infinity;
  }
  graph.edges().forEach(({ from, to, weight }) => {
    dist[index.get(from)][index.get(to)] = Math.min(dist[index.get(from)][index.get(to)], weight);
    if (!graph.directed) {
      dist[index.get(to)][index.get(from)] = Math.min(dist[index.get(to)][index.get(from)], weight);
    }
  });

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];
      }
    }
  }

  let hasNegativeCycle = false;
  const distances = new Map();
  vertices.forEach((u, i) => {
    if (dist[i][i] < 0) hasNegativeCycle = true;
    const row = new Map();
    vertices.forEach((v, j) => row.set(v, dist[i][j]));
    distances.set(u, row);
  });
  return { distances, hasNegativeCycle };
}

/**
 * A*: Dijkstra guided by a heuristic h(v) = estimated remaining cost to the goal.
 * It expands vertices in order of g(v) + h(v), where g is the cost so far.
 * If h never overestimates the true remaining cost ("admissible"), the first
 * time the goal is popped its path is optimal. h = 0 turns this into Dijkstra.
 * Returns { distance, path } or null.
 */
export function aStar(graph, start, goal, heuristic) {
  requireVertex(graph, start);
  requireVertex(graph, goal);
  const g = new Map([[start, 0]]);
  const previous = new Map();
  const open = new Heap((a, b) => a[0] - b[0]);
  open.push([heuristic(start), start]);
  while (!open.isEmpty()) {
    const [, u] = open.pop();
    if (u === goal) {
      return { distance: g.get(goal), path: reconstructPath(previous, start, goal) };
    }
    graph.edgesFrom(u).forEach(({ to, weight }) => {
      const tentative = g.get(u) + weight;
      if (!g.has(to) || tentative < g.get(to)) {
        g.set(to, tentative);
        previous.set(to, u);
        open.push([tentative + heuristic(to), to]);
      }
    });
  }
  return null;
}
