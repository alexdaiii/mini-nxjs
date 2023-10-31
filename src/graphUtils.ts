import {DiGraph} from "@/DiGraph";
import {GenericGraph} from "@/GenericGraph";
import {UndirectedGraph} from "@/UndirectedGraph";

/**
 * Returns a new undirected graph with the same vertices and edges as the
 * @template V the type of the vertices in the graph.
 * @template E the type of the edges in the graph.
 * @param {GenericGraph<V, E>} g the graph to convert to an undirected graph.
 * @return {UndirectedGraph<V>} a new undirected graph with the same vertices
 */
export const toUndirected = <V, E>(
  g: GenericGraph<V, E>,
): UndirectedGraph<V> => {
  const undirected = new UndirectedGraph<V>();
  for (const v of g.vertices()) {
    undirected.addVertex(v);
  }

  for (const [v, w] of g.edges()) {
    undirected.addEdge(v, w);
  }

  return undirected;
};

/**
 * Returns a new directed graph with the same vertices and edges as the
 * @template V the type of the vertices in the graph.
 * @template E the type of the edges in the graph.
 * @param {GenericGraph<V, E>} g the graph to convert to a directed graph.
 * @return {DiGraph<V>} a new directed graph with the same vertices and edges
 */
export const toDirected = <V, E>(g: GenericGraph<V, E>): DiGraph<V> => {
  const directed = new DiGraph<V>();

  for (const v of g.vertices()) {
    directed.addVertex(v);
  }

  for (const [v, w] of g.edges()) {
    directed.addEdge(v, w);

    if (!g.isDirected()) {
      directed.addEdge(w, v);
    }
  }

  return directed;
};
