# Arrays

A collection of classic array/interview problems from the cs-labs repo — rotations, swaps, inversions, profit/price problems, frequency counting, and a maze-path backtracking exercise.

## Rotate Left (rotLeft)

Rotates an array left by `d` positions. Solution 1 does it the brute-force way, shifting the whole array one step at a time, `d` times (O(N²)). Solution 2 computes each element's final index directly in one pass (O(N)).

```javascript
// Solution 1 (brute force), Complexity O(N*N)
function rotLeft(a, d) {
  let r = 0

  while (r < d) {
    const pivot = a[0]

    for (let i = 1; i < a.length; i++) {
      a[i - 1] = a[i]
    }

    a[a.length - 1] = pivot

    r++
  }

  return a
}

// Solution 2, Complexity O(N)
function rotLeft(a, d) {
  const obj = { ...a },
    len = a.length

  for (let i = 0; i < len; i++) {
    a[i] = obj[i + d <= len - 1 ? i + d : i + d - len]
  }

  return a
}
```

## Minimum Swaps

Finds the minimum number of swaps needed to sort an array. Solution 1 is a brute-force selection-sort-style pass (O(N²)). Solution 2 is the linear approach: since the array holds `1..N`, each value's correct index is known up front, so misplaced elements can be swapped directly into place (O(N)).

```javascript
// Solution 1 (brute force), Complexity O(N * N) → Complexity O(N²)
function minimumSwaps(arr) {
  let counter = 0

  for (let i = 0; i < arr.length - 1; i++) {
    let ref = arr[i],
      tempIdx = 0

    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < ref) {
        ref = arr[j]
        tempIdx = j
      }
    }

    if (ref < arr[i]) {
      arr[tempIdx] = arr[i]
      arr[i] = ref
      counter++
    }
  }

  return counter
}

// Solution 2, Complexity O(N log N) → O(N)
function minimumSwaps(arr) {
  let counter = 0

  for (let i = 0; i < arr.length; i++) {
    if (i + 1 != arr[i]) {
      let t = i

      while (arr[t] != i + 1) {
        t++
      }

      let temp = arr[t]

      arr[t] = arr[i]
      arr[i] = temp

      counter++
    }
  }

  return counter
}

const input = [1, 3, 5, 2, 4, 6, 7]

const result = minimumSwaps(input) // 3
```

## Count Inversions

Counts the number of out-of-order pairs in an array (how far it is from sorted). Solution 1 compares every pair directly (O(N²)). Solution 2 counts inversions as a side effect of merge sort: whenever an element from the right half is placed before remaining elements of the left half, all of those remaining left elements form an inversion with it (O(N log N)).

```javascript
// Solution 1 (brute force), Complexity O(N²)
function countInversions(arr) {
  let count = 0

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) {
        count++
      }
    }
  }

  return count
}

// Solution 2, Complexity O(N log N)
function countInversions(arr) {
  function mergeCount(a, left, right) {
    let leftIndex = 0,
      rightIndex = 0,
      idx = 0,
      count = 0

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] <= right[rightIndex]) {
        a[idx] = left[leftIndex]
        leftIndex++
      } else {
        a[idx] = right[rightIndex]
        rightIndex++
        count += left.length - leftIndex
      }

      idx++
    }

    while (leftIndex < left.length) {
      a[idx] = left[leftIndex]

      leftIndex++
      idx++
    }

    while (rightIndex < right.length) {
      a[idx] = right[rightIndex]

      rightIndex++
      idx++
    }

    return count
  }

  function sortCount(a) {
    if (a.length <= 1) {
      return 0
    }

    let count = 0,
      len = a.length,
      middleIndex = Math.floor(len / 2)

    let left = a.slice(0, middleIndex)
    let right = a.slice(middleIndex, len)

    count += sortCount(left)
    count += sortCount(right)

    count += mergeCount(a, left, right)

    return count
  }

  return sortCount(arr)
}

countInversions([2, 4, 1]) //2
countInversions([2, 4, 1, 3]) // 3
```

## Max Profit

Single pass to find the maximum profit from one buy and one sell, tracking the minimum price seen so far and the best profit achievable at each step. Complexity O(N).

```javascript
// Solution 1 (Greedy approach 🤔), Complexity O(N)
function maxProfit(prices) {
  const len = prices.length

  if (len <= 0) {
    return 0
  }

  let minPrice = prices[0]
  let maxProfit = prices[1] - prices[0]

  for (let i = 1; i < len; ++i) {
    if (prices[i] - minPrice > maxProfit) {
      maxProfit = prices[i] - minPrice
    }

    if (prices[i] < minPrice && i !== len - 1) {
      minPrice = prices[i]
    }
  }

  return maxProfit
}

const result = maxProfit([6, 0, -1, 10]) // 11
```

