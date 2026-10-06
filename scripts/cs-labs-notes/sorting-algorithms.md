# Sorting Algorithms

Six classic sorting algorithms from the cs-labs practice repo. Three (bubble, counting, merge) had working implementations; three (quick, radix, selection) were empty stub files with only a doc comment describing the intended approach — those have been filled in below with standard textbook implementations in the same plain-JS style as the rest of the repo.

## Bubble Sort

Repeatedly sweeps the array, swapping adjacent elements that are out of order, so the largest unsorted element "bubbles" to the end of each pass. Complexity O(N²).

```javascript
/** In bubble sort, we start at the beginning of the array and swap the first two elements if the first is greater than the second.
 * Then, we go to the next pair, and so on, continuously making sweeps of the array until it is sorted.
 * In doing so, the smaller items slowly "bubble" up to the beginning of the list.
*/
// Solution 1, Complexity O(N²)
function bubbleSort(a) {
  function swap(arr, i, j) {
    const temp = arr[i]

    arr[i] = arr[j]
    arr[j] = temp
  }

  function sort(arr) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 1; j < arr.length; j++) {
        if (arr[j - 1] > arr[j]) {
          swap(arr, j - 1, j)
        }
      }
    }

    return arr
  }

  return sort(a)
}
```

## Counting Sort

Counts occurrences of each value into an auxiliary array, turns those counts into prefix sums (so each count becomes "how many elements are ≤ this value"), then places each element directly at its sorted index. Complexity O(N + K), where K is the range of input values.

```javascript
/** Counting sort is a sorting algorithm that sorts the elements of an array by counting the number of occurrences of each element in the array.
 * The count is stored in an auxiliary array and the sorting is done by mapping the count as an index of the auxiliary array.
 * */

// Solution, Complexity O(N + K)
function countingSort(a) {
  let len = a.length,
    max = a[0],
    result = []

  for (let i = 0; i < len; i++) {
    if (a[i] > max) {
      max = a[i]
    }
  }

  const count = new Array(max + 1).fill(0)

  for (let i = 0; i < len; i++) {
    count[a[i]]++
  }

  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1]
  }

  for (let i = len - 1; i >= 0; i--) {
    result[count[a[i]] - 1] = a[i]
    count[a[i]]--
  }

  return result
}
```

## Merge Sort

Recursively splits the array in half, sorts each half, then merges the two sorted halves back together; the merge step does all the real work. Complexity O(N log N) in the best, average, and worst case, with O(N) space.

```javascript
/** Merge sort divides the array in half, sorts each of those halves, and then merges them back together.
 * Each of those halves has the same sorting algorithm applied to it.
 * Eventually, you are merging just two single­ element arrays. It is the "merge" part that does all the heavy lifting.
 *
 *
  Merge Sort Complexity
  Time Complexity
  Best Case Complexity: O(n*log n)

  Worst Case Complexity: O(n*log n)

  Average Case Complexity: O(n*log n)

  Space Complexity
  The space complexity of merge sort is O(n).

  Merge Sort Applications
  Inversion count problem (I did this already)
  External sorting
  E-commerce applications
 * */

// Common solution, Complexity O(N log N)
const mergeSort = (a) => {
  function merge(left, right) {
    let resultArray = [],
      leftIndex = 0,
      rightIndex = 0

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] < right[rightIndex]) {
        resultArray.push(left[leftIndex])
        leftIndex++
      } else {
        resultArray.push(right[rightIndex])
        rightIndex++
      }
    }

    return resultArray
      .concat(left.slice(leftIndex))
      .concat(right.slice(rightIndex))
  }

  function sort(array) {
    if (array.length <= 1) {
      return array
    }

    let middleIndex = Math.floor(array.length / 2)

    let left = array.slice(0, middleIndex)
    let right = array.slice(middleIndex, array.length)

    return merge(sort(left), sort(right))
  }

  return sort(a)
}
```

## Quick Sort

The source file was an empty stub (`function quickSort() {}`) with only a doc comment describing the pivot-partition idea. Filled in below with a standard Lomuto-partition quicksort: pick the last element as pivot, partition the range so smaller elements end up on the left, then recurse on both sides. Complexity average O(N log N), worst case O(N²) when the pivot choice is consistently bad.

