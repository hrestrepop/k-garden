// Seeds the "AI / ML & Math Foundations" starter topic with notes built from
// the user's ML/AI/Math learning-path notes. Safe to re-run — it overwrites
// the seeded topic/notes but won't touch any other topic.
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOPICS_DIR = path.join(__dirname, "..", "topics");
const SLUG = "ai-ml-math-foundations";
const TOPIC_DIR = path.join(TOPICS_DIR, SLUG);

const now = new Date().toISOString();

const topic = {
  name: "AI / ML & Math Foundations",
  slug: SLUG,
  description:
    "The math path from linear algebra to neural networks — plus runnable Python to make it concrete.",
  level: "learning",
  createdAt: now,
  updatedAt: now,
  tags: ["math", "ml", "ai"],
  color: "#10B981",
};

function text(t, styles = {}) {
  return { type: "text", text: t, styles };
}

function writeNote(id, { title, type, order = 0, pinned = false, format, content }) {
  const front = {
    title,
    type,
    createdAt: now,
    updatedAt: now,
    tags: [],
    pinned,
    order,
    format,
  };
  const body = format === "blocknote" ? JSON.stringify(content) : content;
  writeFileSync(path.join(TOPIC_DIR, `${id}.md`), matter.stringify(body, front));
}

mkdirSync(TOPIC_DIR, { recursive: true });
writeFileSync(path.join(TOPIC_DIR, "topic.json"), JSON.stringify(topic, null, 2));

// ---------------------------------------------------------------------------
// 1. The Learning Path (concept, markdown)
// ---------------------------------------------------------------------------

writeNote("the-learning-path", {
  title: "The Learning Path",
  type: "concept",
  order: 0,
  pinned: true,
  format: "markdown",
  content: `# How the math maps to what you already know

| Concept | Area |
|---|---|
| \`θ = [2, -1, 0.5]\` | Linear algebra — vectors, matrices |
| \`output = 2·x₁ − 1·x₂ + 0.5\` | Linear algebra — dot product |
| \`tanh(...)\` | Functions (precalc-level) |
| "learning" = adjusting θ | Calculus — derivatives, gradients |
| "how wrong is it?" | Probability / stats — loss functions |

## The path, in order

### 1. Linear algebra (only the parts you need)
- Vectors, dot product, matrices, matrix × vector
- Why: every layer is "multiply by a matrix, add a vector"
- 🎥 3Blue1Brown, *Essence of Linear Algebra* (YouTube) — very visual.

### 2. Calculus (focus on derivatives)
- What a derivative is — "how much the output changes when I nudge the input"
- Partial derivatives and gradients — derivatives with respect to many inputs, like every number in θ
- The chain rule — the most important idea, since backpropagation is just the chain rule applied repeatedly
- 🎥 3Blue1Brown, *Essence of Calculus*

### 3. Light probability and statistics
- Mean, variance, probability distributions, softmax, log-likelihood
- Why: loss functions measure how wrong the network is, and they're built from these ideas

### 4. Optimization
- Gradient descent: "step downhill on the error surface"
- If you've done 1–3, you mostly know this already

## The bridge to neural networks
- 🎥 3Blue1Brown, *Neural Networks* series — connects all of the above visually
- 💻 Andrej Karpathy, *Neural Networks: Zero to Hero*, especially the micrograd video — build backpropagation from scratch in ~100 lines of Python; the calculus clicks once you've written it. See the **Micrograd Warm-up** note in this topic.
- 📘 Optional reference: *Mathematics for Machine Learning* (Deisenroth et al.), free online — use it to look things up rather than reading cover to cover.
`,
});

// ---------------------------------------------------------------------------
// 2. How the Math Maps to Neural Nets (math-notes, blocknote w/ real mathBlocks)
// ---------------------------------------------------------------------------

writeNote("how-the-math-maps-to-neural-nets", {
  title: "How the Math Maps to Neural Nets",
  type: "math-notes",
  order: 1,
  format: "blocknote",
  content: [
    {
      type: "paragraph",
      content: [
        text(
          "A single neuron, worked through step by step — each line below is the same computation, viewed through a different branch of math.",
        ),
      ],
    },
    {
      type: "heading",
      props: { level: 2 },
      content: [text("1. The weights — linear algebra")],
    },
    { type: "mathBlock", props: { code: "\\theta = [2, -1, 0.5]" } },
    {
      type: "paragraph",
      content: [
        text(
          "θ is just a vector — three numbers the network has learned. Nothing more exotic than that.",
        ),
      ],
    },
    {
      type: "heading",
      props: { level: 2 },
      content: [text("2. The forward pass — dot product")],
    },
    {
      type: "mathBlock",
      props: { code: "\\text{output} = 2x_1 - 1x_2 + 0.5" },
    },
    {
      type: "paragraph",
      content: [
        text(
          "This is a dot product between θ and the input, plus a bias term. Every layer in a neural net is this operation, repeated.",
        ),
      ],
    },
    {
      type: "heading",
      props: { level: 2 },
      content: [text("3. The nonlinearity — functions")],
    },
    { type: "mathBlock", props: { code: "a = \\tanh(\\text{output})" } },
    {
      type: "paragraph",
      content: [
        text(
          "tanh squashes the output into (-1, 1). Precalc-level function application — the interesting part is what comes next.",
        ),
      ],
    },
    {
      type: "heading",
      props: { level: 2 },
      content: [text("4. Learning — calculus")],
    },
    {
      type: "mathBlock",
      props: { code: "\\theta \\leftarrow \\theta - \\eta \\frac{\\partial L}{\\partial \\theta}" },
    },
    {
      type: "paragraph",
      content: [
        text(
          '"Learning" means adjusting θ using the gradient of a loss function. This is the chain rule, applied once per parameter.',
        ),
      ],
    },
    {
      type: "heading",
      props: { level: 2 },
      content: [text("5. How wrong is it — probability / stats")],
    },
    {
      type: "mathBlock",
      props: { code: "L = -\\log p(y \\mid x)" },
    },
    {
      type: "paragraph",
      content: [
        text(
          "Loss functions like this one come straight from probability — log-likelihood, cross-entropy, softmax all live here.",
        ),
      ],
    },
  ],
});

