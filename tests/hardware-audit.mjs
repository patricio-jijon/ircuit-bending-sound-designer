import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
globalThis.window = {};
Function(await readFile(resolve(root, "hardware-data.js"), "utf8"))();

const colors = new Set(["red", "black", "blue", "green", "yellow", "orange", "purple", "red/black", "red/blue", "yellow/green"]);
const hole = /^(?:[A-J](?:[1-9]|[12][0-9]|30)|[+-](?:[1-9]|[12][0-9]|30))$/;

assert.equal(Object.keys(window.HARDWARE_PRESETS).length, 3);
for (const [key, preset] of Object.entries(window.HARDWARE_PRESETS)) {
  assert.equal(key, preset.id);
  assert(preset.name && preset.summary && preset.guide);
  assert(["Oscillators", "Distortion"].includes(preset.category), `${key}: missing circuit folder`);
  assert(preset.controls.length >= 3);
  assert(preset.components.length >= 10);
  assert(preset.connections.length >= 7);
  assert(preset.assembly.length >= 8);
  assert(preset.sources.every(([, url]) => url.startsWith("https://")));
  const supplyControl = preset.controls.find((control) => control.key === "supply");
  assert(supplyControl?.type === "select", `${key}: supply selector missing`);
  assert(supplyControl.options.every((option) => option.value >= 3.3 && option.value <= 12), `${key}: supply outside lesson boundary`);
  assert(preset.components.some((component) => component.kind === "supply" && component.valueKey === "supply"), `${key}: supply component is not synchronized`);
  for (const control of preset.controls) {
    if (control.type === "select") {
      assert(control.options.some((option) => option.value === preset.values[control.key]), `${key}: invalid ${control.key} selection`);
    } else {
      assert(Number.isFinite(preset.values[control.key]), `${key}: missing ${control.key}`);
    }
    assert(preset.chain[control.audio.module], `${key}: audio module index missing`);
  }
  for (const row of preset.connections) {
    assert(row.length >= 6, `${key}: incomplete connection`);
    assert(colors.has(row.at(-2)), `${key}: unknown wire color ${row.at(-2)}`);
  }
  for (const [from, to] of preset.boardWires) {
    assert(hole.test(from), `${key}: invalid hole ${from}`);
    assert(hole.test(to), `${key}: invalid hole ${to}`);
  }
  for (const placement of preset.placements) {
    if (placement.valueKey) assert(preset.controls.some((control) => control.key === placement.valueKey), `${key}: placement ${placement.ref} has unknown value key`);
    if (!placement.valueKey && placement.label === placement.ref) {
      assert(
        preset.components.some((component) => component.ref.split(",").map((ref) => ref.trim()).includes(placement.ref) && component.value),
        `${key}: placement ${placement.ref} would repeat its reference instead of showing a value`
      );
    }
  }
  for (const pinoutKey of preset.pinouts) {
    const pinout = window.HARDWARE_PINOUTS[pinoutKey];
    assert(pinout?.source.startsWith("https://"));
    const expected = pinoutKey === "CD40106BE" ? 14 : 8;
    assert.equal(pinout.pins.length, expected, `${pinoutKey}: pin count mismatch`);
    assert.deepEqual(pinout.pins.map((pin) => pin[0]), Array.from({ length: expected }, (_, i) => i + 1));
  }
}

console.log("Hardware audit passed: 3 presets, pin counts, named holes, connections, sources, and audio mappings.");
