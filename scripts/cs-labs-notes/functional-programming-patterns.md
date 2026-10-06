# Functional Programming Patterns

Core FP building blocks in JavaScript: composing and piping unary functions, transducers, memoization, and the iterator/generator protocol.

## compose

Right-to-left function composition: the rightmost function runs first, and its result feeds into the next one to its left. The source file's first attempt referenced an undefined `args` variable inside the returned function; fixed here to capture the call argument via the function's own parameter.

```javascript
function compose(...fns) {
  return function (...args) {
    return fns.reduceRight((acc, fn) => fn(acc), args[0])
  }
}

// ES6 version
const compose = (...fns) => (args) =>
  fns.reduceRight((arg, fn) => fn(arg), args)
```

## pipe

Left-to-right composition, the mirror image of `compose` — functions run in the order listed.

```javascript
const pipe = (...fns) => args => fns.reduce((arg, fn) => fn(arg), args);
```

## transducers

A transducer composes `map`/`filter`-style transformations into a single reducing function, so a collection is only traversed once instead of once per `.map()`/`.filter()` call. `doubleEvens` composes `filter(isEven)` and `map(double)` into one step function, which is then driven by a single `reduce` call. The `TODO` is the author's own forward-looking note (extending this to other data types), not a bug.

```javascript
// TODO: create transducers with other data types numbers, objects etc...
const compose = (...fns) => {
  return (x) => {
    return fns.reduceRight((y, f) => f(y), x)
  }
}

const map = (f) => (step) => (a, c) => step(a, f(c))

const filter = (predicate) => (step) => (a, c) =>
  predicate(c) ? step(a, c) : a

const isEven = (n) => n % 2 === 0
const double = (n) => n * 2

const doubleEvens = compose(filter(isEven), map(double))

const arrayConcat = (a, c) => a.concat([c])

const xform = doubleEvens(arrayConcat)

const result = [2, 5, 8, 12].reduce(xform, [])

console.log(result) // [4, 16, 24]
```

## memoization

A generic `memoize` higher-order function caches results of an expensive call by its stringified arguments, then wraps `fibonacci` and `factorial` to demonstrate the speedup on a repeated call via `console.time`/`console.timeEnd`.

```javascript
function memoize(fn) {
  return function () {
    const args = Array.prototype.slice.call(arguments)
    fn.cache = fn.cache || {}

    if (fn.cache[args]) {
      console.log('is now cached')
    }

    return fn.cache[args]
      ? fn.cache[args]
      : (fn.cache[args] = fn.apply(this, args))
  }
}

function fibonacci(num) {
  if (num == 1 || num == 2) {
    return 1
  }
  return fibonacci(num - 1) + fibonacci(num - 2)
}

function factorial(num) {
  if (num == 1 || num == 0) {
    return 1
  }
  return num * factorial(num - 1)
}

const memFib = memoize(fibonacci)

const memFact = memoize(factorial)

console.log(memFib.prototype)

console.time('non-memoized factorial(20) call')
console.log(memFact(100))
console.timeEnd('non-memoized factorial(20) call')

console.time('memoized factorial(20) call')
console.log(memFact(100))
console.timeEnd('memoized factorial(20) call')
```

## generators

An iterator is any object implementing the iterator protocol: a `next()` method returning `{ value, done }`. `makeRangeIterator` builds a custom iterator that walks a run-length-encoded string (e.g. `'4A3B2C1D2E'`) two characters at a time (count + char) and decodes each run, and `decodeString` drives it to completion in O(N). This decoder is a generator-based variant of a string run-length-decoding solution covered elsewhere in this knowledge base.

```javascript
/**
 * In JavaScript an iterator is an object which defines a sequence and potentially a return value upon its termination.

  Specifically, an iterator is any object which implements the Iterator protocol by having a next() method that returns an object with two properties:

  value
  The next value in the iteration sequence.

  done
  This is true if the last value in the sequence has already been consumed.
  If value is present alongside done, it is the iterator's return value.
*/

function makeRangeIterator(start = 0, end = 1, s = '') {
  return {
    next: function () {
      const [num, char] = [parseInt(s[start]), s[end]]

      let decoded = '',
        c = 0

      while (c < num) {
        decoded += char

        c++
      }

      start = start + 2

      end = start + 1

      return { value: decoded, done: end === s.length + 1 }
    }
  }
}

// Complexity O(N)
function decodeString(s) {
  let decoded = ''

  const it = makeRangeIterator(0, 1, s)

  let result = it

  while (!result.done) {
    result = it.next()

    decoded += result.value
  }

  return decoded
}

decodeString('4A3B2C1D2E') // AAAABBBCCDEE
```

## iterators

A custom `Symbol.iterator` implementation lets any object be consumed by `for...of`. Here `AAA` returns a frozen object whose `[Symbol.iterator]` is a generator that delegates (`yield*`) to an inner array, so the object itself becomes iterable without exposing the array directly.

```javascript
/**
 * Iterators and Generators bring the concept of iteration directly into the core language and provide a mechanism for customizing the behavior of for...of loops.
*/
function AAA(name, items) {
  let inner = items

  return Object.freeze({
    name,
    [Symbol.iterator]: function* () {
      yield* inner
    }
  })
}

const tens = new AAA('harry', [10, 20, 30, 40])

for (let i of tens[Symbol.iterator]()) {
  console.log(i)
}
```
