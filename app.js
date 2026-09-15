"use strict";

const COLORS = {
  oscillator: "#71c7ff",
  fuzz: "#ff795f",
  overdrive: "#f08bc8",
  distortion: "#f8bd4b",
  octave: "#bb91ff",
  delay: "#55d7a1",
  glitch: "#f3f4e9"
};

const MODULES = {
  oscillator: {
    name: "Oscillator / Dual 555",
    shortName: "555 OSC",
    description: "Mix one or two virtual NE555-style square-wave voices with the input.",
    color: COLORS.oscillator,
    params: [
      { key: "r1", label: "Timing resistor R1", unit: "kΩ", min: 1, max: 100, step: 1, value: 10, role: "Charges the timing capacitor." },
      { key: "r2", label: "Timing resistor R2", unit: "kΩ", min: 1, max: 100, step: 1, value: 22, role: "A larger value slows charging and lowers pitch." },
      { key: "c", label: "Timing capacitor C1", unit: "nF", min: 1, max: 100, step: 1, value: 10, role: "More capacitance stores more charge and lowers pitch." },
      { key: "mix", label: "Oscillator mix", unit: "%", min: 0, max: 100, step: 1, value: 34, role: "Sets oscillator level relative to the incoming sound." },
      { key: "voices", label: "555 timers", type: "select", value: "dual", options: [{ value: "single", label: "Single NE555" }, { value: "dual", label: "Dual NE555" }], role: "The second virtual timer runs at a related frequency for beating and intervals." }
    ],
    bom: [
      ["NE555P timer IC", 2, 0.85, "NE555P DIP-8 timer IC"],
      ["8-pin DIP socket", 2, 0.35, "8 pin DIP IC socket"],
      ["10 kΩ resistor, 1/4 W", 1, 0.08, "10k ohm resistor quarter watt"],
      ["22 kΩ resistor, 1/4 W", 1, 0.08, "22k ohm resistor quarter watt"],
      ["10 nF film capacitor", 1, 0.22, "10nF film capacitor"],
      ["100 kΩ potentiometer", 1, 1.25, "100k linear potentiometer electronics"]
    ]
  },
  fuzz: {
    name: "Fuzz",
    shortName: "FUZZ",
    description: "High gain and strong nonlinear clipping create a dense, harmonically rich sound.",
    color: COLORS.fuzz,
    params: [
      { key: "rin", label: "Input resistor Rin", unit: "kΩ", min: 1, max: 100, step: 1, value: 10, role: "Works with the feedback resistor to set modeled gain." },
      { key: "rf", label: "Feedback resistor Rf", unit: "kΩ", min: 10, max: 1000, step: 10, value: 470, role: "More feedback resistance increases gain and clipping." },
      { key: "toneC", label: "Tone capacitor", unit: "nF", min: 1, max: 220, step: 1, value: 22, role: "With the load resistance, it rolls off high frequencies." },
      { key: "diode", label: "Clipping material", type: "select", value: "germanium", options: [{ value: "germanium", label: "Germanium · soft / early" }, { value: "silicon", label: "Silicon · tighter" }, { value: "led", label: "LED · loud / open" }], role: "Different forward-voltage models change when clipping begins." },
      { key: "level", label: "Output level", unit: "%", min: 5, max: 100, step: 1, value: 58, role: "Attenuates the processed output after clipping." }
    ],
    bom: [
      ["2N3904 NPN transistor", 2, 0.22, "2N3904 transistor TO-92"],
      ["Germanium diode 1N34A", 2, 0.85, "1N34A germanium diode"],
      ["Resistor assortment, 1/4 W", 5, 0.08, "quarter watt resistor assortment"],
      ["Film capacitor assortment", 3, 0.22, "film capacitor assortment audio"],
      ["100 kΩ potentiometer", 2, 1.25, "100k potentiometer electronics"]
    ]
  },
  overdrive: {
    name: "Overdrive",
    shortName: "OD",
    description: "Gentler soft clipping adds harmonics while preserving more picking dynamics than fuzz.",
    color: COLORS.overdrive,
    params: [
      { key: "rin", label: "Gain resistor Rin", unit: "kΩ", min: 1, max: 47, step: 0.1, value: 4.7, role: "Forms the lower part of the non-inverting gain ratio." },
      { key: "drive", label: "Drive potentiometer", unit: "kΩ", min: 1, max: 500, step: 1, value: 100, role: "Increasing feedback resistance raises gain into soft clipping." },
      { key: "couplingC", label: "Input capacitor", unit: "µF", min: 0.01, max: 1, step: 0.01, value: 0.1, role: "With the input resistance, it controls how much bass enters the stage." },
      { key: "diode", label: "Clipping material", type: "select", value: "led", options: [{ value: "germanium", label: "Germanium · compressed" }, { value: "silicon", label: "Silicon · classic" }, { value: "led", label: "LED · open / dynamic" }], role: "Higher thresholds preserve more dynamic range before clipping." },
      { key: "mix", label: "Wet mix", unit: "%", min: 0, max: 100, step: 1, value: 70, role: "Blends clean signal with the overdriven path." }
    ],
    bom: [
      ["TL072 dual op-amp", 1, 0.95, "TL072CP DIP-8 op amp"],
      ["8-pin DIP socket", 1, 0.35, "8 pin DIP IC socket"],
      ["LED, 3 mm", 2, 0.18, "3mm LED assorted colors"],
      ["Resistor assortment, 1/4 W", 5, 0.08, "quarter watt resistor assortment"],
      ["Film capacitor assortment", 3, 0.22, "film capacitor assortment audio"],
      ["500 kΩ potentiometer", 1, 1.45, "500k potentiometer electronics"]
    ]
  },
  distortion: {
    name: "Distortion",
    shortName: "DIST",
    description: "Controlled gain pushes the signal into a selectable clipping threshold.",
    color: COLORS.distortion,
    params: [
      { key: "drive", label: "Drive potentiometer", unit: "kΩ", min: 1, max: 500, step: 1, value: 100, role: "Raises modeled amplifier gain and harmonic content." },
      { key: "toneR", label: "Tone resistor", unit: "kΩ", min: 1, max: 100, step: 1, value: 10, role: "Combines with the tone capacitor to set a low-pass corner." },
      { key: "toneC", label: "Tone capacitor", unit: "nF", min: 1, max: 220, step: 1, value: 47, role: "A larger capacitor lowers the cutoff and darkens the sound." },
      { key: "diode", label: "Clipping material", type: "select", value: "silicon", options: [{ value: "germanium", label: "Germanium · 0.3 V model" }, { value: "silicon", label: "Silicon · 0.7 V model" }, { value: "led", label: "LED · 1.8 V model" }], role: "The threshold changes the simulated headroom and compression." },
      { key: "mix", label: "Wet mix", unit: "%", min: 0, max: 100, step: 1, value: 78, role: "Blends clean and distorted paths." }
    ],
    bom: [
      ["TL072 dual op-amp", 1, 0.95, "TL072CP DIP-8 op amp"],
      ["8-pin DIP socket", 1, 0.35, "8 pin DIP IC socket"],
      ["1N4148 switching diode", 2, 0.10, "1N4148 switching diode"],
      ["Resistor assortment, 1/4 W", 6, 0.08, "quarter watt resistor assortment"],
      ["Film capacitor assortment", 4, 0.22, "film capacitor assortment audio"],
      ["500 kΩ potentiometer", 1, 1.45, "500k potentiometer electronics"]
    ]
  },
  octave: {
    name: "Octave",
    shortName: "OCT",
    description: "Full-wave rectification folds the waveform upward, emphasizing a tone near twice the input frequency.",
    color: COLORS.octave,
    params: [
      { key: "inputC", label: "Input capacitor", unit: "µF", min: 0.01, max: 1, step: 0.01, value: 0.1, role: "With input resistance, it sets the low-frequency coupling point." },
      { key: "loadR", label: "Input resistance", unit: "kΩ", min: 10, max: 1000, step: 10, value: 100, role: "A larger value preserves more bass through the input capacitor." },
      { key: "diode", label: "Rectifier material", type: "select", value: "silicon", options: [{ value: "germanium", label: "Germanium · sensitive" }, { value: "silicon", label: "Silicon · focused" }, { value: "led", label: "LED · gated" }], role: "The threshold affects how much of a quiet waveform is rectified." },
      { key: "blend", label: "Octave blend", unit: "%", min: 0, max: 100, step: 1, value: 72, role: "Mixes the rectified octave texture with the dry signal." }
    ],
    bom: [
      ["2N3904 NPN transistor", 2, 0.22, "2N3904 transistor TO-92"],
      ["1N4148 switching diode", 2, 0.10, "1N4148 switching diode"],
      ["Resistor assortment, 1/4 W", 6, 0.08, "quarter watt resistor assortment"],
      ["Film capacitor assortment", 3, 0.22, "film capacitor assortment audio"],
      ["100 kΩ potentiometer", 1, 1.25, "100k potentiometer electronics"]
    ]
  },
  delay: {
    name: "Delay",
    shortName: "DLY",
    description: "A clocked-memory model repeats sound; feedback sends each repeat around again.",
    color: COLORS.delay,
    params: [
      { key: "clockR1", label: "Clock resistor R1", unit: "kΩ", min: 1, max: 50, step: 1, value: 1, role: "Part of the virtual clock timing network." },
      { key: "clockR2", label: "Clock resistor R2", unit: "kΩ", min: 1, max: 100, step: 1, value: 10, role: "Increasing it slows the clock and lengthens delay time." },
      { key: "clockC", label: "Clock capacitor", unit: "nF", min: 1, max: 100, step: 1, value: 10, role: "Increasing it stores charge longer and lengthens delay time." },
      { key: "feedback", label: "Feedback potentiometer", unit: "%", min: 0, max: 92, step: 1, value: 42, role: "More feedback produces more repeats; very high settings approach self-oscillation." },
      { key: "mix", label: "Delay mix", unit: "%", min: 0, max: 100, step: 1, value: 35, role: "Balances direct sound and repeats." }
    ],
    bom: [
      ["PT2399 echo processor", 1, 1.65, "PT2399 echo processor DIP-16"],
      ["16-pin DIP socket", 1, 0.45, "16 pin DIP IC socket"],
      ["NE555P timer IC", 1, 0.85, "NE555P DIP-8 timer IC"],
      ["Resistor assortment, 1/4 W", 8, 0.08, "quarter watt resistor assortment"],
      ["Film capacitor assortment", 5, 0.22, "film capacitor assortment audio"],
      ["100 kΩ potentiometer", 2, 1.25, "100k potentiometer electronics"]
    ]
  },
  glitch: {
    name: "Glitch",
    shortName: "GLT",
    description: "A clocked chopper and coarse amplitude steps create rhythmic dropouts and digital edges.",
    color: COLORS.glitch,
    params: [
      { key: "clockR", label: "Chop resistor", unit: "kΩ", min: 1, max: 500, step: 1, value: 47, role: "With the timing capacitor, it sets the chopping rate." },
      { key: "clockC", label: "Chop capacitor", unit: "µF", min: 0.01, max: 1, step: 0.01, value: 0.1, role: "More capacitance lowers the chopping rate." },
      { key: "steps", label: "Amplitude steps", unit: "", min: 3, max: 32, step: 1, value: 8, role: "Fewer steps make the waveform coarser and more digital." },
      { key: "depth", label: "Glitch depth", unit: "%", min: 0, max: 100, step: 1, value: 76, role: "Controls the balance between uninterrupted and chopped sound." }
    ],
    bom: [
      ["CD40106BE Schmitt inverter", 1, 0.85, "CD40106BE DIP-14 Schmitt trigger"],
      ["14-pin DIP socket", 1, 0.40, "14 pin DIP IC socket"],
      ["47 kΩ resistor, 1/4 W", 1, 0.08, "47k ohm resistor quarter watt"],
      ["100 nF film capacitor", 1, 0.22, "100nF film capacitor"],
      ["500 kΩ potentiometer", 1, 1.45, "500k potentiometer electronics"]
    ]
  }
};

