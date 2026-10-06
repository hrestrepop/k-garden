# Stacks & Queues

Stack problems here mostly use a "monotonic stack" pattern to turn `O(N²)` brute-force scans into `O(N)` single passes; the queue problems use BFS-style and simple FIFO processing.

## Stacks

### isBalanced

Checks whether a string of brackets is balanced, by pushing opening brackets and matching each closing bracket against the top of the stack via a lookup table. `O(N)`.

```javascript
function isBalanced(s) {
  const stack = [],
    table = {
      ')': '(',
      '}': '{',
      ']': '['
    }

  for (let i = 0; i < s.length; i++) {
    const char = s[i]

    if (char === '[' || char === '(' || char === '{') {
      stack.push(char)
    } else {
      if (stack.length === 0) {
        return 'NO'
      }

      const c = stack.pop()

      if (c !== table[char]) {
        return 'NO'
      }
    }
  }

  return stack.length > 0 ? 'NO' : 'YES'
}

isBalanced('{[{()}]}') // 'YES'
```

### nextGreaterItem

For each element, finds the next element to its right that is strictly greater. Scans right-to-left, popping stack entries that are `<=` the current value so the stack always holds candidate "next greater" indices. `O(N)`.

```javascript
// Solution 1, Complexity O(N)
function nextGreaterItem(arr) {
  const stack = [],
    nextGreater = [],
    result = [],
    len = arr.length

  for (let i = 0; i < len; i++) {
    nextGreater[i] = 3
    result[i] = 0
  }

  for (let i = len - 1; i >= 0; i--) {
    while (stack.length && arr[i] >= arr[stack[stack.length - 1]]) {
      stack.pop()
    }

    if (stack.length) {
      nextGreater[i] = stack[stack.length - 1]
    }

    stack.push(i)
  }

  while (stack.length) {
    stack.pop()
  }

  for (let i = 0; i < len; i++) {
    result[i] = arr[nextGreater[i]]
  }

  return result
}

nextGreaterItem([4, 5, 2, 25]) // [5, 25, 25, 25]
```

### stockSpanProblem

For each day, finds how many consecutive prior days had a price `<=` today's price. Brute force is `O(N²)`; the stack-based version keeps indices of a decreasing price sequence and is `O(N)`.

```javascript
/** Given a list of prices of a single stock for N number of days,
 * find stock span for each day.
 *
 * Stock span is defined as a number of consecutive days prior to the current day
 * when the price of a stock was less than or equal to the price at current day.
 *
 * For example, {100,60,70,65,80,85} span will be {1,1,2,1,4,5}.
 *
 */

// Solution 1 (Brute Force), Complexity O(N²)
function stockSpan(prices) {
  const span = []

  for (let i = 0; i < prices.length; i++) {
    let curr = i - 1,
      count = 1

    while (prices[curr] <= prices[i] && curr >= 0) {
      count += 1

      curr--
    }

    span.push(count)
  }

  return span
}

// Solution 2 (Using Stack), Complexity O(N)
function stockSpan(prices) {
  const stack = [0],
    span = [1]

  for (let i = 1; i < prices.length; i++) {
    while (stack.length && prices[stack[stack.length - 1]] < prices[i]) {
      stack.pop()
    }

    if (prices[stack[stack.length - 1]] > prices[i]) {
      span[i] = i - stack[stack.length - 1]
    }

    stack.push(i)
  }

  return span
}

stockSpan([100, 60, 70, 65, 80, 85]) // [1, 1, 2, 1, 4, 5]
```

### largestRectangle

Finds the largest rectangular area in a histogram. Maintains a stack of indices with increasing bar heights; whenever a shorter bar is hit, pops taller bars and computes the area they could span. `O(N)`.

