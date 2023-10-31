// istanbul ignore file
import {beforeEach, describe, expect, test} from "@jest/globals";

import {GenericGraph} from "@/GenericGraph";
import {EdgeDoesNotExistError, VertexDoesNotExistError} from "@/GraphErrors";
import {hasPath} from "@/algorithms/shortestPath";

export abstract class TestGenericGraph<T extends GenericGraph<number>> {
  abstract getGraph(): T;

  runGenericTests() {
    this.testEmpty();
    this.testAddVertex();
    this.testVertices();
    this.testRemoveVertex();
    this.testEdges();
    this.testAddEdge();
    this.testFromEdgeList();
    this.testRemoveEdge();
    this.testAddPathGeneric();
    this.testNeighbors();
    this.testDegreeGeneric();
    this.testAdjGetter();
    this.testToString();
  }

  testEmpty() {
    describe("test empty", () => {
      let graph: T;

      beforeEach(() => {
        graph = this.getGraph();
      });

      test("should have size 0", () => {
        expect(graph.numberOfNodes()).toBe(0);
      });

      test("should not have edge", () => {
        expect(() => graph.hasEdge(0, 1)).toThrow(VertexDoesNotExistError);
        expect(graph.edges()).toEqual([]);
      });

      test("should not have vertex", () => {
        expect(graph.hasVertex(0)).toBeFalsy();
        expect(graph.vertices()).toEqual([]);
      });
    });
  }

  testAddVertex() {
    describe("test addVertex", () => {
      let graph: T;

      beforeEach(() => {
        graph = this.getGraph();
      });

      test("should add vertex", () => {
        graph.addVertex(0);
        expect(graph.hasVertex(0)).toBeTruthy();
      });

      test("should not add vertex twice", () => {
        graph.addVertex(0);
        graph.addVertex(0);
        expect(graph.numberOfNodes()).toBe(1);
      });

      test("should be able to add multiple vertices", () => {
        graph.addVertex(0);
        graph.addVertex(1);
        graph.addVertex(2);
        expect(graph.numberOfNodes()).toBe(3);
      });
    });
  }

  testVertices() {
    describe("test vertices", () => {
      test("should return vertices", () => {
        const graph = this.getGraph();
        graph.addVertex(0);
        graph.addVertex(1);
        graph.addVertex(2);
        expect(new Set(graph.vertices())).toEqual(new Set([0, 1, 2]));
      });
    });
  }

  testRemoveVertex() {
    describe("test removeVertex", () => {
      test("should throw VertexDoesNotExistError if vertex does not exist", () => {
        const graph = this.getGraph();
        expect(() => graph.removeVertex(0)).toThrow(VertexDoesNotExistError);
      });

      test("should remove vertex", () => {
        const graph = this.getGraph();
        graph.addVertex(0);
        graph.removeVertex(0);
        expect(graph.hasVertex(0)).toBeFalsy();
      });

      test("should remove edges", () => {
        const graph = this.getGraph();
        graph.fromEdgeList([
          [0, 1],
          [0, 2],
        ]);
        graph.removeVertex(0);
        expect(hasPath(graph, 1, 2)).toBeFalsy();
      });
    });
  }

  abstract testEdges(): void;

  abstract addEdgeK5CompleteGraph(): [number, number][];
  abstract addEdgeGetTreeGraph(): [number, number][];
  abstract addEdgeTreeLeafNeighbors(): number[];

  testAddEdge() {
    describe("test addEdge", () => {
      let graph: T;

      beforeEach(() => {
        graph = this.getGraph();
      });

      test("should add edge", () => {
        graph.addEdge(0, 1);
        expect(graph.hasEdge(0, 1)).toBeTruthy();
      });

      test("should create vertices if they don't exist", () => {
        graph.addEdge(0, 1);
        expect(graph.numberOfNodes()).toBe(2);
      });

      test("should not add parallel edges", () => {
        graph.addEdge(0, 1);
        graph.addEdge(0, 1);
        expect(graph.neighbors(0)).toEqual([1]);
      });

      test("should not add self loops", () => {
        graph.addEdge(1, 1);
        expect(graph.neighbors(1)).toEqual([]);
      });

      test.each([
        [
          "Complete graph",
          {
            edge_list: this.addEdgeK5CompleteGraph(),
            size: 5,
            neighbors: [1, 2, 3, 4],
            vertex: 0,
          },
        ],
        [
          "Tree: root",
          {
            edge_list: this.addEdgeGetTreeGraph(),
            size: 8,
            neighbors: [1, 2, 4],
            vertex: 0,
          },
        ],
        [
          "Tree: leaf",
          {
            edge_list: this.addEdgeGetTreeGraph(),
            size: 8,
            neighbors: this.addEdgeTreeLeafNeighbors(),
            vertex: 5,
          },
        ],
      ])(
        "adding multiple edges & testing neighbors for graph: %p",
        (_, {edge_list, vertex, size, neighbors}) => {
          for (let i = 0; i < edge_list.length; i++) {
            const [from, to] = edge_list[i];
            graph.addEdge(from, to);
          }
          expect(graph.numberOfNodes()).toBe(size);
          expect(graph.neighbors(vertex)).toEqual(neighbors);
        },
      );
    });
  }