const BASE_BOM = [
  ["Solderless breadboard, full size", 1, 8.50, "full size solderless breadboard"],
  ["Breadboard jumper wire kit", 1, 6.50, "breadboard jumper wire kit"],
  ["6.35 mm mono audio jack", 2, 1.10, "quarter inch mono audio jack panel mount"],
  ["9 V regulated DC adapter", 1, 9.50, "9V regulated guitar pedal power supply center negative"],
  ["100 nF ceramic bypass capacitor", 2, 0.12, "100nF ceramic capacitor"],
  ["10 µF electrolytic capacitor, 25 V", 2, 0.18, "10uF 25V electrolytic capacitor"]
];

let nextId = 1;
const state = {
  modules: [],
  selectedId: null,
  audioOn: false,
  source: "demo",
  prices: {},
  hardwarePreset: "dual555",
  hardwareLoadedId: null,
  constructionView: "schematic"
};

let audio = {
  context: null,
  sourceBus: null,
  master: null,
  analyser: null,
  sourceNodes: [],
  moduleNodes: [],
  stream: null,
  fileBuffer: null,
  riffTimer: null,
  limiter: null
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function announce(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(announce.timer);
  announce.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function freshParams(type) {
  return Object.fromEntries(MODULES[type].params.map((param) => [param.key, param.value]));
}

function addModule(type, select = true) {
  const instance = { id: nextId++, type, bypassed: false, params: freshParams(type) };
  state.modules.push(instance);
  if (select) state.selectedId = instance.id;
  renderStudio();
  rebuildAudioGraph();
  announce(`${MODULES[type].name} added to the signal chain.`);
}

function removeModule(id) {
  const index = state.modules.findIndex((item) => item.id === id);
  if (index < 0) return;
  const [removed] = state.modules.splice(index, 1);
  if (state.selectedId === id) state.selectedId = state.modules[Math.min(index, state.modules.length - 1)]?.id ?? null;
  renderStudio();
  rebuildAudioGraph();
  announce(`${MODULES[removed.type].name} removed.`);
}

function moveModule(id, direction) {
  const index = state.modules.findIndex((item) => item.id === id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= state.modules.length) return;
  [state.modules[index], state.modules[target]] = [state.modules[target], state.modules[index]];
  renderStudio();
  rebuildAudioGraph();
  announce("Signal order changed. Listen for how each stage processes the previous one.");
}

function formatValue(param, value) {
  return `${Number.isFinite(Number(value)) && param.type !== "select" ? Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 }) : value}${param.unit ? ` ${param.unit}` : ""}`;
}

function calculateModule(instance) {
  const p = instance.params;
  if (instance.type === "oscillator") {
    const frequency = 1.44 / (((p.r1 + 2 * p.r2) * 1000) * (p.c * 1e-9));
    const second = frequency * 1.498;
    return {
      title: "Astable timing frequency",
      formula: "f ≈ 1.44 ÷ ((R1 + 2R2) × C)",
      substitution: `1.44 ÷ ((${p.r1} kΩ + 2 × ${p.r2} kΩ) × ${p.c} nF)`,
      result: `${frequency.toFixed(1)} Hz${p.voices === "dual" ? ` + ${second.toFixed(1)} Hz second voice` : ""}`,
      why: "Raising either timing resistance or capacitance increases the charge time, so pitch falls. This is a calculated NE555 astable estimate; real tolerances shift it. The audible browser model is limited to 12 kHz.",
      frequency
    };
  }
  if (instance.type === "fuzz") {
    const gain = 1 + p.rf / p.rin;
    const cutoff = 1 / (2 * Math.PI * 10000 * p.toneC * 1e-9);
    return {
      title: "Gain and tone estimate",
      formula: "Gain ≈ 1 + Rf ÷ Rin;  fc = 1 ÷ (2πRC)",
      substitution: `1 + ${p.rf} kΩ ÷ ${p.rin} kΩ; R = 10 kΩ, C = ${p.toneC} nF`,
      result: `${gain.toFixed(1)}× gain · ${cutoff.toFixed(0)} Hz tone corner`,
      why: "More gain drives the virtual clipper harder. Increasing the tone capacitor lowers the filter corner, removing more high-frequency edge."
    };
  }
  if (instance.type === "overdrive") {
    const gain = 1 + p.drive / p.rin;
    const cutoff = 1 / (2 * Math.PI * p.rin * 1000 * p.couplingC * 1e-6);
    return {
      title: "Soft-clipping gain estimate",
      formula: "Gain ≈ 1 + Rdrive ÷ Rin;  fc = 1 ÷ (2πRinC)",
      substitution: `1 + ${p.drive} kΩ ÷ ${p.rin} kΩ; C = ${p.couplingC} µF`,
      result: `${gain.toFixed(1)}× gain · ${cutoff.toFixed(1)} Hz input corner`,
      why: "More feedback resistance increases drive. A larger input capacitor passes more bass, which can make overdrive sound fuller or less defined."
    };
  }
  if (instance.type === "distortion") {
    const gain = 1 + p.drive / 4.7;
    const cutoff = 1 / (2 * Math.PI * p.toneR * 1000 * p.toneC * 1e-9);
    return {
      title: "Drive and low-pass corner",
      formula: "Gain ≈ 1 + Rdrive ÷ 4.7 kΩ;  fc = 1 ÷ (2πRC)",
      substitution: `1 + ${p.drive} kΩ ÷ 4.7 kΩ; R = ${p.toneR} kΩ, C = ${p.toneC} nF`,
      result: `${gain.toFixed(1)}× gain · ${cutoff.toFixed(0)} Hz cutoff`,
      why: "The gain estimate controls how strongly the signal exceeds the selected diode threshold. The RC network shapes brightness after clipping."
    };
  }
  if (instance.type === "octave") {
    const cutoff = 1 / (2 * Math.PI * p.loadR * 1000 * p.inputC * 1e-6);
    return {
      title: "Input coupling corner",
      formula: "fc = 1 ÷ (2πRC)",
      substitution: `1 ÷ (2π × ${p.loadR} kΩ × ${p.inputC} µF)`,
      result: `${cutoff.toFixed(1)} Hz high-pass corner`,
      why: "Full-wave rectification repeats the waveform shape twice per cycle, emphasizing an octave-up component. Clean single notes make the effect easiest to hear."
    };
  }
  if (instance.type === "glitch") {
    const chopRate = 1 / (2.2 * p.clockR * 1000 * p.clockC * 1e-6);
    return {
      title: "RC chopping rate",
      formula: "f ≈ 1 ÷ (2.2RC)",
      substitution: `1 ÷ (2.2 × ${p.clockR} kΩ × ${p.clockC} µF)`,
      result: `${chopRate.toFixed(1)} Hz calculated · ${clamp(chopRate, .5, 80).toFixed(1)} Hz browser model`,
      why: "The RC network sets a repeating on/off gate. This intentionally breaks continuity; reducing amplitude steps adds quantization texture.",
      chopRate
    };
  }
  const clock = 1.44 / (((p.clockR1 + 2 * p.clockR2) * 1000) * (p.clockC * 1e-9));
  const calculatedDelayMs = (2048 / clock) * 1000;
  const delayMs = clamp(calculatedDelayMs, 20, 1200);
  return {
    title: "Clock-derived delay estimate",
    formula: "fclock ≈ 1.44 ÷ ((R1 + 2R2)C); t ≈ 2048 ÷ fclock",
    substitution: `R1 = ${p.clockR1} kΩ, R2 = ${p.clockR2} kΩ, C = ${p.clockC} nF`,
    result: `${clock.toFixed(0)} Hz clock · ${calculatedDelayMs.toFixed(0)} ms calculated${delayMs !== calculatedDelayMs ? ` · ${delayMs.toFixed(0)} ms browser limit` : ""}`,
    why: "A slower clock means each stored sample advances more slowly, producing a longer delay. This teaching model is not a PT2399 component equation.",
    delayMs
  };
}

function renderLibrary() {
  $("#module-library").innerHTML = Object.entries(MODULES).map(([type, definition]) => `
    <button class="module-add" type="button" data-add="${type}" style="--module-color:${definition.color}">
      <span class="module-glyph" aria-hidden="true">${definition.shortName.slice(0, 3)}</span>
      <span><strong>${definition.name}</strong><small>${definition.description}</small></span>
      <span class="add-symbol" aria-hidden="true">+</span>
    </button>`).join("");
}

function renderChain() {
  const chain = $("#signal-chain");
  if (!state.modules.length) {
    chain.innerHTML = '<p class="chain-empty">Your chain is empty.<br>Add a module from the library.</p>';
    return;
  }
  chain.innerHTML = state.modules.map((instance, index) => {
    const definition = MODULES[instance.type];
    const knobs = definition.params.filter((param) => param.type !== "select").slice(0, 3).map((param) => {
      const turn = ((Number(instance.params[param.key]) - param.min) / (param.max - param.min)) * 75 + 5;
      return `<span class="mini-knob" style="--turn:${turn}%" title="${param.label}: ${formatValue(param, instance.params[param.key])}"></span>`;
    }).join("");
    return `<button class="effect-module${state.selectedId === instance.id ? " is-selected" : ""}${instance.bypassed ? " is-bypassed" : ""}" type="button" data-select="${instance.id}" style="--module-color:${definition.color}" aria-label="Select ${definition.name}, position ${index + 1}${instance.bypassed ? ", bypassed" : ""}">
      <span class="effect-title"><strong>${definition.name}</strong><span>#${String(instance.id).padStart(2, "0")}</span></span>
      <span class="mini-knobs" aria-hidden="true">${knobs}</span>
      <span class="effect-footer"><span>${instance.bypassed ? "BYPASSED" : "ACTIVE"}</span><span class="effect-led"></span></span>
    </button>`;
  }).join("");
}

function renderInspector() {
  const instance = state.modules.find((item) => item.id === state.selectedId);
  const content = $("#inspector-content");
  if (!instance) {
    $("#inspector-subtitle").textContent = "Select a module in the chain.";
    content.innerHTML = '<div class="empty-inspector"><div class="empty-symbol" aria-hidden="true">R?</div><p>Add a module, then select it to explore the components behind its sound.</p></div>';
    return;
  }
  const definition = MODULES[instance.type];
  const calculation = calculateModule(instance);
  $("#inspector-subtitle").textContent = `Module #${String(instance.id).padStart(2, "0")} · simulated audio model`;
  const controls = definition.params.map((param) => {
    if (param.type === "select") {
      return `<div class="component-control"><div class="component-label"><label for="param-${instance.id}-${param.key}">${param.label}</label></div>
        <select id="param-${instance.id}-${param.key}" data-param="${param.key}">${param.options.map((option) => `<option value="${option.value}"${instance.params[param.key] === option.value ? " selected" : ""}>${option.label}</option>`).join("")}</select>
        <small>${param.role}</small></div>`;
    }
    return `<div class="component-control"><div class="component-label"><label for="param-${instance.id}-${param.key}">${param.label}</label><output id="value-${param.key}">${formatValue(param, instance.params[param.key])}</output></div>
      <input id="param-${instance.id}-${param.key}" type="range" min="${param.min}" max="${param.max}" step="${param.step}" value="${instance.params[param.key]}" data-param="${param.key}">
      <small>${param.role}</small></div>`;
  }).join("");
  const currentIndex = state.modules.indexOf(instance);
  content.innerHTML = `<div class="inspector-top"><div><h3>${definition.name}</h3><p>${definition.description}</p></div><button class="bypass-button" type="button" data-bypass="${instance.id}" aria-pressed="${instance.bypassed}">${instance.bypassed ? "Enable" : "Bypass"}</button></div>
    ${controls}
    <div class="calculation-box" style="--module-color:${definition.color}">
      <p class="evidence-label">Calculated relationship</p><h4>${calculation.title}</h4>
      <p class="formula">${calculation.formula}</p><p>${calculation.substitution}</p><p><strong>${calculation.result}</strong></p><p>${calculation.why}</p>
    </div>
    <div class="module-tools"><button type="button" data-move="-1"${currentIndex === 0 ? " disabled" : ""}>Move left</button><button type="button" data-move="1"${currentIndex === state.modules.length - 1 ? " disabled" : ""}>Move right</button><button type="button" data-remove="${instance.id}">Remove</button></div>`;
}

function refreshCalculation(instance) {
  const calculation = calculateModule(instance);
  const box = $(".calculation-box", $("#inspector-content"));
  if (!box) return;
  box.innerHTML = `<p class="evidence-label">Calculated relationship</p><h4>${calculation.title}</h4>
    <p class="formula">${calculation.formula}</p><p>${calculation.substitution}</p><p><strong>${calculation.result}</strong></p><p>${calculation.why}</p>`;
}

function renderStudio() {
  renderChain();
  renderInspector();
  renderLessons();
  renderBom();
}

function renderLessons() {
  $("#lesson-list").innerHTML = Object.values(MODULES).map((definition) => {
    const sample = { type: Object.keys(MODULES).find((key) => MODULES[key] === definition), params: Object.fromEntries(definition.params.map((p) => [p.key, p.value])) };
    const result = calculateModule(sample);
    return `<article class="lesson-row" style="--lesson-color:${definition.color}"><h2>${definition.name}</h2><p>${definition.description} ${result.why}</p><div class="lesson-formula"><strong>${result.formula}</strong><br>${result.result}</div></article>`;
  }).join("");
}

function updateSelectedParam(key, rawValue) {
  const instance = state.modules.find((item) => item.id === state.selectedId);
  if (!instance) return;
  const parameter = MODULES[instance.type].params.find((param) => param.key === key);
  instance.params[key] = parameter.type === "select" ? rawValue : Number(rawValue);
  const output = $(`#value-${key}`);
  if (output) output.textContent = formatValue(parameter, instance.params[key]);
  renderChain();
  refreshCalculation(instance);
  renderBom();
  rebuildAudioGraph();
}

function aggregateBom() {
  const rows = new Map();
  const addRows = (items) => items.forEach(([name, qty, price, query]) => {
    const key = `${name}|${query}`;
    if (!rows.has(key)) rows.set(key, { key, name, qty: 0, price, query });
    rows.get(key).qty += qty;
  });
  addRows(BASE_BOM);
  state.modules.forEach((instance) => addRows(MODULES[instance.type].bom));
  return [...rows.values()];
}

function renderBom() {
  const rows = aggregateBom();
  let total = 0;
  $("#bom-body").innerHTML = rows.map((row) => {
    const price = Number(state.prices[row.key] ?? row.price);
    const subtotal = row.qty * price;
    total += subtotal;
    const search = `https://www.amazon.com/s?k=${encodeURIComponent(row.query)}`;
    return `<tr><td>${row.name}</td><td>${row.qty}</td><td><label class="sr-only" for="cost-${encodeURIComponent(row.key)}">Unit cost for ${row.name}</label><input id="cost-${encodeURIComponent(row.key)}" type="number" min="0" step="0.01" value="${price.toFixed(2)}" data-cost-key="${encodeURIComponent(row.key)}"></td><td data-subtotal="${encodeURIComponent(row.key)}">$${subtotal.toFixed(2)}</td><td><a class="amazon-link" href="${search}" target="_blank" rel="noopener noreferrer">Amazon US ↗</a></td></tr>`;
  }).join("");
  $("#budget-total").textContent = `$${total.toFixed(2)}`;
}

async function ensureAudio() {
  if (!audio.context) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) throw new Error("This browser does not support the Web Audio API.");
    audio.context = new AudioContext();
    audio.sourceBus = audio.context.createGain();
    audio.master = audio.context.createGain();
    audio.master.gain.value = Number($("#master-volume").value) / 100;
    audio.limiter = audio.context.createDynamicsCompressor();
    audio.limiter.threshold.value = -12;
    audio.limiter.knee.value = 3;
    audio.limiter.ratio.value = 12;
    audio.limiter.attack.value = 0.003;
    audio.limiter.release.value = 0.2;
    audio.analyser = audio.context.createAnalyser();
    audio.analyser.fftSize = 2048;
    audio.master.connect(audio.limiter);
    audio.limiter.connect(audio.analyser);
    audio.analyser.connect(audio.context.destination);
  }
  await audio.context.resume();
}

