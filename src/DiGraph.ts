import {is} from "immutable";

import {GenericGraph} from "@/GenericGraph";
import {
  GraphChangedDuringIterationError,
  GraphContainsCycleError,
  UnfeasibleError,
} from "@/GraphErrors";

/**
 * An unweighted directed graph that does not allow parallel edges
 */
export class DiGraph<V = unknown> extends GenericGraph<
  V,
  {
    inVtx: Set<V>;
    outVtx: Set<V>;
  }
> {
  /**
   * Constructs a new empty DiGraph.
   */
  constructor() {
    super();
  }

  /**
   * @inheritDoc
   */
  isDirected(): boolean {
    return true;
  }

  /**
   * @inheritDoc
   */
  edges(): [V, V][] {
    const edges: [V, V][] = [];
    for (const [v, {outVtx}] of this._adj) {
      for (const w of outVtx) {
        edges.push([v, w]);
      }
    }
    return edges;
  }

  /**
   * @inheritDoc
   */
  addVertex(v: V): void {
    if (!this._adj.has(v)) {
      this._adj.set(v, {inVtx: new Set(), outVtx: new Set()});
    }
  }

  /**
   * @inheritDoc
   */
  addEdge(v: V, w: V): void {
    if (!this._adj.has(v)) {
      this._adj.set(v, {inVtx: new Set(), outVtx: new Set()});
    }
    if (!this._adj.has(w)) {
      this._adj.set(w, {inVtx: new Set(), outVtx: new Set()});
    }

    if (is(w, v)) return;

    this._adj.get(v)!.outVtx.add(w);
    this._adj.get(w)!.inVtx.add(v);
  }

  /**
   * @inheritDoc
   */
  removeEdge(v: V, w: V) {
    this.validateEdge(v, w);

    this._adj.get(v)!.outVtx.delete(w);
    this._adj.get(w)!.inVtx.delete(v);
  }

  /**
   * @inheritDoc
   */
  hasEdge(v: V, w: V): boolean {
    this.validateVertex(v);
    this.validateVertex(w);
    return this._adj.get(v)!.outVtx.has(w) && this._adj.get(w)!.inVtx.has(v);
  }

  /**
   * @inheritDoc
   */
  neighbors(v: V): V[] {
    this.validateVertex(v);
    return Array.from(this._adj.get(v)!.outVtx);
  }

  /**
   * @inheritDoc
   */
  inDegree(v: V): number {
    this.validateVertex(v);
    return this._adj.get(v)!.inVtx.size;
  }

  /**
   * @inheritDoc
   */
  outDegree(v: V): number {
    this.validateVertex(v);
    return this._adj.get(v)!.outVtx.size;
  }

  /**
   * Determines if the graph is a directed acyclic graph.
   * @return {boolean} true if the graph is a directed acyclic graph,
   * false otherwise.
   */
  isDirectedAcyclicGraph(): boolean {
    if (!this.isDirected()) return false;

    try {
      Array.from(this.topologicalGenerations());
      return true;
    } catch (e) {
      if (e instanceof GraphContainsCycleError) {
        return false;
      } else {
        // istanbul ignore next
        throw e;
      }
    }
  }

  /**
   * Returns a topological sort of the graph.
   * @throws CycleError if the graph is cyclic.
   */
  *topologicalSort() {
    if (!this.isDirected()) {
      throw new UnfeasibleError(
        "Topological sort is not defined for undirected graphs",
      );
    }

    for (const generation of this.topologicalGenerations()) {
      yield* generation;
    }
  }

  /**
   * A copy of networkx's topological generations algorithm.
   */
  *topologicalGenerations() {
    if (this.numberOfNodes() === 0) {
      return;
    }

    const inDegreeMap = new Map<V, number>();
    let zeroInDegree: V[] = [];

    for (const [v] of this._adj) {
      if (this.inDegree(v) > 0) {
        inDegreeMap.set(v, this.inDegree(v));
      } else {
        zeroInDegree.push(v);
      }
    }

    while (zeroInDegree.length > 0) {
      const thisGeneration = zeroInDegree;
      zeroInDegree = [];

      for (let i = 0; i < thisGeneration.length; ++i) {
        const node = thisGeneration[i];

        if (!this.hasVertex(node)) {
          throw new GraphChangedDuringIterationError();
        }

        const neighbors = this.neighbors(node);
        for (let j = 0; j < neighbors.length; ++j) {
          const child = neighbors[j];
          if (!inDegreeMap.has(child)) {
            throw new GraphChangedDuringIterationError();
          }
          inDegreeMap.set(child, inDegreeMap.get(child)! - 1);

          if (inDegreeMap.get(child)! === 0) {
            zeroInDegree.push(child);
            inDegreeMap.delete(child);
          }
        }
      }

      yield thisGeneration;
    }

    if (inDegreeMap.size > 0) {
      throw new GraphContainsCycleError();
    }
  }
}
