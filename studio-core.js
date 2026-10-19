/* Shared musical math and validated, versioned preset format. */
(function (root) {
  "use strict";
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  function envelopeTimes(step, attackMs, releaseMs, gate = 0.72) {
    const end = step * clamp(gate, 0.1, 0.95);
    const attack = Math.min(Math.max(0.001, attackMs / 1000), end * 0.2);
    const release = Math.min(Math.max(0.002, releaseMs / 1000), end * 0.5);
    return {
      attack,
      decay: Math.min(attack + 0.025, end * 0.4),
      releaseStart: Math.max(attack, end - release),
      end,
    };
  }
  function frequencyToMidi(f) {
    return 69 + 12 * Math.log2(f / 440);
  }
  function detectPitch(data, sampleRate) {
    const n = data.length;
    let energy = 0;
    for (const v of data) energy += v * v;
    if (Math.sqrt(energy / n) < 0.008) return null;
    // Difference function with cumulative normalization rejects harmonic multiples.
    const max = Math.min(Math.floor(sampleRate / 65), Math.floor(n / 2) - 1),
      min = Math.floor(sampleRate / 1400);
    let sum = 0,
      previous = 1;
    for (let tau = 1; tau <= max; tau++) {
      let d = 0;
      for (let i = 0; i < n / 2; i++) {
        const delta = data[i] - data[i + tau];
        d += delta * delta;
      }
      sum += d;
      const norm = sum ? (d * tau) / sum : 1;
      if (tau > min && previous < 0.12 && norm > previous)
        return sampleRate / (tau - 1);
      previous = norm;
    }
    return null;
  }
  function validatePreset(p, modules, hardware) {
    if (
      !p ||
      p.schema !== 2 ||
      !Array.isArray(p.modules) ||
      p.modules.length > 40
    )
      throw Error("Unsupported preset format.");
    if (
      !Array.isArray(p.pattern) ||
      p.pattern.length !== 32 ||
      p.pattern.some(
        (n) => n !== null && (!Number.isInteger(n) || n < 0 || n > 127),
      )
    )
      throw Error("Preset must contain 32 MIDI notes or rests.");
    if (!hardware[p.hardwarePreset]) throw Error("Unknown physical circuit.");
    for (const m of p.modules) {
      if (!modules[m.type] || !m.params || !Number.isInteger(m.id))
        throw Error("Unknown module.");
      const clean = {};
      for (const def of modules[m.type].params) {
        const v = m.params[def.key];
        if (def.type === "select") {
          if (!def.options.some((o) => o.value === v))
            throw Error("Invalid component option.");
        } else if (!Number.isFinite(v) || v < def.min || v > def.max)
          throw Error("Component value outside supported range.");
        clean[def.key] = v;
      }
      if ([5, 9, 12].includes(m.params.supply)) clean.supply = m.params.supply;
      if (m.params.hardwareOnly === true) clean.hardwareOnly = true;
      m.params = clean;
    }
    if (new Set(p.modules.map((m) => m.id)).size !== p.modules.length)
      throw Error("Duplicate module identities.");
    for (const k of ["bpm", "division", "arpOctave", "globalOctave"])
      if (!Number.isFinite(p[k])) throw Error("Invalid transport settings.");
    if (
      p.bpm < 30 ||
      p.bpm > 300 ||
      ![2, 4, 8].includes(p.division) ||
      Math.abs(p.arpOctave) > 3 ||
      Math.abs(p.globalOctave) > 3
    )
      throw Error("Transport settings outside supported range.");
    if (
      !Array.isArray(p.stepOctaves) ||
      p.stepOctaves.length !== 32 ||
      p.stepOctaves.some((n) => !Number.isInteger(n) || Math.abs(n) > 2)
    )
      throw Error("Invalid step octaves.");
    return p;
  }
  root.CircuitCore = {
    clamp,
    envelopeTimes,
    detectPitch,
    frequencyToMidi,
    validatePreset,
  };
})(typeof window === "undefined" ? globalThis : window);
