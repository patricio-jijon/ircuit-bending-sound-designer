import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import { JSDOM, VirtualConsole } from "jsdom";
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const errors = [];
const virtualConsole = new VirtualConsole();
virtualConsole.on("jsdomError", (e) => errors.push(e.message));
const dom = new JSDOM(html, {
  url: "https://circuit.example/#studio",
  runScripts: "outside-only",
  pretendToBeVisual: true,
  virtualConsole,
});
const w = dom.window,
  context = dom.getInternalVMContext();
let timer = 0;
w.setTimeout = () => ++timer;
w.clearTimeout = () => {};
w.setInterval = () => ++timer;
w.clearInterval = () => {};
w.requestAnimationFrame = () => ++timer;
w.cancelAnimationFrame = () => {};
w.structuredClone = structuredClone;
w.HTMLDialogElement.prototype.showModal = function () {
  this.open = true;
};
w.HTMLDialogElement.prototype.close = function () {
  this.open = false;
};
w.HTMLCanvasElement.prototype.getContext = () =>
  new Proxy({}, { get: () => () => {} });
class Param {
  constructor(value = 0) {
    this.value = value;
    this.events = [];
  }
  setValueAtTime(v, t) {
    this.value = v;
    this.events.push(["set", v, t]);
  }
  linearRampToValueAtTime(v, t) {
    this.value = v;
    this.events.push(["ramp", v, t]);
  }
  exponentialRampToValueAtTime(v, t) {
    this.value = v;
    this.events.push(["exp", v, t]);
  }
  setTargetAtTime(v, t) {
    this.value = v;
    this.events.push(["target", v, t]);
  }
  cancelScheduledValues() {}
  cancelAndHoldAtTime() {}
}
class Node {
  constructor() {
    this.connections = [];
    for (const k of [
      "gain",
      "frequency",
      "Q",
      "delayTime",
      "threshold",
      "knee",
      "ratio",
      "attack",
      "release",
    ])
      this[k] = new Param();
    this.fftSize = 2048;
    this.frequencyBinCount = 1024;
  }
  connect(n) {
    this.connections.push(n);
    return n;
  }
  disconnect() {
    this.connections = [];
  }
  start() {
    this.started = true;
  }
  stop() {
    this.stopped = true;
  }
  setPeriodicWave() {}
  getByteTimeDomainData(a) {
    a.fill(128);
  }
  getByteFrequencyData(a) {
    a.fill(0);
  }
  getFloatTimeDomainData(a) {
    a.fill(0);
  }
}
class AudioContext {
  constructor() {
    this.currentTime = 10;
    this.sampleRate = 48000;
    this.state = "running";
    this.destination = new Node();
  }
  createGain() {
    return new Node();
  }
  createOscillator() {
    return new Node();
  }
  createBiquadFilter() {
    return new Node();
  }
  createDelay() {
    return new Node();
  }
  createWaveShaper() {
    return new Node();
  }
  createAnalyser() {
    return new Node();
  }
  createDynamicsCompressor() {
    return new Node();
  }
  createBufferSource() {
    return new Node();
  }
  createBuffer() {
    return {};
  }
  createPeriodicWave() {
    return {};
  }
  createMediaStreamSource() {
    return new Node();
  }
  async resume() {
    this.state = "running";
  }
  async suspend() {
    this.state = "suspended";
  }
}
w.AudioContext = AudioContext;
Object.defineProperty(w.navigator, "mediaDevices", {
  value: { getUserMedia: async () => ({ getTracks: () => [{ stop() {} }] }) },
});
const run = (s) => vm.runInContext(s, context);
const click = (s) =>
  w.document
    .querySelector(s)
    .dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
for (const script of [
  ...html.matchAll(/<script src="([^"?]+)[^"]*" defer><\/script>/g),
])
  run(await readFile(new URL("../" + script[1], import.meta.url), "utf8"));