function stopSource() {
  window.clearInterval(audio.riffTimer);
  audio.riffTimer = null;
  audio.sourceNodes.forEach((node) => {
    try { if (typeof node.stop === "function") node.stop(); } catch (_) { /* already stopped */ }
    try { node.disconnect(); } catch (_) { /* already disconnected */ }
  });
  audio.sourceNodes = [];
  if (audio.stream) {
    audio.stream.getTracks().forEach((track) => track.stop());
    audio.stream = null;
  }
}

async function startSource() {
  if (!audio.context || !state.audioOn) return;
  stopSource();
  const ctx = audio.context;
  if (state.source === "microphone") {
    try {
      audio.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      const mic = ctx.createMediaStreamSource(audio.stream);
      mic.connect(audio.sourceBus);
      audio.sourceNodes.push(mic);
      announce("Microphone input active. Use headphones to prevent feedback.");
    } catch (error) {
      state.source = "tone";
      $("#source-select").value = "tone";
      announce("Microphone permission was unavailable. Test oscillator selected.");
      startSource();
    }
    return;
  }
  if (state.source === "file") {
    if (!audio.fileBuffer) {
      announce("Choose an audio file before starting file playback.");
      return;
    }
    const source = ctx.createBufferSource();
    source.buffer = audio.fileBuffer;
    source.loop = true;
    source.connect(audio.sourceBus);
    source.start();
    audio.sourceNodes.push(source);
    return;
  }
  const output = ctx.createGain();
  output.gain.value = state.source === "demo" ? 0.16 : 0.11;
  output.connect(audio.sourceBus);
  audio.sourceNodes.push(output);

  if (state.source === "tone") {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 110;
    osc.connect(output);
    osc.start();
    audio.sourceNodes.push(osc);
    return;
  }

  const frequencies = [82.41, 98, 110, 123.47, 146.83, 110, 98, 73.42];
  const osc = ctx.createOscillator();
  const sub = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 850;
  filter.Q.value = 4;
  osc.type = "sawtooth";
  sub.type = "square";
  osc.frequency.value = frequencies[0];
  sub.frequency.value = frequencies[0] / 2;
  osc.connect(filter);
  sub.connect(filter);
  filter.connect(output);
  osc.start(); sub.start();
  audio.sourceNodes.push(osc, sub, filter);
  let step = 0;
  audio.riffTimer = window.setInterval(() => {
    if (!state.audioOn || !audio.context) return;
    step = (step + 1) % frequencies.length;
    const time = audio.context.currentTime;
    osc.frequency.setTargetAtTime(frequencies[step], time, .012);
    sub.frequency.setTargetAtTime(frequencies[step] / 2, time, .012);
    filter.frequency.setTargetAtTime(550 + (step % 4) * 180, time, .04);
  }, 260);
}

