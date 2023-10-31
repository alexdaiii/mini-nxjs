import {Map} from "immutable";

import {GenericGraph} from "@/GenericGraph";
import {
  GraphChangedDuringIterationError,
  GraphContainsCycleError,
  UnfeasibleError,
} from "@/GraphErrors";

/**
 * Determines if the graph is a directed acyclic graph.
 * @template V the type of the vertex id.
 * @template E the type of the edge data.
 * @param {GenericGraph<V, E>} graph the graph to check.
 * @return {boolean} true if the graph is a directed acyclic graph,
 * false otherwise.
 */
export function isDirectedAcyclicGraph<V, E>(
  graph: GenericGraph<V, E>,
): boolean {
  if (!graph.isDirected()) return false;

  try {
    Array.from(topologicalGenerations(graph));
    return true;
  } catch (e) {
    // istanbul ignore else
    if (e instanceof GraphContainsCycleError) {
      return false;
    } else {
      throw e;
    }
  }
}

/**
 * Returns a topological sort of the graph.
 * @template V the type of the vertex id.
 * @template E the type of the edge data.
 * @param {GenericGraph<V, E>} graph the graph to sort.
 * @throws CycleError if the graph is cyclic.
 * @throws UnfeasibleError if the graph is not directed.
 */
export function* topologicalSort<V, E>(graph: GenericGraph<V, E>) {
  if (!graph.isDirected()) {
    throw new UnfeasibleError(
      "Topological sort is not defined for undirected graphs",
    );
  }

  for (const generation of topologicalGenerations(graph)) {
    yield* generation;
  }
}

/**
 * A copy of networkx's topological generations algorithm.
 * @see https://networkx.github.io/documentation/stable/_modules/networkx/algorithms/dag.html#topological_generations
 * @template V the type of the vertex id.
 * @template E the type of the edge data.
 * @param {GenericGraph<V, E>} graph the graph to traverse.
 */
function* topologicalGenerations<V, E>(graph: GenericGraph<V, E>) {
  if (graph.numberOfNodes() === 0) {
    return;
  }

  // eslint-disable-next-line new-cap
  const inDegreeMap = Map<V, number>().asMutable();
  let zeroInDegree: V[] = [];

  for (const [v] of graph.adj) {
    if (graph.inDegree(v) > 0) {
      inDegreeMap.set(v, graph.inDegree(v));
    } else {
      zeroInDegree.push(v);
    }
  }

  while (zeroInDegree.length > 0) {
    const thisGeneration = zeroInDegree;
    zeroInDegree = [];

    for (let i = 0; i < thisGeneration.length; ++i) {
      const node = thisGeneration[i];

      if (!graph.hasVertex(node)) {
        throw new GraphChangedDuringIterationError();
      }

      const neighbors = graph.neighbors(node);
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
