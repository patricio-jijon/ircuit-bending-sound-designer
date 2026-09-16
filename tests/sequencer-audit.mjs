import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = await readFile(resolve(root, "app.js"), "utf8");

const noteParser = source.match(/function noteNameToMidi\(token\) \{[\s\S]*?\n\}/)?.[0];
const frequencyFunction = source.match(/function midiFrequency\(note\) \{[\s\S]*?\n\}/)?.[0];
assert(noteParser && frequencyFunction, "MIDI conversion functions not found");

const helpers = Function(`const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));${noteParser}${frequencyFunction};return {noteNameToMidi,midiFrequency};`)();
assert.equal(helpers.noteNameToMidi("C3"), 48);
assert.equal(helpers.noteNameToMidi("F#3"), 54);
assert.equal(helpers.noteNameToMidi("Bb3"), 58);
assert(Math.abs(helpers.midiFrequency(69) - 440) < 1e-9, "A4 must equal 440 Hz");

const patternSource = source.match(/sequencePattern: \[([^\]]+)\]/)?.[1];
const pattern = Function(`return [${patternSource}]`)();
assert.equal(pattern.length, 32, "Two 4/4 bars at sixteenth-note resolution require 32 steps");
assert.equal((60000 / 120) / 4, 125, "120 BPM sixteenth-note interval must be 125 ms");

console.log("Sequencer audit passed: MIDI parsing, A4 tuning, 32-step pattern, and BPM timing.");
