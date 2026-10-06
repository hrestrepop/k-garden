# Hashmaps & Frequency Tricks

A collection of problems solved by trading extra space for a hashmap/set lookup, turning what would be an `O(N²)` nested scan into a single `O(N)` pass.

## Find Pair Summing to K (findSumK.js)

Checks whether any two numbers in an array sum to `k`, by checking each number against a running set of complements seen so far. `O(N)`.

```javascript
// Solution 1, Complexity O(N)
function findSumK(numbers, k) {
  const set = new Set()

  for (let i = 0; i < numbers.length; i++) {
    if (set.has(k - numbers[i])) {
      return true
    }

    set.add(numbers[i])
  }

  return false
}
```

## Ransom Note / Check Magazine (ransomNotes.js)

Determines whether a note can be constructed entirely from words available in a magazine, by building a word-count table for the magazine and decrementing it while scanning the note. `O(N)`.

```javascript
// Solution 1, Complexity O(N)
function checkMagazine(magazine, note) {
  const magTable = {}
  let contains = true

  for (let i = 0; i < magazine.length; i++) {
    magTable[magazine[i]] = magTable[magazine[i]] + 1 || 1
  }

  for (let i = 0; i < note.length; i++) {
    if (!magTable[note[i]] || magTable[note[i]] < 0) {
      contains = false
    }

    magTable[note[i]] -= 1
  }

  return contains ? 'Yes' : 'No'
}

checkMagazine(
  ['two', 'times', 'three', 'is', 'not', 'four'],
  ['two', 'times', 'two', 'is', 'four']
) // 'NO'
```

## Frequency Queries (frequencyQueries.js)

Processes insert/delete/"does any value have frequency z" queries against a multiset. Alongside the value→count hashmap (`hash`), it maintains a parallel count→how-many-values-have-this-count array (`freq`), so frequency-existence checks are `O(1)` instead of scanning all values. `O(N)` overall.

```javascript
/**
 * You are given Q queries. Each query is of the form two integers described below:
 *
    - 1 x: Insert x in your data structure.
    - 2 y: Delete one occurence of y from your data structure, if present.
    - 3 z: Check if any integer is present whose frequency is exactly z. If yes, print 1 else 0.
 */

// Solution 1, Complexity O(N)
const frequencyQueries = (queries) => {
  const result = []
  const hash = {}
  const freq = []

  for (let i = 0; i < queries.length; i += 1) {
    const [action, value] = queries[i]
    const initValue = hash[value] || 0

    if (action === 1) {
      hash[value] = initValue + 1

      freq[initValue] = (freq[initValue] || 0) - 1

      freq[initValue + 1] = (freq[initValue + 1] || 0) + 1
    }

    if (action === 2 && initValue > 0) {
      hash[value] = initValue - 1

      freq[initValue - 1] += 1
      freq[initValue] -= 1
    }

    if (action === 3) result.push(freq[value] > 0 ? 1 : 0)
  }

  return result
}

frequencyQueries([
  [1, 5],
  [1, 6],
  [3, 2],
  [1, 10],
  [1, 10],
  [1, 6],
  [2, 5],
  [3, 2]
])

// Result: [0, 1]
```

## Sherlock and Anagrams (sherlockAnagrams.js)

Counts pairs of substrings that are anagrams of each other, by grouping substrings of each length using their sorted-character form as the hashmap key, then counting pairs within each group (`n*(n-1)/2`). `O(N²)`.

```javascript
/** Two strings are anagrams of each other if the letters of one string can be rearranged to form the other string.
 * Given a string, find the number of pairs of substrings of the string that are anagrams of each other.
 *
*/

// Solution 1, Complexity O(N²)
function sherlockAnagrams(s) {
  let count = 0

  for (let i = 1; i < s.length + 1; i++) {
    const strMap = {}

    for (let j = 0; j < s.length - i + 1; j++) {
      const str = s
        .substring(j, j + i)
        .split('')
        .sort()
        .join('')

      strMap[str] = (strMap[str] || 0) + 1
    }

    for (const s in strMap) {
      count += (strMap[s] * (strMap[s] - 1)) / 2
    }
  }

  return count
}

sherlockAnagrams('cdcd') // 5
sherlockAnagrams('kkkk') // 10
sherlockAnagrams('ifailuhkqq') // 3
```

## Count Triplets in Geometric Progression (countTriplets.js)

Counts index triplets `(i, j, k)` with `i < j < k` whose values form a geometric progression with ratio `r`, scanning right-to-left while tracking counts of values seen (`counts`) and counts of valid pairs starting at each value (`pairs`). `O(N)`.

```javascript
/** You are given an array and you need to find number of tripets of indices (i, j, k)
 *  such that the elements at those indices are in geometric progression for a given common ratio r and  i < j < k.

*/

// Solution 1, Complexity O(N)
function countTriplets(arr, r) {
  let triplets = 0,
    counts = {},
    pairs = {}

  for (let i = arr.length - 1; i >= 0; i--) {
    const num = arr[i],
      op = num * r

    if (pairs[op]) {
      triplets += pairs[op]
    }

    if (counts[op]) {
      pairs[num] = pairs[num] + counts[op] || counts[op]
    }

    counts[num] = counts[num] + 1 || 1
  }

  return triplets
}


countTriplets([1, 2, 2, 4], 2) // 2
countTriplets([1, 3, 9, 9, 27, 81], 3) // 6
```

## Two Strings — Common Character (twoStrings.js)

Checks whether two strings share at least one common character, using a `Set` built from the first string for `O(1)` membership checks against the second. `O(N)`.

```javascript
// Solution 1, Complexity O(N)
function twoStrings(s1, s2) {
  const dict = new Set(s1)
  let words = 0

  for (let i = 0; i < s2.length; i++) {
    if (dict.has(s2[i])) {
      words += 1
    }
  }

  return words > 0 ? 'YES' : 'NO'
}

twoStrings('hello', 'world') // YES
```

## What Flavors / Search Split Cost (searchSplitCost.js)

Given a list of costs and a budget, finds the pair of items whose costs sum exactly to the budget. Uses a hashmap from cost to (1-indexed) position, filled as the array is scanned; each item checks whether its complement (`money - cost[i]`) has already been seen. `O(N)`.

```javascript
// Optimal Search implementation —uses a dictionary so that each search is performed in O(1) time, Complexity O(N)
function whatFlavors(cost, money) {
  const dic = {}

  for (let i = 0; i < cost.length; i++) {
    const remaining = money - cost[i]

    if (dic[remaining]) {
      return console.log(`${dic[remaining]} ${i + 1}`)
    } else {
      dic[cost[i]] = i + 1
    }
  }
}

whatFlavors([1, 4, 5, 3, 2], 4) // 1, 4
whatFlavors([2, 2, 4, 3], 4) // 1, 2
```
