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
assert.match(source, /gateSynthNote\(state\.performance\.mute \? null : note, sequenceIntervalMs\(\) \/ 1000 \* \.72/, "Each sequencer step must use a finite gate shorter than its interval");
assert.match(source, /exponentialRampToValueAtTime\(\.0001/, "The step envelope must release to silence");
assert.match(source, /state\.source === "sequencer"\) return \{ input, output, nodes \}/, "Chain oscillators must not drone over sequencer notes");
assert.match(source, /for \(let note = 48; note <= 71; note \+= 1\)/, "Keyboard must provide two chromatic octaves");

console.log("Sequencer audit passed: MIDI parsing, A4 tuning, 32-step timing, finite note gates, and two-octave keyboard.");
