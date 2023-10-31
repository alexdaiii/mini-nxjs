/**
 * Error thrown when a vertex does not exist in the graph.
 * @template T the type of the vertex id.
 * @extends Error
 */
export class VertexDoesNotExistError<T = any> extends Error {
  /**
   * Constructs a new VertexDoesNotExistError.
   * @param {T} id the id of the vertex that does not exist.
   */
  constructor(id: T) {
    super(`Vertex ${id} does not exist`);
  }
}

/**
 * Error thrown when an edge does not exist in the graph.
 * @template T the type of the vertex id.
 * @extends Error
 */
export class EdgeDoesNotExistError<T = any> extends Error {
  /**
   * Constructs a new EdgeDoesNotExistError.
   * @param {T} v the id of the first vertex of the edge that does not exist.
   * @param {T} w the id of the second vertex of the edge that does not exist.
   */
  constructor(v: T, w: T) {
    super(`Edge (${v}, ${w}) does not exist`);
  }
}

/**
 * Error thrown when an edge already exists in the graph.
 * @extends Error
 */
export class GraphChangedDuringIterationError extends Error {
  /**
   * Constructs a new GraphChangedDuringIterationError.
   */
  constructor() {
    super("Graph changed during iteration");
  }
}

/**
 * Error thrown when a graph contains a cycle.
 * @extends Error
 */
export class GraphContainsCycleError extends Error {
  /**
   * Constructs a new GraphContainsCycleError.
   */
  constructor() {
    super("Graph contains a cycle");
  }
}

/**
 * Error thrown when no path exists between two vertices.
 */
export class NoPathExistsError extends Error {
  /**
   * Constructs a new NoPathExistsError.
   */
  constructor() {
    super("No path exists");
  }
}

/**
 * Generic error thrown when a method is called on a graph is not feasible.
 */
export class UnfeasibleError extends Error {
  /**
   * Constructs a new UnfeasibleError.
   * @param {string} message
   */
  constructor(message: string) {
    super(message);
  }
}
