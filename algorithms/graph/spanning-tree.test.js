import Graph from '../../data-structures/graph.js';
import UnionFind from '../../data-structures/union-find.js';
import { kruskal, prim } from './spanning-tree.js';

// The example graph from CLRS; its MST weighs 37.
const clrs = () => Graph.fromEdges([
  ['A', 'B', 4], ['A', 'H', 8], ['B', 'C', 8], ['B', 'H', 11], ['C', 'D', 7],
  ['C', 'F', 4], ['C', 'I', 2], ['D', 'E', 9], ['D', 'F', 14], ['E', 'F', 10],
  ['F', 'G', 2], ['G', 'H', 1], ['G', 'I', 6], ['H', 'I', 7],
]);

function expectSpanningTree(graph, result) {
  expect(result.edges.length).toBe(graph.size - 1);
  const uf = new UnionFind(graph.vertices());
  result.edges.forEach(e => expect(uf.union(e.from, e.to)).toBe(true)); // no cycles
  expect(uf.count).toBe(1); // everything connected
}

describe('kruskal', () => {
  test('finds the minimum spanning tree', () => {
    const result = kruskal(clrs());
    expect(result.totalWeight).toBe(37);
    expectSpanningTree(clrs(), result);
  });

  test('returns a spanning forest for disconnected graphs', () => {
    const g = Graph.fromEdges([[1, 2, 1], [2, 3, 2], [1, 3, 3], [4, 5, 7]]);
    const result = kruskal(g);
    expect(result.totalWeight).toBe(10);
    expect(result.edges.length).toBe(3);
  });

  test('empty graph', () => {
    expect(kruskal(new Graph())).toEqual({ edges: [], totalWeight: 0 });
  });
});

describe('prim', () => {
  test('finds the same total weight as Kruskal', () => {
    const result = prim(clrs(), 'A');
    expect(result.totalWeight).toBe(37);
    expectSpanningTree(clrs(), result);
  });

  test('result does not depend on the start vertex', () => {
    clrs().vertices().forEach(start => {
      expect(prim(clrs(), start).totalWeight).toBe(37);
    });
  });

  test('only spans the start vertex\'s component', () => {
    const g = Graph.fromEdges([[1, 2, 1], [2, 3, 2], [4, 5, 7]]);
    expect(prim(g, 1).totalWeight).toBe(3);
    expect(prim(g, 4).totalWeight).toBe(7);
    expect(prim(new Graph())).toEqual({ edges: [], totalWeight: 0 });
  });
});