function makeCurve(amount, threshold = 0.7, mode = "distortion") {
  const samples = 2048;
  const curve = new Float32Array(samples);
  const drive = clamp(amount, 1, 100);
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / (samples - 1) - 1;
    if (mode === "octave") {
      const gate = threshold / 5;
      curve[i] = Math.abs(x) < gate ? 0 : clamp(Math.abs(x) * 1.65 - 0.48, -1, 1);
    } else {
      const scaled = x * (1 + drive / 7) / threshold;
      curve[i] = Math.tanh(scaled) * threshold;
    }
  }
  return curve;
}

function diodeThreshold(material) {
  return material === "germanium" ? 0.3 : material === "led" ? 1.8 : 0.7;
}

function createModuleProcessor(instance) {
  const ctx = audio.context;
  const input = ctx.createGain();
  const output = ctx.createGain();
  const nodes = [input, output];
  const p = instance.params;

  if (instance.type === "oscillator") {
    input.connect(output);
    const result = calculateModule(instance);
    const frequency = clamp(result.frequency, 20, 12000);
    const toneGain = ctx.createGain();
    toneGain.gain.value = p.mix / 100 * 0.14;
    toneGain.connect(output);
    const osc1 = ctx.createOscillator();
    osc1.type = "square"; osc1.frequency.value = frequency; osc1.connect(toneGain); osc1.start();
    nodes.push(toneGain, osc1);
    if (p.voices === "dual") {
      const osc2 = ctx.createOscillator();
      osc2.type = "square"; osc2.frequency.value = frequency * 1.498; osc2.connect(toneGain); osc2.start();
      nodes.push(osc2);
    }
  } else if (instance.type === "fuzz" || instance.type === "overdrive" || instance.type === "distortion") {
    const dry = ctx.createGain();
    const wet = ctx.createGain();
    const shaper = ctx.createWaveShaper();
    const filter = ctx.createBiquadFilter();
    const threshold = diodeThreshold(p.diode);
    const drive = instance.type === "fuzz" ? clamp((1 + p.rf / p.rin) * 2.1, 1, 100) : instance.type === "overdrive" ? clamp((1 + p.drive / p.rin) * 1.35, 1, 75) : clamp((1 + p.drive / 4.7) * 2.8, 1, 100);
    shaper.curve = makeCurve(drive, threshold);
    shaper.oversample = "4x";
    filter.type = instance.type === "overdrive" ? "highpass" : "lowpass";
    const resistance = instance.type === "fuzz" ? 10000 : instance.type === "overdrive" ? p.rin * 1000 : p.toneR * 1000;
    const capacitance = instance.type === "overdrive" ? p.couplingC * 1e-6 : p.toneC * 1e-9;
    filter.frequency.value = clamp(1 / (2 * Math.PI * resistance * capacitance), 20, 16000);
    const mix = instance.type === "fuzz" ? 1 : p.mix / 100;
    dry.gain.value = 1 - mix;
    wet.gain.value = (instance.type === "fuzz" ? p.level / 100 : mix) * (threshold < 1 ? 1.6 : .85);
    input.connect(dry); dry.connect(output);
    input.connect(shaper); shaper.connect(filter); filter.connect(wet); wet.connect(output);
    nodes.push(dry, wet, shaper, filter);
  } else if (instance.type === "octave") {
    const dry = ctx.createGain();
    const wet = ctx.createGain();
    const shaper = ctx.createWaveShaper();
    const highpass = ctx.createBiquadFilter();
    const dcBlock = ctx.createBiquadFilter();
    const mix = p.blend / 100;
    dry.gain.value = 1 - mix;
    wet.gain.value = mix * 0.9;
    highpass.type = "highpass";
    highpass.frequency.value = clamp(1 / (2 * Math.PI * p.loadR * 1000 * p.inputC * 1e-6), 10, 3000);
    dcBlock.type = "highpass"; dcBlock.frequency.value = 28;
    shaper.curve = makeCurve(20, diodeThreshold(p.diode), "octave");
    shaper.oversample = "4x";
    input.connect(dry); dry.connect(output);
    input.connect(highpass); highpass.connect(shaper); shaper.connect(dcBlock); dcBlock.connect(wet); wet.connect(output);
    nodes.push(dry, wet, shaper, highpass, dcBlock);
  } else if (instance.type === "delay") {
    const dry = ctx.createGain();
    const wet = ctx.createGain();
    const delay = ctx.createDelay(1.25);
    const feedback = ctx.createGain();
    const damping = ctx.createBiquadFilter();
    const calculation = calculateModule(instance);
    const delayMs = calculation.delayMs;
    delay.delayTime.value = clamp(delayMs / 1000, .02, 1.2);
    dry.gain.value = 1 - p.mix / 100 * .45;
    wet.gain.value = p.mix / 100;
    feedback.gain.value = clamp(p.feedback / 100, 0, .92);
    damping.type = "lowpass"; damping.frequency.value = 4200;
    input.connect(dry); dry.connect(output);
    input.connect(delay); delay.connect(wet); wet.connect(output);
    delay.connect(damping); damping.connect(feedback); feedback.connect(delay);
    nodes.push(dry, wet, delay, feedback, damping);
  } else if (instance.type === "glitch") {
    const dry = ctx.createGain();
    const wet = ctx.createGain();
    const shaper = ctx.createWaveShaper();
    const gate = ctx.createGain();
    const modulation = ctx.createGain();
    const lfo = ctx.createOscillator();
    const mix = p.depth / 100;
    const steps = Math.max(3, Math.round(p.steps));
    const curve = new Float32Array(2048);
    for (let i = 0; i < curve.length; i++) {
      const x = i / (curve.length - 1) * 2 - 1;
      curve[i] = Math.round(x * steps) / steps;
    }
    shaper.curve = curve;
    dry.gain.value = 1 - mix * .75;
    wet.gain.value = mix;
    gate.gain.value = .5;
    modulation.gain.value = .5;
    lfo.type = "square";
    lfo.frequency.value = clamp(calculateModule(instance).chopRate, .5, 80);
    input.connect(dry); dry.connect(output);
    input.connect(shaper); shaper.connect(gate); gate.connect(wet); wet.connect(output);
    lfo.connect(modulation); modulation.connect(gate.gain); lfo.start();
    nodes.push(dry, wet, shaper, gate, modulation, lfo);
  }
  return { input, output, nodes };
}

