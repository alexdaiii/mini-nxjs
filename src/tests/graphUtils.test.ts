import {describe, expect, test} from "@jest/globals";

import {DiGraph} from "@/DiGraph";
import {GenericGraph} from "@/GenericGraph";
import {UndirectedGraph} from "@/UndirectedGraph";
import {toDirected, toUndirected} from "@/graphUtils";

/**
 * Edges that anything to or from an undirected graph should have
 */
const undirectedEdges = {
  g1: {
    has: [
      [1, 2],
      [2, 1],
    ],
    notHave: [
      [1, 3],
      [3, 1],
      [2, 3],
      [3, 2],
    ],
  },
  g2: {
    has: [
      [0, 1],
      [1, 0],
      [1, 2],
      [2, 1],
      [1, 3],
      [3, 1],
      [2, 4],
      [4, 2],
      [3, 4],
      [4, 3],
    ],
    notHave: [
      [0, 2],
      [0, 3],
      [0, 4],
    ],
  },
};

/**
 * Edges that from directed graph to directed graph should have
 */
const directedEdges = {
  g1: {
    has: [[1, 2]],
    notHave: [[2, 1], ...undirectedEdges.g1.notHave],
  },
  g2: {
    has: [
      [0, 1],
      [2, 1],
      [1, 3],
      [4, 3],
      [2, 4],
    ],
    notHave: [[3, 1], [3, 4], [4, 2], ...undirectedEdges.g2.notHave],
  },
};

describe("test utility functions", () => {
  describe.each([
    [
      "toUndirected",
      {
        fn: toUndirected,
        fromDirected: undirectedEdges,
        fromUndirected: undirectedEdges,
      },
    ],
    [
      "toDirected",
      {
        fn: toDirected,
        fromDirected: directedEdges,
        fromUndirected: undirectedEdges,
      },
    ],
  ])("test %p", (_, {fn, fromDirected, fromUndirected}) => {
    test.each([
      [
        "directed",
        {
          graph: new DiGraph<number>(),
        },
      ],
      [
        "undirected",
        {
          graph: new UndirectedGraph<number>(),
        },
      ],
    ])("from %p empty graph", (_, {graph}) => {
      const g = fn(graph);
      expect(g.vertices()).toEqual([]);
      expect(g.edges()).toEqual([]);
    });

    test.each([
      [
        "directed",
        {
          graph: new DiGraph<number>(),
          edges: fromDirected,
        },
      ],
      [
        "undirected",
        {
          graph: new UndirectedGraph<number>(),
          edges: fromUndirected,
        },
      ],
    ])("from %p graph", (_, {graph, edges}) => {
      const checkEdges = (
        g: GenericGraph,
        has: number[][],
        notHave: number[][],
      ) => {
        for (let i = 0; i < has.length; i++) {
          const [u, v] = has[i];
          expect(g.hasEdge(u, v)).toBeTruthy();
        }
        for (let i = 0; i < notHave.length; i++) {
          const [u, v] = notHave[i];
          expect(g.hasEdge(u, v)).toBeFalsy();
        }
      };

      graph.addEdge(1, 2);
      graph.addVertex(3);

      const g1 = fn(graph);
      expect(g1.vertices().sort()).toEqual([1, 2, 3]);
      checkEdges(g1, edges.g1.has, edges.g1.notHave);

      graph.fromEdgeList([
        [0, 1],
        [2, 1],
        [1, 3],
        [4, 3],
        [2, 4],
      ]);
      const g2 = fn(graph);
      expect(g2.numberOfNodes()).toEqual(5);
      checkEdges(g2, edges.g2.has, edges.g2.notHave);
    });
  });
});
