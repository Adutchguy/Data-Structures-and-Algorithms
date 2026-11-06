import Graph from '../../data-structures/graph.js';
import { dijkstra, shortestPath, bellmanFord, floydWarshall, aStar, reconstructPath } from './shortest-paths.js';

// Classic weighted example graph.
const roads = () => Graph.fromEdges([
  ['A', 'B', 7], ['A', 'C', 9], ['A', 'F', 14], ['B', 'C', 10], ['B', 'D', 15],
  ['C', 'D', 11], ['C', 'F', 2], ['D', 'E', 6], ['E', 'F', 9],
]);

describe('dijkstra', () => {
  test('computes distances from the source', () => {
    const { distances } = dijkstra(roads(), 'A');
    expect(distances.get('A')).toBe(0);
    expect(distances.get('B')).toBe(7);
    expect(distances.get('C')).toBe(9);
    expect(distances.get('F')).toBe(11);
    expect(distances.get('D')).toBe(20);
    expect(distances.get('E')).toBe(20);
  });

  test('shortestPath returns the distance and the route', () => {
    expect(shortestPath(roads(), 'A', 'E')).toEqual({ distance: 20, path: ['A', 'C', 'F', 'E'] });
    expect(shortestPath(roads(), 'A', 'A')).toEqual({ distance: 0, path: ['A'] });
  });

  test('unreachable vertices stay at Infinity and have no path', () => {
    const g = Graph.fromEdges([[1, 2, 1]]);
    g.addVertex(3);
    expect(dijkstra(g, 1).distances.get(3)).toBe(Infinity);
    expect(shortestPath(g, 1, 3)).toBeNull();
  });

  test('respects edge direction', () => {
    const g = Graph.fromEdges([[1, 2, 5], [2, 3, 5], [1, 3, 20]], { directed: true });
    expect(shortestPath(g, 1, 3).distance).toBe(10);
    expect(shortestPath(g, 3, 1)).toBeNull();
  });

  test('rejects negative weights and unknown vertices', () => {
    expect(() => dijkstra(Graph.fromEdges([[1, 2, -1]], { directed: true }), 1)).toThrow();
    expect(() => dijkstra(roads(), 'Z')).toThrow();
  });
});

describe('reconstructPath', () => {
  test('handles missing links', () => {
    expect(reconstructPath(new Map(), 1, 2)).toBeNull();
    expect(reconstructPath(new Map(), 1, 1)).toEqual([1]);
  });
});

describe('bellmanFord', () => {
  test('handles negative edges', () => {
    const g = Graph.fromEdges(
      [['S', 'A', 4], ['S', 'B', 5], ['A', 'C', -2], ['B', 'A', -3], ['C', 'D', 3]],
      { directed: true }
    );
    const { distances, hasNegativeCycle } = bellmanFord(g, 'S');
    expect(hasNegativeCycle).toBe(false);
    expect(distances.get('B')).toBe(5);
    expect(distances.get('A')).toBe(2);
    expect(distances.get('C')).toBe(0);
    expect(distances.get('D')).toBe(3);
  });

  test('detects a negative cycle', () => {
    const g = Graph.fromEdges([['A', 'B', 1], ['B', 'C', -3], ['C', 'A', 1]], { directed: true });
    expect(bellmanFord(g, 'A').hasNegativeCycle).toBe(true);
  });

  test('agrees with dijkstra when weights are non-negative', () => {
    const d = dijkstra(roads(), 'A').distances;
    const b = bellmanFord(roads(), 'A').distances;
    roads().vertices().forEach(v => expect(b.get(v)).toBe(d.get(v)));
  });
});

describe('floydWarshall', () => {
  const g = Graph.fromEdges(
    [[1, 3, -2], [3, 4, 2], [4, 2, -1], [2, 1, 4], [2, 3, 3]],
    { directed: true }
  );

  test('all-pairs distances agree with Bellman-Ford from every source', () => {
    const { distances, hasNegativeCycle } = floydWarshall(g);
    expect(hasNegativeCycle).toBe(false);
    g.vertices().forEach(source => {
      const expected = bellmanFord(g, source).distances;
      g.vertices().forEach(target => {
        expect(distances.get(source).get(target)).toBe(expected.get(target));
      });
    });
    expect(distances.get(4).get(3)).toBe(1);
  });

  test('works on undirected graphs and detects negative cycles', () => {
    const { distances } = floydWarshall(roads());
    expect(distances.get('A').get('E')).toBe(20);
    expect(distances.get('E').get('A')).toBe(20);
    const bad = Graph.fromEdges([[1, 2, 1], [2, 3, -3], [3, 1, 1]], { directed: true });
    expect(floydWarshall(bad).hasNegativeCycle).toBe(true);
  });
});

describe('aStar', () => {
  // Build a grid graph. '#' cells are walls. Vertices are 'r,c' strings.
  const layout = [
    '.....',
    '.###.',
    '...#.',
    '.#...',
    '.....',
  ];
  const key = (r, c) => r + ',' + c;
  const grid = new Graph();
  layout.forEach((row, r) => {
    row.split('').forEach((cell, c) => {
      if (cell === '#') return;
      grid.addVertex(key(r, c));
      if (c + 1 < row.length && row[c + 1] !== '#') grid.addEdge(key(r, c), key(r, c + 1));
      if (r + 1 < layout.length && layout[r + 1][c] !== '#') grid.addEdge(key(r, c), key(r + 1, c));
    });
  });
  const manhattan = goalR => goalC => v => {
    const [r, c] = v.split(',').map(Number);
    return Math.abs(r - goalR) + Math.abs(c - goalC);
  };

  test('finds an optimal path, matching Dijkstra', () => {
    const goal = key(4, 4);
    const result = aStar(grid, key(0, 0), goal, manhattan(4)(4));
    expect(result.distance).toBe(dijkstra(grid, key(0, 0)).distances.get(goal));
    expect(result.path[0]).toBe('0,0');
    expect(result.path[result.path.length - 1]).toBe(goal);
    expect(result.path.length - 1).toBe(result.distance);
  });

  test('a zero heuristic behaves like Dijkstra; unreachable goal gives null', () => {
    const goal = key(2, 0);
    expect(aStar(grid, key(0, 0), goal, () => 0).distance).toBe(2);
    const g = Graph.fromEdges([[1, 2, 1]]);
    g.addVertex(3);
    expect(aStar(g, 1, 3, () => 0)).toBeNull();
  });
});