function rebuildAudioGraph() {
  if (!audio.context) return;
  try { audio.sourceBus.disconnect(); } catch (_) { /* initial graph */ }
  audio.moduleNodes.forEach((node) => {
    try { if (typeof node.stop === "function") node.stop(); } catch (_) { /* already stopped */ }
    try { node.disconnect(); } catch (_) { /* already disconnected */ }
  });
  audio.moduleNodes = [];
  let previous = audio.sourceBus;
  state.modules.filter((instance) => !instance.bypassed).forEach((instance) => {
    const processor = createModuleProcessor(instance);
    previous.connect(processor.input);
    previous = processor.output;
    audio.moduleNodes.push(...processor.nodes);
  });
  previous.connect(audio.master);
}

async function toggleAudio() {
  const button = $("#audio-toggle");
  try {
    await ensureAudio();
    state.audioOn = !state.audioOn;
    if (state.audioOn) {
      rebuildAudioGraph();
      await startSource();
      button.classList.add("is-on");
      button.setAttribute("aria-pressed", "true");
      button.querySelector("span:last-child").textContent = "Stop audio";
      announce("Audio started. Output is a browser simulation.");
    } else {
      stopSource();
      await audio.context.suspend();
      button.classList.remove("is-on");
      button.setAttribute("aria-pressed", "false");
      button.querySelector("span:last-child").textContent = "Start audio";
      announce("Audio stopped.");
    }
  } catch (error) {
    announce(error.message || "Audio could not start in this browser.");
  }
}

function drawScopes() {
  const waveCanvas = $("#waveform");
  const spectrumCanvas = $("#spectrum");
  const wave = waveCanvas.getContext("2d");
  const bars = spectrumCanvas.getContext("2d");

  function fit(canvas) {
    const ratio = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
    const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    return { width, height, ratio };
  }
  const w = fit(waveCanvas);
  const s = fit(spectrumCanvas);
  wave.fillStyle = "#0c0e0b"; wave.fillRect(0, 0, w.width, w.height);
  bars.fillStyle = "#0c0e0b"; bars.fillRect(0, 0, s.width, s.height);
  wave.strokeStyle = "#242921"; wave.lineWidth = w.ratio;
  for (let i = 1; i < 8; i++) { wave.beginPath(); wave.moveTo(i * w.width / 8, 0); wave.lineTo(i * w.width / 8, w.height); wave.stroke(); }
  for (let i = 1; i < 4; i++) { wave.beginPath(); wave.moveTo(0, i * w.height / 4); wave.lineTo(w.width, i * w.height / 4); wave.stroke(); }

  if (audio.analyser && state.audioOn) {
    const waveformData = new Uint8Array(audio.analyser.fftSize);
    audio.analyser.getByteTimeDomainData(waveformData);
    wave.strokeStyle = "#d7ff3f"; wave.lineWidth = 1.5 * w.ratio; wave.beginPath();
    waveformData.forEach((value, index) => {
      const x = index / (waveformData.length - 1) * w.width;
      const y = value / 255 * w.height;
      index ? wave.lineTo(x, y) : wave.moveTo(x, y);
    });
    wave.stroke();

    const freqData = new Uint8Array(audio.analyser.frequencyBinCount);
    audio.analyser.getByteFrequencyData(freqData);
    const count = 54;
    const gap = 2 * s.ratio;
    const barWidth = s.width / count - gap;
    for (let i = 0; i < count; i++) {
      const sourceIndex = Math.floor(Math.pow(i / count, 2) * freqData.length * .45);
      const height = freqData[sourceIndex] / 255 * s.height * .9;
      bars.fillStyle = i % 5 === 0 ? "#d7ff3f" : "#61704d";
      bars.fillRect(i * (barWidth + gap), s.height - height, barWidth, height);
    }
  } else {
    wave.strokeStyle = "#536047"; wave.beginPath(); wave.moveTo(0, w.height / 2); wave.lineTo(w.width, w.height / 2); wave.stroke();
  }
  window.requestAnimationFrame(drawScopes);
}

function downloadBlob(name, content, type) {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function downloadBom() {
  const rows = aggregateBom();
  const csv = ["Component,Quantity,Unit cost USD,Subtotal USD,Amazon US search"].concat(rows.map((row) => {
    const price = Number(state.prices[row.key] ?? row.price);
    const values = [row.name, row.qty, price.toFixed(2), (row.qty * price).toFixed(2), `https://www.amazon.com/s?k=${encodeURIComponent(row.query)}`];
    return values.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",");
  })).join("\n");
  downloadBlob("circuit-bending-sound-designer-bom.csv", csv, "text/csv;charset=utf-8");
  announce("BOM downloaded as CSV.");
}

function createBoxTriangles(x, y, z, width, depth, height) {
  const v = [
    [x,y,z], [x+width,y,z], [x+width,y+depth,z], [x,y+depth,z],
    [x,y,z+height], [x+width,y,z+height], [x+width,y+depth,z+height], [x,y+depth,z+height]
  ];
  const faces = [[0,2,1],[0,3,2],[4,5,6],[4,6,7],[0,1,5],[0,5,4],[1,2,6],[1,6,5],[2,3,7],[2,7,6],[3,0,4],[3,4,7]];
  return faces.map((face) => face.map((index) => v[index]));
}

function triangleToStl(triangle) {
  const [a,b,c] = triangle;
  const u = [b[0]-a[0], b[1]-a[1], b[2]-a[2]];
  const v = [c[0]-a[0], c[1]-a[1], c[2]-a[2]];
  const n = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]];
  const length = Math.hypot(...n) || 1;
  const normal = n.map((value) => value / length);
  return `facet normal ${normal.join(" ")}\n outer loop\n${triangle.map((point) => `  vertex ${point.join(" ")}`).join("\n")}\n endloop\nendfacet`;
}

function downloadStl() {
  const width = Number($("#case-width").value);
  const depth = Number($("#case-depth").value);
  const height = Number($("#case-height").value);
  const wall = Number($("#case-wall").value);
  if (![width, depth, height, wall].every(Number.isFinite) || wall * 2 >= Math.min(width, depth) || width < 60 || depth < 50 || height < 20 || wall < 1.5) {
    announce("Enter valid dimensions; the wall must fit inside the enclosure.");
    return;
  }
  const triangles = [
    ...createBoxTriangles(0, 0, 0, width, depth, wall),
    ...createBoxTriangles(0, 0, wall, wall, depth, height-wall),
    ...createBoxTriangles(width-wall, 0, wall, wall, depth, height-wall),
    ...createBoxTriangles(wall, 0, wall, width-wall*2, wall, height-wall),
    ...createBoxTriangles(wall, depth-wall, wall, width-wall*2, wall, height-wall)
  ];
  const stl = `solid circuit_bending_enclosure\n${triangles.map(triangleToStl).join("\n")}\nendsolid circuit_bending_enclosure\n`;
  downloadBlob(`cbsd-enclosure-${width}x${depth}x${height}mm.stl`, stl, "model/stl");
  announce("Generic enclosure STL downloaded. Verify dimensions before printing.");
}

function loadPreset() {
  state.modules = [];
  state.selectedId = null;
  ["oscillator", "fuzz", "fuzz", "octave", "distortion", "delay"].forEach((type) => {
    state.modules.push({ id: nextId++, type, bypassed: false, params: freshParams(type) });
  });
  state.selectedId = state.modules[0].id;
  renderStudio();
  rebuildAudioGraph();
  announce("Grit preset loaded: dual oscillator, double fuzz, octave, distortion, and delay.");
}

