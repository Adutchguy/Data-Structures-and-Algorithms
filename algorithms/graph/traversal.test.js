import Graph from '../../data-structures/graph.js';
import {
  bfs, dfs, dfsRecursive, shortestPathUnweighted, connectedComponents, hasCycle,
  topologicalSort, isBipartite, numIslands, floodFill, shortestPathGrid,
} from './traversal.js';

const diamond = () => Graph.fromEdges([['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D'], ['D', 'E']]);

describe('bfs / dfs', () => {
  test('bfs visits nearest vertices first', () => {
    expect(bfs(diamond(), 'A')).toEqual(['A', 'B', 'C', 'D', 'E']);
    expect(bfs(diamond(), 'E')).toEqual(['E', 'D', 'B', 'C', 'A']);
  });

  test('dfs dives deep before backtracking (iterative and recursive agree)', () => {
    expect(dfs(diamond(), 'A')).toEqual(['A', 'B', 'D', 'C', 'E']);
    expect(dfsRecursive(diamond(), 'A')).toEqual(['A', 'B', 'D', 'C', 'E']);
  });

  test('only reaches the start vertex\'s component; unknown start gives []', () => {
    const g = Graph.fromEdges([[1, 2], [3, 4]]);
    expect(bfs(g, 1)).toEqual([1, 2]);
    expect(dfs(g, 3)).toEqual([3, 4]);
    expect(bfs(g, 99)).toEqual([]);
    expect(dfs(g, 99)).toEqual([]);
  });

  test('follows edge direction in directed graphs', () => {
    const g = Graph.fromEdges([[1, 2], [2, 3], [4, 1]], { directed: true });
    expect(bfs(g, 1)).toEqual([1, 2, 3]);
    expect(bfs(g, 4)).toEqual([4, 1, 2, 3]);
  });
});

describe('shortestPathUnweighted', () => {
  test('finds a fewest-edges path', () => {
    expect(shortestPathUnweighted(diamond(), 'A', 'E')).toEqual(['A', 'B', 'D', 'E']);
    expect(shortestPathUnweighted(diamond(), 'A', 'A')).toEqual(['A']);
  });

  test('returns null when unreachable or unknown', () => {
    const g = Graph.fromEdges([[1, 2], [3, 4]]);
    expect(shortestPathUnweighted(g, 1, 4)).toBeNull();
    expect(shortestPathUnweighted(g, 1, 99)).toBeNull();
  });
});

describe('connectedComponents', () => {
  test('groups mutually reachable vertices', () => {
    const g = Graph.fromEdges([[1, 2], [2, 3], [4, 5]]);
    g.addVertex(6);
    const comps = connectedComponents(g).map(c => c.sort());
    expect(comps).toEqual([[1, 2, 3], [4, 5], [6]]);
  });
});

describe('hasCycle', () => {
  test('undirected', () => {
    expect(hasCycle(Graph.fromEdges([[1, 2], [2, 3], [3, 1]]))).toBe(true);
    expect(hasCycle(Graph.fromEdges([[1, 2], [2, 3], [3, 4]]))).toBe(false);
    expect(hasCycle(Graph.fromEdges([[1, 1]]))).toBe(true);
    expect(hasCycle(Graph.fromEdges([[1, 2], [3, 4], [4, 5], [5, 3]]))).toBe(true);
  });

  test('directed', () => {
    expect(hasCycle(Graph.fromEdges([[1, 2], [2, 3], [3, 1]], { directed: true }))).toBe(true);
    // a diamond is not a directed cycle even though two paths meet
    expect(hasCycle(Graph.fromEdges([[1, 2], [1, 3], [2, 4], [3, 4]], { directed: true }))).toBe(false);
  });
});

describe('topologicalSort', () => {
  test('orders every edge forward', () => {
    const edges = [[5, 2], [5, 0], [4, 0], [4, 1], [2, 3], [3, 1]];
    const order = topologicalSort(Graph.fromEdges(edges, { directed: true }));
    expect(order.length).toBe(6);
    edges.forEach(([from, to]) => expect(order.indexOf(from)).toBeLessThan(order.indexOf(to)));
  });

  test('returns null for a cyclic graph', () => {
    expect(topologicalSort(Graph.fromEdges([[1, 2], [2, 1]], { directed: true }))).toBeNull();
  });
});

describe('isBipartite', () => {
  test('even cycles are bipartite, odd cycles are not', () => {
    expect(isBipartite(Graph.fromEdges([[1, 2], [2, 3], [3, 4], [4, 1]]))).toBe(true);
    expect(isBipartite(Graph.fromEdges([[1, 2], [2, 3], [3, 1]]))).toBe(false);
  });

  test('checks every component', () => {
    expect(isBipartite(Graph.fromEdges([[1, 2], [3, 4], [4, 5], [5, 3]]))).toBe(false);
    expect(isBipartite(new Graph())).toBe(true);
  });
});

describe('grid algorithms', () => {
  test('numIslands', () => {
    expect(numIslands([
      [1, 1, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 1, 1],
    ])).toBe(3);
    expect(numIslands([['1', '0'], ['0', '1']])).toBe(2);
    expect(numIslands([])).toBe(0);
  });

  test('floodFill recolours a connected region without mutating the input', () => {
    const image = [
      [1, 1, 0],
      [1, 0, 0],
      [1, 1, 1],
    ];
    const filled = floodFill(image, 0, 0, 7);
    expect(filled).toEqual([
      [7, 7, 0],
      [7, 0, 0],
      [7, 7, 7],
    ]);
    expect(image[0][0]).toBe(1);
    expect(floodFill(image, 0, 0, 1)).toEqual(image);
  });

  test('shortestPathGrid', () => {
    const maze = [
      [0, 0, 0, 0],
      [1, 1, 0, 1],
      [0, 0, 0, 0],
      [0, 1, 1, 0],
    ];
    expect(shortestPathGrid(maze, [0, 0], [3, 3])).toBe(6);
    expect(shortestPathGrid(maze, [0, 0], [0, 0])).toBe(0);
    expect(shortestPathGrid([[0, 1], [1, 0]], [0, 0], [1, 1])).toBe(-1);
    expect(shortestPathGrid(maze, [1, 0], [3, 3])).toBe(-1);
  });
});
