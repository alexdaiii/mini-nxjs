import {List} from "immutable";

/**
 * Returns an immutable tuple (implemented as Immutable.List) of the arguments.
 * @template V the type of the arguments.
 * @param {V} args the arguments to be put in a tuple.
 * @return {List<V>} an immutable tuple of the arguments.
 */
export const Tuple = <V>(...args: V[]): List<V> => {
  // eslint-disable-next-line new-cap
  return List(args);
};

export type Tuple<V> = ReturnType<typeof Tuple<V>>;
