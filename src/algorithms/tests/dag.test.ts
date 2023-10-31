import {describe, expect, test} from "@jest/globals";

import {DiGraph} from "@/DiGraph";
import {
  GraphChangedDuringIterationError,
  GraphContainsCycleError,
  UnfeasibleError,
} from "@/GraphErrors";
import {UndirectedGraph} from "@/UndirectedGraph";
import {isDirectedAcyclicGraph, topologicalSort} from "@/algorithms/dag";
import {hasPath} from "@/algorithms/shortestPath";

describe("isDirectedAcyclicGraph", () => {
  test("complete graph K2 is not a directed acyclic graph", () => {
    const graph = new DiGraph<number>();
    graph.fromEdgeList([
      [0, 1],
      [1, 0],
    ]);
    expect(isDirectedAcyclicGraph(graph)).toBeFalsy();
  });

  test("complete graph K3 is not a directed acyclic graph", () => {
    const graph = new DiGraph<number>();
    graph.fromEdgeList([
      [3, 4],
      [4, 3],
      [4, 5],
      [5, 4],
    ]);
    expect(isDirectedAcyclicGraph(graph)).toBeFalsy();
  });

  test("empty graph is a directed acyclic graph", () => {
    const graph = new DiGraph<number>();
    expect(isDirectedAcyclicGraph(graph)).toBeTruthy();
  });

  test("single node is a directed acyclic graph", () => {
    const graph = new DiGraph<number>();
    graph.addVertex(0);
    expect(isDirectedAcyclicGraph(graph)).toBeTruthy();
  });

  test("graph with no cycles is a directed acyclic graph", () => {
    const graph = new DiGraph<number>();
    graph.fromEdgeList([
      [3, 4],
      [4, 5],
    ]);
    expect(isDirectedAcyclicGraph(graph)).toBeTruthy();
  });

  test("undirected graph is not dag", () => {
    const graph = new UndirectedGraph();
    expect(isDirectedAcyclicGraph(graph)).toBeFalsy();
  });
});

describe("topologicalSort", () => {
  describe("test topological sort", () => {
    test("test_topological_sort1", () => {
      const graph = new DiGraph<number>();
      graph.fromEdgeList([
        [1, 2],
        [1, 3],
        [2, 3],
      ]);
      expect(Array.from(topologicalSort(graph))).toEqual([1, 2, 3]);

      graph.addEdge(3, 2);

      expect(() => Array.from(topologicalSort(graph))).toThrow(
        GraphContainsCycleError,
      );

      graph.removeEdge(2, 3);

      expect(Array.from(topologicalSort(graph))).toEqual([1, 3, 2]);

      graph.removeEdge(3, 2);

      const x = Array.from(topologicalSort(graph));
      const possible = [
        [1, 2, 3],
        [1, 3, 2],
      ];
      expect(possible).toContainEqual(x);
    });

    test("test_topological_sort2", () => {
      const graph = new DiGraph<number>();
      graph.fromEdgeList([
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 1],
        [11, 12],
        [12, 13],
        [13, 14],
        [14, 15],
      ]);

      expect(() => Array.from(topologicalSort(graph))).toThrow(
        GraphContainsCycleError,
      );

      expect(isDirectedAcyclicGraph(graph)).toBeFalsy();

      graph.removeEdge(1, 2);

      expect(isDirectedAcyclicGraph(graph)).toBeTruthy();
    });

    test("test_topological_sort3", () => {
      /**
       *     def test_topological_sort3(self):
       *         DG = nx.DiGraph()
       *         DG.add_edges_from([(1, i) for i in range(2, 5)])
       *         DG.add_edges_from([(2, i) for i in range(5, 9)])
       *         DG.add_edges_from([(6, i) for i in range(9, 12)])
       *         DG.add_edges_from([(4, i) for i in range(12, 15)])
       *
       *         def validate(order):
       *             assert isinstance(order, list)
       *             assert set(order) == set(DG)
       *             for u, v in combinations(order, 2):
       *                 assert not nx.has_path(DG, v, u)
       *
       *         validate(list(nx.topological_sort(DG)))
       *
       *         DG.add_edge(14, 1)
       *         pytest.raises(nx.NetworkXUnfeasible, _consume, nx.topological_sort(DG))
       */
      // create a tree graph
      const dg = new DiGraph<number>();
      dg.fromEdgeList(Array.from({length: 4}, (_, i) => [1, i + 2]));
      dg.fromEdgeList(Array.from({length: 4}, (_, i) => [2, i + 5]));
      dg.fromEdgeList(Array.from({length: 3}, (_, i) => [6, i + 9]));
      dg.fromEdgeList(Array.from({length: 3}, (_, i) => [4, i + 12]));

      const validate = (order: number[]) => {
        expect(order).toBeInstanceOf(Array);
        expect(new Set(order)).toEqual(new Set(dg.vertices()));

        function* combinations() {
          for (let i = 0; i < order.length; i++) {
            for (let j = i + 1; j < order.length; j++) {
              yield [order[i], order[j]];
            }
          }
        }

        for (const [u, v] of combinations()) {
          expect(hasPath(dg, v, u)).toBeFalsy();
        }
      };

      validate(Array.from(topologicalSort(dg)));

      // add edge from leaf 14 to root 1
      dg.addEdge(14, 1);
      expect(() => Array.from(topologicalSort(dg))).toThrow(
        GraphContainsCycleError,
      );
    });

    test("test_topological_sort5", () => {
      const graph = new DiGraph<number>();
      graph.addEdge(0, 1);
      expect(Array.from(topologicalSort(graph))).toEqual([0, 1]);
    });

    test("test_topological_sort6", () => {
      const runtimeError = () => {
        const dg = new DiGraph<number>();
        dg.fromEdgeList([
          [1, 2],
          [2, 3],
          [3, 4],
        ]);
        let first = true;
        for (const x of topologicalSort(dg)) {
          if (first) {
            first = false;
            dg.addEdge(5 - x, 5);
          }
        }
      };

      const unfeasibleError = () => {
        const dg = new DiGraph<number>();
        dg.fromEdgeList([
          [1, 2],
          [2, 3],
          [3, 4],
        ]);
        let first = true;
        for (const _ of topologicalSort(dg)) {
          if (first) {
            first = false;
            dg.removeVertex(4);
          }
        }
      };

      const runtimeError2 = () => {
        const dg = new DiGraph<number>();
        dg.fromEdgeList([
          [1, 2],
          [2, 3],
          [3, 4],
        ]);
        let first = true;
        for (const _ of topologicalSort(dg)) {
          if (first) {
            first = false;
            dg.removeVertex(2);
          }
        }
      };

      expect(runtimeError).toThrow(GraphChangedDuringIterationError);
      expect(unfeasibleError).toThrow(GraphChangedDuringIterationError);
      expect(runtimeError2).toThrow(GraphChangedDuringIterationError);
    });
  });

  test("topologicalSort undirected Unfeasible", () => {
    const graph = new UndirectedGraph();
    expect(() => Array.from(topologicalSort(graph))).toThrow(UnfeasibleError);
  });
});
