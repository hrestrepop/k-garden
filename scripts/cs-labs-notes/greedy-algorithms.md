# Greedy Algorithms

Greedy algorithms build a solution step by step, always taking the locally optimal choice, which only works when the problem structure guarantees that local choices lead to a global optimum (often after sorting first).

## Coin Change — Minimum Coins (coinsChange.js)

Given an unlimited supply of fixed denominations, greedily takes as much of the largest usable denomination as possible before moving to the next. `O(Nk)` where `k` is the amount.

```javascript
/** Greedy Algorithm to find Minimum number of Coins
 *
 * Given a value V, if we want to make change for V Rs, and we have infinite supply of each of the denominations in Colombian currency,
 * i.e., we have infinite supply of { 1, 2, 5, 10, 20, 50, 100, 500, 1000} valued coins/notes,
 * what is the minimum number of coins and/or notes needed to make the change?
 * */

 // Solution, Complexity O(Nk)
 function coinsChange(coins, amount) {
  let sum = 0,
    solutions = []

  for (let i = 0; i < coins.length; i++) {
    while (coins[i] + sum <= amount) {
      sum += coins[i]

      solutions.push(coins[i])
    }
  }

  return solutions
}

coinsChange([5, 2, 1], 28) // [5, 5, 5, 5, 5, 2, 1]
```

## Minimum Cost (getMinimumCost.js)

Buying items repeatedly gets more expensive the more times you've already bought `k` items; sorting the costs descending and paying the cheapest items first at the lowest multiplier minimizes total cost. `O(N log N)` (dominated by the sort).

```javascript
// Solution 1, Complexity O(N + log N) → O(N)
function getMinimumCost(k, c) {
  let n = c.length,
    minCost = 0,
    tempCount = 0,
    previousPurchases = 0

  const sorted = c.sort((a, b) => a - b)

  if (k >= n) {
    for (let i = 0; i < n; i++) {
      minCost += sorted[i]
    }
  } else {
    for (let i = n - 1; i >= 0; i--) {
      if (tempCount === k) {
        tempCount = 0
        previousPurchases++
      }

      minCost += (previousPurchases + 1) * sorted[i]

      tempCount++
    }
  }

  return minCost
}

getMinimumCost(3, [2, 5, 6]) // 13
getMinimumCost(2, [2, 5, 6]) // 15
```

## Max-Min / Minimize Unfairness (maxMin.js)

Sorts the array, then slides a window of size `k` across it looking for the window with the smallest spread (`max - min`). `O(N log N)` due to the sort.

```javascript
function maxMin(k, arr) {
  const sorted = arr.sort((a, b) => a - b)

  let unfairness = sorted[k - 1] - sorted[0]

  for (let i = 1; i < arr.length - 1; i++) {
    const max = sorted[i + k - 1],
      min = sorted[i]

    if (max - min < unfairness) {
      unfairness = max - min
    }
  }

  return unfairness
}

maxMin(2, [1, 4, 7, 2]) // 1
```

## Number of Things (numberOfThings.js)

Given a time budget, maximizes the count of completed to-do items by always doing the shortest ones first (sort ascending, accumulate time, stop counting once the budget is exceeded). `O(N log N)`.

```javascript
/** Being a very busy person, you have exactly T time to do some interesting things and you want to do maximum such things.

  You are given an array A of integers, where each element indicates the time a thing takes for completion.
  You want to calculate the maximum number of things that you can do in the limited time that you have.

  This is a simple Greedy-algorithm problem. In each iteration, you have to greedily select the things which will take
  the minimum amount of time to complete while maintaining two variables currentTime and numberOfThings.

  To complete the calculation, you must:

  Sort the array A in a non-decreasing order.
  Select each to-do item one-by-one.
  Add the time that it will take to complete that to-do item into currentTime.
  Add one to numberOfThings.
*/
// Solution 1, Complexity O(N + N) → O(N)
function numberOfThings(todoList, timeLimit) {
  const sorted = todoList.sort((a, b) => a - b)

  let totalTime = 0,
    numberOfThings = 0

  for (let i = 0; i < todoList.length; i++) {
    if (sorted[i] + totalTime <= timeLimit) {
      numberOfThings++
    }

    totalTime++
  }

  return numberOfThings
}

numberOfThings([5, 3, 4, 2, 1], 6) // 3
```

## Minimum Absolute Difference (minAbsDifference.js)

Finds the minimum absolute difference between any two elements of an array. After sorting, the closest pair is always adjacent, so one pass over the sorted array suffices. `O(N log N)`.

```javascript
// Solution, Complexity O(N log N)
function minAbsDifference(arr) {
  const sorted = arr.sort((a, b) => a - b)
  let minDiff = Math.abs(arr[0] - arr[1])

  for (let i = 1; i < arr.length - 1; i++) {
    const diff = Math.abs(sorted[i] - sorted[i + 1])

    if (diff < minDiff) {
      minDiff = diff
    }
  }

  return minDiff
}

minAbsDifference([1, -3, 71, 68, 17]) // 3
```

## Luck Balance (luckBalance.js)

Given contests as `[luck, important]` pairs, maximizes total luck by letting yourself lose at most `k` important contests (keeping their luck) and losing every unimportant one. Sorts contests by luck descending, greedily keeps luck for the first `k` important contests encountered. `O(N log N)`.

```javascript
// Solution 1, Complexity O(N + N)
function luckBalance(k, contests) {
  let luck = 0,
    luckCount = 0

  const sorted = contests.sort((a, b) => b[0] - a[0])

  for (let i = 0; i < contests.length; i++) {
    if (sorted[i][1] === 1) {
      if (luckCount < k) {
        luck += sorted[i][0]
      } else {
        luck -= sorted[i][0]
      }

      luckCount++
    } else {
      luck += sorted[i][0]
    }
  }

  return luck
}

luckBalance(3, [
  [5, 1],
  [1, 1],
  [4, 0],
  [3, 1],
  [2, 0]
]) // 15
```

## Reverse Shuffle Merge (reverseShuffleMerge.js)

> Flagged by the original author as unfinished ("still needs deep-understanding analysis and improvements") — included for reference, not as a polished/verified solution.

Reconstructs the lexicographically smallest string `s'` such that `s` is a result of merging `s'` with a shuffle of its own reverse, using character-frequency bookkeeping.

```javascript
/** IMPORTANT: it still needs deep-understanding analysis and improvements
 * link: https://www.hackerrank.com/challenges/reverse-shuffle-merge/problem?h_l=interview&playlist_slugs%5B%5D=interview-preparation-kit&playlist_slugs%5B%5D=greedy-algorithms
*/
function reverseShuffleMerge(s) {
  const map = {},
    reversed = s.split('').reverse('').join('')

  for (let i = 0; i < s.length; i++) {
    map[reversed[i]] = map[reversed[i]] ? map[reversed[i]] + 1 : 1
  }

  let ref = {}

  for (let key in map) {
    ref[key] = map[key] / 2
  }

  let result = [],
    i = 0

  while (result.length < reversed.length / 2) {
    let minCharPos = -1

    while (true) {
      let c = reversed[i]

      if (ref[c] > 0 && (minCharPos < 0 || c < reversed[minCharPos])) {
        minCharPos = i
      }

      map[c] -= 1

      if (map[c] < ref[c]) {
        break
      }

      i += 1
    }

    for (let j = minCharPos + 1; j < i + 1; j++) {
      map[reversed[j]] += 1
    }

    ref[reversed[minCharPos]] -= 1

    result.push(reversed[minCharPos])

    i = minCharPos + 1
  }

  return result.join('')
}
```
