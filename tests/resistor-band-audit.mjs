import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = await readFile(resolve(root, "app.js"), "utf8");
const start = source.indexOf("const RESISTOR_COLORS");
const end = source.indexOf("function componentIcon", start);
assert(start >= 0 && end > start, "Resistor color encoder source not found");

const getBands = Function(`${source.slice(start, end)}; return resistorBands;`)();
const names = (value) => getBands(value).map(([name]) => name);

assert.deepEqual(names("1 kΩ"), ["brown", "black", "black", "brown", "brown"]);
assert.deepEqual(names("10 kΩ"), ["brown", "black", "black", "red", "brown"]);
assert.deepEqual(names("22 kΩ"), ["red", "red", "black", "red", "brown"]);
assert.deepEqual(names("470 kΩ"), ["yellow", "violet", "black", "orange", "brown"]);

console.log("Resistor band audit passed: 1 kΩ, 10 kΩ, 22 kΩ, and 470 kΩ five-band encodings.");
