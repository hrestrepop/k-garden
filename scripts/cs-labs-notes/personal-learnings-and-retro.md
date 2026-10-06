# Personal Learnings & Retro

Honest notes-to-self from working through this practice repo — kept as originally written (typos fixed, structure tightened), not polished into something they weren't.

## General lessons learned

- **Solve algorithms intuitively first.** This should always be the first pass — reach for a gut-feel approach before reaching for a known pattern.
- **Resolve straightforward problems first.** Go through the brute-force approach, and once the bottlenecks are identified, figure out what the actual challenge is — then research or figure out how to solve *that*.

## Weaknesses to keep working on

- Tendency to struggle with solving extensive/multi-part challenges in one sitting.
- Easily lose track of what's actually causing an issue once a solution attempt goes sideways — worth deliberately narrowing down to a minimal repro instead of guessing.

## How this shows up across the imported code

A few patterns in this very repo are a pretty direct illustration of both: several files only have the brute-force pass finished and never got the optimized follow-up (`algorithms/graph/shortestPath.js`'s abandoned second attempt is the clearest example), and a handful have debugging artifacts (`console.log`s, dead commented-out code) left in from a session where the root cause wasn't pinned down cleanly before moving on. Worth treating "clean up before moving to the next problem" as part of the definition of done, not an optional follow-up.
