import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
assert.equal(new Set(ids).size, ids.length, "Duplicate HTML IDs");
for (const id of [
  "presets-dialog",
  "sequence-target",
  "macro-knobs",
  "midi-tempo-station",
  "note-gate",
  "note-swing",
  "repeat-length",
  "step-octaves",
  "combination-app",
  "audio-toggle",
  "logo-wave",
])
  assert(ids.includes(id), "Missing " + id);
for (const match of html.matchAll(
  /(?:src|href)="([^"#?:]+\.(?:js|css))(?:\?[^\"]*)?"/g,
))
  await access(new URL("../" + match[1], import.meta.url));
console.log(
  "Structure passed: unique IDs and every local script/style resolves.",
);