function hardwarePreset() {
  return window.HARDWARE_PRESETS[state.hardwarePreset];
}

function componentValue(component, preset) {
  if (component.valueKey) return `${preset.values[component.valueKey]}${component.suffix || ""}`;
  return component.value;
}

function componentIcon(kind) {
  const common = 'viewBox="0 0 82 50" aria-hidden="true"';
  if (kind === "resistor") return `<svg ${common}><path d="M4 25h14l5-9 8 18 8-18 8 18 8-18 5 9h18"/><text x="41" y="47">R</text></svg>`;
  if (kind === "capacitor") return `<svg ${common}><path d="M5 25h28m0-14v28m16-28v28m0-14h28"/><text x="41" y="47">C</text></svg>`;
  if (kind === "electrolytic") return `<svg ${common}><path d="M5 25h28m0-14v28m16-28v28m0-14h28"/><text x="25" y="10">+</text><text x="41" y="47">C</text></svg>`;
  if (kind === "diode") return `<svg ${common}><path d="M5 25h25m22 0h25M30 11v28l22-14zM52 11v28"/><text x="41" y="47">D</text></svg>`;
  if (kind === "pot") return `<svg ${common}><path d="M5 28h14l5-8 7 16 7-16 7 16 7-16 5 8h20M62 5 43 20m19-15-2 9m2-9-9 1"/><text x="18" y="48">POT</text></svg>`;
  if (kind === "jack") return `<svg ${common}><circle cx="41" cy="25" r="17"/><circle cx="41" cy="25" r="7"/><path d="M58 25h19"/><text x="5" y="47">JACK</text></svg>`;
  if (kind === "supply") return `<svg ${common}><path d="M6 25h20m4-14v28m11-20v12m4-6h31"/><text x="49" y="47">9 V</text></svg>`;
  if (kind === "breadboard") return `<svg ${common}><rect x="4" y="6" width="74" height="37" rx="2"/><path d="M8 14h66M8 35h66M39 17v15m4-15v15" stroke-dasharray="2 2"/><text x="23" y="29">BB830</text></svg>`;
  const pins = kind === "dip14" ? 7 : 4;
  return `<svg ${common}><rect x="19" y="8" width="44" height="34" rx="2"/><path d="M35 8q6 8 12 0"/>${Array.from({length:pins},(_,i)=>`<path d="M${23+i*(36/(pins-1))} 3v5m0 34v5"/>`).join("")}<text x="41" y="29" text-anchor="middle">IC</text></svg>`;
}

function renderHardwareSelector() {
  const select = $("#hardware-preset");
  select.innerHTML = Object.values(window.HARDWARE_PRESETS).map((preset) => `<option value="${preset.id}"${preset.id === state.hardwarePreset ? " selected" : ""}>${preset.name}</option>`).join("");
  $("#download-guide").href = hardwarePreset().guide;
}

function renderHardwareControls() {
  const preset = hardwarePreset();
  $("#hardware-controls").innerHTML = `<p class="hardware-summary">${preset.summary}</p>${preset.controls.map((control) => `
    <div class="hardware-control">
      <div><label for="hardware-${control.key}"><span>${control.ref}</span>${control.label}</label><output id="hardware-value-${control.key}">${preset.values[control.key]} ${control.unit}</output></div>
      <input id="hardware-${control.key}" type="range" min="${control.min}" max="${control.max}" step="${control.step}" value="${preset.values[control.key]}" data-hardware-key="${control.key}">
    </div>`).join("")}
    <div class="hardware-calculation">${hardwareCalculation(preset)}</div>`;
}

function hardwareCalculation(preset) {
  const v = preset.values;
  if (preset.id === "dual555") {
    const f = 1.44 / (((v.r1 + 2 * v.r2) * 1000) * (v.c * 1e-9));
    return `<span>Calculated timing</span><strong>${f.toFixed(1)} Hz</strong><code>f ≈ 1.44 / ((${v.r1} kΩ + 2×${v.r2} kΩ) × ${v.c} nF)</code><p>Component tolerance means a physical frequency will differ.</p>`;
  }
  if (preset.id === "opampFuzz") {
    const gain = v.rf / v.rin;
    const fc = 1 / (2 * Math.PI * 10000 * v.toneC * 1e-9);
    return `<span>Calculated relationships</span><strong>${gain.toFixed(1)}× gain · ${fc.toFixed(0)} Hz corner</strong><code>|A| ≈ ${v.rf} kΩ / ${v.rin} kΩ; fc = 1/(2π×10 kΩ×${v.toneC} nF)</code><p>Diodes limit the unclipped gain in practice.</p>`;
  }
  const rate = 1 / (2.2 * v.clockR * 1000 * v.clockC * 1e-6);
  return `<span>Calculated RC estimate</span><strong>${rate.toFixed(1)} Hz</strong><code>f ≈ 1 / (2.2 × ${v.clockR} kΩ × ${v.clockC} µF)</code><p>CD40106 thresholds and part tolerances shift the physical rate.</p>`;
}

function renderIllustratedBom() {
  const preset = hardwarePreset();
  let total = 0;
  $("#illustrated-components").innerHTML = preset.components.map((component) => {
    total += component.qty * component.cost;
    return `<article class="part-item">
      <div class="part-icon">${componentIcon(component.kind)}</div>
      <div><span>${component.ref} · qty ${component.qty}</span><strong>${component.name}</strong><p>${componentValue(component, preset)}</p><small>${component.note}</small><a href="https://www.amazon.com/s?k=${encodeURIComponent(component.query)}" target="_blank" rel="noopener noreferrer">Find on Amazon US ↗</a></div>
    </article>`;
  }).join("");
  $("#hardware-cost").textContent = `$${total.toFixed(2)}`;
}

