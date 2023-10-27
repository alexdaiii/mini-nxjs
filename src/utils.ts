import {List} from "immutable";

/**
 * Returns an immutable tuple (implemented as Immutable.List) of the arguments.
 */
export const Tuple = <V>(...args: V[]) => {
  return List(args);
};

export type Tuple<V> = ReturnType<typeof Tuple<V>>;