```javascript
/** A histogram is a polygon composed of a sequence of rectangles aligned at a common base line.
 * The rectangles have equal widths but may have different heights.
 *
 * For example, the figure on the left shows the histogram that consists of rectangles with the heights 2, 1, 4, 5, 1, 3, 3,
 * measured in units where 1 is the width of the rectangles:
 */

// Solution 1, Complexity O(N)
function largestRectangle(h) {
  const stack = [],
    len = h.length

  let area = 0,
    i = 0,
    top = 0

  while (i < len) {
    if (stack.length === 0 || h[stack[stack.length - 1]] <= h[i]) {
      stack.push(i)

      i++
    } else {
      top = stack.pop()

      let currentArea =
        stack.length === 0
          ? h[top] * i
          : h[top] * (i - stack[stack.length - 1] - 1)

      area = Math.max(area, currentArea)
    }
  }

  while (stack.length > 0) {
    top = stack.pop()

    let currentArea =
      stack.length === 0
        ? h[top] * i
        : h[top] * (i - stack[stack.length - 1] - 1)

    area = Math.max(area, currentArea)
  }

  return area
}

largestRectangle([1, 2, 3, 4, 5]) // 9
```

### maxMinRiddle

For every window size from 1 to N, finds the maximum of the minimums across all windows of that size. Brute force is `O(N²)`; the optimized version precomputes, for each element, the nearest smaller element on each side (via two monotonic-stack passes) to derive the max window size each element can "win" in a single `O(N)` pass.

```javascript
/** Given an integer array of size n, find the maximum of the minimum(s) of every window size in the array.
 * The window size varies from 1 to n.
 * */

// Solution 1 (Brute Force), Complexity O(NN)
function maxMinRiddle(arr) {
  const stack = [],
    len = arr.length

  let last = 0

  while (last < len) {
    let auxStack = [],
      i = 0,
      lastIdx = i + last + 1

    while (lastIdx <= len) {
      const slice = arr.slice(i, lastIdx)

      auxStack.push(Math.min(...slice))

      i++

      lastIdx = i + last + 1
    }

    last += 1

    stack.push(Math.max(...auxStack))
  }

  return stack
}

// Solution 2 (using next smaller and prev smaller indexes), Complexity O(N)
function maxMinRiddle(arr) {
  const stack = [],
    nextSmaller = [],
    prevSmaller = [],
    maximums = [],
    len = arr.length

  for (let i = 0; i < len; i++) {
    prevSmaller[i] = -1
    nextSmaller[i] = len
  }

  for (let i = 0; i < len; i++) {
    while (stack.length && arr[i] <= arr[stack[stack.length - 1]]) {
      stack.pop()
    }

    if (stack.length) {
      prevSmaller[i] = stack[stack.length - 1]
    }

    stack.push(i)
  }

  while (stack.length) {
    stack.pop()
  }

  for (let i = len - 1; i >= 0; i--) {
    while (stack.length && arr[i] <= arr[stack[stack.length - 1]]) {
      stack.pop()
    }

    if (stack.length) {
      nextSmaller[i] = stack[stack.length - 1]
    }

    stack.push(i)
  }

  for (let i = 0; i <= len; i++) {
    maximums[i] = 0
  }

  for (let i = 0; i < len; i++) {
    const l = nextSmaller[i] - prevSmaller[i] - 1

    maximums[l] = Math.max(maximums[l], arr[i])
  }

  for (let i = len - 1; i >= 1; i--) {
    maximums[i] = Math.max(maximums[i], maximums[i + 1])
  }

  maximums.shift()

  return maximums
}

maxMinRiddle([2, 6, 1, 12]) // [12, 2, 1, 1]
```

### poisonousPlants

