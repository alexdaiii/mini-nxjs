import {Set} from "immutable";

import {DiGraph} from "@/DiGraph";
import {Tuple} from "@/utils";

/**
 * An unweighted undirected graph that does not allow parallel edges or self
 * loops.
 * Implemented as a Digraph with edges (v, w) and (w, v) for every edge (v, w).
 * @template V the type of the vertex id.
 * @extends DiGraph
 */
export class UndirectedGraph<V = unknown> extends DiGraph<V> {
  /**
   * @inheritDoc
   */
  isDirected(): boolean {
    return false;
  }

  /**
   * @inheritDoc
   */
  addEdge(v: V, w: V): void {
    super.addEdge(v, w);
    super.addEdge(w, v);
  }

  /**
   * @inheritDoc
   */
  removeEdge(v: V, w: V): void {
    super.removeEdge(v, w);
    super.removeEdge(w, v);
  }

  /**
   * @inheritDoc
   */
  edges(): [V, V][] {
    // should only return edge once
    // eslint-disable-next-line new-cap
    const edges = Set<Tuple<V>>().asMutable();
    for (const [v, {outVtx}] of this._adj) {
      for (const w of outVtx) {
        // eslint-disable-next-line new-cap
        edges.add(Tuple(...this.getSmallestEdge(v, w)));
      }
    }

    const edgeArray = edges.toArray();
    return edgeArray.map(edge => edge.toArray() as [V, V]);
  }

  /**
   * Orders the edge (u', v') such that u' < v'.
   * @param {V} v the first vertex.
   * @param {V} w the second vertex.
   * @return {V[]} the ordered edge.
   * @protected
   */
  protected getSmallestEdge(v: V, w: V): [V, V] {
    if (v < w) return [v, w];
    return [w, v];
  }
}
