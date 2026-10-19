import assert from "node:assert/strict";
import "../circuit-engine.js";
const e = globalThis.CircuitEngine;
for (const recipe of e.RECIPES) {
  const p = e.build(recipe.id);
  assert(p.checks.passed, recipe.id + ": " + p.checks.errors.join(", "));
  for (const chip of p.chips) {
    const d = e.CHIPS[chip.type];
    assert.equal(p.pinNets[chip.ref + "." + d.power], "VCC");
    assert.equal(p.pinNets[chip.ref + "." + d.ground], "GND");
    const n = d.pins.length / 2;
    assert.equal(p.layout.pinHoles[chip.ref + ".1"], "F" + chip.col);
    assert.equal(p.layout.pinHoles[chip.ref + "." + n * 2], "E" + chip.col);
  }
  const endpoints = p.components.flatMap((c) => p.layout.leads[c.ref]);
  assert.equal(
    new Set(endpoints).size,
    endpoints.length,
    "No component may reuse a hole",
  );
  const doubled = e.build(recipe.id, { c: p.settings.c * 2 });
  assert(
    Math.abs(doubled.sound.frequency * 2 - p.sound.frequency) < 1e-6,
    "RC pitch should halve when C doubles",
  );
  const copy = structuredClone(p);
  copy.layout.jumps.pop();
  assert(!e.validate(copy).passed, "Disconnected physical nets must fail");
  const bad = structuredClone(p);
  bad.layout.jumps[0].to = bad.layout.pinHoles[p.chips[0].ref + ".1"];
  assert(!e.validate(bad).passed, "Occupied / wrong-net jumper must fail");
}
assert.throws(() => e.build("randompitch", { supply: 9 }));
assert.throws(() => e.build("tone555", { rb: -1 }));
const p = e.build("triple555");
assert.equal(p.pinNets["U1.4"], "U2A_OUT");
assert.equal(p.pinNets["U1.3"], "U1A_OUT");
assert.equal(p.pinNets["U1.8"], "VCC");
assert.equal(p.pinNets["U1.1"], "GND");
assert(
  p.components.some(
    (c) => c.ref === "mod depth R" && c.nets.includes("U1A_CV"),
  ),
);
assert.equal(e.build("tone556").chips[0].type, "NE556N");
assert(
  e.build("highmute", { high: true }).sound.frequency >
    e.build("highmute").sound.frequency,
);
assert(
  e
    .build("tone40106")
    .sources.every((s) => s.startsWith("https://www.ti.com/")),
);
console.log(
  `Circuit engine audit passed: ${e.RECIPES.length} plans, exact DIP holes, independent connectivity checks, disconnect/short rejection, RC scaling, 5 V logic boundary and multi-timer routing.`,
);

let shift = 0;
const seen = new Set();
for (let i = 0; i < 255; i++) {
  assert(!seen.has(shift));
  seen.add(shift);
  shift = e.lfsrStep(shift);
}
assert.equal(shift, 0);
assert.equal(seen.size, 255, "Feedback must produce a 255-state cycle");
assert(
  e.randomPitchFrequency(0, e.build("randompitch").settings) !==
    e.randomPitchFrequency(7, e.build("randompitch").settings),
);