function schematicSvg(preset) {
  const v = preset.values;
  const header = `<svg class="technical-svg" viewBox="0 0 980 520" role="img" aria-label="${preset.name} labeled construction schematic"><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 10 5 0 10z" fill="currentColor"/></marker></defs><rect width="980" height="520" fill="#f7f8f3"/><text x="34" y="42" class="svg-title">${preset.name}</text><text x="34" y="66" class="svg-note">9 V DC · TOP VIEW PIN REFERENCES · NOT PHYSICALLY TESTED</text>`;
  if (preset.id === "dual555") return `${header}
    <path class="rail plus" d="M70 100H910"/><text x="72" y="92">+9 V</text><path class="rail ground" d="M70 455H910"/><text x="72" y="478">GND</text>
    <g transform="translate(185 145)"><rect class="ic-body" width="190" height="185"/><path d="M80 0q15 20 30 0" class="symbol"/><text x="95" y="90" text-anchor="middle" class="ic-name">U1 NE555P</text><text x="12" y="25">8 VCC</text><text x="12" y="165">1 GND</text><text x="125" y="25">4 RESET</text><text x="112" y="165">3 OUT</text><text x="12" y="58">7 DISCH</text><text x="12" y="126">2 TRIG</text><text x="116" y="126">6 THRES</text><text x="116" y="58">5 CONT</text></g>
    <g transform="translate(610 145)"><rect class="ic-body" width="190" height="185"/><path d="M80 0q15 20 30 0" class="symbol"/><text x="95" y="90" text-anchor="middle" class="ic-name">U2 NE555P</text><text x="12" y="25">8 VCC</text><text x="12" y="165">1 GND</text><text x="125" y="25">4 RESET</text><text x="112" y="165">3 OUT</text><text x="12" y="58">7 DISCH</text><text x="12" y="126">2 TRIG</text><text x="116" y="126">6 THRES</text><text x="116" y="58">5 CONT</text></g>
    <path class="wire" d="M220 145V100m120 45v-45M645 145v-45m120 45v-45M220 330v125M645 330v125"/>
    <path class="wire blue" d="M197 203H130v70h67m166 0h70v88H320m302-158h-67v70h67m166 0h70v88H745"/>
    <g class="component-label"><text x="78" y="188">R1 ${v.r1} kΩ</text><text x="76" y="226">P1 ${v.r2} kΩ</text><text x="370" y="382">C1 ${v.c} nF</text><text x="502" y="188">R3 ${v.r1} kΩ</text><text x="500" y="226">P2 100 kΩ</text><text x="796" y="382">C3 ${v.c} nF</text></g>
    <path class="wire signal" d="M297 310v75h125m266-75v75H562m-140 0h140"/><rect x="454" y="365" width="76" height="40" class="component-box"/><text x="492" y="390" text-anchor="middle">MIX R5/R6</text><path class="wire signal" d="M530 385h145v45h160"/><text x="700" y="420">P3 ${v.mix}% → C5 → OUTPUT</text></svg>`;
  if (preset.id === "opampFuzz") return `${header}
    <path class="rail plus" d="M50 95H930"/><text x="55" y="86">+9 V</text><path class="rail ground" d="M50 460H930"/><text x="55" y="483">GND</text>
    <path class="wire" d="M120 95v75m0 70v70m0 70v80"/><path class="resistor-symbol" d="M120 170l-10 7 20 12-20 12 20 12-10 7"/><path class="resistor-symbol" d="M120 310l-10 7 20 12-20 12 20 12-10 7"/><text x="138" y="198">R1 100 kΩ</text><text x="138" y="338">R2 100 kΩ</text><circle cx="120" cy="270" r="5"/><text x="140" y="276">VBIAS ≈ 4.5 V</text>
    <path class="wire purple" d="M120 270h160"/><path class="opamp" d="M280 225v90l95-45z"/><text x="295" y="251">+ 5</text><text x="295" y="298">− 6</text><text x="333" y="274">U1B</text><path class="wire purple" d="M375 270h75v75h-145v-48"/><text x="385" y="257">7 VREF</text>
    <path class="wire signal" d="M40 385h90"/><text x="42" y="375">INPUT</text><rect x="130" y="365" width="62" height="38" class="component-box"/><text x="161" y="389" text-anchor="middle">C2</text><path class="wire signal" d="M192 385h62"/><path class="resistor-symbol" d="M254 385l8-10 12 20 12-20 12 20 12-10h50"/><text x="260" y="420">R3 ${v.rin} kΩ</text>
    <path class="opamp" d="M360 335v100l110-50z"/><text x="376" y="365">− 2</text><text x="376" y="415">+ 3</text><text x="413" y="389">U1A</text><path class="wire purple" d="M360 410H280V270"/><path class="wire signal" d="M470 385h92"/>
    <path class="wire orange" d="M455 355v-72H330v72"/><path class="resistor-symbol" d="M355 283l8-10 12 20 12-20 12 20 12-10"/><text x="348" y="261">R4 ${v.rf} kΩ</text><path class="wire yellow" d="M350 320h84"/><path class="diode-symbol" d="M370 310v20l22-10zm22-10v40m20-30v20l-22-10zm-22-10v40"/><text x="350" y="345">D1/D2 1N4148 antiparallel</text>
    <rect x="562" y="365" width="95" height="40" class="component-box"/><text x="609" y="389" text-anchor="middle">R5 10 kΩ</text><path class="wire signal" d="M657 385h78"/><path class="wire" d="M705 385v75"/><text x="674" y="440">C4 ${v.toneC} nF</text><path class="wire signal" d="M735 385h195"/><text x="755" y="374">P1 ${v.level}% → C3 → OUTPUT</text></svg>`;
  return `${header}
    <path class="rail plus" d="M60 95H920"/><text x="65" y="86">+9 V</text><path class="rail ground" d="M60 445H920"/><text x="65" y="470">GND</text>
    <rect x="165" y="150" width="250" height="205" class="ic-body"/><text x="290" y="185" text-anchor="middle" class="ic-name">U1 CD40106BE · PDIP-14</text><path class="inverter" d="M240 225v80l95-40z"/><circle cx="346" cy="265" r="11" class="symbol"/><text x="205" y="270">1 A</text><text x="355" y="270">2 /A</text><text x="180" y="330">14 VDD → +9 V · 7 VSS → GND</text>
    <path class="wire blue" d="M357 265h145v-105H210v65"/><path class="resistor-symbol" d="M410 160l8-10 12 20 12-20 12 20 12-10"/><text x="382" y="138">R1 1 kΩ + P1 ${v.clockR} kΩ</text><path class="wire" d="M210 265H110v180"/><path d="M90 355h40m-40 14h40" class="symbol"/><text x="62" y="342">C1</text><text x="54" y="390">${v.clockC} µF</text>
    <path class="wire signal" d="M357 265h205"/><path class="resistor-symbol" d="M500 265l8-10 12 20 12-20 12 20 12-10"/><rect x="562" y="245" width="70" height="40" class="component-box"/><text x="597" y="270" text-anchor="middle">C2 1 µF</text><path class="wire signal" d="M632 265h270"/><text x="682" y="249">P2 ${v.depth}% → OUTPUT</text><text x="515" y="330">Unused inputs 3, 5, 9, 11, 13 → GND</text></svg>`;
}

function holePoint(hole) {
  const rail = hole[0] === "+" || hole[0] === "-";
  if (rail) return { x: 54 + (Number(hole.slice(1)) - 1) * 24, y: hole[0] === "+" ? 57 : 82 };
  const letter = hole[0].toUpperCase();
  const col = Number(hole.slice(1));
  const ys = { A:132, B:152, C:172, D:192, E:212, F:262, G:282, H:302, I:322, J:342 };
  return { x: 54 + (col - 1) * 24, y: ys[letter] };
}

function breadboardSvg(preset) {
  let holes = "";
  for (let col = 1; col <= 30; col++) {
    const x = 54 + (col - 1) * 24;
    holes += `<text x="${x}" y="118" text-anchor="middle">${col}</text><circle cx="${x}" cy="57" r="3" class="rail-hole plus-hole"/><circle cx="${x}" cy="82" r="3" class="rail-hole ground-hole"/>`;
    for (const y of [132,152,172,192,212,262,282,302,322,342]) holes += `<circle cx="${x}" cy="${y}" r="3.2" class="board-hole"/>`;
  }
  const letters = Object.entries({A:132,B:152,C:172,D:192,E:212,F:262,G:282,H:302,I:322,J:342}).map(([l,y])=>`<text x="20" y="${y+4}">${l}</text>`).join("");
  const wires = preset.boardWires.map(([from,to,color]) => { const a=holePoint(from), b=holePoint(to); return `<path class="board-wire ${color}" d="M${a.x} ${a.y} C${a.x} ${(a.y+b.y)/2} ${b.x} ${(a.y+b.y)/2} ${b.x} ${b.y}"/><circle cx="${a.x}" cy="${a.y}" r="5" class="wire-end ${color}"/><circle cx="${b.x}" cy="${b.y}" r="5" class="wire-end ${color}"/>`; }).join("");
  const parts = preset.placements.map((part) => {
    if (part.kind.startsWith("dip")) {
      const pins = part.kind === "dip14" ? 7 : 4;
      const x = 54 + (part.col - 1) * 24 - 8;
      const width = (pins - 1) * 24 + 16;
      const pinLabels = Array.from({length:pins},(_,i)=>`<text x="${x+8+i*24}" y="253" text-anchor="middle">${i+1}</text><text x="${x+8+i*24}" y="228" text-anchor="middle">${pins*2-i}</text>`).join("");
      return `<g><rect x="${x}" y="218" width="${width}" height="38" class="board-ic"/><path d="M${x} 229q13 8 0 16" class="symbol"/><text x="${x+width/2}" y="244" text-anchor="middle" class="board-label">${part.ref} ${part.label}</text>${pinLabels}</g>`;
    }
    const a=holePoint(part.from), b=holePoint(part.to), mx=(a.x+b.x)/2, my=(a.y+b.y)/2;
    if (part.kind === "resistor") return `<g><path d="M${a.x} ${a.y}L${mx-22} ${my}m44 0L${b.x} ${b.y}" class="part-lead"/><rect x="${mx-22}" y="${my-8}" width="44" height="16" rx="6" class="board-resistor"/><text x="${mx}" y="${my-12}" text-anchor="middle" class="board-label">${part.ref} ${part.label}</text></g>`;
    if (part.kind === "diode") return `<g><path d="M${a.x} ${a.y}L${mx-20} ${my}m40 0L${b.x} ${b.y}" class="part-lead"/><rect x="${mx-20}" y="${my-7}" width="40" height="14" class="board-diode"/><path d="M${mx+12} ${my-7}v14" class="diode-band"/><text x="${mx}" y="${my-12}" text-anchor="middle" class="board-label">${part.ref}</text></g>`;
    return `<g><path d="M${a.x} ${a.y}L${mx-8} ${my}m16 0L${b.x} ${b.y}" class="part-lead"/><path d="M${mx-8} ${my-13}v26m16-26v26" class="board-cap"/><text x="${mx}" y="${my-17}" text-anchor="middle" class="board-label">${part.ref} ${part.label}</text></g>`;
  }).join("");
  return `<svg class="technical-svg breadboard-svg" viewBox="0 0 790 410" role="img" aria-label="${preset.name} breadboard placement, top view"><rect x="4" y="20" width="780" height="370" rx="8" class="breadboard-body"/><path d="M35 232H765" class="board-trench"/><path d="M35 57H765M35 82H765" class="board-rail"/><text x="20" y="61" class="plus-text">+</text><text x="20" y="86" class="minus-text">−</text>${letters}${holes}${wires}${parts}<text x="395" y="382" text-anchor="middle" class="svg-note">TOP VIEW · BB830-STYLE · VERIFY RAIL CONTINUITY · CONNECTION TABLE IS AUTHORITATIVE</text></svg>`;
}

