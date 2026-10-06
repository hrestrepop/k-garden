# Strings

String manipulation problems from the cs-labs repo: decoding, palindromes, anagrams, compression, permutations, and walking a step sequence.

## Decode String

Decodes a run-length-encoded string like `'4A3B2C1D2E'` (digit followed by a character, repeated) back into its expanded form, e.g. `'AAAABBBCCDEE'`. Complexity O(N). The source file also has a generator-based variant of the same algorithm (using a custom iterator) which isn't duplicated here — the brute-force version below is functionally equivalent and simpler to read.

```javascript
// Solution 1 (brute force), Complexity O(N)
function decodeString(s) {
  let decoded = '',
    i = 0

  while (i < s.length) {
    const [num, char] = [parseInt(s[i]), s[i + 1]]

    let c = 0
    while (c < num) {
      decoded += char

      c++
    }

    i = i + 2
  }

  return decoded
}

decodeString('4A3B2C1D2E') // AAAABBBCCDEE
```

## Is Palindrome

Normalizes a string (lowercase, strip spaces/commas) and checks whether it reads the same forwards and backwards. Complexity O(N).

```javascript
function isPalindrome(str) {
  const trimmed = str.toLowerCase().replace(/\s|\,/g, '')
  const reversed = trimmed.split('').reverse().join('')

  return trimmed === reversed
}

isPalindrome('A car, a man, a maraca') //true
```

## Make Anagram

Finds the minimum number of character deletions needed to make two strings anagrams of each other, by greedily matching off common characters and summing what's left over in both strings.

```javascript
/**
 * It must return an integer representing the minimum total characters that must be deleted to make the strings anagrams.
 * eg:
 * a -> cde
 * b -> abc
 * Both form -> c
 * Total deletions: 4
*/
// Solution 1, Complexity O(log N)
function makeAnagram(a, b) {
  const common = []

  for (let i = 0; i < a.length; i++) {
    const idx = b.indexOf(a[i])
    if (idx >= 0) {
      common.push(a[i])

      b = b.substring(0, idx) + b.substring(idx + 1)
    }
  }

  return a.length - common.length + b.length
}

const result = makeAnagram('showman', 'woman') // 2
```

## Alternating Characters

Counts the minimum number of deletions needed so no two adjacent characters are the same, by scanning for runs of repeated characters and counting the extras in each run.

```javascript
/**
 * It must return an integer representing the minimum number of deletions to make the alternating string.
 */

// Solution 1, Complexity O(log N)
function alternatingCharacters(s) {
  let total = 0
  let i = 0
  let next = 1

  while (i < s.length) {
    if (s[i] === s[next]) {
      total++
      next++
    } else {
      i = next
      next++
    }
  }
  return total
}

const result = alternatingCharacters('AAABBB') // result: 4, AB
```

## Funny String

A string is "funny" if the sequence of absolute differences between consecutive character codes is the same forwards and in reverse. Complexity O(N).

```javascript
/**
 Iterating through each string, compare the absolute difference in the ascii values of the characters at positions 0 and 1, 1 and 2 and so on to the end.
 If the list of absolute differences is the same for both strings, they are funny.
 Link: https://www.hackerrank.com/challenges/funny-string/problem
*/

// Solution 1, Complexity O(N)
function funnyString(s) {
  const r = s
    .split('')
    .reverse()
    .join('')

  let first = 0
  let sec = 1

  while (first < s.length - 1) {
    sec = first + 1

    const subsS = s.charCodeAt(sec) - s.charCodeAt(first)
    const subsR = r.charCodeAt(sec) - r.charCodeAt(first)

    if (Math.abs(subsS) === Math.abs(subsR)) {
      first++
    } else {
      return 'Not Funny'
    }
  }

  return 'Funny'
}
```

## Repeated String

Counts occurrences of `'a'` in the first `n` characters of a string `s` repeated infinitely, without actually building the repeated string: count the `'a'`s in one copy of `s`, multiply by how many full copies fit in `n`, then add the count from the leftover partial copy. Complexity O(N) (length of `s`). Two solutions shown, differing only in how they count `'a'` characters (filter vs. manual loop).

