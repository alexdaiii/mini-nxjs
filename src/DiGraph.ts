import {is} from "immutable";

import {GenericGraph} from "@/GenericGraph";

/**
 * Edge information for a vertex.
 * @template V the type of the vertex id.
 */
class EdgeInfo<V> {
  inVtx: Set<V>;
  outVtx: Set<V>;

  /**
   * Constructs a new EdgeInfo.
   */
  constructor() {
    this.inVtx = new Set();
    this.outVtx = new Set();
  }
}

/**
 * An unweighted directed graph that does not allow parallel edges
 * @extends GenericGraph
 */
export class DiGraph<V = unknown> extends GenericGraph<V, EdgeInfo<V>> {
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
      this._adj.set(v, new EdgeInfo());
    }
  }

  /**
   * @inheritDoc
   */
  addEdge(v: V, w: V): void {
    if (!this._adj.has(v)) {
      this._adj.set(v, new EdgeInfo());
    }
    if (!this._adj.has(w)) {
      this._adj.set(w, new EdgeInfo());
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
}
