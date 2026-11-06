import Graph from '../../data-structures/graph.js';
import maxFlow from './max-flow.js';

describe('maxFlow (Edmonds-Karp)', () => {
  test('classic CLRS network has max flow 23', () => {
    const g = Graph.fromEdges([
      ['s', 'v1', 16], ['s', 'v2', 13], ['v1', 'v3', 12], ['v2', 'v1', 4],
      ['v2', 'v4', 14], ['v3', 'v2', 9], ['v3', 't', 20], ['v4', 'v3', 7], ['v4', 't', 4],
    ], { directed: true });
    expect(maxFlow(g, 's', 't')).toBe(23);
  });

  test('a single path is limited by its bottleneck', () => {
    const g = Graph.fromEdges([[1, 2, 10], [2, 3, 3], [3, 4, 10]], { directed: true });
    expect(maxFlow(g, 1, 4)).toBe(3);
  });

  test('parallel paths add up', () => {
    const g = Graph.fromEdges([
      ['s', 'a', 5], ['a', 't', 5], ['s', 'b', 7], ['b', 't', 2],
    ], { directed: true });
    expect(maxFlow(g, 's', 't')).toBe(7);
  });

  test('needs the residual (reverse) edges to reach the optimum', () => {
    // A greedy first path s-a-b-t blocks the better routing unless it can be undone.
    const g = Graph.fromEdges([
      ['s', 'a', 1], ['s', 'b', 1], ['a', 'b', 1], ['a', 't', 1], ['b', 't', 1],
    ], { directed: true });
    expect(maxFlow(g, 's', 't')).toBe(2);
  });

  test('no route means zero flow; same source and sink means zero', () => {
    const g = Graph.fromEdges([[1, 2, 5], [3, 4, 5]], { directed: true });
    expect(maxFlow(g, 1, 4)).toBe(0);
    expect(maxFlow(g, 1, 1)).toBe(0);
  });

  test('rejects unknown vertices', () => {
    expect(() => maxFlow(new Graph({ directed: true }), 'x', 'y')).toThrow();
  });
});