```javascript
/**
 * Complete the repeatedString function in the editor below.
 * It should return an integer representing the number of occurrences of a in the prefix of length  in the infinitely repeating string.
 * repeatedString has the following parameter(s):
 * s: a string to repeat
 * n: the number of characters to consider
 */

// Solution 1, Complexity O(N)
function repeatedString(s, n) {
  const count = str => str.split('').filter(char => char === 'a').length

  const len = s.length
  const times = Math.floor(n / len)

  const asInTimes = count(s) * times
  const rIdx = Math.floor(n - times * len)
  const rStr = s.substring(0, rIdx)
  const rAs = count(rStr)

  return asInTimes + rAs
}

// Solution 2, Complexity O(N)
function repeatedString(s, n) {
  const count = str => {
    let i = 0,
      c = 0

    while (i < str.length) {
      if (str[i] === 'a') {
        c++
      }
      i++
    }

    return c
  }

  const len = s.length
  const times = Math.floor(n / len)

  const asInTimes = count(s) * times
  const rIdx = Math.floor(n - times * len)
  const rStr = s.substring(0, rIdx)
  const rAs = count(rStr)

  return asInTimes + rAs
}

const input = 'aba'
const result = repeatedString(input, 10)
```

## String Compression

Run-length-encodes a string (e.g. `'aabcccccaaa'` → `'a2b1c5a3'`), returning the original string unchanged if the compressed form wouldn't be shorter. Complexity O(N).

```javascript
// Optimized Solution, Complexity O(N)
function stringCompression(string) {
  let compressed = ''
  let currChar = ''
  let currCount = ''
  let maxCount = 1

  for (let i = 0; i < string.length; i++) {
    if (currChar !== string[i]) {
      compressed = compressed + currChar + currCount

      maxCount = Math.max(maxCount, currCount)

      currChar = string[i]

      currCount = 1
    } else {
      currCount++
    }
  }

  compressed = compressed + currChar + currCount

  maxCount = Math.max(maxCount, currCount)

  return maxCount === 1 ? string : compressed
}

stringCompression('aaaaaa') // a6

stringCompression('aabcccccaaa') // a2b1c5a3
```

## String Permutation

Generates all permutations of a string by recursively picking each character as the next prefix character and permuting the remainder. Complexity O(N × N!).

```javascript
// Complexity O(N * !N) →
function permutation(str, prefix, result = []) {
  if (str.length === 0) {
    result.push(prefix)
  }

  for (let i = 0; i < str.length; i++) {
    const rem = str.substring(0, i) + str.substring(i + 1)

    permutation(rem, prefix + str.charAt(i), result)
  }

  return result
}
```

## Counting Valleys

Walks a string of `'U'`/`'D'` steps tracking altitude starting at sea level (0); a valley is entered each time a step goes from altitude 0 down to -1. Complexity O(N).

**Bug found and fixed:** the original file conflated two different problems — the implemented function was literally named `jumpingOnClouds` (a copy-paste of the array category's cloud-jumping solution) and its logic tracked altitude changes but never actually counted valley entries correctly for this problem; the demo at the bottom even called a nonexistent `countingValleys(input)` function that was never defined anywhere in the file. Replaced with a correct, small valley-counting implementation from scratch.

```javascript
/**
 * Print a single integer that denotes the number of valleys Gary walked through during his hike.
 * U = up
 * D = down
 */

// Solution, Complexity: O(N)
function countingValleys(s) {
  let altitude = 0
  let valleys = 0

  for (let i = 0; i < s.length; i++) {
    if (s[i] === 'U') {
      altitude++
    } else {
      altitude--
    }

    // A valley is entered the moment we step down from sea level (0) to -1.
    if (s[i] === 'D' && altitude === -1) {
      valleys++
    }
  }

  return valleys
}

const input = 'UDDDUDUU'
const result = countingValleys(input)
```
