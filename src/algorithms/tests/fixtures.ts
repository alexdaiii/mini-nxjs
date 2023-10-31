// istanbul ignore file
import {DiGraph} from "@/DiGraph";
import {GenericGraph} from "@/GenericGraph";
import {UndirectedGraph} from "@/UndirectedGraph";

export const getDiGraph = () => {
  return new DiGraph<number>();
};

export const getGraph = () => {
  return new UndirectedGraph<number>();
};

export const testAllGraphs = (): [string, () => GenericGraph<number>][] => {
  return [
    ["UndirectedGraph", getGraph],
    ["DiGraph", getDiGraph],
  ];
};
