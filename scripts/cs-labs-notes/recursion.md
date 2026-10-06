# Recursion

In recursion, each time you recurse, you're putting the current call of the function on hold and making a new call to the function. Then, once you hit the base case, you start going down the list of functions in a Last In, First Out manner (LIFO), because the VM has created a stack of your function calls to process later while you were recursing.

## The Five Steps to Solve Any Recursive Algorithm

A methodology worked through on a concrete example: count the number of unique paths from the top-left to the bottom-right corner of an N×M grid, moving only down or right one unit at a time.

### 1. What's the simplest possible input?

The simplest possible reasonable input to the function is a 1x1 grid.

`f(1, 1) ➝ 1`

```
[1]
[1]
```

When trying some more simple inputs, you might notice something interesting: if either N or M is 1, there's always one single path, thus, this might be a starting great base case.

```
f(1, 1) ➝ 1
f(2, 1) ➝ 1
f(1, 2) ➝ 1
f(1, M) ➝ 1
f(N, 1) ➝ 1
```

This could be written quite concisely as the following base case:

`g(N, M) ➝ 1 if N = 1 or M = 1`

### 2. Play around with examples and visualize

Try a 2x2 grid: from the top-left corner there are exactly two ways to reach the bottom-right corner — right then down, or down then right — so `f(2, 2) = 2`. Extend to a 2x3 grid and enumerate by hand: the moves are some arrangement of 1 "down" and 2 "rights", which works out to `f(2, 3) = 3`. Lining these small results up (`f(1, M) = 1`, `f(N, 1) = 1`, `f(2, 2) = 2`, `f(2, 3) = 3`) starts to look like entries in Pascal's triangle, which is the hint the recursive relationship needs.

### 3. Relate hard cases to simpler cases

Any path that ends at the bottom-right corner of the grid must have arrived there from one of exactly two neighboring cells: the cell directly above it, or the cell directly to its left. That means the total number of paths into an N×M grid is the sum of the paths into the (N-1)×M grid (arriving from above) and the paths into the N×(M-1) grid (arriving from the left). Each of those sub-grids is one row or column smaller, moving steadily toward the `N = 1` or `M = 1` base case from step 1.

### 4. Generalize the pattern

Combining steps 1 and 3 gives the full recurrence:

```
g(N, M) = 1                           if N = 1 or M = 1
g(N, M) = g(N-1, M) + g(N, M-1)       otherwise
```

This is the same shape as `findPaths.js` below: it recurses by moving the current cell one row down (`recurse(row + 1, col, ...)`) or one column right (`recurse(row, col + 1, ...)`), and records a completed path once `row`/`col` reach the bottom-right corner.

### 5. Write code by combining recursive pattern with the base case

## Find Paths

Explores every down/right path through a grid from the top-left to the bottom-right corner, skipping cells marked `'x'`, and collects each complete path found along the way.

```javascript
function findPaths(grid) {
  const paths = []
  const endRow = grid.length - 1
  const endCol = grid[0].length - 1

  function recurse(row, col, currPath) {
    // route.push('r' + row + ', c' + col) // showing route
    if (row === endRow && col === endCol) {
      paths.push(currPath.concat([[row, col]]))
    }

    if (row <= endRow && col <= endCol) {
      if (row < endRow && grid[row + 1][col] !== 'x') {
        recurse(row + 1, col, currPath.concat([[row, col]]))
      }

      if (col < endCol && grid[row][col + 1] !== 'x') {
        recurse(row, col + 1, currPath.concat([[row, col]]))
      }
    }
  }

  recurse(0, 0, [])

  return paths
}

const grid = [
  ['0', '0', '0', '0'],
  ['0', 'x', '0', 'x'],
  ['x', '0', '0', '0']
]

const result = findPaths(grid)
```

## Count Partitions

Counts the number of ways to partition `N` objects using parts of size up to `M`, recursing on either using a part of size `M` (reducing `N`) or dropping down to smaller part sizes (reducing `M`).

```javascript
/**
 * Write a function that counts the number of ways you can partition N objects using parts up to M (assuming M >= 0)
 *
 * Given N = 5 and M = 5
 * ◉◉◉◉◉⎮◉◉◉◉◉
 *
 *  Partitions
 *  ◉◉◉◉◉
 *  ◉◉◉◉+◉
 *  ◉◉◉+◉◉
 *  ◉◉◉+◉+◉
 *  ◉◉+◉◉+◉
 *  ◉◉+◉+◉+◉
 *  ◉+◉+◉+◉+◉
 *
 *  7 Partitions
 *
*/

function countPartitions(n, m) {
  if (n === 0) return 1

  if (m === 0 || n < 0) return 0

  return countPartitions(n - m, m) + countPartitions(n, m - 1)
}

console.log('result', countPartitions(5, 5)) // 7
```
