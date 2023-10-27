import {Map, Set, is} from "immutable";
import Queue from "yocto-queue";

import {
  EdgeDoesNotExistError,
  NoPathExistsError,
  VertexDoesNotExistError,
} from "@/GraphErrors";
import {Tuple} from "@/utils";

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
 * Example:
 *
 * ```[typescript]
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
 * ```
 */
export abstract class GenericGraph<V = never, E = never> {
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
    return this._adj.asImmutable();
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
   * @param v the vertex to add.
   */
  abstract addVertex(v: V): void;

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
   * @param {V} v the source vertex.
   * @param {V} w the destination vertex.
   */
  abstract addEdge(v: V, w: V): void;

  /**
   * Removes the edge (v, w) from the graph.
   * @param {V} v the source vertex.
   * @param {V} w the destination vertex.
   */
  abstract removeEdge(v: V, w: V): void;

  /**
   * Adds all the edges in the edge list to the graph.
   * @param {[V, V][]} edgeList the list of edges to add.
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
   * @param {V} v the source vertex.
   * @param {V} w the destination vertex.
   */
  abstract hasEdge(v: V, w: V): boolean;

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
   * @param {V} v the vertex to check.
   * @return {number} the number of edges in the graph.
   */
  abstract neighbors(v: V): V[];

  /**
   * Returns the number of edges incident to v.
   * @param {V} v the vertex to check.
   * @return {number} the number of edges incident to v.
   */
  abstract inDegree(v: V): number;

  /**
   * Returns the number of edges that leave v.
   * @param {V} v the vertex to check.
   * @return {number} the number of edges that leave v.
   */
  abstract outDegree(v: V): number;

  /**
   * Generator that yields the edges in the graph from a DFS starting at v.
   * @param {V} v the vertex to start the DFS at.
   */
  *dfsEdges(v: V): Generator<[V, V]> {
    this.validateVertex(v);

    const stack: [V | null, V][] = [[null, v]];
    // eslint-disable-next-line new-cap
    const visited = Set<V>().asMutable();

    while (stack.length > 0) {
      const [parent, child] = stack.pop()!;
      if (visited.has(child)) continue;

      visited.add(child);

      if (parent !== null) {
        yield [parent, child];
      }

      const neighbors = this.neighbors(child);
      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];
        if (!visited.has(neighbor)) {
          stack.push([child, neighbor]);
        }
      }
    }
  }

  /**
   * Determines if there is a path from v to w.
   * @param {V} v
   * @param {V} w
   * @return {boolean} true if there is a path from v to w, false otherwise.
   */
  hasPath(v: V, w: V): boolean {
    this.validateVertex(v);
    this.validateVertex(w);

    for (const [_curr, neigh] of this.dfsEdges(v)) {
      if (is(neigh, w)) return true;
    }

    return false;
  }

  /**
   * Generator that yields the edges in the graph from a BFS starting at v.
   * Stops once all vertices have been visited.
   * @param {V} v the vertex to start the BFS at.
   */
  *bfsEdges(v: V): Generator<[V, V]> {
    this.validateVertex(v);

    const queue = new Queue<V>();
    // eslint-disable-next-line new-cap
    const visited = Set<V>().asMutable();

    queue.enqueue(v);
    visited.add(v);

    while (queue.size > 0) {
      const node = queue.dequeue()!;

      const neighbors = this.neighbors(node);
      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];
        if (!visited.has(neighbor)) {
          yield [node, neighbor];
          queue.enqueue(neighbor);
          visited.add(neighbor);
        }
      }
    }
  }

  /**
   * Computes the shortest path from v to w. If no such path exists,
   * raises an error.
   * @param {V} v the source vertex.
   * @param {V} w the destination vertex.
   * @return {V[]} an array of vertices representing the shortest path from
   * v to w.
   */
  shortestPath(v: V, w: V): V[] {
    this.validateVertex(v);
    this.validateVertex(w);

    if (is(v, w)) return [];

    // eslint-disable-next-line new-cap
    const prev = Map<V, V>().asMutable();

    for (const [curr, neigh] of this.bfsEdges(v)) {
      prev.set(neigh, curr);
      if (neigh === w) break;
    }

    if (!prev.has(w)) {
      throw new NoPathExistsError();
    }

    const path = [w];
    let curr = w;
    while (!is(curr, v)) {
      curr = prev.get(curr)!;
      path.push(curr);
    }

    return path.reverse();
  }

  /**
   * Similar to bfs_edges, in that it returns edges in BFS order from a source.
   * However, it differs in that it stops
   * once all the edges in the connected component containing v have been
   * visited.
   * @param {V} v the vertex to start the BFS at.
   */
  *edgeBfs(v: V): Generator<[V, V]> {
    this.validateVertex(v);

    const getEdge = (u: V, v: V) => {
      if (this.isDirected()) {
        // eslint-disable-next-line new-cap
        return Tuple(u, v);
      }

      // if undirected, return the edge in sorted order so that
      // (u, v) and (v, u) are the same edge
      if (u < v) {
        // eslint-disable-next-line new-cap
        return Tuple(u, v);
      }
      // eslint-disable-next-line new-cap
      return Tuple(v, u);
    };

    const queue = new Queue<V>();
    // eslint-disable-next-line new-cap
    const visitedEdges = Set<Tuple<V>>().asMutable();

    queue.enqueue(v);

    while (queue.size > 0) {
      const node = queue.dequeue()!;

      const neighbors = this.neighbors(node);
      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];

        const edge = getEdge(node, neighbor);
        if (!visitedEdges.has(edge)) {
          yield [node, neighbor];
          queue.enqueue(neighbor);
          visitedEdges.add(edge);
        }
      }
    }
  }

  /**
   * Validates that the edge (v, w) exists in the graph.
   * @param {V} v
   * @param {V} w
   * @protected
   */
  protected validateEdge(v: V, w: V) {
    if (!this.hasEdge(v, w)) {
      throw new EdgeDoesNotExistError(v, w);
    }
  }

  /**
   * Validates that the vertex v exists in the graph.
   * @param {V} v
   * @protected
   */
  protected validateVertex(v: V) {
    if (!this.hasVertex(v)) {
      throw new VertexDoesNotExistError(v);
    }
  }
}