## Smallest Positive Number Missing

Returns the smallest positive integer not present in the array. Solution 1 sorts descending and scans for a gap (O(N log N) despite the comment claiming O(N)). Solution 2 is the cleaner O(N) approach: drop every value into a `Set`, then count up from 1 until a value is missing from the set.

```javascript
/**
 * Given an array A of N integers, returns the smallest positive integer (greater than 0) that does not occur in A.
 * For example, given A = [1, 3, 6, 4, 1, 2], the function should return 5.
 * Given A = [1, 2, 3], the function should return 4.
 */

// Solution 1, Complexity: O(N)
function solution(A) {
  const sorted = A.sort((a, b) => b - a)

  let result = sorted[0] + 1,
    i = 0

  while (i < sorted.length - 1) {
    const next = sorted[i + 1]
    const curr = sorted[i]

    if (Math.sign(curr) > 0) {
      if (next < curr - 1 && curr > 1) {
        result = next + 1
      }
    }

    i++
  }

  return result > 0 ? result : 1
}

// Solution 2, Complexity: O(N)
function solution(A) {
  const set = new Set(A)
  let i = 1

  while (set.has(i)) {
    i++
  }

  return i
}
```

## Minimum Bribes

Queue-jumping simulation: given a final ordering of people in a queue where each person can only have moved forward by bribing at most 2 places, counts the total bribes or reports `'Too chaotic'` if anyone moved more than 2 places forward. Complexity O(N).

```javascript
// Solution 1, Complexity O(N)
function minimumBribes(arr) {
  let len = arr.length
  let reg = 0

  for (let i = len - 1; i >= 0; i--) {
    const idx = i + 1
    const curr = arr[i]

    if (curr - idx > 2) {
      return 'Too chaotic'
    }

    if (curr > idx) {
      reg += curr - idx
    } else {
      if (len > curr) {
        len = curr
      } else if (curr !== len) {
        reg++
      }
    }
  }

  return reg
}

const input = [2, 1, 5, 3, 4]
const solution = minimumBribes(input)
/**
 * 3
 * Too chaotic
 */
```

## Maximum Price

Greedy knapsack-style problem: sorts prices ascending and keeps adding the cheapest remaining item while the running total stays within budget `k`. Complexity O(N log N) (dominated by the sort).

```javascript
// Solution 1, Complexity O(N + log N) → O(N)
function maximumPrice(prices, k) {
  const sorted = prices.sort((a, b) => a - b)

  let c = 0,
    total = 0

  while (total + sorted[c] <= k) {
    total += sorted[c]

    c++
  }

  return total
}

maximumPrice([1, 12, 5, 111, 200, 1000, 10], 50) // maxprice: 28, maxItems 4
```

## Activity Notifications

Sliding-window median problem: for each day, notify if that day's expenditure is at least double the median of the trailing `d` days. Solution 1 re-sorts the window every step (O(N²)). Solution 2 maintains a counting-sort frequency array over the window instead of re-sorting, updating it incrementally as the window slides (O(N + K), where K is the expenditure value range).

```javascript
// Solution 1 (brute force), Complexity O(N * N) → O(N²)
function activityNotifications(expenditure, d) {
  let notifications = 0,
    left = 0,
    right = d

  while (right < expenditure.length) {
    const sorted = expenditure.slice(left, right).sort((a, b) => a - b)
    const isEven = sorted.length % 2 === 0
    const middle = Math.floor(sorted.length / 2)
    const mediam = isEven
      ? sorted[middle - 1] + sorted[middle] / 2
      : sorted[middle]

    if (right - left === d && expenditure[right] >= 2 * mediam) {
      notifications++
    }

    left++
    right++
  }

  return notifications
}

// Solution 2 (Using Counting Sort), Complexity O(N + K)
function activityNotifications(expenditure, d) {
  let notifications = 0,
    right = d

  let [i1, i2] = [Math.floor((d - 1) / 2), Math.ceil((d - 1) / 2)]
  let cs = new Array(201).fill(0)

  for (let i = d - 1; i >= 0; i--) {
    cs[expenditure[i]]++
  }

  let m1, m2

  while (right < expenditure.length) {
    for (let j = 0, k = 0; k <= i1; k += cs[j], j++) {
      m1 = j
    }

    for (let j = 0, k = 0; k <= i2; k += cs[j], j++) {
      m2 = j
    }

    let m = (m1 + m2) / 2

    if (expenditure[right] >= 2 * m) {
      notifications++
    }

    cs[expenditure[right - d]]--
    cs[expenditure[right]]++

    right++
  }

  return notifications
}
```

