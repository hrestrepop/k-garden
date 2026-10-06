# Graphs

Graph traversal, shortest-path, and max-flow algorithms from the DSA practice repo. Several files here were buggy or incomplete; fixes and from-scratch implementations are called out explicitly in each subsection.

## Graph Terminology

A graph is a data structure `(V, E)` made up of a collection of vertices `V` and a collection of edges `E`:

- **Vertex (node):** the fundamental unit a graph is built from.
- **Edge:** a connection between two vertices — an unordered pair in an undirected graph, or an ordered pair (arc) in a directed graph.
- **Adjacency:** a vertex is adjacent to another if an edge connects them directly.
- **Path:** a sequence of edges that lets you travel from one vertex to another.
- **Directed graph:** a graph where an edge `(u, v)` does not imply the reverse edge `(v, u)` also exists; direction is typically drawn as an arrow.

In diagrams, a vertex is usually drawn as a labeled circle, and an edge as a line or arrow between two vertices (e.g. `V1 → V2`, `V2 ↔ V3`).

## bfs.js

Generic breadth-first traversal over a graph of nodes, where each node exposes an `adjacent` array of neighbor nodes. Marks nodes visited as they're enqueued to avoid revisiting. O(V + E) time.

```javascript
function BFS(root) {
  const queue = []

  root.marked = true

  queue.push(root)

  while (queue.length) {
    const top = queue.shift()

    top.marked = true

    const children = top.adjacent

    for (let i = 0; i < children.length; i++) {
      if (!children[i].marked) {
        children[i].marked = true

        queue.push(children[i])
      }
    }
  }
}
```

## dfs.js

Recursive depth-first traversal over the same `node.adjacent` graph shape as `bfs.js`, marking each node visited as it's reached.

**Fixed:** `DFS(n)` was recursing on the entire adjacency array `n` instead of indexing into it, so it never actually descended into individual children (and would have blown up calling `.adjacent` on an array). Changed the recursive call to `DFS(n[i])` so it properly visits each neighbor. O(V + E) time.

```javascript
function DFS(root) {
  if (root === null) {
    return
  }

  root.visited = true

  const n = root.adjacent

  for (let i = 0; i < n.length; i++) {
    if (!n[i].visited) {
      DFS(n[i])
    }
  }
}
```

## dijkstra.js

Single-source shortest path over a graph represented as an adjacency matrix (`graph[u][v]` is the edge weight, `0` meaning no edge). Naive array-based implementation — it uses a plain array as its "queue" and scans it linearly rather than using a real priority queue, so it's O(V²) rather than the O((V + E) log V) you'd get with a binary heap.

```javascript
function dijktra(graph, start) {
  const distances = [],
    prev = [],
    queue = []

  for (let i = 0; i < graph.length; i++) {
    distances[i] = Number.MAX_VALUE

    prev[i] = -1

    queue.push(i)
  }

  distances[start] = 0

  while (queue.length) {
    const u = queue.pop()

    for (let i = 0; i < graph[u].length; i++) {
      const alt = distances[u] + graph[u][i]

      if (graph[u][i] !== 0 && distances[i] > alt) {
        distances[i] = alt

        prev[i] = u
      }
    }
  }

  return { distances, prev }
}
```

## connectedCells.js

Finds the size of the largest connected region of `1`s in a grid, where cells are connected via any of the 8 surrounding directions (including diagonals). DFS marks visited cells and accumulates region size; the outer loop scans every cell as a potential region start. O(M×N) time.

```javascript
// Solution 1, Complexity O(MN) → O(N)
function isValid(grid, i, j, visited) {
  return (
    i >= 0 &&
    i < grid.length &&
    j >= 0 &&
    j < grid[0].length &&
    grid[i][j] === 1 &&
    !visited[`${i}${j}`]
  )
}

function dfs(grid, i, j, visited, len = 0) {
  // i - 1, j + 0, etc... includes diagonal movements
  const rowMoves = [-1, 1, 0, 0, -1, -1, 1, 1]
  const colMoves = [0, 0, -1, 1, -1, 1, -1, 1]

  visited[`${i}${j}`] = true

  for (let k = 0; k < 8; k++) {
    const [nextRow, nextCol] = [i + rowMoves[k], j + colMoves[k]]

    if (isValid(grid, nextRow, nextCol, visited)) {
      len = dfs(grid, nextRow, nextCol, visited, len) + 1
    }
  }

  return len
}

function connectedCells(grid) {
  const visited = {}

  let largest = 0

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (!visited[`${i}${j}`] && grid[i][j] === 1) {
        largest = Math.max(largest, dfs(grid, i, j, visited))
      }
    }
  }

  return largest + 1
}

connectedCells([
  [0, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 0, 1, 0],
  [0, 1, 0, 1, 1],
  [0, 1, 1, 1, 0]
]) // 15
```

