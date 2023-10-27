import {DiGraph} from "@/DiGraph";
import {GenericGraph} from "@/GenericGraph";
import {UndirectedGraph} from "@/UndirectedGraph";

export const toUndirected = <V, E>(g: GenericGraph<V, E>) => {
  const undirected = new UndirectedGraph<V>();
  for (const v of g.vertices()) {
    undirected.addVertex(v);
  }

  for (const [v, w] of g.edges()) {
    undirected.addEdge(v, w);
  }

  return undirected;
};

export const toDirected = <V, E>(g: GenericGraph<V, E>) => {
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