## Most Frequent Element

Three different approaches to finding the majority/most frequent element: sort-and-scan (O(N log N)), a hashmap of counts (O(N)), and the Boyer-Moore majority voting algorithm (O(N), O(1) space, valid when a true majority element exists).

```javascript
// Solution 1, sorting array. Complexity O(N log(N))
// [40, 50, 30, 40, 50, 30, 30]
// Sorted: [30, 30, 30, 40, 40, 50, 50]
function mostFrequent1(arr, n) {
  // Sort the array
  arr.sort()

  // find the max frequency using linear
  // traversal
  let maxCount = 1,
    res = arr[0]
  let currCount = 1

  for (let i = 1; i < n; i++) {
    if (arr[i] === arr[i - 1]) {
      currCount++
    } else {
      currCount = 1
    }

    if (currCount > maxCount) {
      maxCount = currCount
      res = arr[i - 1]
    }
  }

  return res
}

// Solution 2, using a hash table. Complexity O(N)
function mostFrequent2(arr) {
  // Insert all elements in hash.
  const hash = new Map()

  for (let i = 0; i < arr.length; i++) {
    if (hash.has(arr[i])) {
      hash.set(arr[i], hash.get(arr[i]) + 1)
    } else {
      hash.set(arr[i], 1)
    }
  }

  // find the max frequency
  let maxCount = 0,
    res = -1

  hash.forEach((value, key) => {
    if (maxCount < value) {
      res = key
      maxCount = value
    }
  })

  return res
}

// Solution 3, using voting algorithm. Complexity O(N)
//                       r
// [40, 50, 30, 40, 50, 30, 30]
function mostFrequent3(arr) {
  let res = 0
  let count = 1

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] === arr[res]) {
      count++
    } else {
      count--
    }

    if (count === 0) {
      res = i
      count = 1
    }
  }

  return arr[res]
}

const result = mostFrequent1([40, 50, 30, 40, 50, 30, 30])
```

## Jumping on the Clouds

Greedy shortest-path: jump 2 clouds ahead whenever possible (and safe), otherwise jump 1, to clear the cloud row in the fewest jumps. Complexity O(N) (the comment's O(log N) label doesn't match the linear scan it actually does).

```javascript
/**
 * For example,  indexed from . The number on each cloud is its index in the list so she must avoid the clouds at indexes  and .
 * She could follow the following two paths:  or . The first path takes  jumps while the second takes .
 */

// Solution 1, Complexity: O(log N)
function jumpingOnClouds(arr) {
  let c = 0,
    steps = 0

  while (c < arr.length - 1) {
    if (c + 2 < arr.length && arr[c + 2] !== 1) {
      steps++
      c = c + 2
    } else {
      steps++
      c++
    }
  }

  return steps
}

const input = [0, 0, 1, 0, 0, 1, 0]
const input2 = [0, 0, 0, 0, 1, 0]
```

## Find Maze Path

Recursive backtracking through a grid maze, marking visited cells and exploring all four directions until the destination is reached.

**Bug found and fixed:** the file was explicitly labeled "not working well yet." The inner `walk(column, row)` function immediately shadowed its own parameters with `const column = destCol; const row = destRow`, so the real traversal position passed into each recursive call was discarded on entry and replaced with the destination on every single call — meaning the function only ever looked at the destination cell, never actually walked the maze. It also never checked whether the current cell *was* the destination, and never propagated a recursive call's `true` result back up the call stack (it always fell through to `return false`), so even a correct walk could never report success. The fix: `walk` now uses its own `column`/`row` arguments as the current cell, checks that cell against `destRow`/`destCol` to terminate, marks visited cells to avoid infinite recursion, and returns `true` up the chain as soon as any of the four directions finds the destination. The entry call now also starts from the real `startRow`/`startCol` arguments instead of the hardcoded `walk(3, 0)`.

```javascript
/**
 * Sample input:
 * const maze = [
    [1, 0, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 1, 1, 0],
    [1, 0, 0, 0, 0]
  ]
*/

// Solution 1
const findMazePath = (maze, startRow, startCol, destRow, destCol) => {
  function walk(column, row) {
    if (column === destRow && row === destCol) {
      return true
    }

    if (maze[column][row] == 1) {
      maze[column][row] = 9 // mark as visited so we don't walk it again

      if (column < maze.length - 1 && walk(column + 1, row)) {
        return true
      }
      if (row < maze[column].length - 1 && walk(column, row + 1)) {
        return true
      }
      if (column > 0 && walk(column - 1, row)) {
        return true
      }
      if (row > 0 && walk(column, row - 1)) {
        return true
      }
    }

    return false
  }

  return walk(startRow, startCol)
}
```
