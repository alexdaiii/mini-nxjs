import {Map, is} from "immutable";

import {GenericGraph} from "@/GenericGraph";
import {NoPathExistsError} from "@/GraphErrors";
import {bfsEdges, dfsEdges} from "@/algorithms/traversal";

/**
 * Determines if there is a path from v to w.
 * @template V the type of the vertex id.
 * @template E the type of the edge data.
 * @param {GenericGraph<V, E>} graph the graph to search.
 * @param {V} source
 * @param {V} target
 * @return {boolean} true if there is a path from v to w, false otherwise.
 */
export function hasPath<V, E>(
  graph: GenericGraph<V, E>,
  source: V,
  target: V,
): boolean {
  graph.validateVertex(source);
  graph.validateVertex(target);

  for (const [_curr, neigh] of dfsEdges(graph, source)) {
    if (is(neigh, target)) return true;
  }

  return false;
}

/**
 * Computes the shortest path from v to w. If no such path exists,
 * raises an error.
 * @template V the type of the vertex id.
 * @template E the type of the edge data.
 * @param {GenericGraph<V, E>} graph the graph to search.
 * @param {V} v the source vertex.
 * @param {V} w the destination vertex.
 * @return {V[]} an array of vertices representing the shortest path from
 * v to w.
 * @throws {NoPathExistsError} if no path exists from v to w.
 */
export function shortestPath<V, E>(graph: GenericGraph<V, E>, v: V, w: V): V[] {
  graph.validateVertex(v);
  graph.validateVertex(w);

  if (is(v, w)) return [];

  // eslint-disable-next-line new-cap
  const prev = Map<V, V>().asMutable();

  for (const [curr, neigh] of bfsEdges(graph, v)) {
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
