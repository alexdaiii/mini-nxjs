import {Set} from "immutable";

import {DiGraph} from "@/DiGraph";
import {Tuple} from "@/utils";

/**
 * An unweighted undirected graph that does not allow parallel edges or self loops.
 * Implemented as a Digraph with edges (v, w) and (w, v) for every edge (v, w).
 */
export class UndirectedGraph<V = any> extends DiGraph<V> {
  isDirected(): boolean {
    return false;
  }
  addEdge(v: V, w: V): void {
    super.addEdge(v, w);
    super.addEdge(w, v);
  }

  removeEdge(v: V, w: V): void {
    super.removeEdge(v, w);
    super.removeEdge(w, v);
  }

  edges(): [V, V][] {
    // should only return edge once
    const edges = Set<Tuple<V>>().asMutable();
    for (const [v, {outVtx}] of this._adj) {
      for (const w of outVtx) {
        if (v < w) edges.add(Tuple(v, w));
        else edges.add(Tuple(w, v));
      }
    }

    const edgeArray = edges.toArray();
    return edgeArray.map(edge => edge.toArray() as [V, V]);
  }
}