  testFromEdgeList() {
    describe("test fromEdgeList", () => {
      let graph: T;

      beforeEach(() => {
        graph = this.getGraph();
      });

      test("should add edges from edge list", () => {
        const edgeList = [
          [0, 1],
          [0, 2],
          [0, 3],
          [0, 4],
        ];
        graph.fromEdgeList(edgeList);
        expect(graph.numberOfNodes()).toBe(5);
      });

      test("should allow empty edge list", () => {
        const edgeList: [number, number][] = [];
        graph.fromEdgeList(edgeList);
        expect(graph.numberOfNodes()).toBe(0);
      });
    });
  }

  testRemoveEdge() {
    describe("test removeEdge", () => {
      let graph: T;

      beforeEach(() => {
        graph = this.getGraph();
      });

      test("should throw VertexDoesNotExistError if vertex does not exist", () => {
        expect(() => graph.removeEdge(0, 1)).toThrow(VertexDoesNotExistError);
      });

      test("should throw EdgeDoesNotExistError if edge does not exist", () => {
        graph.addVertex(0);
        graph.addVertex(1);
        expect(() => graph.removeEdge(0, 1)).toThrow(EdgeDoesNotExistError);
      });

      test("should remove edge", () => {
        graph.fromEdgeList([
          [0, 1],
          [0, 2],
        ]);
        graph.removeEdge(0, 1);
        expect(graph.hasEdge(0, 1)).toBeFalsy();
        expect(graph.hasEdge(0, 2)).toBeTruthy();
      });
    });
  }

  testAddPathGeneric() {
    describe("test addPath", () => {
      test("less than 2 vertices", () => {
        const graph = this.getGraph();
        graph.addPath([]);
        expect(graph.numberOfNodes()).toBe(0);
        expect(graph.edges()).toEqual([]);

        graph.addPath([0]);
        expect(graph.numberOfNodes()).toBe(0);
        expect(graph.edges()).toEqual([]);
      });

      this.testAddPath();
    });
  }

  abstract testAddPath(): void;

  testNeighbors() {
    describe("test neighbors", () => {
      let graph = this.getGraph();

      beforeEach(() => {
        graph = this.getGraph();
      });

      test("should throw VertexDoesNotExistError if vertex does not exist", () => {
        expect(() => graph.neighbors(0)).toThrow(VertexDoesNotExistError);
      });

      test("should return empty array if vertex has no neighbors", () => {
        graph.addVertex(0);
        expect(graph.neighbors(0)).toEqual([]);
      });
    });
  }

  testDegreeGeneric() {
    describe("test inDegree", () => {
      test("should throw VertexDoesNotExistError if vertex does not exist", () => {
        const graph = this.getGraph();
        expect(() => graph.inDegree(0)).toThrow(VertexDoesNotExistError);
      });

      test("should return 0 if vertex has no neighbors", () => {
        const graph = this.getGraph();
        graph.addVertex(0);
        expect(graph.inDegree(0)).toEqual(0);
      });

      this.testInDegree();
    });

    describe("test outDegree", () => {
      test("should throw VertexDoesNotExistError if vertex does not exist", () => {
        const graph = this.getGraph();
        expect(() => graph.outDegree(0)).toThrow(VertexDoesNotExistError);
      });

      test("should return 0 if vertex has no neighbors", () => {
        const graph = this.getGraph();
        graph.addVertex(0);
        expect(graph.outDegree(0)).toEqual(0);
      });

      this.testOutDegree();
    });
  }

  abstract testInDegree(): void;
  abstract testOutDegree(): void;

  testAdjGetter() {
    describe("test adj getter", () => {
      test("should return empty map if no vertices", () => {
        const graph = this.getGraph();
        expect(graph.adj.size).toBe(0);
      });

      test("can be edited after getting", () => {
        const graph = this.getGraph();
        graph.fromEdgeList([
          [0, 1],
          [1, 2],
          [2, 3],
        ]);
        let adj = graph.adj;
        expect(adj.size).toBe(4);
        expect(graph.adj.size).toBe(4);

        graph.addEdge(4, 5);

        expect(graph.adj.size).toBe(6);
        expect(adj.size).toBe(6);
      });
    });
  }

  testToString() {
    describe("test toString", () => {
      test("should not return [object Object]", () => {
        const graph = this.getGraph();
        expect(`${graph}`).not.toBe("[object Object]");
      });

      test("should return the same as adj", () => {
        const graph = this.getGraph();
        expect(`${graph}`).toBe(graph.adj.toString());

        graph.fromEdgeList([
          [0, 1],
          [1, 2],
          [2, 3],
        ]);
        expect(`${graph}`).toBe(graph.adj.toString());
      });
    });
  }
}
