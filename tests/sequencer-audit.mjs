import assert from "node:assert/strict";
import "../studio-core.js";
const c = globalThis.CircuitCore;
for (const bpm of [30,40,55,70,90,100,110,120,125,140,150,160,170,180,190,200,210,220,230,240,250,260,270,290,300])
  for (const division of [2, 4, 8])
    for (const attack of [1, 25, 500])
      for (const release of [5, 180, 1000])
        for (const gate of [0.1, 0.72, 0.95]) {
          const step = 60 / bpm / division,
            t = c.envelopeTimes(step, attack, release, gate);
          assert(
            t.attack <= t.decay &&
              t.decay <= t.releaseStart &&
              t.releaseStart < t.end &&
              t.end < step,
            "All envelope stages must fit before the next step",
          );
        }
for (const f of [82.4069, 110, 220, 440, 880]) {
  const a = Float32Array.from(
    { length: 2048 },
    (_, i) => 0.2 * Math.sin((2 * Math.PI * f * i) / 48000),
  );
  const detected = c.detectPitch(a, 48000);
  assert(
    detected && Math.abs(12 * Math.log2(detected / f)) < 0.3,
    `Pitch detector ${f} Hz`,
  );
}
assert.equal(c.detectPitch(new Float32Array(2048), 48000), null);
assert.equal(c.frequencyToMidi(440), 69);
console.log(
  "Sequencer math passed: 2,025 envelope combinations through 300 BPM, guitar-range pitch detection and silence rejection.",
);
