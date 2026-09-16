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
assert.match(html, /class="brand-mark"[\s\S]*>555<\/text>/);
assert.match(html, /app\.js\?v=18/);
assert.match(html, /id="macro-knobs"/);
assert.match(html, /id="midi-learn-toggle"/);
assert.match(html, /id="logo-wave"/);
assert.match(html, /id="voice-parameter-knobs"/);
assert.match(html, /id="modular-console-title"/);
assert.match(html, /id="synth-keyboard"/);
assert.match(html, /id="midi-pattern-bar-2"/);
assert.match(html, /id="arp-grid"/);
assert.match(html, /id="midi-bpm"/);
assert.match(html, /data-performance="freeze"/);
assert.match(html, /data-construction="synths"/);
assert.match(html, /id="browse-circuits"/);
assert.match(html, /id="supply-select"/);
assert.match(html, /id="knob-style"/);
assert.match(html, /id="engineering-help"/);
assert.match(css, /Graphite engineering theme/);
assert.match(css, /\.brand-mark svg circle/);
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

for (const moduleName of ["oscillator", "fuzz", "overdrive", "distortion", "octave", "delay", "glitch", "ladder", "korgfilter", "brute"]) {
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
assert.match(js, /function resistorBands/);
assert.match(js, /resistor-band/);
assert.match(js, /const ENGINEERING_HELP/);
assert.match(js, /function renderEngineeringHelp/);
assert.match(js, /function renderSequencer/);
assert.match(js, /function startSequencerTransport/);
assert.match(js, /function triggerSequenceStep/);
assert.match(js, /function gateSynthNote/);
assert.match(js, /exponentialRampToValueAtTime\(\.0001/);
assert.match(js, /state\.source === "sequencer"\) return \{ input, output, nodes \}/);
assert.match(js, /function startKeyboardNote/);
assert.match(js, /function renderMacroPanel/);
assert.match(js, /function handleMidiMessage/);
assert.match(js, /navigator\.requestMIDIAccess/);
assert.match(js, /function effectCircuitDetail/);
assert.match(js, /const EFFECT_CIRCUITS/);
assert.match(js, /data-add-effect-circuit/);
assert.match(js, /const SYNTH_REFERENCES/);
assert.match(js, /Manufacturer-published schematic/);
assert.match(js, /monotron DELAY/);
assert.match(js, /Matriarch stereo delay/);
assert.match(js, /function synthReferenceView/);
assert.match(js, /function synthBoardSvg/);
assert.match(js, /data-synth-reference/);
assert.match(js, /selectedSynthReference/);
assert.match(js, /NE555 astable oscillator/);
assert.match(js, /function switchHardwareCircuit/);
assert.match(js, /supplyScale/);
assert.match(js, /knob-\$\{state\.knobStyle\}/);
assert.match(js, /function previewPotValue/);
assert.match(js, /function finishPotTurn/);
assert.match(js, /addEventListener\("pointermove"/);
assert.match(js, /addEventListener\("wheel"/);
assert.match(js, /ArrowLeft/);
assert.match(js, /function assemblyTutorial/);
assert.match(js, /data-assembly-complete/);
assert.match(js, /event\.ctrlKey \|\| event\.metaKey/);
assert.match(js, /function addHardwareSoundStage/);
assert.match(js, /class="interactive-wire/);
assert.match(js, /openCatalogPicker\("sound"/);
assert.match(js, /state\.constructionView = button\.dataset\.construction/);
assert.match(js, /contextmenu/);
assert.match(js, /addEventListener\("click", openComponentMenuFromClick\)/);
assert.match(js, /Click, tap, or press Enter/);
assert.match(js, /data-component-key/);
assert.match(js, /Transistor model/);
for (const section of ["schematic", "breadboard", "connections", "pinouts", "assembly", "synths"]) {
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
assert.match(css, /\.wire-hit/);
assert.match(css, /\.sound-chain-panel/);
assert.match(css, /\.engineering-help/);
assert.match(css, /\.component-realistic \.resistor-body/);
assert.match(css, /\.assembly-tutorial-layout/);
assert.match(css, /\.modular-console/);
assert.match(css, /\.synth-keyboard/);
assert.match(css, /\.macro-knobs/);
assert.match(css, /\.midi-learn-mode/);
assert.match(css, /\.effect-component-grid/);
assert.match(css, /\.piano-key-black/);
assert.match(css, /\.arp-note-row/);
assert.match(css, /\.synth-reference-card/);
assert.match(css, /\.synth-board-svg/);
assert.match(css, /\.synth-explorer/);
assert.match(readme, /GitHub Pages/);

console.log("Static smoke tests passed: structure, modules, accessibility hooks, audio limiter, purchasing, and STL export.");
