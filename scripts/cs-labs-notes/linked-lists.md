# Linked Lists

Doubly linked list operations: sorted insertion, insertion at an arbitrary position, and full reversal.

## Sorted Insert (sortedInsert.js)

Inserts a new node into a sorted doubly linked list at the correct position, handling the head-insert case, mid-list insert, and tail-append separately. `O(N)`.

```javascript
/** Task: insert new node in a sorted Doubly LinkList in the right position */

// Solution 1, Complexity O(N)
function sortedInsert(head, data) {
  let currentNode = head,
    insertNode = null

  if (data < currentNode.data) {
    insertNode = {
      data,
      next: currentNode,
      prev: null
    }

    head = insertNode

    return head
  }

  while (currentNode !== null) {
    if (data <= currentNode.data) {
      insertNode = {
        data,
        next: currentNode,
        prev: currentNode.prev
      }

      currentNode.prev.next = insertNode

      return head
    }

    if (currentNode.next === null) {
      insertNode = {
        data,
        prev: currentNode,
        next: null
      }

      currentNode.next = insertNode

      return head
    }

    currentNode = currentNode.next
  }

  return head
}

function Node(data) {
  this.data = data
  this.prev = null
  this.next = null
}

const n1 = new Node(1)
const n2 = new Node(2)
const n3 = new Node(6)

n1.prev = null
n1.next = n2

n2.prev = n1
n2.next = n3

n3.prev = n2
n3.next = null

function LinkedList() {
  this.head = n1
}

const ll = new LinkedList()

const result = sortedInsert(ll.head, 0)
```

## Reverse (reverse.js)

Reverses a sorted doubly linked list in place. Does a first pass to record every node by position, then rebuilds the `next`/`prev` pointers from the tail backward. `O(N)`.

```javascript
/** Task: reverse a sorted Doubly LinkList */

// Solution 1, Complexity O(N)
function reverse(head) {
  if (!head) {
    return null
  }

  let currentNode = head,
    count = 0,
    last = null,
    table = {}

  while (currentNode !== null) {
    last = currentNode

    table[count] = last

    count++

    currentNode = currentNode.next
  }

  head.next = null
  head.prev = table[count - 2]

  head = last

  let nextHead = head

  for (let i = count - 2; i >= 0; i--) {
    nextHead.prev = nextHead.next
    nextHead.next = table[i]

    nextHead = nextHead.next
  }

  return head
}
```

## Insert At Position (insertAt.js)

Inserts a new node with the given data at a specific position in a singly linked list (position `0` becomes the new head; otherwise walks to the node just before the target position and splices in the new node). `O(N)`.

The original had a copy-paste bug: the inserted node referenced an undefined `value` variable instead of the function's actual `data` parameter. Fixed below.

```javascript
function insertAt(head, data, position) {
  if (position === 0) {
    const next = head

    head = {
      data: data,
      next: next
    }
  } else {
    let cur = head
    let i = 0

    while (cur != null) {
      if (i == position - 1) {
        let node = {
          data: data,
          next: cur.next
        }

        cur.next = node

        return head
      } else {
        i++
        cur = cur.next
      }
    }
  }

  return head
}
```
