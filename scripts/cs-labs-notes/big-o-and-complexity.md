# Big O & Complexity

Big O measures how an algorithm's time or space requirements grow as the input grows — and it does that in a way that's independent of the computer it runs on, so it's comparable across machines, languages, and time.

![Growth rate comparison of the common complexity classes, log scale](/uploads/big-o-growth-chart.svg)

## Classes of running time

| Class | Notation | Feel |
|---|---|---|
| Constant | O(1) | Same cost no matter how big the input gets |
| Logarithmic | O(log n) | Cost grows very slowly — halving the problem each step |
| Linear | O(n) | Cost scales directly with input size |
| Linearithmic | O(n log n) | The sweet spot for comparison-based sorting |
| Polynomial | O(n²), O(n³), O(n⁴)... | Nested loops over the input — gets expensive fast |
| Exponential | O(2ⁿ), O(3ⁿ)... | Brute-force search over combinations — explodes quickly |

As the chart above shows, by n = 20 the quadratic curve is already an order of magnitude past linear — the gap only widens from there.

## How to identify the running time of an algorithm

1. **Understand how the algorithm works.**
   - What's the purpose of the algorithm?
   - What are the inputs?
   - What are the outputs?

2. **Identify a basic unit of the algorithm to count.**
   - Print statements
   - Iterations / assignment statements
   - Recursive calls
   - Focus on the *worst case* — that's what Big O describes.

3. **Map the growth of that count to a Big O class.**
   - Is the growth constant? Linear? Does it double with every doubling of input (quadratic)?