function renderConstruction() {
  const preset = hardwarePreset();
  const panel = $("#construction-panel");
  if (state.constructionView === "schematic") panel.innerHTML = `<div class="graphic-heading"><div><p class="evidence-label">Construction schematic</p><h2>${preset.name}</h2></div><span>Calculated / not physically tested</span></div>${schematicSvg(preset)}<p class="graphic-caption">Reference designators and values match the parts tray. Use the Connections view as the wiring source of truth.</p>`;
  if (state.constructionView === "breadboard") panel.innerHTML = `<div class="graphic-heading"><div><p class="evidence-label">Breadboard layout</p><h2>${preset.name}</h2></div><span>Top view · power disconnected</span></div>${breadboardSvg(preset)}<p class="graphic-caption">Colored paths show jumpers; component leads terminate at named holes. Off-board pots and jacks are defined in the Connections view.</p>`;
  if (state.constructionView === "connections") panel.innerHTML = `<div class="graphic-heading"><div><p class="evidence-label">Canonical connection table</p><h2>${preset.name}</h2></div><span>${preset.connections.length} audited nets</span></div><div class="connection-table-wrap"><table class="connection-table"><thead><tr><th>Net</th><th>Connection path</th><th>Wire</th><th>Check</th></tr></thead><tbody>${preset.connections.map((row)=>`<tr><td><strong>${row[0]}</strong></td><td>${row.slice(1,-2).join(" → ")}</td><td><span class="wire-swatch ${row.at(-2)}"></span>${row.at(-2)}</td><td>${row.at(-1)}</td></tr>`).join("")}</tbody></table></div>`;
  if (state.constructionView === "pinouts") panel.innerHTML = `<div class="graphic-heading"><div><p class="evidence-label">Manufacturer-verified pinouts</p><h2>${preset.name}</h2></div><span>Top view · confirm notch before power</span></div>${preset.pinouts.map((key)=>{const item=window.HARDWARE_PINOUTS[key];return `<section class="pinout-section"><h3>${item.identity}</h3><p>${item.orientation}</p><div class="connection-table-wrap"><table class="connection-table pinout-table"><thead><tr><th>Pin</th><th>Name</th><th>Role in this component</th></tr></thead><tbody>${item.pins.map(([number,name,role])=>`<tr><td>${number}</td><td><strong>${name}</strong></td><td>${role}</td></tr>`).join("")}</tbody></table></div><a href="${item.source}" target="_blank" rel="noopener noreferrer">Open manufacturer source ↗</a></section>`;}).join("")}`;
  if (state.constructionView === "assembly") panel.innerHTML = `<div class="graphic-heading"><div><p class="evidence-label">Power-off assembly</p><h2>${preset.name}</h2></div><span>Complete one step at a time</span></div><ol class="assembly-list">${preset.assembly.map((step,index)=>`<li><span>${String(index+1).padStart(2,"0")}</span><p>${step}</p></li>`).join("")}</ol>`;
}

function renderHardwareSources() {
  const preset = hardwarePreset();
  $("#hardware-sources").innerHTML = `<strong>Pinout sources</strong>${preset.sources.map(([label,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`).join("")}`;
}

function renderHardware() {
  renderHardwareSelector();
  renderHardwareControls();
  renderIllustratedBom();
  renderConstruction();
  renderHardwareSources();
}

function loadHardwareSound() {
  const preset = hardwarePreset();
  state.modules = preset.chain.map((type) => ({ id: nextId++, type, bypassed: false, params: freshParams(type) }));
  preset.controls.forEach((control) => {
    const module = state.modules[control.audio.module];
    if (module) module.params[control.audio.key] = preset.values[control.key];
  });
  if (preset.id === "dual555") state.modules[0].params.voices = "dual";
  if (preset.id === "opampFuzz") state.modules[0].params.diode = "silicon";
  state.selectedId = state.modules[0]?.id ?? null;
  state.hardwareLoadedId = preset.id;
  renderStudio();
  rebuildAudioGraph();
  announce(`${preset.name} sound model loaded. Open Studio to listen.`);
}

function showView(viewId) {
  $$(".view").forEach((view) => { view.hidden = view.id !== viewId; view.classList.toggle("is-active", view.id === viewId); });
  $$(".tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === viewId));
  if (viewId === "build") renderBom();
  if (viewId === "hardware") renderHardware();
  const heading = $(`#${viewId} h1`);
  if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const add = event.target.closest("[data-add]");
    if (add) return addModule(add.dataset.add);
    const select = event.target.closest("[data-select]");
    if (select) { state.selectedId = Number(select.dataset.select); renderChain(); renderInspector(); return; }
    const bypass = event.target.closest("[data-bypass]");
    if (bypass) {
      const instance = state.modules.find((item) => item.id === Number(bypass.dataset.bypass));
      instance.bypassed = !instance.bypassed; renderStudio(); rebuildAudioGraph(); announce(instance.bypassed ? "Module bypassed." : "Module enabled."); return;
    }
    const remove = event.target.closest("[data-remove]");
    if (remove) return removeModule(Number(remove.dataset.remove));
    const move = event.target.closest("[data-move]");
    if (move) return moveModule(state.selectedId, Number(move.dataset.move));
    const tab = event.target.closest(".tab");
    if (tab) return showView(tab.dataset.view);
  });

  $("#inspector-content").addEventListener("input", (event) => {
    if (event.target.matches("[data-param]")) updateSelectedParam(event.target.dataset.param, event.target.value);
  });
  $("#inspector-content").addEventListener("change", (event) => {
    if (event.target.matches("select[data-param]")) updateSelectedParam(event.target.dataset.param, event.target.value);
  });
  $("#audio-toggle").addEventListener("click", toggleAudio);
  $("#master-volume").addEventListener("input", (event) => {
    const value = Number(event.target.value);
    $("#master-volume-value").textContent = `${value}%`;
    if (audio.master) audio.master.gain.setTargetAtTime(value / 100, audio.context.currentTime, .01);
  });
  $("#source-select").addEventListener("change", async (event) => {
    state.source = event.target.value;
    $("#file-label").hidden = state.source !== "file";
    if (state.audioOn) await startSource();
  });
  $("#audio-file").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      await ensureAudio();
      audio.fileBuffer = await audio.context.decodeAudioData(await file.arrayBuffer());
      announce(`${file.name} loaded locally. It is not uploaded.`);
      if (state.audioOn && state.source === "file") await startSource();
    } catch (_) { announce("That audio file could not be decoded by this browser."); }
  });
  $("#clear-chain").addEventListener("click", () => { state.modules = []; state.selectedId = null; renderStudio(); rebuildAudioGraph(); announce("Signal chain cleared."); });
  $("#preset-grit").addEventListener("click", loadPreset);
  $("#bom-body").addEventListener("change", (event) => {
    const input = event.target.closest("[data-cost-key]");
    if (!input) return;
    state.prices[decodeURIComponent(input.dataset.costKey)] = Math.max(0, Number(input.value) || 0);
    renderBom();
  });
  $("#download-bom").addEventListener("click", downloadBom);
  $("#print-build").addEventListener("click", () => window.print());
  $("#download-stl").addEventListener("click", downloadStl);
  $("#hardware-preset").addEventListener("change", (event) => {
    state.hardwarePreset = event.target.value;
    state.hardwareLoadedId = null;
    renderHardware();
    announce(`${hardwarePreset().name} build guide selected.`);
  });
  $("#load-hardware-sound").addEventListener("click", loadHardwareSound);
  $("#hardware-controls").addEventListener("input", (event) => {
    const input = event.target.closest("[data-hardware-key]");
    if (!input) return;
    const preset = hardwarePreset();
    const control = preset.controls.find((item) => item.key === input.dataset.hardwareKey);
    preset.values[control.key] = Number(input.value);
    $(`#hardware-value-${control.key}`).textContent = `${input.value} ${control.unit}`;
    if (state.hardwareLoadedId === preset.id) {
      const module = state.modules[control.audio.module];
      if (module) module.params[control.audio.key] = Number(input.value);
      rebuildAudioGraph(); renderChain(); renderInspector();
    }
    renderIllustratedBom();
    $(".hardware-calculation").innerHTML = hardwareCalculation(preset);
    if (state.constructionView === "schematic" || state.constructionView === "breadboard") renderConstruction();
  });
  $(".construction-tabs").addEventListener("click", (event) => {
    const button = event.target.closest("[data-construction]");
    if (!button) return;
    state.constructionView = button.dataset.construction;
    $$("[data-construction]").forEach((tab) => tab.setAttribute("aria-selected", String(tab === button)));
    renderConstruction();
  });
  $("#experiment-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const summary = `Experiment summary\nModule: ${$("#experiment-module").value}\nPrediction: ${$("#prediction").value}\nChange: ${$("#changed-value").value}\nObservation: ${$("#observation").value}\nExplanation: ${$("#reflection").value}\n\nEvidence label: Student observation of simulated browser audio; not a physical measurement.`;
    $("#experiment-output").textContent = summary;
    announce("Experiment summary prepared.");
  });
  $("#experiment-form").addEventListener("reset", () => { window.setTimeout(() => { $("#experiment-output").textContent = ""; }, 0); });
}

renderLibrary();
bindEvents();
loadPreset();
renderHardware();
drawScopes();
