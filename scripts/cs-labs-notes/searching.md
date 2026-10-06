# Searching

Binary search on a sorted array, shown in both iterative and recursive form.

## Binary Search (Iterative)

Repeatedly compares the target to the midpoint of the current range and narrows to the left or right half until it's found or the range is empty. Complexity O(log N).

```javascript
/** In binary search, we look for an element x in a SORTED array by first comparing x to the midpoint of the array.
 * If x is less than the midpoint, then we search the left half of the array.
 * If x is greater than the midpoint, then we search the right half of the array.
 * We then repeat this process, treating the left and right halves as sub-ar­rays.
 * Again, we compare x to the midpoint of this subarray and then search either its left or right side.
 * We repeat this process until we either find x or the subarray has size 0.
 * */

// Solution, Complexity O(log N)
function binarySearch(a, x) {
  let middle = Math.floor(a.length / 2)
  let left = 0
  let right = a.length

  while (right >= left) {
    const middleValue = a[middle]

    if (middleValue === x) {
      return middle
    }

    if (middleValue > x) {
      right = middle - 1
    } else {
      left = middle + 1
    }

    middle = Math.floor((left + right) / 2)
  }

  return -1
}
```

## Binary Search (Recursive)

Same idea as the iterative version, expressed as a recursive helper that narrows `left`/`right` bounds on each call instead of looping. Complexity O(log N).

```javascript
// Solution 2 (recursive), Complexity O(log N)
function binarySearch(arr, x) {
  function search(a, x, left, right) {
    if (right >= left) {
      let middle = Math.floor((left + right) / 2)

      if (a[middle] === x) {
        return middle
      }

      if (x > a[middle]) {
        return search(a, x, middle + 1, right)
      }

      return search(a, x, left, middle - 1)
    }

    return -1
  }

  return search(arr, x, 0, arr.length)
}
```