## countMatches.js

Given two same-shaped grids, counts how many connected regions of `1`s in `grid1` have an *exactly matching* shape (same cells, same values) in `grid2`. DFS (4-directional, no diagonals) collects the coordinates of each region in `grid1`, then checks those same coordinates against `grid2`. O(M×N) time.

```javascript
// Solution 1, Complexity O(MN) → O(N)
function isValid(grid, i, j, visited) {
  return (
    i >= 0 &&
    i < grid.length &&
    j >= 0 &&
    j < grid[0].length &&
    grid[i][j] === 1 &&
    !visited[`${i}${j}`]
  )
}

function dfs(grid, i, j, visited, matched = []) {
  // i - 1, j + 0, etc...
  const rowMoves = [-1, 1, 0, 0]
  const colMoves = [0, 0, -1, 1]

  matched.push(i, j)

  visited[`${i}${j}`] = true

  for (let k = 0; k < 4; k++) {
    const [nextRow, nextCol] = [i + rowMoves[k], j + colMoves[k]]

    if (isValid(grid, nextRow, nextCol, visited)) {
      dfs(grid, nextRow, nextCol, visited, matched)
    }
  }

  return matched
}

function countMatches(grid1, grid2) {
  const visited = {}

  let matches = 0

  for (let i = 0; i < grid1.length; i++) {
    for (let j = 0; j < grid1[i].length; j++) {
      if (!visited[`${i}${j}`] && grid1[i][j] === 1) {
        const matched = dfs(grid2, i, j, visited)

        let k = 0,
          contais = true

        while (k < matched.length) {
          const [row, col] = [matched[k], matched[k + 1]]

          if (grid1[row][col] !== grid2[row][col]) {
            contais = false
          }

          k += 2
        }

        if (contais) {
          matches += 1
        }
      }
    }
  }

  return matches
}
```

## shortestPath.js

Shortest path between two cells in a grid. The original implementation had several undefined references (`queries[k]` with no `k` in scope) and a `PriorityQueue` import that was commented out, plus roughly 130 of its 196 lines were dead commented-out code from an abandoned second attempt — replaced here with a clean BFS version since the underlying grid is unweighted (`0` = open cell, `1` = wall). BFS naturally finds the shortest path in an unweighted grid in O(M×N) time.

```javascript
function isSafe(grid, i, j, visited) {
  return (
    i >= 0 &&
    i < grid.length &&
    j >= 0 &&
    j < grid[0].length &&
    grid[i][j] === 0 &&
    !visited[`${i}${j}`]
  )
}

function shortestPath(grid, [sr, sc, dr, dc]) {
  const dx = [-1, 1, 0, 0]
  const dy = [0, 0, -1, 1]
  const visited = { [`${sr}${sc}`]: true }
  const queue = [[sr, sc, 0]]

  while (queue.length) {
    const [row, col, dist] = queue.shift()

    if (row === dr && col === dc) {
      return dist
    }

    for (let i = 0; i < 4; i++) {
      const x = row + dx[i]
      const y = col + dy[i]

      if (isSafe(grid, x, y, visited)) {
        visited[`${x}${y}`] = true
        queue.push([x, y, dist + 1])
      }
    }
  }

  return -1 // unreachable
}

const grid = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0]
]

shortestPath(grid, [0, 0, 2, 2]) // 4
```

## bellmanFord.js

This file was empty in the original repo; implemented here. Bellman-Ford computes single-source shortest paths over a weighted edge list, correctly handling negative edge weights by relaxing every edge `V - 1` times, then runs one extra pass to detect a negative-weight cycle reachable from the source. O(V × E) time.

