import {describe, expect, test} from "@jest/globals";

import {VertexDoesNotExistError} from "@/GraphErrors";
import {getDiGraph, getGraph, testAllGraphs} from "@/algorithms/tests/fixtures";
import {bfsEdges, dfsEdges, edgeBfs} from "@/algorithms/traversal";

describe("BFS", () => {
  describe.each(testAllGraphs())("test bfs generic on graph %p", (_, fn) => {
    test("should throw VertexDoesNotExistError if vertex does not exist", () => {
      const graph = fn();

      expect(() => Array.from(bfsEdges(graph, 0))).toThrow(
        VertexDoesNotExistError,
      );
    });

    test("should return empty array if vertex has no neighbors", () => {
      const graph = fn();
      graph.addVertex(0);
      expect(Array.from(bfsEdges(graph, 0))).toEqual([]);
    });

    test("test disconnected", () => {
      const graph = fn();
      graph.fromEdgeList([
        [0, 1],
        [2, 3],
      ]);
      const x = Array.from(bfsEdges(graph, 0));
      const x_ = [[0, 1]];
      expect(x).toEqual(x_);
    });
  });

  describe("bfs", () => {
    test("disconnected graph directed", () => {
      const graph = getDiGraph();
      graph.fromEdgeList([
        [0, 1],
        [2, 3],
      ]);
      const x = Array.from(bfsEdges(graph, 1));
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
      const graph = getDiGraph();
      graph.fromEdgeList(edges);
      const x = Array.from(bfsEdges(graph, 0));
      const x_ = [
        [0, 1],
        [1, 2],
        [1, 3],
        [2, 4],
      ];
      expect(x).toEqual(x_);
    });

    test("disconnected graph undirected", () => {
      const graph = getGraph();
      graph.fromEdgeList([
        [0, 1],
        [2, 3],
      ]);
      const x = Array.from(bfsEdges(graph, 1));
      expect(x).toEqual([[1, 0]]);
    });

    test("test undirected BFS", () => {
      const graph = getGraph();
      graph.fromEdgeList([
        [0, 1],
        [1, 2],
        [1, 3],
        [2, 4],
        [3, 4],
      ]);
      const x = Array.from(bfsEdges(graph, 0));
      expect(x).toEqual([
        [0, 1],
        [1, 2],
        [1, 3],
        [2, 4],
      ]);
    });
  });
});

describe("DFS", () => {
  describe.each(testAllGraphs())("test dfs generic on graph %p", (_, fn) => {
    test("should throw VertexDoesNotExistError if vertex does not exist", () => {
      const graph = fn();
      expect(() => Array.from(dfsEdges(graph, 0))).toThrow(
        VertexDoesNotExistError,
      );
    });

    test("should return empty array if vertex has no neighbors", () => {
      const graph = fn();
      graph.addVertex(0);
      expect(Array.from(dfsEdges(graph, 0))).toEqual([]);
    });

    test("test disconnected", () => {
      const graph = fn();
      graph.fromEdgeList([
        [0, 1],
        [2, 3],
      ]);
      const x = Array.from(dfsEdges(graph, 0));
      const x_ = [[0, 1]];
      expect(x).toEqual(x_);
    });
  });

  describe("dfs", () => {
    test("disconnected graph directed", () => {
      const graph = getDiGraph();
      graph.fromEdgeList([
        [0, 1],
        [2, 3],
      ]);
      const x = Array.from(dfsEdges(graph, 1));
      expect(x).toEqual([]);
    });

    test("test directed DFS", () => {
      const g = getDiGraph();
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

      const dfs = Array.from(dfsEdges(g, 0));
      expect(validDFS).toContainEqual(dfs);
    });

    test("disconnected graph undirected", () => {
      const graph = getGraph();
      graph.fromEdgeList([
        [0, 1],
        [2, 3],
      ]);
      const x = Array.from(dfsEdges(graph, 1));
      expect(x).toEqual([[1, 0]]);
    });

    test("test undirected DFS", () => {
      const graph = getGraph();
      graph.fromEdgeList([
        [0, 1],
        [1, 2],
        [1, 3],
        [2, 4],
        [3, 0],
        [0, 4],
      ]);

      const x = Array.from(dfsEdges(graph, 0));

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
  });
});

describe("EdgeBFS", () => {
  describe.each(testAllGraphs())(
    "test edgeBfs generic on graph %p",
    (_, fn) => {
      test("should throw VertexDoesNotExistError if vertex does not exist", () => {
        const graph = fn();
        expect(() => Array.from(edgeBfs(graph, 0))).toThrow(
          VertexDoesNotExistError,
        );
      });

      test("should return empty array if vertex has no neighbors", () => {
        const graph = fn();
        graph.addVertex(0);
        expect(Array.from(edgeBfs(graph, 0))).toEqual([]);
      });

      test("test disconnected", () => {
        const graph = fn();
        graph.fromEdgeList([
          [0, 1],
          [2, 3],
        ]);
        const x = Array.from(edgeBfs(graph, 0));
        expect(x).toEqual([[0, 1]]);
      });
    },
  );

  describe("edgeBfs", () => {
    test("test digraph", async () => {
      const graph = getDiGraph();
      const edgeList = [
        [0, 1],
        [1, 2],
        [1, 3],
        [2, 4],
        [4, 3],
      ];
      graph.fromEdgeList(edgeList);

      expect(Array.from(edgeBfs(graph, 4))).toEqual([[4, 3]]);

      const x = Array.from(edgeBfs(graph, 0));
      expect(x.length).toBe(edgeList.length);

      expect(x[0]).toEqual([0, 1]);
      expect(x.slice(1, 3)).toContainEqual([1, 2]);
      expect(x.slice(1, 3)).toContainEqual([1, 3]);
      expect(x[3]).toEqual([2, 4]);
      expect(x[4]).toEqual([4, 3]);
    });

    test("test digraph2", () => {
      const graph = getDiGraph();
      graph.addPath([0, 1, 2, 3]);
      const x = Array.from(edgeBfs(graph, 0));
      expect(x).toEqual([
        [0, 1],
        [1, 2],
        [2, 3],
      ]);
    });

    test("test digraph3", () => {
      const graph = getDiGraph();
      // [(0, 1), (1, 0), (1, 0), (2, 0), (2, 1), (3, 1)]
      graph.fromEdgeList([
        [0, 1],
        [1, 0],
        [1, 0],
        [2, 0],
        [2, 1],
        [3, 1],
      ]);

      expect(Array.from(edgeBfs(graph, 0))).toEqual([
        [0, 1],
        [1, 0],
      ]);

      expect(Array.from(edgeBfs(graph, 1))).toEqual([
        [1, 0],
        [0, 1],
      ]);

      const x = Array.from(edgeBfs(graph, 2));
      expect(x.length).toBe(4);
      expect(x.slice(0, 2)).toContainEqual([2, 0]);
      expect(x.slice(0, 2)).toContainEqual([2, 1]);
      expect(x.slice(2, 4)).toContainEqual([1, 0]);
      expect(x.slice(2, 4)).toContainEqual([0, 1]);
    });

    test("test single source", () => {
      const graph = getGraph();
      // [(0, 1), (1, 0), (1, 0), (2, 0), (2, 1), (3, 1)]
      graph.fromEdgeList([
        [0, 1],
        [1, 0],
        [1, 0],
        [2, 0],
        [2, 1],
        [3, 1],
      ]);

      expect(Array.from(edgeBfs(graph, 0))).toEqual([
        [0, 1],
        [0, 2],
        [1, 2],
        [1, 3],
      ]);
    });
  });
});
