import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const [html, css, js, hardware, devices, readme] = await Promise.all([
  readFile(resolve(root, "index.html"), "utf8"),
  readFile(resolve(root, "styles.css"), "utf8"),
  readFile(resolve(root, "app.js"), "utf8"),
  readFile(resolve(root, "hardware-data.js"), "utf8"),
  readFile(resolve(root, "devices-data.js"), "utf8"),
  readFile(resolve(root, "README.md"), "utf8")
]);

assert.match(html, /<title>Circuit Bending Sound Designer<\/title>/);
assert.match(html, /app\.js\?v=9/);
assert.match(html, /id="devices" class="view devices-view"/);
assert.match(html, /id="planner-controller"/);
assert.match(html, /id="device-catalog"/);
assert.match(html, /id="compatibility-report"/);
assert.match(html, /id="catalog-picker"/);
assert.match(html, /id="catalog-picker-subcategory"/);
assert.match(html, /id="parts-subcategory"/);
assert.match(html, /id="audio-toggle"/);
assert.match(html, /id="signal-chain"/);
assert.match(html, /id="bom-body"/);
assert.match(html, /id="download-stl"/);
assert.match(html, /id="hardware-preset"/);
assert.match(html, /id="hardware-audio-toggle"/);
assert.match(html, /id="hardware-source-select"/);
assert.match(html, /id="component-menu"/);
assert.match(html, /id="parts-search"/);
assert.match(html, /id="component-inspector-title"/);
assert.match(html, /id="workspace-zoom"/);
assert.match(html, /id="hardware-undo"/);
assert.match(html, /id="hardware" class="view hardware-view is-active"/);
assert.match(html, /id="construction-panel"/);
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
assert.match(js, /function breadboardSvg/);
assert.match(js, /function schematicSvg/);
assert.match(js, /function syncAudioButtons/);
assert.match(js, /function inventoryMatch/);
assert.match(js, /function openComponentMenu/);
assert.match(js, /function selectHardwarePart/);
assert.match(js, /function undoHardwareChange/);
assert.match(js, /function renderDevicePlanner/);
assert.match(js, /function deviceChecks/);
assert.match(js, /function suggestedDeviceConnection/);
assert.match(js, /function openCatalogPicker/);
assert.match(js, /function renderCatalogPicker/);
assert.match(js, /event\.ctrlKey \|\| event\.metaKey/);
assert.match(js, /state\.constructionView = button\.dataset\.construction/);
assert.match(js, /contextmenu/);
assert.match(js, /addEventListener\("click", openComponentMenuFromClick\)/);
assert.match(js, /Click, tap, or press Enter/);
assert.match(js, /data-component-key/);
assert.match(js, /Transistor model/);
for (const section of ["schematic", "breadboard", "connections", "pinouts", "assembly"]) {
  assert.match(js, new RegExp(`id="construction-${section}"`), `Missing visible ${section} section`);
}
assert.match(js, /loadHardwareSound\(\);[\s\S]*const initialView/);
for (const preset of ["dual555", "opampFuzz", "glitchClock"]) {
  assert.match(hardware, new RegExp(`\\b${preset}: \\{`), `Missing ${preset} hardware preset`);
}
assert.match(hardware, /pin 8 · E10/);
assert.match(hardware, /pin 14 · E10/);
assert.match(devices, /Arduino UNO R4 WiFi/);
assert.match(devices, /Raspberry Pi 5/);
assert.match(devices, /Teensy 4\.1/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /Physical computing workspace/);
assert.match(css, /grid-template-columns: 248px minmax\(520px, 1fr\) 310px/);
assert.match(css, /Device compatibility planner/);
assert.match(css, /\.catalog-picker::backdrop/);
assert.match(readme, /GitHub Pages/);

console.log("Static smoke tests passed: structure, modules, accessibility hooks, audio limiter, purchasing, and STL export.");
