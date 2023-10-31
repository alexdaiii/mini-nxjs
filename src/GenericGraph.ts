import {Map} from "immutable";

import {EdgeDoesNotExistError, VertexDoesNotExistError} from "@/GraphErrors";

/**
 * A generic graph that does not allow parallel edges, self loops,
 * or multiple edges.
 *
 * Behind the scenes, this graph is represented as an adjacency list
 * using immutable.js Map.
 *
 * To use objects as vertices, the object should have a valid implementation
 * of the equals() and hashCode() methods.
 * Objects should also include a valueOf() method that returns a primitive
 * value.
 *
 * @example
 * class Foo {
 *   private readonly a: number;
 *   private readonly b: number;
 *
 *   constructor(a: number, b: number) {
 *     this.a = a;
 *     this.b = b;
 *   }
 *
 *   equals(other: any) {
 *     if (!(other instanceof Foo)) return false;
 *
 *     return this.a == other.a;
 *   }
 *
 *   hashCode() {
 *     return this.a;
 *   }
 *
 *   valueOf() {
 *     return this.a + this.b;
 *   }
 * }
 * const g = new GenericGraph<Foo>();
 *
 * @template V the type of the vertices in the graph.
 */
export abstract class GenericGraph<V = unknown, E = unknown> {
  protected readonly _adj: Map<V, E>;

  /**
   * Constructs a new empty graph.
   * @protected
   */
  protected constructor() {
    // eslint-disable-next-line new-cap
    this._adj = Map<V, E>().asMutable();
  }

  /**
   * Returns an immutable copy of the adjacency list.
   */
  get adj() {
    return this._adj;
  }

  /**
   * Returns true if the graph is directed, false otherwise.
   */
  abstract isDirected(): boolean;

  /**
   * Returns an array of all the vertices in the graph.
   * @return {V[]} an array of all the vertices in the graph.
   */
  vertices(): V[] {
    return this._adj.keySeq().toArray();
  }

  /**
   * Returns an array of all the edges in the graph.
   * @return {[V, V][]} an array of all the edges in the graph.
   */
  abstract edges(): [V, V][];

  /**
   * Returns a string representation of the graph.
   * Just calls the toString() method of the underlying adjacency list.
   * @return {string} a string representation of the graph.
   */
  toString(): string {
    return this._adj.toString();
  }

  /**
   * Adds a vertex to the graph.
   * @param _v
   */
  abstract addVertex(_v: V): void;

  /**
   * Removes a vertex from the graph.
   * @param {V} v the vertex to remove.
   */
  removeVertex(v: V) {
    this.validateVertex(v);

    for (const w of this.neighbors(v)) {
      this.removeEdge(v, w);
    }

    this._adj.delete(v);
  }

  /**
   * Creates a new edge (v, w) in the graph.
   * @param {V} _v the source vertex.
   * @param {V} _w the destination vertex.
   */
  abstract addEdge(_v: V, _w: V): void;

  /**
   * Removes the edge (v, w) from the graph.
   * @param {V} _v the source vertex.
   * @param {V} _w the destination vertex.
   */
  abstract removeEdge(_v: V, _w: V): void;

  /**
   * Adds all the edges in the edge list to the graph
   * @param {Array.<Array.<V>>} edgeList the list of edges to add.
   */
  fromEdgeList(edgeList: V[][]) {
    for (let i = 0; i < edgeList.length; i++) {
      const [from, to] = edgeList[i];
      this.addEdge(from, to);
    }
  }

  /**
   * Adds all the edges in the path to the graph.
   * @param {V[]} path the path to add.
   */
  addPath(path: V[]) {
    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];
      this.addEdge(from, to);
    }
  }

  /**
   * Determines if there is a (v, w) edge in the graph.
   * @param {V} _v the source vertex.
   * @param {V} _w the destination vertex.
   */
  abstract hasEdge(_v: V, _w: V): boolean;

  /**
   * Determines if the graph contains the vertex v.
   * @param {V} v the vertex to check.\
   * @return {boolean} true if the graph contains the vertex v, false otherwise.
   */
  hasVertex(v: V): boolean {
    return this._adj.has(v);
  }

  /**
   * Returns the number of vertices in the graph.
   * @return {number} the number of vertices in the graph.
   */
  numberOfNodes(): number {
    return this._adj.size;
  }

  /**
   * Returns the number of edges in the graph.
   * @param {V} _v the vertex to check.
   * @return {number} the number of edges in the graph.
   */
  abstract neighbors(_v: V): V[];

  /**
   * Returns the number of edges incident to v.
   * @param {V} _v the vertex to check.
   * @return {number} the number of edges incident to v.
   */
  abstract inDegree(_v: V): number;

  /**
   * Returns the number of edges that leave v.
   * @param {V} _v the vertex to check.
   * @return {number} the number of edges that leave v.
   */
  abstract outDegree(_v: V): number;

  /**
   * Validates that the vertex v exists in the graph.
   * @param {V} v
   * @throws VertexDoesNotExistError if the vertex does not exist.
   */
  validateVertex(v: V) {
    if (!this.hasVertex(v)) {
      throw new VertexDoesNotExistError(v);
    }
  }

  /**
   * Validates that the edge (v, w) exists in the graph.
   * @param {V} v
   * @param {V} w
   * @throws EdgeDoesNotExistError if the edge does not exist.
   */
  validateEdge(v: V, w: V) {
    if (!this.hasEdge(v, w)) {
      throw new EdgeDoesNotExistError(v, w);
    }
  }
}