```javascript
/** In quick sort we pick a random element and partition the array,
 * such that all numbers that are less than the partitioning element come before all elements that are greater than it.
 * The partitioning can be performed efficiently through a series of swaps (see below).
 *
 * If we repeatedly partition the array (and its sub-arrays) around an element, the array will eventually become sorted.
 * However, as the partitioned element is not guaranteed to be the median (or anywhere near the median), our sorting could be very slow.
 * This is the reason for the 0(n2) worst case runtime.
 *
*/
// Solution, Complexity Average: O(N log N), Worst Case: O(N²)
// Was an empty stub — filled in with a standard Lomuto-partition quicksort.
function quickSort(a, low = 0, high = a.length - 1) {
  function swap(arr, i, j) {
    const temp = arr[i]

    arr[i] = arr[j]
    arr[j] = temp
  }

  function partition(arr, low, high) {
    const pivot = arr[high]
    let i = low - 1

    for (let j = low; j < high; j++) {
      if (arr[j] <= pivot) {
        i++
        swap(arr, i, j)
      }
    }

    swap(arr, i + 1, high)

    return i + 1
  }

  if (low < high) {
    const pivotIndex = partition(a, low, high)

    quickSort(a, low, pivotIndex - 1)
    quickSort(a, pivotIndex + 1, high)
  }

  return a
}
```

## Radix Sort

The source file was an empty stub (`function radixSort() {}`) with only a doc comment. Filled in below with a standard LSD (least-significant-digit) radix sort for non-negative integers: for each digit place, bucket the numbers 0-9 by that digit, then reassemble, repeating from the ones place up to the most significant digit. Complexity O(N·K), where N is the number of elements and K is the number of digits in the largest number (the stub's header comment said O(N²), which doesn't match the algorithm it describes — corrected to O(N·K) to match the doc comment above it).

```javascript
/** Radix sort is a sorting algorithm for integers (and some other data types) that takes advantage of the fact that integers have a finite number of bits.
 * In radix sort, we iterate through each digit of the number, grouping numbers by each digit.
 *
 * For example, if we have an array of integers, we might first sort by the first digit, so that the Os are grouped together.
 * Then, we sort each of these groupings by the next digit. We repeat this process sorting by each subsequent digit, until finally the whole array is sorted.
 * Unlike comparison sorting algorithms, which cannot perform better than O(n log(n)) in the average case, radix sort has a runtime of 0(kn),
 * where n is the number of elements and k is the number of passes of the sorting algorithm.
*/
// Solution, Complexity O(N * K)
// Was an empty stub — filled in with a standard LSD radix sort for non-negative integers.
function radixSort(a) {
  function getDigit(num, place) {
    return Math.floor(num / Math.pow(10, place)) % 10
  }

  function digitCount(num) {
    if (num === 0) return 1

    return Math.floor(Math.log10(Math.abs(num))) + 1
  }

  function maxDigitCount(arr) {
    let max = 0

    for (let i = 0; i < arr.length; i++) {
      max = Math.max(max, digitCount(arr[i]))
    }

    return max
  }

  const maxDigits = maxDigitCount(a)

  let arr = a

  for (let k = 0; k < maxDigits; k++) {
    const buckets = Array.from({ length: 10 }, () => [])

    for (let i = 0; i < arr.length; i++) {
      const digit = getDigit(arr[i], k)

      buckets[digit].push(arr[i])
    }

    arr = [].concat(...buckets)
  }

  return arr
}
```

## Selection Sort

The source file was an empty stub (`function selectionSort() {}`) with only a doc comment. Filled in below with the textbook version: repeatedly scan the unsorted remainder for the smallest element and swap it into place at the front. Complexity O(N²) in every case, since the scan runs regardless of how sorted the input already is.

```javascript
/** Selection sort is the child's algorithm: simple, but inefficient.
 * Find the smallest element using a linear scan and move it to the front (swapping it with the front element).
 * Then, find the second smallest and move it, again doing a linear scan. Continue doing this until all the elements are in place.
 *
*/
// Solution, Complexity O(N²)
// Was an empty stub — filled in with a standard selection sort.
function selectionSort(a) {
  function swap(arr, i, j) {
    const temp = arr[i]

    arr[i] = arr[j]
    arr[j] = temp
  }

  for (let i = 0; i < a.length - 1; i++) {
    let minIndex = i

    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[minIndex]) {
        minIndex = j
      }
    }

    if (minIndex !== i) {
      swap(a, i, minIndex)
    }
  }

  return a
}
```

## Complexity Comparison

| Algorithm      | Best       | Average    | Worst      | Space     | Stable? |
|----------------|------------|------------|------------|-----------|---------|
| Bubble Sort    | O(N)       | O(N²)      | O(N²)      | O(1)      | Yes     |
| Counting Sort  | O(N + K)   | O(N + K)   | O(N + K)   | O(N + K)  | Yes     |
| Merge Sort     | O(N log N) | O(N log N) | O(N log N) | O(N)      | Yes     |
| Quick Sort     | O(N log N) | O(N log N) | O(N²)      | O(log N)  | No      |
| Radix Sort     | O(N·K)     | O(N·K)     | O(N·K)     | O(N + K)  | Yes     |
| Selection Sort | O(N²)      | O(N²)      | O(N²)      | O(1)      | No      |
