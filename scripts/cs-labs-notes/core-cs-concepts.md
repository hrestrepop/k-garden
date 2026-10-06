# Core CS Concepts

A few foundational ideas that come up constantly once you're past basic Big-O notation and into analyzing and designing algorithms.

## Master Theorem

The master method is a formula for solving recurrence relations of the form:

```text
T(n) = aT(n/b) + f(n)

where:
  n    = size of input
  a    = number of subproblems in the recursion
  n/b  = size of each subproblem (all subproblems assumed equal size)
  f(n) = cost of the work done outside the recursive call — dividing
         the problem and merging the solutions
```

Here, a ≥ 1 and b > 1 are constants, and f(n) is an asymptotically positive function — meaning for a sufficiently large n, f(n) > 0.

> Master theorem is used to calculate the time complexity of recurrence relations (divide-and-conquer algorithms) quickly, without unrolling the recursion by hand.

## Asymptotic Analysis

The study of how an algorithm's performance changes as the input size changes is called **asymptotic analysis**.

Asymptotic notations are the mathematical notations used to describe an algorithm's running time as the input size tends toward a particular (usually large) value. There are three main ones:

- **Big-O (O)** — upper bound, the worst case
- **Omega (Ω)** — lower bound, the best case
- **Theta (Θ)** — tight bound, when best and worst case match

## Divide and Conquer

A strategy for breaking a complex problem down into a set of smaller problems. It requires breaking a piece of data down into smaller pieces until the pieces are simple enough to be solved directly.

```text
procedure p(input x of size n):
  if n < some constant k:
    solve x directly, without recursion
  else:
    create subproblems of x, each of size n/b
    call p recursively on each subproblem
    combine the results from the subproblems
```

Merge sort, quick sort, and binary search are all divide-and-conquer algorithms — see the **Sorting Algorithms** and **Searching** notes for working implementations, and the Master Theorem above for how to reason about their complexity.