Given pesticide levels per plant, finds how many days it takes until no more plants die (a plant dies the day after a plant to its left with a higher-or-equal pesticide level dies, unless it's shielded by a stronger neighbor). Stock-span-style monotonic stack, storing `[index, daysToDie]` pairs. `O(N)`.

```javascript
// Solution 1 (Stock Span problem based, using stack), Complexity O(N)
function poisonousPlants(p) {
  const len = p.length,
    stack = [[0, 1]]

  let days = -1

  for (let i = 1; i < len; i++) {
    let daysToDie = 1

    while (stack.length) {
      if (stack.length && p[stack[stack.length - 1][0]] >= p[i]) {
        daysToDie = Math.max(daysToDie, stack[stack.length - 1][1] + 1)

        stack.pop()
      } else {
        break
      }
    }

    if (!stack.length) {
      daysToDie = -1
    }

    days = Math.max(days, daysToDie)

    stack.push([i, daysToDie])
  }

  return days < 0 ? 0 : days
}

poisonousPlants([6, 5, 8, 4, 7, 10, 9]) // 2
```

## Queues

### minimumMoves

BFS over a grid with forbidden (`'X'`) cells, where each move can slide any distance in a straight line until it hits a wall or forbidden cell (like a rook). Tracks visited distances in a hashmap keyed by coordinates. `O(N)`.

```javascript
/** This uses a 2D grid, similiar to the finding the path algorithm:

    . X .
    . X .
    . . .

    * Xs are fordibben steps
*/


// Solution 1 (using queue), Complexity O(n)
function minimumMoves(grid, startX, startY, goalX, goalY) {
  const len = grid.length,
    queue = [],
    visited = {
      [`${startX}, ${startY}`]: 0
    }

  queue.push([startX, startY])

  let cdistance = 0

  while (queue.length) {
    let [x, y] = queue.shift()
    const neighbors = []

    cdistance = visited[`${x}, ${y}`]

    if (x === goalX && y === goalY) {
      break
    }

    let xc = x - 1

    while (xc > -1 && grid[xc][y] !== 'X') {
      // top
      neighbors.push([xc, y])

      xc -= 1
    }

    xc = x + 1

    while (xc < len && grid[xc][y] !== 'X') {
      // bottom
      neighbors.push([xc, y])

      xc += 1
    }

    // Y Direction
    let yc = y - 1

    while (yc > -1 && grid[x][yc] !== 'X') {
      // left
      neighbors.push([x, yc])

      yc -= 1
    }

    yc = y + 1

    while (yc < len && grid[x][yc] !== 'X') {
      // right
      neighbors.push([x, yc])

      yc += 1
    }

    for (let i = 0; i < neighbors.length; i++) {
      const [nx, ny] = neighbors[i]

      if (cdistance + 1 < visited[`${nx}, ${ny}`] || !visited[`${nx}, ${ny}`]) {
        visited[`${nx}, ${ny}`] = cdistance + 1

        queue.push([nx, ny])
      }
    }
  }

  return cdistance
}

minimumMoves(['...', '.X.', '.X.'], 2, 0, 2, 2) // 3
```

### switchOperations

Processes a list of queue operations (`1 x` enqueue, `2` dequeue, `3` peek front) against a plain array used as a queue. The original had a copy-paste typo (`ouput` instead of `output`) and a demo that called a nonexistent `processData` function instead of `switchOperations` — both fixed below, along with removing a leftover debug log.

```javascript
/** Task: perform queue operations based on the input
 *
 *  There are 3 types of operations:
  1 x: Enqueue element  into the end of the queue.
  2: Dequeue the element at the front of the queue.
  3: Print the element at the front of the queue.
 */

 // Solution 1, Complexity O(N)
function switchOperations(input) {
  let output = []

  for (let i = 0; i < input.length; i++) {
    const [op, val = undefined] = input[i].split(' ')

    switch (op) {
      case '1':
        output.push(val)
        break
      case '2':
        output.shift()
        break
      case '3':
      default:
        break
    }
  }

  return output
}

const result = switchOperations([
  '1 42',
  '2',
  '1 14',
  '3',
  '1 28',
  '3',
  '1 60',
  '1 78',
  '2',
  '2'
])

// result: ['60', '78']
```
