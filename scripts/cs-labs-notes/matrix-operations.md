# Matrix Operations

Matrix manipulation from the DSA practice repo — currently just a single, fairly dense rotation algorithm.

## rotation.js

Rotates an M×N matrix `r` times in the anti-clockwise direction. The approach peels the matrix into concentric square "layers" (like an onion), and for each layer walks its border clockwise — top row, right column, bottom row, left column — encoding each cell as a `{"v": value, "i": row, "r": col}` JSON-string fragment (via string concatenation rather than building objects directly, which is the file's more unusual stylistic choice). Each layer's encoded fragments are split, parsed back into objects, and rotated by shifting every element's value `r` positions forward within that layer (`rotate`); the rotated layers are then flattened and written back into the matrix in place (`fill`). Complexity is O(M×N) to visit every cell, independent of `r` (handled via modulo on each layer's length).

```javascript
/*
  You are given a 2D matrix of dimension  and a positive integer.
  You have to rotate the matrix r times and print the resultant matrix.
  Rotation should be in anti-clockwise direction.

  @param {int} m - Matrix cols number.
  @param {int} n - Matrix rows number.
  @param {int} r - Number of ratations.
  @example matrixRotation(matrix, 5, 4, 140000)
*/
function matrixRotation(matrix, m, n, r) {
  const totalLayers = Math.min(m, n) / 2

  let i = 0,
    rowIndex = 0,
    colIndex = 0,
    result = []
  let colLimit = m,
    rowLimit = n,
    layers = []

  for (let layer = 0; layer < totalLayers; layer++) {
    result[layer] = ''

    i = rowIndex

    while (i < rowLimit) {
      result[layer] += `{"v":${matrix[rowIndex][i]},"i":${rowIndex},"r":${i}};`
      i++
    }

    rowIndex++

    i = rowIndex

    while (i < colLimit) {
      result[layer] += `{"v":${
        matrix[i][rowLimit - 1]
      },"i":${i},"r":${rowLimit - 1}};`
      i++
    }

    rowLimit--

    i = rowLimit - 1

    while (i >= colIndex) {
      result[layer] += `{"v":${matrix[colLimit - 1][i]},"i":${colLimit -
        1},"r":${i}};`
      i--
    }

    colLimit--

    i = colLimit - 1

    while (i > colIndex) {
      result[layer] += `{"v":${matrix[i][colIndex]},"i":${i},"r":${colIndex}};`
      i--
    }

    layers = result[layer]
      .split(';')
      .filter(o => !!o)
      .map(o => JSON.parse(o))

    result[layer] = rotate(layers, r)

    colIndex++
  }

  const parsed = result.reduce((acc, o) => {
    return [...acc, ...o]
  }, [])

  return fill(matrix, parsed)
}

function rotate(layer, r) {
  const len = layer.length
  let i,
    copy = Object.assign(
      [],
      layer.map(o => o.v)
    ),
    idx

  for (i = 0; i < len; ++i) {
    idx = (i + r) % len
    layer[i]['v'] = copy[idx]
    copy[idx] = null
  }

  copy = null

  return layer
}

function fill(matrix, layers) {
  let i,
    len = layers.length

  for (i = 0; i < len; ++i) {
    matrix[layers[i]['i']][layers[i]['r']] = layers[i]['v']
  }

  return matrix
}

function printMatrix(matrix, m, n) {
  let str = ''
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      str += matrix[i][j]
      if (j < n - 1) {
        str += ` `
      }
    }
    if (i < m - 1) {
      str += `\n`
    }
  }
  return str
}
```
