import Graph from '../../data-structures/graph.js';
import { tarjanSCC, kosaraju, bridges, articulationPoints } from './connectivity.js';

const normalize = components => components.map(c => c.slice().sort()).sort((a, b) => a[0] - b[0]);

describe('strongly connected components', () => {
  const directed = () => Graph.fromEdges(
    [[1, 2], [2, 3], [3, 1], [3, 4], [4, 5], [5, 4], [5, 6]],
    { directed: true }
  );

  [['tarjanSCC', tarjanSCC], ['kosaraju', kosaraju]].forEach(([name, scc]) => {
    test(name + ' finds the components', () => {
      expect(normalize(scc(directed()))).toEqual([[1, 2, 3], [4, 5], [6]]);
    });

    test(name + ': every vertex is its own component in a DAG', () => {
      const dag = Graph.fromEdges([[1, 2], [1, 3], [2, 4], [3, 4]], { directed: true });
      expect(normalize(scc(dag))).toEqual([[1], [2], [3], [4]]);
    });

    test(name + ': one big cycle is a single component', () => {
      const cycle = Graph.fromEdges([[1, 2], [2, 3], [3, 4], [4, 1]], { directed: true });
      expect(normalize(scc(cycle))).toEqual([[1, 2, 3, 4]]);
    });
  });
});

describe('bridges', () => {
  test('finds the edge joining two triangles', () => {
    const g = Graph.fromEdges([[0, 1], [1, 2], [2, 0], [1, 3], [3, 4], [4, 5], [5, 3]]);
    expect(bridges(g)).toEqual([[1, 3]]);
  });

  test('every edge of a path (tree) is a bridge; a cycle has none', () => {
    const path = Graph.fromEdges([[0, 1], [1, 2], [2, 3]]);
    expect(bridges(path).length).toBe(3);
    expect(bridges(Graph.fromEdges([[0, 1], [1, 2], [2, 0]]))).toEqual([]);
  });
});

describe('articulationPoints', () => {
  test('finds vertices that hold two triangles together', () => {
    const g = Graph.fromEdges([[0, 1], [1, 2], [2, 0], [1, 3], [3, 4], [4, 5], [5, 3]]);
    expect(articulationPoints(g).sort()).toEqual([1, 3]);
  });

  test('inner vertices of a path are cut vertices; a cycle has none', () => {
    expect(articulationPoints(Graph.fromEdges([[0, 1], [1, 2], [2, 3]])).sort()).toEqual([1, 2]);
    expect(articulationPoints(Graph.fromEdges([[0, 1], [1, 2], [2, 0]]))).toEqual([]);
  });

  test('the DFS root counts only if it has several subtrees (a star centre)', () => {
    const star = Graph.fromEdges([[0, 1], [0, 2], [0, 3]]);
    expect(articulationPoints(star)).toEqual([0]);
  });
});
