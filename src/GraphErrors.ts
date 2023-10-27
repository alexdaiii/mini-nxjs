export class VertexDoesNotExistError<T = any> extends Error {
  constructor(id: T) {
    super(`Vertex ${id} does not exist`);
  }
}

export class EdgeDoesNotExistError<T = any> extends Error {
  constructor(v: T, w: T) {
    super(`Edge (${v}, ${w}) does not exist`);
  }
}

export class GraphChangedDuringIterationError extends Error {
  constructor() {
    super(`Graph changed during iteration`);
  }
}

export class GraphContainsCycleError extends Error {
  constructor() {
    super(`Graph contains a cycle`);
  }
}

export class NoPathExistsError extends Error {
  constructor() {
    super(`No path exists`);
  }
}

export class UnfeasibleError extends Error {
  constructor(message: string) {
    super(message);
  }
}