```javascript
// Note: this file was empty in the original repo; implemented here.

// Solution 1, Complexity O(V * E)
function bellmanFord(edges, vertexCount, source) {
  const distances = new Array(vertexCount).fill(Number.MAX_VALUE)

  distances[source] = 0

  for (let i = 0; i < vertexCount - 1; i++) {
    for (const [u, v, weight] of edges) {
      if (
        distances[u] !== Number.MAX_VALUE &&
        distances[u] + weight < distances[v]
      ) {
        distances[v] = distances[u] + weight
      }
    }
  }

  for (const [u, v, weight] of edges) {
    if (
      distances[u] !== Number.MAX_VALUE &&
      distances[u] + weight < distances[v]
    ) {
      throw new Error('Graph contains a negative-weight cycle')
    }
  }

  return distances
}

// s, t, x, y, z -> 0, 1, 2, 3, 4
const edges = [
  [0, 1, 6],
  [0, 3, 7],
  [1, 2, 5],
  [1, 3, 8],
  [1, 4, -4],
  [2, 1, -2],
  [3, 2, -3],
  [3, 4, 9],
  [4, 0, 2],
  [4, 2, 7]
]

bellmanFord(edges, 5, 0) // [0, 2, 4, 7, -2]
```

## floydWarshall.js

This file was empty in the original repo; implemented here. Floyd-Warshall computes all-pairs shortest paths over a weighted adjacency matrix via dynamic programming: for each candidate intermediate vertex `k`, it checks whether routing `i → k → j` beats the current best `i → j`. O(V³) time.

```javascript
// Note: this file was empty in the original repo; implemented here.

// Solution 1, Complexity O(V^3)
function floydWarshall(graph) {
  const n = graph.length
  const dist = graph.map(row => [...row])

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j]
        }
      }
    }
  }

  return dist
}

const INF = Number.MAX_VALUE

const graph = [
  [0, 3, INF, 7],
  [8, 0, 2, INF],
  [5, INF, 0, 1],
  [2, INF, INF, 0]
]

floydWarshall(graph)
// [
//   [0, 3, 5, 6],
//   [5, 0, 2, 3],
//   [3, 6, 0, 1],
//   [2, 5, 7, 0]
// ]
```

## fordFulkerson.js

This file was pseudocode/comments only in the original repo; implemented here. Max flow between a source and sink, computed as Edmonds-Karp (Ford-Fulkerson using BFS to find each augmenting path, which bounds the number of augmentations polynomially). Repeatedly finds a path from source to sink through edges with remaining residual capacity, pushes the bottleneck flow along it, and updates the residual graph, until no augmenting path remains. O(V × E²) time.

```javascript
// Note: this file was pseudocode/comments only in the original repo; implemented here.

// Solution 1 (Edmonds-Karp: Ford-Fulkerson with BFS augmenting paths), Complexity O(V * E^2)
function bfsFindPath(residual, source, sink, parent) {
  const visited = new Array(residual.length).fill(false)
  const queue = [source]

  visited[source] = true

  while (queue.length) {
    const u = queue.shift()

    for (let v = 0; v < residual.length; v++) {
      if (!visited[v] && residual[u][v] > 0) {
        visited[v] = true
        parent[v] = u
        queue.push(v)
      }
    }
  }

  return visited[sink]
}

function fordFulkerson(graph, source, sink) {
  const n = graph.length
  const residual = graph.map(row => [...row])
  const parent = new Array(n).fill(-1)

  let maxFlow = 0

  while (bfsFindPath(residual, source, sink, parent)) {
    let pathFlow = Number.MAX_VALUE
    let v = sink

    while (v !== source) {
      const u = parent[v]
      pathFlow = Math.min(pathFlow, residual[u][v])
      v = u
    }

    v = sink
    while (v !== source) {
      const u = parent[v]
      residual[u][v] -= pathFlow
      residual[v][u] += pathFlow
      v = u
    }

    maxFlow += pathFlow
  }

  return maxFlow
}

const graph = [
  [0, 16, 13, 0, 0, 0],
  [0, 0, 10, 12, 0, 0],
  [0, 4, 0, 0, 14, 0],
  [0, 0, 9, 0, 0, 20],
  [0, 0, 0, 7, 0, 4],
  [0, 0, 0, 0, 0, 0]
]

fordFulkerson(graph, 0, 5) // 23
```

## Dinic's Algorithm (reference only)

`dicnic.js` in the original repo is pseudocode/comments only, and Dinic's algorithm is substantial enough (level graphs plus blocking flow) that it isn't reimplemented here — this is a conceptual pointer, not working code. The idea: repeatedly build a *level graph* from the residual graph via BFS, where each vertex is labeled with its shortest distance (in edges) from the source; this restricts attention to edges that make forward progress. Then run DFS over the level graph to find a *blocking flow* — a set of augmenting paths that saturates at least one edge along every possible source-to-sink path in that level graph — and add it to the total flow. Rebuild the level graph and repeat until the sink is no longer reachable. This achieves O(V² × E) time, better than Edmonds-Karp on dense graphs, but a full implementation is out of scope for this note.
