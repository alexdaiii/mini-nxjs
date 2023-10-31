import {beforeEach, describe, expect, test} from "@jest/globals";

import {DiGraph} from "@/DiGraph";

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
}

describe("DirectedGraph", () => {
  const directedGraphTest = new TestDirectedGraph();

  directedGraphTest.runGenericTests();
});
