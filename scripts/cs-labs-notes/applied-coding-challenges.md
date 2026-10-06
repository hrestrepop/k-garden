# Applied Coding Challenges

A grab-bag of self-contained coding exercises: a sensor-log parser, a character-frequency problem, and a classic closure gotcha.

## evaluateLogFile

A sensor-log parser and the most complete file in the set — it ships its own inline test log, an exported function, and a demo invocation. The log mixes thermometer, humidity, and monoxide sections; the first line is a `reference` row giving the expected room temperature, humidity, and CO level to compare readings against. For each sensor block it computes the mean and standard deviation of its readings in a single pass, then classifies thermometers as `'ultra precise'` / `'very precise'` / `'precise'` based on how close their mean is to the reference temperature and how tight their standard deviation is, while humidity and monoxide sensors are simply flagged `'keep'` or `'discard'` based on whether any reading deviates from the reference by more than an allowed constraint.

```javascript
const fileContent = `reference 70.0 45.0 6
thermometer temp-1
2007-04-05T22:00 72.4
2007-04-05T22:01 76.0
2007-04-05T22:02 79.1
2007-04-05T22:03 75.6
2007-04-05T22:04 71.2
2007-04-05T22:05 71.4
2007-04-05T22:06 69.2
2007-04-05T22:07 65.2
2007-04-05T22:08 62.8
2007-04-05T22:09 61.4
2007-04-05T22:10 64.0
2007-04-05T22:11 67.5
2007-04-05T22:12 69.4
thermometer temp-2
2007-04-05T22:01 69.5
2007-04-05T22:02 70.1
2007-04-05T22:03 71.3
2007-04-05T22:04 71.5
2007-04-05T22:05 69.8
humidity hum-1
2007-04-05T22:04 45.2
2007-04-05T22:05 45.3
2007-04-05T22:06 45.1
humidity hum-2
2007-04-05T22:04 44.4
2007-04-05T22:05 43.9
2007-04-05T22:06 44.9
2007-04-05T22:07 43.8
2007-04-05T22:08 42.1
monoxide mon-1
2007-04-05T22:04 5
2007-04-05T22:05 7
2007-04-05T22:06 9
monoxide mon-2
2007-04-05T22:04 2
2007-04-05T22:05 4
2007-04-05T22:06 10
2007-04-05T22:07 8
2007-04-05T22:08 6`

function getTempBrand(roomTemp = 0, mean = 0, std = 0) {
  const diff = Math.abs(roomTemp - mean)

  if (diff <= 0.5 && std < 3) {
    return 'ultra precise'
  }

  if (diff <= 0.5 && std < 5) {
    return 'very precise'
  }

  return 'precise'
}

function getIsDiscarded(readingRef = 0, constraint = 0, readings = []) {
  const isDiscarded = readings.some(
    (val) => Math.abs(readingRef - val) > constraint
  )

  return isDiscarded ? 'discard' : 'keep'
}

export function evaluateLogFile(logContentsStr) {
  const matchExp = /([a-z]+)\s([a-z]+\-\d)/
  const splitFile = logContentsStr.split(/\n/)
  const reference = splitFile.shift().split(' ')

  const roomTemp = Number(reference[1])
  const relativeHumidity = Number(reference[2])
  const ppmCM = Number(reference[3])

  const mappersDict = {
    thermometer: (mean, std) => getTempBrand(roomTemp, mean, std),
    humidity: (_, __, readings) =>
      getIsDiscarded(relativeHumidity, 1, readings),
    monoxide: (_, __, readings) => getIsDiscarded(ppmCM, 3, readings)
  }

  let fn = null,
    i = 0,
    lastSensorType = null

  const readingsDict = {}

  while (i < splitFile.length) {
    let j = i
    const matched = matchExp.exec(splitFile[i])

    if (!!matched) {
      readingsDict[matched[2]] = 0
      lastSensorType = matched[2]
      fn = mappersDict[matched[1]]

      i += 1
      // jumps into the next row as this is a sensor-name-row, no need for further computation
      continue
    }

    const readings = []

    // when row is not of type sensor-name we proccess subsequent children rows to make all calculations
    while (!matchExp.test(splitFile[j]) && j < splitFile.length) {
      readings.push(Number(splitFile[j].split(' ')[1]))

      j++
    }

    const mean =
      readings.reduce((acc, curr) => {
        return acc + curr
      }, 0) / readings.length

    const variance =
      readings
        .map((r) => (r - mean) ** 2)
        .reduce((acc, curr) => acc + curr, 0) / readings.length

    const std = Math.sqrt(variance)

    readingsDict[lastSensorType] = fn(mean, std, readings)

    // as subsequent rows were computed already, we move on to the next sensor-name-row index.
    // this way we keep the time complexity around O(N+N)
    i = j
  }

  return readingsDict
}

const results = evaluateLogFile(fileContent)

console.log('results', results)
```

## secondMostFrequent

Finds the second-most-frequent character in a string in O(N) by counting character occurrences into a fixed-size array (indexed by char code), then scanning the counts once to track the top two frequencies.

```javascript
// Solution 1, Complexity: O(N)
function secondMostFrequent(str) {
  const NO_OF_CHARS = 256
  const count = new Array(NO_OF_CHARS).fill(0)

  for (let i = 0; i < str.length; i++) {
    count[str[i].charCodeAt()]++
  }

  let first = 0,
    second = 0

  for (let i = 0; i < NO_OF_CHARS; i++) {
    /* If current element is smaller
            than first then update both first
            and second */
    if (count[i] > count[first]) {
      second = first
      first = i
    }

    if (count[i] > count[second] && count[i] < count[first]) {
      /* If count[i] is in between first
              and second then update second */
      second = i
    }
  }

  return String.fromCharCode(second)
}

secondMostFrequent('geeksforgeeks') // g
```

## loopClosure

The classic `var`-in-a-loop closure pitfall: `var` is function-scoped, so every `setTimeout` callback in the first loop closes over the *same* `i`, which has already reached its final value by the time any callback runs. The second example shows the same issue surfacing through a helper function (`getTimeOut`) that schedules a callback per loop iteration.

```javascript
/**
 * With ES6 you can create a solution to the code quickly.
 * By changing var to let, it allows the value of i to be “held” until after the setTimeout is finished.
 */

const arr = [10, 12, 15, 21]

for (var i = 0; i < arr.length; i++) {
  // using var waits for last i value which is 4, using let, it gets block-scoped and hold the valus of i
  setTimeout(function () {
    console.log('index: ' + i + ' element : ' + arr[i])
  }, 3000)
}


// Executes timeout every second n times
function getTimeOut(val) {
  return setTimeout(function () {
    console.log(val)
  }, 1000 * val)
}

for (var i = 1; i < 10; i++) {
  getTimeOut(i)
}
```
