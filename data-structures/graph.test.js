import Graph from './graph.js';

describe('Graph (undirected)', () => {
  let g;
  beforeEach(() => {
    g = Graph.fromEdges([['A', 'B', 4], ['A', 'C', 2], ['B', 'C', 1], ['C', 'D']]);
  });

  test('stores vertices and symmetric edges', () => {
    expect(g.vertices()).toEqual(['A', 'B', 'C', 'D']);
    expect(g.size).toBe(4);
    expect(g.hasEdge('A', 'B')).toBe(true);
    expect(g.hasEdge('B', 'A')).toBe(true);
    expect(g.hasEdge('A', 'D')).toBe(false);
  });

  test('weights default to 1', () => {
    expect(g.getWeight('A', 'B')).toBe(4);
    expect(g.getWeight('C', 'D')).toBe(1);
    expect(g.getWeight('A', 'D')).toBeUndefined();
  });

  test('neighbors, edgesFrom and degree', () => {
    expect(g.neighbors('C').sort()).toEqual(['A', 'B', 'D']);
    expect(g.neighbors('nope')).toEqual([]);
    expect(g.edgesFrom('B')).toEqual([{ to: 'A', weight: 4 }, { to: 'C', weight: 1 }]);
    expect(g.outDegree('C')).toBe(3);
  });

  test('edges() lists each undirected edge once', () => {
    expect(g.edges().length).toBe(4);
  });

  test('removeEdge removes both directions', () => {
    expect(g.removeEdge('A', 'B')).toBe(true);
    expect(g.hasEdge('B', 'A')).toBe(false);
    expect(g.removeEdge('A', 'B')).toBe(false);
  });

  test('removeVertex removes incident edges', () => {
    expect(g.removeVertex('C')).toBe(true);
    expect(g.hasVertex('C')).toBe(false);
    expect(g.neighbors('A')).toEqual(['B']);
    expect(g.neighbors('D')).toEqual([]);
    expect(g.removeVertex('C')).toBe(false);
  });

  test('self-loops are listed once', () => {
    const loop = Graph.fromEdges([[1, 1]]);
    expect(loop.edges().length).toBe(1);
  });
});

describe('Graph (directed)', () => {
  let g;
  beforeEach(() => {
    g = Graph.fromEdges([[1, 2], [1, 3], [3, 2], [2, 4]], { directed: true });
  });

  test('edges are one-way', () => {
    expect(g.hasEdge(1, 2)).toBe(true);
    expect(g.hasEdge(2, 1)).toBe(false);
    expect(g.edges().length).toBe(4);
  });

  test('in and out degree', () => {
    expect(g.outDegree(1)).toBe(2);
    expect(g.inDegree(2)).toBe(2);
    expect(g.inDegree(1)).toBe(0);
  });

  test('transpose flips every edge', () => {
    const t = g.transpose();
    expect(t.hasEdge(2, 1)).toBe(true);
    expect(t.hasEdge(1, 2)).toBe(false);
    expect(t.edges().length).toBe(4);
    expect(t.vertices().sort()).toEqual([1, 2, 3, 4]);
  });
});
