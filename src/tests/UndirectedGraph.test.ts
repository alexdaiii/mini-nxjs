import {describe, expect, test} from "@jest/globals";

import {UnfeasibleError} from "@/GraphErrors";
import {UndirectedGraph} from "@/UndirectedGraph";
import {Tuple} from "@/utils";

import {TestGenericGraph} from "./GenericGraphTest";

class TestUndirectedGraph extends TestGenericGraph<UndirectedGraph<number>> {
  getGraph(): UndirectedGraph<number> {
    return new UndirectedGraph<number>();
  }
  addEdgeK5CompleteGraph(): [number, number][] {
    return [
      [1, 4],
      [2, 3],
      [2, 4],
      [4, 3],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [1, 2],
      [1, 3],
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
    return [4];
  }

  testAddEdge() {
    super.testAddEdge();

    describe("test addEdge undirected", () => {
      test("edge is directed", () => {
        const graph = this.getGraph();
        graph.addEdge(1, 2);
        expect(graph.hasEdge(2, 1)).toBeTruthy();
        expect(graph.hasEdge(1, 2)).toBeTruthy();
      });
    });
  }

  testEdges(): void {
    describe("test edges", () => {
      test("empty graph", () => {
        const graph = this.getGraph();
        expect(graph.edges()).toEqual([]);
      });

      test("complete graph", async () => {
        const Set = (await import("immutable")).Set;

        const graph = this.getGraph();
        graph.fromEdgeList(this.addEdgeK5CompleteGraph());
        // K5 has 10 edges
        expect(graph.edges().length).toBe(10);

        const edges = Set(
          graph.edges().map(([u, v]) => {
            if (u < v) return Tuple(u, v);
            else return Tuple(v, u);
          }),
        );
        const expectedEdges = Set(
          this.addEdgeK5CompleteGraph().map(([u, v]) => {
            if (u < v) return Tuple(u, v);
            else return Tuple(v, u);
          }),
        );

        expect(edges.equals(expectedEdges)).toBeTruthy();
      });
    });
  }

  testAddPath() {
    test("add path", () => {
      const graph = this.getGraph();
      graph.addPath([1, 2, 3, 4]);
      expect(graph.hasEdge(1, 2)).toBeTruthy();
      expect(graph.hasEdge(2, 1)).toBeTruthy();
      expect(graph.hasEdge(2, 3)).toBeTruthy();
      expect(graph.hasEdge(3, 2)).toBeTruthy();
      expect(graph.hasEdge(3, 4)).toBeTruthy();
      expect(graph.hasEdge(4, 3)).toBeTruthy();
    });
  }

  shortestCycleGraphTest(graph: UndirectedGraph<number>): void {
    expect(graph.shortestPath(0, 3)).toEqual([0, 1, 2, 3]);
    expect(graph.shortestPath(0, 4)).toEqual([0, 6, 5, 4]);
  }

  testBFS(): void {
    test("disconnected graph undirected", () => {
      const graph = this.getGraph();
      graph.fromEdgeList([
        [0, 1],
        [2, 3],
      ]);
      const x = Array.from(graph.bfsEdges(1));
      expect(x).toEqual([[1, 0]]);
    });

    test("test undirected BFS", () => {
      const graph = this.getGraph();
      graph.fromEdgeList([
        [0, 1],
        [1, 2],
        [1, 3],
        [2, 4],
        [3, 4],
      ]);
      const x = Array.from(graph.bfsEdges(0));
      expect(x).toEqual([
        [0, 1],
        [1, 2],
        [1, 3],
        [2, 4],
      ]);
    });
  }

  testDFS(): void {
    test("disconnected graph undirected", () => {
      const graph = this.getGraph();
      graph.fromEdgeList([
        [0, 1],
        [2, 3],
      ]);
      const x = Array.from(graph.dfsEdges(1));
      expect(x).toEqual([[1, 0]]);
    });

    test("test undirected DFS", () => {
      const graph = this.getGraph();
      graph.fromEdgeList([
        [0, 1],
        [1, 2],
        [1, 3],
        [2, 4],
        [3, 0],
        [0, 4],
      ]);

      const x = Array.from(graph.dfsEdges(0));

      const possibleDFS = [
        [
          [0, 1],
          [1, 2],
          [2, 4],
          [1, 3],
        ],
        [
          [0, 1],
          [1, 3],
          [1, 2],
          [2, 4],
        ],
        [
          [0, 4],
          [4, 2],
          [2, 1],
          [1, 3],
        ],
        [
          [0, 3],
          [3, 1],
          [1, 2],
          [2, 4],
        ],
      ];

      expect(possibleDFS).toContainEqual(x);
    });
  }

  testEdgeBFS(): void {
    test("test single source", () => {
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
        [0, 2],
        [1, 2],
        [1, 3],
      ]);
    });
  }

  testInDegree(): void {
    test("test undirected inDegree", () => {
      const graph = this.getGraph();
      graph.fromEdgeList([
        [0, 1],
        [1, 2],
        [0, 2],
        [4, 5],
        [4, 6],
        [4, 7],
      ]);
      expect(graph.inDegree(0)).toBe(2);
      expect(graph.inDegree(1)).toBe(2);
      expect(graph.inDegree(2)).toBe(2);

      expect(graph.inDegree(4)).toBe(3);
      expect(graph.inDegree(5)).toBe(1);
      expect(graph.inDegree(6)).toBe(1);
    });
  }

  testOutDegree(): void {
    test("test undirected outDegree", () => {
      const graph = this.getGraph();
      graph.fromEdgeList([
        [0, 1],
        [1, 2],
        [0, 2],
        [4, 5],
        [4, 6],
        [4, 7],
      ]);
      expect(graph.outDegree(0)).toBe(2);
      expect(graph.outDegree(1)).toBe(2);
      expect(graph.outDegree(2)).toBe(2);

      expect(graph.outDegree(4)).toBe(3);
      expect(graph.outDegree(5)).toBe(1);
      expect(graph.outDegree(6)).toBe(1);
    });
  }

  runUndirectedTests(): void {
    this.testDAG();
  }

  testDAG() {
    describe("test DAG", () => {
      test("isDAG", () => {
        const graph = this.getGraph();
        expect(graph.isDirectedAcyclicGraph()).toBeFalsy();
      });

      test("topologicalSort", () => {
        const graph = this.getGraph();
        expect(() => Array.from(graph.topologicalSort())).toThrow(
          UnfeasibleError,
        );
      });
    });
  }
}

describe("UndirectedGraph", () => {
  const undirectedGraphTest = new TestUndirectedGraph();

  undirectedGraphTest.runGenericTests();
  undirectedGraphTest.runUndirectedTests();
});
