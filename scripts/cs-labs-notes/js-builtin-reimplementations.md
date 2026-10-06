# JS Built-in Reimplementations

Hand-rolled reimplementations of core `Array`/`Number` prototype methods, written to internalize how they actually behave.

## array/map

Builds a new array by applying `fn(element, index, array)` to each item and writing the result to the same index.

```javascript
function map(arr, fn) {
  const result = []

  for (let i = 0; i < arr.length; i++) {
    result[i] = fn(arr[i], i, arr)
  }

  return result
}
```

## array/filter

Builds a new array containing only the elements for which `fn(element, index, array)` returns exactly `true`.

```javascript
function filter(arr, fn) {
  const result = []

  for (let i = 0; i < arr.length; i++) {
    if (fn(arr[i], i, arr) === true) {
      result.push(arr[i])
    }
  }

  return result
}
```

## array/reduce

The original version defaulted a missing `initialValue` to `0` and always looped over every element starting at index 0. That doesn't match real `Array.prototype.reduce` semantics — when no initial value is supplied, the accumulator should start as `arr[0]` and iteration should begin at index 1. The `0` default happened to work for numeric-sum reducers but silently produces wrong results for any non-additive reducer (e.g. finding a max, concatenating strings, building an object). Fixed to follow the real spec:

```javascript
function reduce(arr, reducer, initialValue) {
  let accumulator = initialValue
  let startIndex = 0

  if (accumulator === undefined) {
    accumulator = arr[0]
    startIndex = 1
  }

  for (let i = startIndex; i < arr.length; i++) {
    accumulator = reducer(accumulator, arr[i], i, arr)
  }

  return accumulator
}
```

## number/toFixed

The original multiplied by a hardcoded `100` regardless of the requested `decimals`, then `Math.ceil`'d a sliced substring of the decimal digits. That means it ignored `decimals` for the rounding step itself, always rounded up instead of rounding to nearest, and broke for multi-digit precision since slicing digit characters and `Math.ceil`-ing them isn't equivalent to numeric rounding. Fixed to use the standard scale-round-unscale approach, with zero-padding so the result always has the requested number of decimal places:

```javascript
function toFixed(number, decimals) {
  const factor = 10 ** decimals
  const rounded = Math.round(number * factor) / factor

  const [intPart, decPart = ''] = rounded.toString().split('.')

  return `${intPart}.${decPart.padEnd(decimals, '0')}`
}
```
