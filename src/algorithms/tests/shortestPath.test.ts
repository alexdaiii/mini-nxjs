import {describe, expect, test} from "@jest/globals";

import {NoPathExistsError, VertexDoesNotExistError} from "@/GraphErrors";
import {hasPath, shortestPath} from "@/algorithms/shortestPath";
import {getDiGraph, getGraph, testAllGraphs} from "@/algorithms/tests/fixtures";

describe("hasPath", () => {
  describe.each(testAllGraphs())("test hasPath for graph %p", (_, fn) => {
    test("should throw VertexDoesNotExistError if vertex does not exist", () => {
      const graph = fn();
      expect(() => hasPath(graph, 0, 1)).toThrow(VertexDoesNotExistError);
    });

    test("should return true if path exists", () => {
      const graph = fn();
      graph.fromEdgeList([
        [0, 1],
        [1, 2],
        [3, 4],
      ]);
      expect(hasPath(graph, 0, 2)).toBeTruthy();
    });

    test("should return false if path does not exist", () => {
      const graph = fn();
      graph.fromEdgeList([
        [0, 1],
        [1, 2],
        [3, 4],
      ]);
      expect(hasPath(graph, 0, 4)).toBeFalsy();
    });
  });
});

describe("shortestPath", () => {
  describe.each(testAllGraphs())("test shortestPath for graph %p", (_, fn) => {
    test("should throw VertexDoesNotExistError if vertex does not exist", () => {
      const graph = fn();
      expect(() => shortestPath(graph, 0, 1)).toThrow(VertexDoesNotExistError);
      graph.addVertex(0);
      expect(() => shortestPath(graph, 0, 1)).toThrow(VertexDoesNotExistError);
    });

    test("should return empty array if shortest path to same vertex", () => {
      const graph = fn();
      graph.addVertex(0);
      expect(shortestPath(graph, 0, 0)).toEqual([]);
    });

    test("throws NoPathExistsError if no path exists", () => {
      const graph = fn();
      graph.fromEdgeList([
        [0, 1],
        [2, 3],
      ]);
      expect(() => shortestPath(graph, 0, 3)).toThrow(NoPathExistsError);
    });
  });

  test("cycle graph", () => {
    const dg = getDiGraph();
    const g = getGraph();

    const edges = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 0],
    ];

    dg.fromEdgeList(edges);
    g.fromEdgeList(edges);

    expect(shortestPath(dg, 0, 3)).toEqual([0, 1, 2, 3]);
    expect(shortestPath(dg, 0, 4)).toEqual([0, 1, 2, 3, 4]);

    expect(shortestPath(g, 0, 3)).toEqual([0, 1, 2, 3]);
    expect(shortestPath(g, 0, 4)).toEqual([0, 6, 5, 4]);
  });
});
