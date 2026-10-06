# Custom Data Structures

From-scratch implementations of the core data structures backing the algorithms in this repo — graphs, linked lists, a priority queue, a queue, and a stack.

## graph.js

An adjacency-map `Graph`: `nodes` is an object keyed by node value, where each value maps to an object of its connected neighbors. Supports `addNode`, `addEdge`, `removeNode`, `removeEdge`, `hasNode`, `hasEdge`, and `findEdges`; `removeNode` also sweeps every other node's edge map to clean up references to the removed node. All operations are O(1) average case except `removeNode`, which is O(V) due to that sweep.

```javascript
function Graph() {
  this.nodes = {}
}

Graph.prototype.addEdge = function (node, edge) {
  if (this.nodes[node] === undefined) {
    return 'node does not exist'
  }

  if (this.nodes[node][edge]) {
    return `edge ${node}-${edge} already exists`
  }

  this.nodes[node][edge] = true
}

Graph.prototype.addNode = function (value) {
  if (this.nodes[value] !== undefined) {
    return `node of value ${value} already exists`
  }

  this.nodes[value] = {}
}

Graph.prototype.findEdges = function (node) {
  if (this.nodes[node] === undefined) {
    return 'node does not exist'
  }

  return this.nodes[node]
}

Graph.prototype.hasEdge = function (node, edge) {
  if (this.nodes[node] === undefined) {
    return false
  }

  return this.nodes[node][edge] !== undefined
}

Graph.prototype.hasNode = function (node) {
  return this.nodes[node] !== undefined
}

Graph.prototype.removeEdge = function (node, edge) {
  if (this.nodes[node] === undefined) {
    return 'node does not exist'
  }

  delete this.nodes[node][edge]
}

Graph.prototype.removeNode = function (node) {
  if (this.nodes[node] === undefined) {
    return 'node does not exist'
  }

  delete this.nodes[node]

  for (var currNode in this.nodes) {
    if (this.nodes[currNode][node] !== undefined) {
      delete this.nodes[currNode][node]
    }
  }
}
```

## linkedList.js

A singly linked list built from a plain `Node(data, next)` constructor. `getAt(index)` walks from the head counting steps; `insertAt(data, index)` handles the empty-list case, head insertion, and mid-list insertion by splicing a new node in after the node at `index - 1`. `getAt` is O(N); `insertAt` is O(N) due to the `getAt` lookup it relies on.

```javascript
function Node(data, next = null) {
  this.data = data
  this.next = next
}

function LinkedList() {
  this.head = null
}

LinkedList.prototype.getAt = function (index) {
  let counter = 0
  let node = this.head

  while (node) {
    if (counter === index) {
      return node
    }

    counter++
    node = node.next
  }

  return null
}

LinkedList.prototype.insertAt = function (data, index) {
  if (!this.head) {
    this.head = new Node(data)

    return
  }

  if (index === 0) {
    this.head = new Node(data, this.head)
    return
  }

  const previous = this.getAt(index - 1)
  let newNode = new Node(data)

  newNode.next = previous.next
  previous.next = newNode

  return this.head
}

const list = new LinkedList()
```

## priorityQueue.js

A proper ES6-class binary-heap priority queue, with a configurable `compare` function (defaults to standard ascending order) — this is the "real" priority queue that `graph/shortestPath.js` referenced via a commented-out import but never actually used (that file has since been replaced with a plain BFS implementation in the Graphs note, since its underlying grid was unweighted). Internally it's a classic array-backed binary heap: `push` appends and sifts up (`_up`), `pop` swaps the last element into the root and sifts down (`_down`), and the constructor can heapify an existing array in O(N). `push`/`pop` are O(log N); `peek` is O(1).

```javascript
export default class PriorityQueue {
  constructor(data = [], compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0)) {
    this.data = data
    this.length = this.data.length
    this.compare = compare

    if (this.length > 0) {
      for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i)
    }
  }

  push(item) {
    this.data.push(item)
    this._up(this.length++)
  }

  pop() {
    if (this.length === 0) return undefined

    const top = this.data[0]
    const bottom = this.data.pop()

    if (--this.length > 0) {
      this.data[0] = bottom
      this._down(0)
    }

    return top
  }

  peek() {
    return this.data[0]
  }

  _up(pos) {
    const item = this.data[pos]

    while (pos > 0) {
      const parent = (pos - 1) >> 1
      const current = this.data[parent]
      if (this.compare(item, current) >= 0) break
      this.data[pos] = current
      pos = parent
    }

    this.data[pos] = item
  }

  _down(pos) {
    const halfLength = this.length >> 1
    const item = this.data[pos]

    while (pos < halfLength) {
      let bestChild = (pos << 1) + 1 // initially it is the left child
      const right = bestChild + 1

      if (
        right < this.length &&
        this.compare(this.data[right], this.data[bestChild]) < 0
      ) {
        bestChild = right
      }
      if (this.compare(this.data[bestChild], item) >= 0) break

      this.data[pos] = this.data[bestChild]
      pos = bestChild
    }

    this.data[pos] = item
  }
}
```

## queue.js

A FIFO queue backed by a plain array, with `enqueue`/`dequeue` (aliased as `add`/`remove`), `peek`, and `isEmpty`. `enqueue` is O(1); `dequeue` is O(N) since `Array.shift()` reindexes the underlying array.

```javascript
function Queue() {
  // this.list = new LinkedList() // Can also be implemented using a LinkedList
  this.list = []
}

Queue.prototype.enqueue = function (value) {
  this.list.push(value)
}

Queue.prototype.dequeue = function () {
  return this.list.shift()
}

Queue.prototype.peek = function () {
  return this.isEmpty() ? null : this.list[0]
}

Queue.prototype.isEmpty = function () {
  return this.list.length === 0
}

// alias
Queue.prototype.add = Queue.prototype.enqueue
Queue.prototype.remove = Queue.prototype.dequeue
```

## stack.js

A LIFO stack backed by a plain array, with `push`, `pop`, `peek`, `size`, `isEmpty`, and `toArray`. All operations are O(1).

```javascript
function Stack() {
  this.stack = []
}

Stack.prototype.size = function () {
  return this.stack.length
}

Stack.prototype.isEmpty = function () {
  return this.size() == 0
}

Stack.prototype.push = function (value) {
  this.stack.push(value)
}

Stack.prototype.pop = function () {
  return this.stack.pop()
}

Stack.prototype.peek = function () {
  if (this.isEmpty()) {
    return null
  }

  return this.stack[this.size() - 1]
}

Stack.prototype.toArray = function () {
  return this.stack
}
```

There's also a `tree.js` in this directory, but it's just two bare constructor functions (`Tree`, `BinaryTree`) with no methods attached, so it isn't worth its own subsection here.
