# Dynamic Programming

Dynamic programming (DP) is an optimization technique: break a problem into simpler subproblems, solve each subproblem once, and store its solution so it never has to be recomputed.

## Recognizing DP Problems

DP pays off when a problem has two properties.

### Overlapping Subproblems

A problem has overlapping subproblems if solving it means solving the *same* smaller subproblem multiple times. Computing `fib(4)` recursively, for example, expands to `fib(3)`, `fib(2)` (twice), `fib(1)` (three times), and `fib(0)` (twice) — the same subproblems keep reappearing. When that happens, caching results instead of recomputing them saves real work. (Binary search, by contrast, has no overlapping subproblems, so DP doesn't apply to it.)

### Optimal Substructure

A problem has optimal substructure if an optimal solution to the whole problem can be built from optimal solutions to its subproblems. Shortest-path is the classic example: if node `x` lies on the shortest path from `u` to `v`, that shortest path is just the shortest path from `u` to `x` combined with the shortest path from `x` to `v`.

### Memoization vs. Tabulation

- **Memoization (top-down)**: write the natural recursive solution, but before recursing, check a lookup table for an already-computed answer. If it's there, return it; otherwise compute it, store it, and return it.
- **Tabulation (bottom-up)**: build the table iteratively from the smallest subproblems upward (e.g. `fib(0)`, then `fib(1)`, then `fib(2)`, ...) until the table holds the final answer.

Either way, the key implementation constraint is ordering: before solving a given subproblem, every subproblem it depends on must already be solved.

### 5 Steps to Solve Any DP Problem

1. Visualize examples (order matters — organizing/sorting the input is usually useful).
2. Find an appropriate subproblem.
3. Find the relationship between subproblems (how does subproblem `i` depend on earlier ones?).
4. Generalize that relationship into a recurrence.
5. Implement it, solving subproblems in the correct order.

## Longest Common Subsequence (lcs.js)

Three progressively better solutions to LCS: naive recursion (`O(2^n)`), top-down memoization, and bottom-up tabulation (both `O(mn)`).

```javascript
/* Returns length of LCS for X[0..m-1], Y[0..n-1] */

// solution 1, naive (simple recursion), Time Complexity O(2^n)
function lcs(X, Y, m, n) {
  if (m == 0 || n == 0) return 0

  if (X[m - 1] === Y[n - 1]) return 1 + lcs(X, Y, m - 1, n - 1)

  return Math.max(lcs(X, Y, m, n - 1), lcs(X, Y, m - 1, n))
}

// Solution 2, using DP with Memoization, Time Complexity: O(mn) ignoring recursion stack space
function lcs(X, Y, m, n, dp) {
  if (m === 0 || n === 0) return 0

  if (X[m - 1] === Y[n - 1]) return (dp[m][n] = 1 + lcs(X, Y, m - 1, n - 1, dp))

  if (dp[m][n] !== -1) {
    return dp[m][n]
  }

  return (dp[m][n] = Math.max(lcs(X, Y, m, n - 1, dp), lcs(X, Y, m - 1, n, dp)))
}

// Solution 2, using DP with Tabulation (bottom up), Time Complexity: O(mn) ignoring recursion stack space
function lcs(X, Y, m, n) {
  const dp = new Array(m + 1)

  for (let i = 0; i < dp.length; i++) {
    dp[i] = new Array(n + 1).fill(0)
  }

  dp[0][0] = 0

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        X[i - 1] === Y[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }

  return dp[m][n]
}

const X = 'AGGTAB'
const Y = 'GXTXAYB'

const m = X.length
const n = Y.length

lcs(X, Y, m, n)
```

## Coin Change — Count Combinations (coinsChange.js)

Counts the number of distinct combinations of coin denominations `S` that sum to `n`, using a 2D tabulation grid. `O(MN)`.

```javascript
/** Count all possible combinations to make a change
 * For N = 10 and S = {2, 5, 3, 6},
 * there are five solutions: {2,2,2,2,2}, {2,2,3,3}, {2,2,6}, {2,3,5} and {5,5}.
 * So the output should be 5.
*/

// Solution 1, Complexity O(MN)
function coinsChange(S, m, n) {
  const table = []

  for (let i = 0; i < n + 1; i++) {
    table[i] = []
  }

  for (let i = 0; i < m; i++) {
    table[0][i] = 1
  }

  for (let i = 1; i < n + 1; i++) {
    for (let j = 0; j < m; j++) {
      let x = i - S[j] >= 0 ? table[i - S[j]][j] : 0

      let y = j >= 1 ? table[i][j - 1] : 0

      table[i][j] = x + y
    }
  }

  return table[n][m - 1]
}

coinsChange([2, 5, 3, 6], 4, 10) //5
```

## Minimum Coins (minCoins.js)

Finds the minimum number of coins (unlimited supply of each denomination) needed to make amount `V`. Bottom-up tabulation.

```javascript
function minCoins(coins, m, V) {
  const table = [],
    max = Number.MAX_SAFE_INTEGER

  table[0] = 0

  for (let i = 1; i <= V; i++) {
    table[i] = max
  }

  const values = []

  for (let i = 1; i <= V; i++) {
    for (let j = 0; j < m; j++) {
      if (coins[j] <= i) {
        let res = table[i - coins[j]]

        values.push(coins[j])

        if (res !== max && res + 1 < table[i]) {
          table[i] = res + 1
        }
      }
    }
  }

  return table[V]
}

minCoins([9, 6, 5, 1], 4, 11) // 2 -> {5, 6}
```

## Maximum Subset Sum, No Adjacent Elements (maxSubsetSum.js)

Finds the maximum sum achievable by picking non-adjacent elements from an array. Brute force (checking every subset) is `O(2^n)`; the DP solution below is `O(N)`.

```javascript
/**  The brute-force approach will be to generate all subsets of elements of the array and for each subset where the elements are non-adjacent,
 *   we check the sum and print the maximum of all the sums.
 *
 *   The time-complexity of this approach is (2ⁿ), which won't pass.
 * */

// Solution 1, using DP, Time Complexity O(N)
function maxSubsetSum(arr) {
  const n = arr.length
  const dp = []

  dp[0] = arr[0]

  dp[1] = Math.max(arr[1], dp[0])

  for (let i = 2; i < n; i++) {
    dp[i] = Math.max(arr[i], dp[i - 1], arr[i] + dp[i - 2])
  }

  return dp[n - 1]
}
```

## Minimum Cost Path (minCost.js)

Given a cost matrix, finds the cheapest path from `(0,0)` to `(m,n)`, moving only right, down, or diagonally. Recursive solution is `O(mn)` with constant extra space (plus recursion stack); the iterative tabulated version is `O(mn)` time and space.

```javascript
/** Given a cost matrix cost[][] and a position (m, n) in cost[][],
 *  write a function that returns cost of minimum cost path to reach (m, n) from (0, 0).
 *
 *  Each cell of the matrix represents a cost to traverse through that cell.
 *
 *  The total cost of a path to reach (m, n) is the sum of all the costs on that path (including both source and destination).
 *
 *  You can only traverse down, right and diagonally lower cells from a given cell, i.e.,
 *  from a given cell (i, j), cells (i+1, j), (i, j+1), and (i+1, j+1) can be traversed.
 *
 *  You may assume that all costs are positive integers.
 *
 *  For example, in the following figure, what is the minimum cost path to (2, 2)?
 *
 * [
      [1, 2, 3],
      [4, 8, 2],
      [1, 5, 3]
    ]
 *
 *  The path with minimum cost is highlighted in the following figure.
 *
 *  The path is (0, 0) –> (0, 1) –> (1, 2) –> (2, 2). The cost of the path is 8 (1 + 2 + 2 + 3).
 *
 *  [
      [1*, 2*, 3],
      [4, 8, 2*],
      [1, 5, 3*]
    ]
 *
 * */

// Returns cost of minimum cost path
// from (0,0) to (m, n) in mat[R][C]

// Solution 1, recursive, Time Complexity: O(m * n) (constant space)
function minCost(cost, m, n) {
  if (n < 0 || m < 0) return Number.MAX_VALUE

  if (m == 0 && n == 0) return cost[m][n]

  return (
    cost[m][n] +
    Math.min(
      minCost(cost, m - 1, n - 1),
      minCost(cost, m - 1, n),
      minCost(cost, m, n - 1)
    )
  )
}

// Solution 1, iterative, Complexity O(mn), Auxiliary Space: O(m * n)(dynamic space)
function minCost(cost, m, n) {
  let i, j
  let tc = new Array(m + 1)

  for (let k = 0; k < m + 1; k++) {
    tc[k] = new Array(n + 1)
  }

  tc[0][0] = cost[0][0]

  /* Initialize first column of total cost(tc) array */
  for (i = 1; i <= m; i++) {
    tc[i][0] = tc[i - 1][0] + cost[i][0]
  }

  /* Initialize first row of tc array */
  for (j = 1; j <= n; j++) {
    tc[0][j] = tc[0][j - 1] + cost[0][j]
  }

  /* Construct rest of the tc array */
  for (i = 1; i <= m; i++) {
    for (j = 1; j <= n; j++) {
      tc[i][j] =
        Math.min(tc[i - 1][j - 1], tc[i - 1][j], tc[i][j - 1]) + cost[i][j]
    }
  }

  return tc[m][n]
}

const cost = [
  [1, 2, 3],
  [4, 8, 2],
  [1, 5, 3]
]

minCost(cost, 2, 2) // 8
```

## Abbreviation (abbreviation.js)

Determines whether string `a` can be turned into string `b` by capitalizing zero or more of its lowercase letters and deleting the rest of the lowercase letters. 2D tabulation over the two strings.

```javascript
/*
 * Complete the 'abbreviation' function below.
 *
 * The function is expected to return a STRING.
 * The function accepts following parameters:
 *  1. STRING a
 *  2. STRING b
 *
 * You can perform the following operations on the string a:

    1. Capitalize zero or more of a 's lowercase letters.
    1 .Delete all of the remaining lowercase letters in a.
 */

function abbreviation(a, b) {
  const isUpperCase = (str) => {
    return String(str).toUpperCase() === str
  }

  const m = a.length,
    n = b.length

  const dp = new Array(m + 1)

  for (let i = 0; i < dp.length; i++) {
    dp[i] = new Array(n + 1).fill(0)
  }

  dp[0][0] = 1

  let i = 1

  while (i < n + 1) {
    if (isUpperCase(a[i - 1])) break

    dp[i][0] = 1

    i++
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else if (
        !isUpperCase(a[i - 1]) &&
        String(a[i - 1]).toUpperCase() === b[j - 1]
      ) {
        dp[i][j] = dp[i - 1][j - 1] || dp[i - 1][j]
      } else if (isUpperCase(a[i - 1])) {
        dp[i][j] = 0
      } else {
        dp[i][j] = dp[i - 1][j]
      }
    }
  }

  return dp[m][n] ? 'YES' : 'NO'
}

const result = abbreviation('daBcd', 'ABC') // YES
```

## Tallest Box Stack (tallestStack.js)

Given boxes with length/width/height, finds the tallest stack where each box can only sit on a box with strictly greater length and width. Sorts by length, then for each box does an `O(N)` scan of earlier boxes it could sit on — `O(N²)` overall.

```javascript
/** Given N boxes each with the Length, Width and Height, where box i has length Li, width Wi and height Hi.
 *
 * Find the height of the tallest possible stack.
 *
 * Box (Li, Wi, Hi) can be on top of box (Lj, Wj, Hj) if Li < Lj and Wi < Wj.
 *
 * Eg. Given boxes [(2,3,3), (2,2,4), (4,4,2)]
 *
 *                                L W  H     L W  H
 * The talles possible stack is [(4,4,{2}), (2,2,{4})]
 * Then the answer is 4 + 2 = 6
 *
 * In this case box (2,3,3) can't be placed on top of box (2,2,4) as the lenght of the (2,3,3) is not bigger than 2
 */

function canBeStacked(top, bottom) {
  return top[0] < bottom[0] && top[1] < bottom[1]
}

function tallestStack(boxes = []) {
  const sorted = boxes.sort((a, b) => a[0] - b[0])

  const heights = sorted.map((box) => box[2])

  for (let i = 1; i < sorted.length; i++) {
    const box = sorted[i]

    const subStack = []

    for (let j = 0; j < i; j++) {
      if (canBeStacked(sorted[j], box)) {
        subStack.push(sorted[j][2])
      }

      heights[i] = box[2] + Math.max(...subStack)
    }
  }

  return Math.max(...heights)
}
```
