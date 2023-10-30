import {Set} from "immutable";

import {DiGraph} from "@/DiGraph";
import {Tuple} from "@/utils";

/**
 * An unweighted undirected graph that does not allow parallel edges or self
 * loops.
 * Implemented as a Digraph with edges (v, w) and (w, v) for every edge (v, w).
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
        if (v < w) edges.add(Tuple(v, w));
        // eslint-disable-next-line new-cap
        else edges.add(Tuple(w, v));
      }
    }

    const edgeArray = edges.toArray();
    return edgeArray.map(edge => edge.toArray() as [V, V]);
  }
}
