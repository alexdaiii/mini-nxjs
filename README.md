# @alexdaiii/mini-nxjs

[![npm version](https://badge.fury.io/js/@alexdaiii%2Fmini-nxjs.svg)](https://badge.fury.io/js/@alexdaiii%2Fmini-nxjs)
[![codecov](https://codecov.io/gh/alexdaiii/mini-nxjs/graph/badge.svg?token=FP5SCSGRZH)](https://codecov.io/gh/alexdaiii/mini-nxjs)

@alexdaiii/mini-nxjs-cls is a simple graph theory library for JavaScript. It implements basic graph theory algorithms
on unweighted graphs. Graph algorithms are implemented in an

## Installation

```bash
npm install @alexdaiii/mini-nxjs
```

## Usage

@alexdaiii/mini-nxjs only implements two types of graphs: `DirectedGraph` and `UndirectedGraph`.

These graphs are unweighted, do not allow self-loops, and do not allow parallel edges.

### Example

```typescript
import {DiGraph, algorithms} from "@alexdaiii/mini-nxjs";

const graph = new DiGraph<number>();
graph.addEdge(1, 2);
graph.addEdge(2, 3);

const path = algorithms.shortestPath(graph, 1, 3);
```

### API Documentation

[Docs](https://mini-nxjs.port5000.com)
