// Generates a static Big-O growth-curve comparison chart as an SVG, following
// the dataviz skill's categorical dark-mode palette + mark specs (2px lines,
// direct end-labels, hairline recessive gridlines, no dual axis). Uses a log
// y-axis — the only sane way to compare O(1)..O(n^2) on one chart without the
// quadratic curve flattening everything else against the baseline.
import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "public", "uploads", "big-o-growth-chart.svg");

const W = 760;
const H = 440;
const PAD = { top: 28, right: 128, bottom: 36, left: 40 };
const plotW = W - PAD.left - PAD.right;
const plotH = H - PAD.top - PAD.bottom;

const N_MAX = 20;
const Y_MIN = 1;
const Y_MAX = 400;

const series = [
  { key: "O(1)", color: "#3987e5", fn: () => 1 },
  { key: "O(log n)", color: "#d95926", fn: (n) => Math.log2(n) },
  { key: "O(n)", color: "#199e70", fn: (n) => n },
  { key: "O(n log n)", color: "#c98500", fn: (n) => n * Math.log2(n) },
  { key: "O(n²)", color: "#d55181", fn: (n) => n * n },
];

const x = (n) => PAD.left + ((n - 1) / (N_MAX - 1)) * plotW;
const logY = (v) => {
  const clamped = Math.max(v, Y_MIN);
  const t = (Math.log10(clamped) - Math.log10(Y_MIN)) / (Math.log10(Y_MAX) - Math.log10(Y_MIN));
  return PAD.top + plotH - t * plotH;
};

function pathFor(fn) {
  const pts = [];
  for (let n = 1; n <= N_MAX; n++) pts.push(`${x(n).toFixed(1)},${logY(fn(n)).toFixed(1)}`);
  return `M${pts.join(" L")}`;
}

const gridY = [1, 2, 5, 10, 20, 50, 100, 200, 400];

const surface = "#111827";
const border = "#1F2937";
const gridColor = "#1F2937";
const textMuted = "#6B7280";
const textPrimary = "#E5E7EB";

let svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="Inter, system-ui, sans-serif">
  <rect width="${W}" height="${H}" rx="12" fill="${surface}" stroke="${border}" stroke-width="1"/>
  <text x="${PAD.left}" y="20" fill="${textPrimary}" font-size="13" font-weight="600">Growth rate by input size (n) — log scale</text>
`;

for (const gy of gridY) {
  const yy = logY(gy);
  svg += `  <line x1="${PAD.left}" y1="${yy.toFixed(1)}" x2="${W - PAD.right}" y2="${yy.toFixed(1)}" stroke="${gridColor}" stroke-width="1"/>\n`;
  svg += `  <text x="${PAD.left - 6}" y="${(yy + 3).toFixed(1)}" fill="${textMuted}" font-size="10" text-anchor="end">${gy}</text>\n`;
}

for (const n of [1, 5, 10, 15, 20]) {
  const xx = x(n);
  svg += `  <text x="${xx.toFixed(1)}" y="${H - PAD.bottom + 16}" fill="${textMuted}" font-size="10" text-anchor="middle">${n}</text>\n`;
}
svg += `  <text x="${PAD.left + plotW / 2}" y="${H - 6}" fill="${textMuted}" font-size="10" text-anchor="middle">n (input size)</text>\n`;

for (const s of series) {
  svg += `  <path d="${pathFor(s.fn)}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>\n`;
  const endY = logY(s.fn(N_MAX));
  const endX = x(N_MAX);
  svg += `  <circle cx="${endX.toFixed(1)}" cy="${endY.toFixed(1)}" r="4" fill="${s.color}" stroke="${surface}" stroke-width="2"/>\n`;
  svg += `  <text x="${(endX + 10).toFixed(1)}" y="${(endY + 4).toFixed(1)}" fill="${textPrimary}" font-size="12" font-weight="600">${s.key}</text>\n`;
}

svg += `</svg>\n`;

mkdirSync(path.dirname(OUT), { recursive: true });
writeFileSync(OUT, svg);
console.log(`[generate-big-o-chart] wrote ${OUT}`);
