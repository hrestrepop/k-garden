# Trees

Core binary-tree operations from the DSA practice repo: search, aggregation, height, serialization, and ancestor-finding. A couple of these files had small but real bugs that are fixed below.

## searchNode.js

Binary-search-tree lookup: recurses left or right by comparing the target value against the current node, returning the matching node or `null`. O(log N) on a balanced tree, O(N) worst case.

```javascript
function searchNode(root, val) {
  if (root === null || root.value === val) {
    return root
  }

  if (val < root.value) {
    return searchNode(root.left, val)
  }

  return searchNode(root.right, val)
}
```

## sumNodes.js

Sums every value in a binary tree via simple recursive traversal (left subtree + current node + right subtree). O(N) time, O(N) worst-case recursion depth.

```javascript
// Solution 1, Complexity O(2 log N) -> O(log N)
function sumNodes(n) {
  if (n === null) {
    return 0
  }

  return sumNodes(n.l) + n.x + sumNodes(n.r)
}

const node = {
  x: 1,
  l: {
    x: 2,
    l: null,
    r: {
      x: 4,
      l: null,
      r: null
    }
  },
  r: {
    x: 3,
    l: null,
    r: null
  }
}

const result = sumNodes(node) // 10
```

## binaryHeight.js

Computes the height of a binary tree by recursing into both children and taking `1 + max(leftHeight, rightHeight)`, with an empty tree defined as height `-1`. O(N) time, O(N) worst-case recursion depth.

**Fixed:** the function is declared as `binaryHeight` but both its internal recursive calls and the demo call at the bottom referenced an undefined `treeHeight`. Corrected all references to call `binaryHeight` consistently.

```javascript
/** Task: Return the height of a Binary Tree */

// Solution 1, Complexity O(N)
function binaryHeight(root) {
  if (!root) {
    return -1
  }

  return 1 + Math.max(binaryHeight(root.left), binaryHeight(root.right))
}

const node = {
  info: 3,
  left: {
    info: 2,
    left: {
      info: 1,
      left: null,
      right: null
    },
    right: null
  },
  right: {
    info: 5,
    left: {
      info: 4,
      left: null,
      right: null
    },
    right: {
      info: 6,
      left: null,
      right: {
        info: 7,
        left: null,
        right: null
      }
    }
  }
}

binaryHeight(node) // 3
```

## serializeTree.js

Serializes a binary tree to a string via level-order (BFS) traversal, appending each node's value or `*` for `null` children as it walks the queue. O(N) time and space.

**Fixed:** the final line returned `serialize` (the function itself, a naming typo) instead of the accumulated `serializedStr` variable that the loop actually builds.

```javascript
function serialize(root) {
  let serializedStr = ''

  if (root === null) {
    return serializedStr
  }

  const queue = [root]

  while (queue.length) {
    const firstNode = queue.shift()

    if (firstNode === null) {
      serializedStr += '*'
    } else {
      serializedStr += `${firstNode.val}`

      queue.push(firstNode.left)
      queue.push(firstNode.right)
    }
  }

  return serializedStr
}
```

## largestNodeFromArray.js

Given an array-represented binary tree (heap-style indexing), determines whether the left or right subtree (relative to the root's two children) has the larger sum. Walks the array two elements at a time, alternating which side accumulates. O(N) time.

**Fixed:** removed a leftover `// Type your solution here` boilerplate comment. Also fixed `arr[idx] + arr[idx + 1] ? arr[idx + 1] : 0`, which incorrectly tested the *truthiness of a sum* (breaking whenever that sum happened to be `0`) instead of checking whether a next element actually exists; changed to a proper bounds check: `idx + 1 < arr.length ? arr[idx + 1] : 0`.

```javascript
/** Task: find the largest node and return it's total sumed */

//Solution 1, Complexity O(log N)
const largestNodeFromArray = (arr) => {
  if (arr.length <= 1) {
    return ''
  }

  let left = arr[0] + arr[1],
    right = arr[0] + arr[2]

  let idx = 2,
    isLeft = true

  while (idx < arr.length) {
    const total = idx + 1 < arr.length ? arr[idx + 1] : 0

    if (isLeft) {
      left += total
    } else {
      right += total
    }

    idx += 2
    isLeft = !isLeft
  }

  if (left === right) {
    return ''
  }

  return left > right ? 'Left' : 'Right'
}
```

## lowerCommonAncestor.js

Finds the lowest common ancestor of two values in a binary tree by locating each node via BST search, then walking both nodes up toward the root (via `parent` pointers) until they meet. O(N) time for the two searches plus O(H) for the ancestor walk.

> Flagged by the original author as not fully tested — the file's header TODO reads "finish testing and Python implementation."

```javascript
/** Task: find lower common ancestor
 * TODO: finish testing and Python implementation
 */

// Solution 1, Complexity O(N + N)
function lowerCommonAncestor(root, v1, v2) {
  function searchNode(root, val) {
    if (root === null || root.value === val) {
      return root
    }

    if (val < root.value) {
      return searchNode(root.left, val)
    }

    return searchNode(root.right, val)
  }

  let currentV1 = searchNode(root, v1),
    currentV2 = searchNode(root, v2),
    LCA = null,
    isRoot = false

  while (!isRoot) {
    if (currentV1.value === currentV2.value) {
      return currentV1.value
    }

    isRoot = currentV1.parent === null && currentV2.parent === null

    if (currentV1.parent !== null) {
      currentV1 = currentV1.parent
    }

    if (currentV2.parent !== null) {
      currentV2 = currentV2.parent
    }
  }

  return LCA
}

function BinaryTree(value) {
  this.value = value
  this.left = null
  this.right = null
  this.parent = null
}

const four = new BinaryTree(4),
  two = new BinaryTree(2),
  one = new BinaryTree(1),
  three = new BinaryTree(3),
  seven = new BinaryTree(7),
  six = new BinaryTree(6)

four.left = two
two.left = one
two.right = three

four.right = seven
seven.left = six

six.parent = seven
seven.parent = four

two.parent = four
three.parent = two
one.parent = two

lowerCommonAncestor(four, 1, 3) // 2
```
