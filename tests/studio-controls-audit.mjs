import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [source, html] = await Promise.all([
  readFile(resolve(root, "app.js"), "utf8"),
  readFile(resolve(root, "index.html"), "utf8")
]);

assert.match(source, /macros: Array\.from\(\{length:8\}/, "Studio must expose exactly eight macro controls");
assert.match(source, /\(status&0xf0\)!==0xb0/, "MIDI learn must accept Control Change messages, not note data");
assert.match(source, /clamp\(Number\(value\)\|\|0,0,127\)/, "MIDI CC values must be constrained to the 7-bit 0-127 range");
assert.match(source, /event\.metaKey && event\.key\.toLowerCase\(\)===\"m\"/, "Command+M shortcut is missing");
assert.match(source, /function assignMacroToVoice/, "Synth voice controls must be MIDI-mappable");
assert.match(source, /data-assign-voice-param/, "Synth voice map targets are missing");
assert.match(source, /waveformData\.reduce/, "Logo scope must be driven by analyser samples");
assert.match(source, /data-remove=/, "Signal modules need a direct delete control");

for (const profile of ["osc-555", "werkstatt", "moog-bass", "monotron", "korg-delay", "yamaha-fm", "yamaha-bass"]) {
  assert.match(source, new RegExp(`(?:\\"${profile}\\"|${profile}): \\{`), `Missing synth profile ${profile}`);
}

const effectBlock = source.match(/const EFFECT_CIRCUITS = \[([\s\S]*?)\n\];/)?.[1] || "";
for (const type of ["oscillator", "fuzz", "overdrive", "distortion", "octave", "delay", "glitch", "ladder", "korgfilter", "brute"]) {
  assert.match(effectBlock, new RegExp(`moduleType:\"${type}\"`), `Missing Circuit Builder effect folder ${type}`);
}

assert.match(html, /Effect &amp; synth circuits/);
console.log("Studio controls audit passed: eight MIDI macros, live logo scope, seven core presets, direct deletion, and ten effect circuit folders.");
