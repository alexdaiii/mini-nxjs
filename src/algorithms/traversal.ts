import {Set} from "immutable";
import Queue from "yocto-queue";

import {GenericGraph} from "@/GenericGraph";
import {Tuple} from "@/utils";

/**
 * Generator that yields the edges in the graph from a DFS starting at v.
 * @template V the type of the vertex id.
 * @template E the type of the edge data.
 * @param {GenericGraph<V, E>} graph the graph to traverse.
 * @param {V} v the vertex to start the DFS at.
 */
export function* dfsEdges<V, E>(
  graph: GenericGraph<V, E>,
  v: V,
): Generator<[V, V]> {
  graph.validateVertex(v);

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

    const neighbors = graph.neighbors(child);
    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];
      if (!visited.has(neighbor)) {
        stack.push([child, neighbor]);
      }
    }
  }
}

/**
 * Generator that yields the edges in the graph from a BFS starting at v.
 * Stops once all vertices have been visited.
 * @template V the type of the vertex id.
 * @template E the type of the edge data.
 * @param {GenericGraph<V, E>} graph the graph to traverse.
 * @param {V} v the vertex to start the BFS at.
 */
export function* bfsEdges<V, E>(
  graph: GenericGraph<V, E>,
  v: V,
): Generator<[V, V]> {
  graph.validateVertex(v);

  const queue = new Queue<V>();
  // eslint-disable-next-line new-cap
  const visited = Set<V>().asMutable();

  queue.enqueue(v);
  visited.add(v);

  while (queue.size > 0) {
    const node = queue.dequeue()!;

    const neighbors = graph.neighbors(node);
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
 * Similar to bfs_edges, in that it returns edges in BFS order from a source.
 * However, it differs in that it stops
 * once all the edges in the connected component containing v have been
 * visited.
 * @template V the type of the vertex id.
 * @template E the type of the edge data.
 * @param {GenericGraph<V, E>} graph the graph to traverse.
 * @param {V} v the vertex to start the BFS at.
 */
export function* edgeBfs<V, E>(
  graph: GenericGraph<V, E>,
  v: V,
): Generator<[V, V]> {
  graph.validateVertex(v);

  const queue = new Queue<V>();
  // eslint-disable-next-line new-cap
  const visitedEdges = Set<Tuple<V>>().asMutable();

  queue.enqueue(v);

  while (queue.size > 0) {
    const node = queue.dequeue()!;

    const neighbors = graph.neighbors(node);
    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];

      const edge = getEdge(graph, node, neighbor);
      if (!visitedEdges.has(edge)) {
        yield [node, neighbor];
        queue.enqueue(neighbor);
        visitedEdges.add(edge);
      }
    }
  }
}

const getEdge = <V, E>(graph: GenericGraph<V, E>, u: V, v: V) => {
  if (graph.isDirected()) {
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