assert.equal(errors.length, 0, "Startup must run without DOM errors");
assert.equal(
  w.document.querySelectorAll("#arp-grid [data-pattern-step]").length,
  400,
);
assert.equal(w.document.querySelectorAll("#step-octaves select").length, 16);
assert.equal(
  w.document.querySelectorAll("#macro-knobs .macro-control").length,
  8,
);
assert(
  run("window.DEVICE_LIBRARY.length>25"),
  "Additional sound chips must appear in the planner",
);
const before = run("JSON.stringify(state.modules)");
run("renderStudio()");
assert.equal(
  run("JSON.stringify(state.modules)"),
  before,
  "Rendering must never change component values",
);
click('[data-pattern-bar="1"]');
assert.equal(
  w.document.querySelector("#step-octaves select").dataset.stepOctave,
  "16",
);
run(
  "state.stepOctaves[16]=2;state.arpOctave=1;state.globalOctave=-1;state.sequencePattern[16]=48;",
);
assert.equal(run("sequenceNoteForStep(16)"), 72);
run(
  'state.stepOctaves.fill(0);state.arpOctave=0;state.globalOctave=0;state.arpMode="pattern";state.midiBpm=300;state.stepDivision=8;state.source="sequencer";state.audioOn=true;',
);
await run("ensureAudio()");
run(
  "rebuildAudioGraph();createSynthVoice();state.sequencerRunning=true;triggerSequenceStep();",
);
const last = run("audio.sequencerVoice.envelope.gain.events.at(-1)");
assert.equal(last[1], 0, "Gate must reach true zero");
assert(last[2] - 10 < 0.025, "Fast envelope must close within next step");
const originalFreq = run("audio.sequencerVoice.voices[0].osc.frequency.value");
run('state.modules[0].params.r2*=2;gateSynthNote(48,.018,"test")');
assert(
  run("audio.sequencerVoice.voices[0].osc.frequency.value") < originalFreq,
  "Timing resistor must change sequenced carrier frequency",
);
run(
  "state.repeatLength=4;state.sequencerStep=8;state.sequencePattern=Array(32).fill(60);",
);
click('[data-performance="repeat"]');
const steps = [];
for (let i = 0; i < 6; i++) {
  run("triggerSequenceStep()");
  steps.push(run("state.sequencerStep"));
}
assert.deepEqual(steps, [8, 9, 10, 11, 8, 9]);
click('[data-performance="mute"]');
assert.equal(run("audio.sequencerVoice.envelope.gain.events.at(-1)[1]"), 0);
run(
  "stopSource();state.audioOn=false;state.performance={repeat:false,freeze:false,mute:false};",
);
// Real DOM clicks and persistent snapshots catch disconnected handlers.
click("#open-presets");
assert(w.document.querySelector("#presets-dialog").open);
w.document.querySelector("#preset-name").value = "Saved tone";
click("#save-my-circuit");
assert.equal(
  JSON.parse(w.localStorage.getItem("circuit-bending-library-v2"))[0].name,
  "Saved tone",
);
const snapshot = run("presetSnapshot()");
run("state.modules[0].params.r2=5;");
run("loadSnapshot(" + JSON.stringify(snapshot) + ")");
assert.equal(
  run("state.modules[0].params.r2"),
  snapshot.modules[0].params.r2,
  "Recall must restore component values exactly",
);
run(
  'state.source="microphone";state.sequenceTarget="guitar-gate";state.audioOn=true;rebuildAudioGraph();',
);
await run("startSource()");
assert(run("!!audio.externalGate && state.sequencerRunning"));
run('stopSource();state.sequenceTarget="guitar-synth";');
await run("startSource()");
assert(run("!!audio.pitchAnalyser && !!audio.sequencerVoice"));
run("stopSource();state.audioOn=false;");
click('[data-view="combinations"]');
assert(!w.document.querySelector("#combinations").hidden);
click('[data-recipe="triple555"]');
await Promise.resolve();
assert.equal(run("combination.plan.chips.length"), 3);
run(
  'combination.id="tone555";combination.settings={};combination.view="breadboard";renderCombinations()',
);
const timingIndex = run(
  'combination.plan.components.findIndex(c=>c.ref==="U1A timing C")',
);
click('[data-design-part="' + timingIndex + '"]');
const replacement = w.document.querySelector('[data-design-part-setting="c"]');
assert(replacement);
replacement.value = "47";
replacement.dispatchEvent(new w.Event("change", { bubbles: true }));
await Promise.resolve();
assert(Math.abs(run("combination.plan.settings.c") - 47e-9) < 1e-18);

click('[data-design-view="schematic"]');
assert(w.document.querySelector(".design-schematic"));
click('[data-design-view="connections"]');
assert(
  w.document
    .querySelector("#design-drawing")
    .textContent.includes("U1 pin 3 OUT"),
);
run('combination.id="tone40106";renderCombinations()');
await run("previewCombination()");
assert(run("combination.node.some(n=>n.started)"));
await run("previewCombination(true)");
for (const type of ["chorus", "flanger", "phaser"]) {
  run(
    `state.source='tone';state.modules=[{id:50,type:'${type}',params:freshParams('${type}'),bypassed:false}];rebuildAudioGraph()`,
  );
  assert(
    run("audio.moduleNodes.some(n=>n.started)"),
    "Modulation effect must run an LFO",
  );
}
assert.equal(errors.length, 0);
dom.window.close();
console.log(
  "Runtime audit passed: startup, rendering purity, step octaves, 300 BPM gates, component pitch, repeat/mute, saved recall, both guitar paths, 3-chip plan and modulation effects.",
);
