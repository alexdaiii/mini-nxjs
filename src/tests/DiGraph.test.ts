import {beforeEach, describe, expect, test} from "@jest/globals";

import {DiGraph} from "@/DiGraph";
import {
  GraphChangedDuringIterationError,
  GraphContainsCycleError,
} from "@/GraphErrors";

import {TestGenericGraph} from "./GenericGraphTest";

class TestDirectedGraph extends TestGenericGraph<DiGraph<number>> {
  getGraph(): DiGraph<number> {
    return new DiGraph<number>();
  }

  testEdges() {
    describe("test edges", () => {
      test("should return edges", () => {
        const graph = this.getGraph();
        graph.addVertex(0);
        graph.addVertex(1);
        graph.addVertex(2);
        graph.addEdge(0, 1);
        graph.addEdge(1, 2);
        expect(new Set(graph.edges())).toEqual(
          new Set([
            [0, 1],
            [1, 2],
          ]),
        );
      });
    });
  }

  addEdgeK5CompleteGraph(): [number, number][] {
    return [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [1, 0],
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 0],
      [2, 1],
      [2, 3],
      [2, 4],
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 4],
      [4, 0],
      [4, 1],
      [4, 2],
      [4, 3],
    ];
  }

  addEdgeGetTreeGraph(): [number, number][] {
    return [
      [0, 1],
      [0, 2],
      [0, 4],
      [2, 3],
      [4, 5],
      [4, 6],
      [6, 7],
    ];
  }

  addEdgeTreeLeafNeighbors(): number[] {
    return [];
  }

  testAddEdge() {
    super.testAddEdge();

    describe("test addEdge directed", () => {
      let graph: DiGraph<number>;

      beforeEach(() => {
        graph = this.getGraph();
      });

      test("edge is directed", () => {
        graph.addEdge(1, 2);
        expect(graph.hasEdge(2, 1)).toBeFalsy();
        expect(graph.hasEdge(1, 2)).toBeTruthy();
      });
    });
  }

  testAddPath() {
    test("add path", () => {
      const graph = this.getGraph();
      graph.addPath([1, 2, 3, 4]);
      expect(graph.hasEdge(1, 2)).toBeTruthy();
      expect(graph.hasEdge(2, 3)).toBeTruthy();
      expect(graph.hasEdge(3, 4)).toBeTruthy();

      expect(graph.hasEdge(2, 1)).toBeFalsy();
      expect(graph.hasEdge(3, 2)).toBeFalsy();
      expect(graph.hasEdge(4, 3)).toBeFalsy();
    });
  }

  testInDegree() {
    test("test digraph inDegree", () => {
      const graph = this.getGraph();
      graph.fromEdgeList([
        [0, 1],
        [1, 2],
        [0, 2],
      ]);
      expect(graph.inDegree(0)).toBe(0);
      expect(graph.inDegree(1)).toBe(1);
      expect(graph.inDegree(2)).toBe(2);
    });
  }

  testOutDegree() {
    test("test digraph outDegree", () => {
      const graph = this.getGraph();
      graph.fromEdgeList([
        [0, 1],
        [1, 2],
        [0, 2],
      ]);
      expect(graph.outDegree(0)).toBe(2);
      expect(graph.outDegree(1)).toBe(1);
      expect(graph.outDegree(2)).toBe(0);
    });
  }

  testBFS() {
    test("disconnected graph directed", () => {
      const graph = this.getGraph();
      graph.fromEdgeList([
        [0, 1],
        [2, 3],
      ]);
      const x = Array.from(graph.bfsEdges(1));
      expect(x).toEqual([]);
    });

    test("test_digraph", () => {
      const edges = [
        [0, 1],
        [1, 2],
        [1, 3],
        [2, 4],
        [3, 4],
      ];
      const graph = new DiGraph<number>();
      graph.fromEdgeList(edges);
      const x = Array.from(graph.bfsEdges(0));
      const x_ = [
        [0, 1],
        [1, 2],
        [1, 3],
        [2, 4],
      ];
      expect(x).toEqual(x_);
    });
  }

  testDFS() {
    test("disconnected graph directed", () => {
      const graph = this.getGraph();
      graph.fromEdgeList([
        [0, 1],
        [2, 3],
      ]);
      const x = Array.from(graph.dfsEdges(1));
      expect(x).toEqual([]);
    });

    test("test directed DFS", () => {
      const g = this.getGraph();
      g.fromEdgeList([
        [0, 1],
        [1, 2],
        [1, 3],
        [2, 4],
        [3, 0],
      ]);

      const validDFS = [
        [
          [0, 1],
          [1, 3],
          [1, 2],
          [2, 4],
        ],
        [
          [0, 1],
          [1, 2],
          [2, 4],
          [1, 3],
        ],
      ];

      const dfs = Array.from(g.dfsEdges(0));
      expect(validDFS).toContainEqual(dfs);
    });
  }
  testEdgeBFS(): void {
    test("test digraph", async () => {
      const graph = this.getGraph();
      const edgeList = [
        [0, 1],
        [1, 2],
        [1, 3],
        [2, 4],
        [4, 3],
      ];
      graph.fromEdgeList(edgeList);

      expect(Array.from(graph.edgeBfs(4))).toEqual([[4, 3]]);

      const x = Array.from(graph.edgeBfs(0));
      expect(x.length).toBe(edgeList.length);

      expect(x[0]).toEqual([0, 1]);
      expect(x.slice(1, 3)).toContainEqual([1, 2]);
      expect(x.slice(1, 3)).toContainEqual([1, 3]);
      expect(x[3]).toEqual([2, 4]);
      expect(x[4]).toEqual([4, 3]);
    });

    test("test digraph2", () => {
      const graph = this.getGraph();
      graph.addPath([0, 1, 2, 3]);
      const x = Array.from(graph.edgeBfs(0));
      expect(x).toEqual([
        [0, 1],
        [1, 2],
        [2, 3],
      ]);
    });

    test("test digraph3", () => {
      const graph = this.getGraph();
      // [(0, 1), (1, 0), (1, 0), (2, 0), (2, 1), (3, 1)]
      graph.fromEdgeList([
        [0, 1],
        [1, 0],
        [1, 0],
        [2, 0],
        [2, 1],
        [3, 1],
      ]);

      expect(Array.from(graph.edgeBfs(0))).toEqual([
        [0, 1],
        [1, 0],
      ]);

      expect(Array.from(graph.edgeBfs(1))).toEqual([
        [1, 0],
        [0, 1],
      ]);

      const x = Array.from(graph.edgeBfs(2));
      expect(x.length).toBe(4);
      expect(x.slice(0, 2)).toContainEqual([2, 0]);
      expect(x.slice(0, 2)).toContainEqual([2, 1]);
      expect(x.slice(2, 4)).toContainEqual([1, 0]);
      expect(x.slice(2, 4)).toContainEqual([0, 1]);
    });
  }

  runDirectedTests() {
    this.testTopologicalSort();
    this.testDAG();
  }

  /**
   * Similar to tests from networkx.algorithms.dag.test_dag.TestDAG
   */
  testTopologicalSort() {
    describe("test topological sort", () => {
      test("test_topological_sort1", () => {
        const graph = new DiGraph<number>();
        graph.fromEdgeList([
          [1, 2],
          [1, 3],
          [2, 3],
        ]);
        expect(Array.from(graph.topologicalSort())).toEqual([1, 2, 3]);

        graph.addEdge(3, 2);

        expect(() => Array.from(graph.topologicalSort())).toThrow(
          GraphContainsCycleError,
        );

        graph.removeEdge(2, 3);

        expect(Array.from(graph.topologicalSort())).toEqual([1, 3, 2]);

        graph.removeEdge(3, 2);

        const x = Array.from(graph.topologicalSort());
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

        expect(() => Array.from(graph.topologicalSort())).toThrow(
          GraphContainsCycleError,
        );

        expect(graph.isDirectedAcyclicGraph()).toBeFalsy();

        graph.removeEdge(1, 2);

        expect(graph.isDirectedAcyclicGraph()).toBeTruthy();
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
            expect(dg.hasPath(v, u)).toBeFalsy();
          }
        };

        validate(Array.from(dg.topologicalSort()));

        // add edge from leaf 14 to root 1
        dg.addEdge(14, 1);
        expect(() => Array.from(dg.topologicalSort())).toThrow(
          GraphContainsCycleError,
        );
      });

      test("test_topological_sort5", () => {
        const graph = new DiGraph<number>();
        graph.addEdge(0, 1);
        expect(Array.from(graph.topologicalSort())).toEqual([0, 1]);
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
          for (const x of dg.topologicalSort()) {
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
          for (const _ of dg.topologicalSort()) {
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
          for (const _ of dg.topologicalSort()) {
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
  }

  testDAG() {
    describe("test DAG", () => {
      test("complete graph K2 is not a directed acyclic graph", () => {
        const graph = new DiGraph<number>();
        graph.fromEdgeList([
          [0, 1],
          [1, 0],
        ]);
        expect(graph.isDirectedAcyclicGraph()).toBeFalsy();
      });

      test("complete graph K3 is not a directed acyclic graph", () => {
        const graph = new DiGraph<number>();
        graph.fromEdgeList([
          [3, 4],
          [4, 3],
          [4, 5],
          [5, 4],
        ]);
        expect(graph.isDirectedAcyclicGraph()).toBeFalsy();
      });

      test("empty graph is a directed acyclic graph", () => {
        const graph = new DiGraph<number>();
        expect(graph.isDirectedAcyclicGraph()).toBeTruthy();
      });

      test("single node is a directed acyclic graph", () => {
        const graph = new DiGraph<number>();
        graph.addVertex(0);
        expect(graph.isDirectedAcyclicGraph()).toBeTruthy();
      });

      test("graph with no cycles is a directed acyclic graph", () => {
        const graph = new DiGraph<number>();
        graph.fromEdgeList([
          [3, 4],
          [4, 5],
        ]);
        expect(graph.isDirectedAcyclicGraph()).toBeTruthy();
      });
    });
  }

  shortestCycleGraphTest(graph: DiGraph<number>) {
    expect(graph.shortestPath(0, 3)).toEqual([0, 1, 2, 3]);
    expect(graph.shortestPath(0, 4)).toEqual([0, 1, 2, 3, 4]);
  }
}

describe("DirectedGraph", () => {
  const directedGraphTest = new TestDirectedGraph();

  directedGraphTest.runGenericTests();
  directedGraphTest.runDirectedTests();
});
