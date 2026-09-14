import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const [html, css, js, readme] = await Promise.all([
  readFile(resolve(root, "index.html"), "utf8"),
  readFile(resolve(root, "styles.css"), "utf8"),
  readFile(resolve(root, "app.js"), "utf8"),
  readFile(resolve(root, "README.md"), "utf8")
]);

assert.match(html, /<title>Circuit Bending Sound Designer<\/title>/);
assert.match(html, /id="audio-toggle"/);
assert.match(html, /id="signal-chain"/);
assert.match(html, /id="bom-body"/);
assert.match(html, /id="download-stl"/);
assert.match(html, /aria-live="polite"/);

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, "HTML contains duplicate IDs");

for (const moduleName of ["oscillator", "fuzz", "overdrive", "distortion", "octave", "delay", "glitch"]) {
  assert.match(js, new RegExp(`\\b${moduleName}: \\{`), `Missing ${moduleName} module`);
}

assert.match(js, /createDynamicsCompressor/);
assert.match(js, /navigator\.mediaDevices\.getUserMedia/);
assert.match(js, /amazon\.com\/s\?k=/);
assert.match(js, /solid circuit_bending_enclosure/);
assert.match(css, /prefers-reduced-motion/);
assert.match(readme, /GitHub Pages/);

console.log("Static smoke tests passed: structure, modules, accessibility hooks, audio limiter, purchasing, and STL export.");