// ---------------------------------------------------------------------------
// 3–6. Stub concept notes
// ---------------------------------------------------------------------------

writeNote("linear-algebra-essentials", {
  title: "Linear Algebra Essentials",
  type: "concept",
  order: 2,
  format: "markdown",
  content: `# Linear Algebra Essentials

Only the parts needed for ML: every layer is "multiply by a matrix, add a vector."

## Topics to fill in
- Vectors — what they are, addition, scaling
- Dot product — and why it shows up in every forward pass
- Matrices as linear transformations
- Matrix × vector, matrix × matrix
- Shapes and broadcasting (the practical part that trips everyone up)

## Resources
- 🎥 3Blue1Brown — *Essence of Linear Algebra*
`,
});

writeNote("calculus-and-the-chain-rule", {
  title: "Calculus & the Chain Rule",
  type: "concept",
  order: 3,
  format: "markdown",
  content: `# Calculus & the Chain Rule

## Topics to fill in
- What a derivative is — "how much the output changes when I nudge the input"
- Partial derivatives — derivatives with respect to one of many inputs
- Gradients — the vector of all partial derivatives
- The chain rule — the single most important idea for backpropagation

## Why it matters
Backpropagation is the chain rule, applied repeatedly through a computation graph. Once this clicks, neural net training stops feeling magic.

## Resources
- 🎥 3Blue1Brown — *Essence of Calculus*
- 💻 Andrej Karpathy — *micrograd* (see the **Micrograd Warm-up** note)
`,
});

writeNote("probability-and-loss-functions", {
  title: "Probability & Loss Functions",
  type: "concept",
  order: 4,
  format: "markdown",
  content: `# Probability & Loss Functions

## Topics to fill in
- Mean and variance
- Probability distributions
- Softmax — turning scores into probabilities
- Log-likelihood and cross-entropy loss

## Why it matters
Loss functions measure "how wrong is it?" — and they're built directly from these ideas.
`,
});

writeNote("gradient-descent-and-optimization", {
  title: "Gradient Descent & Optimization",
  type: "cheatsheet",
  order: 5,
  format: "markdown",
  content: `# Gradient Descent & Optimization

> Step downhill on the error surface.

## Core idea
\`\`\`
θ ← θ − η · ∂L/∂θ
\`\`\`
- **θ** — the parameters being learned
- **η** — learning rate (step size)
- **∂L/∂θ** — gradient of the loss with respect to θ

If you understand linear algebra, calculus, and probability/stats, gradient descent is mostly just putting them together.

## Resources
- 🎥 3Blue1Brown — *Neural Networks* series
`,
});

// ---------------------------------------------------------------------------
// 7. Micrograd Warm-up (notebook, blocknote w/ a real pythonCell)
// ---------------------------------------------------------------------------

writeNote("micrograd-warm-up", {
  title: "Micrograd Warm-up",
  type: "notebook",
  order: 6,
  format: "blocknote",
  content: [
    {
      type: "paragraph",
      content: [
        text(
          "A tiny scalar-autograd sketch, inspired by Andrej Karpathy's micrograd. Press Run below — it executes for real, in-browser, via Pyodide.",
        ),
      ],
    },
    {
      type: "pythonCell",
      props: {
        code: `class Value:
    def __init__(self, data, _children=(), _op=""):
        self.data = data
        self.grad = 0.0
        self._backward = lambda: None
        self._prev = set(_children)
        self._op = _op

    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other), "+")

        def _backward():
            self.grad += out.grad
            other.grad += out.grad
        out._backward = _backward
        return out

    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data * other.data, (self, other), "*")

        def _backward():
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad
        out._backward = _backward
        return out

    def backward(self):
        topo, visited = [], set()

        def build(v):
            if v not in visited:
                visited.add(v)
                for child in v._prev:
                    build(child)
                topo.append(v)
        build(self)
        self.grad = 1.0
        for v in reversed(topo):
            v._backward()


# theta = [2, -1, 0.5], x = [x1, x2] -- same numbers as "How the Math Maps to Neural Nets"
w1, w2, b = Value(2.0), Value(-1.0), Value(0.5)
x1, x2 = Value(1.0), Value(2.0)

out = w1 * x1 + w2 * x2 + b
out.backward()

print("output:", out.data)
print("d(output)/d(w1):", w1.grad)
print("d(output)/d(w2):", w2.grad)
`,
      },
    },
    {
      type: "paragraph",
      content: [
        text(
          "Compare the gradients above to x1 and x2 — for a linear layer, d(output)/dw is just the input. That's the whole trick, before the chain rule makes it compound.",
        ),
      ],
    },
  ],
});

console.log(`[seed-content] wrote topic "${SLUG}" with 7 notes to topics/${SLUG}`);
