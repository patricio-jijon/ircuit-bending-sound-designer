/* Application integration: musical controls, portable presets, design workspace. */
function refreshSequenceTargets() {
  const select = $("#sequence-target");
  const previous = state.sequenceTarget;
  select.querySelectorAll("[data-module-target]").forEach((n) => n.remove());
  state.modules
    .filter((m) => m.type === "oscillator")
    .forEach((m) => {
      const option = document.createElement("option");
      option.value = String(m.id);
      option.dataset.moduleTarget = "";
      option.textContent = `555 oscillator #${m.id} · component pitch`;
      select.append(option);
    });
  if (![...select.options].some((o) => o.value === previous))
    state.sequenceTarget = "chain";
  select.value = state.sequenceTarget;
}
function presetSnapshot() {
  return {
    schema: 2,
    source: state.source,
    volume: +$("#master-volume").value,
    duration: state.patternDuration,
    startDelay: state.startDelay,
    controller: state.plannerController,
    devices: [...state.selectedDeviceIds],
    name: $("#preset-name").value.trim() || "Untitled circuit",
    savedAt: new Date().toISOString(),
    modules: structuredClone(state.modules),
    pattern: [...state.sequencePattern],
    stepOctaves: [...state.stepOctaves],
    bpm: state.midiBpm,
    division: state.stepDivision,
    arpMode: state.arpMode,
    arpOctave: state.arpOctave,
    globalOctave: state.globalOctave,
    voice: state.synthProfile,
    voiceParams: { ...state.voiceParams },
    wave: state.synthWaveform,
    macros: structuredClone(state.macros),
    hardwarePreset: state.hardwarePreset,
    hardwareValues: { ...hardwarePreset().values },
    gate: state.gate,
    swing: state.swing,
    repeatLength: state.repeatLength,
    sequenceTarget: state.sequenceTarget,
    knobStyle: state.knobStyle,
    design: {
      id: combination.id,
      settings: { ...combination.settings },
      inventory: [...combination.inventory],
    },
    effects: structuredClone(state.effectCircuitValues),
  };
}
function readPresets() {
  try {
    const data = JSON.parse(
      localStorage.getItem("circuit-bending-library-v2") || "[]",
    );
    return Array.isArray(data) ? data : [];
  } catch (_) {
    return [];
  }
}
function writePresets(data) {
  localStorage.setItem("circuit-bending-library-v2", JSON.stringify(data));
}
function renderPresets() {
  const list = $("#my-circuits-list");
  list.replaceChildren();
  const presets = readPresets();
  if (!presets.length) {
    const p = document.createElement("p");
    p.textContent =
      "Your first experiment belongs here. Save a sound or chip combination to begin.";
    list.append(p);
  }
  presets.forEach((p, i) => {
    const row = document.createElement("article");
    row.className = "saved-preset";
    const text = document.createElement("strong");
    text.textContent = p.name;
    row.append(text);
    for (const [label, key] of [
      ["Load", "load"],
      ["Duplicate", "duplicate"],
      ["Rename", "rename"],
      ["Delete", "delete"],
    ]) {
      const button = document.createElement("button");
      button.textContent = label;
      button.dataset.presetAction = key;
      button.dataset.presetIndex = i;
      row.append(button);
    }
    list.append(row);
  });
}
function loadSnapshot(raw) {
  const p = CircuitCore.validatePreset(
    structuredClone(raw),
    MODULES,
    window.HARDWARE_PRESETS,
  );
  if (!SYNTH_PROFILES[p.voice]) throw Error("Unknown synth voice");
  const values = p.hardwareValues || {};
  for (const c of window.HARDWARE_PRESETS[p.hardwarePreset].controls) {
    const v = values[c.key];
    if (
      c.type === "select"
        ? !c.options.some((o) => o.value === v)
        : !Number.isFinite(v) || v < c.min || v > c.max
    )
      throw Error("Invalid saved physical component");
  }
  if (p.design) {
    if (
      !Array.isArray(p.design.inventory) ||
      p.design.inventory.some((id) => !E().CATALOG.some((c) => c.id === id))
    )
      throw Error("Unknown saved chip");
    E().build(p.design.id, p.design.settings);
  }
  stopSource();
  previewCombination(true);
  state.audioOn = false;
  state.modules = p.modules;
  nextId = Math.max(0, ...p.modules.map((m) => m.id)) + 1;
  state.sequencePattern = p.pattern;
  state.stepOctaves = p.stepOctaves;
  state.midiBpm = p.bpm;
  state.stepDivision = p.division;
  state.arpMode = ["pattern", "up", "down", "random", "glitch"].includes(
    p.arpMode,
  )
    ? p.arpMode
    : "pattern";
  state.hardwarePreset = p.hardwarePreset;
  window.HARDWARE_PRESETS[p.hardwarePreset].values = { ...values };
  state.hardwareLoadedId = p.hardwarePreset;
  applySynthProfile(p.voice);
  state.synthWaveform = ["sine", "square", "triangle", "sawtooth"].includes(
    p.wave,
  )
    ? p.wave
    : "square";
  $("#synth-profile").value = p.voice;
  $("#synth-waveform").value = state.synthWaveform;
  for (const param of VOICE_PARAMETERS)
    if (Number.isFinite(p.voiceParams?.[param.key]))
      updateVoiceParameter(
        param.key,
        clamp(p.voiceParams[param.key], param.min, param.max),
      );
  state.macros =
    Array.isArray(p.macros) && p.macros.length === 8
      ? p.macros.map((m, i) => ({
          name: `Macro ${i + 1}`,
          target: ["module", "voice"].includes(m.target) ? m.target : null,
          moduleId: Number.isInteger(m.moduleId) ? m.moduleId : null,
          paramKey: String(m.paramKey || ""),
          midiCc:
            Number.isInteger(m.midiCc) && m.midiCc >= 0 && m.midiCc <= 127
              ? m.midiCc
              : null,
          value: clamp(Number(m.value) || 0, 0, 127),
        }))
      : state.macros;
  state.gate = clamp(Number(p.gate) || 0.72, 0.1, 0.95);
  state.swing = clamp(Number(p.swing) || 0, 0, 0.45);
  state.repeatLength = [1, 2, 4, 8, 16, 32].includes(p.repeatLength)
    ? p.repeatLength
    : 4;
  state.sequenceTarget = String(p.sequenceTarget || "chain");
  state.knobStyle = ["pointer", "skirted", "aluminum"].includes(p.knobStyle)
    ? p.knobStyle
    : "pointer";
  $("#knob-style").value = state.knobStyle;
  for (const m of state.macros) {
    if (
      m.target === "voice" &&
      !VOICE_PARAMETERS.some((x) => x.key === m.paramKey)
    )
      m.target = null;
    if (m.target === "module") {
      const module = state.modules.find((x) => x.id === m.moduleId);
      if (
        !module ||
        !MODULES[module.type].params.some(
          (x) => x.key === m.paramKey && x.type !== "select",
        )
      )
        m.target = null;
    }
  }
  if (p.effects)
    for (const [type, values] of Object.entries(p.effects)) {
      if (!MODULES[type] || !values) continue;
      for (const d of MODULES[type].params) {
        const v = values[d.key];
        if (
          d.type === "select"
            ? d.options.some((o) => o.value === v)
            : Number.isFinite(v) && v >= d.min && v <= d.max
        )
          state.effectCircuitValues[type][d.key] = v;
      }
    }
  state.source = ["demo", "tone", "sequencer", "microphone", "file"].includes(
    p.source,
  )
    ? p.source
    : "demo";
  $("#source-select").value = state.source;
  $("#file-label").hidden = state.source !== "file";
  $("#master-volume").value = clamp(Number.isFinite(p.volume) ? p.volume : 70, 0, 100);
  $("#master-volume-value").textContent = $("#master-volume").value + "%";
  if (audio.master) audio.master.gain.value = +$("#master-volume").value / 100;
  state.patternDuration = clamp(Number(p.duration) || 0, 0, 5);
  $("#pattern-duration").value = state.patternDuration;
  state.startDelay = ["0", "1", "2", "3", "bars"].includes(String(p.startDelay))
    ? String(p.startDelay)
    : "0";
  $("#start-delay").value = state.startDelay;
  if (window.DEVICE_CONTROLLERS.some((c) => c.id === p.controller))
    state.plannerController = p.controller;
  state.selectedDeviceIds = Array.isArray(p.devices)
    ? p.devices.filter((id) => window.DEVICE_LIBRARY.some((d) => d.id === id))
    : [];
  state.performance = { repeat: false, freeze: false, mute: false };
  $$("[data-performance]").forEach((b) =>
    b.setAttribute("aria-pressed", "false"),
  );
  $("#note-gate").value = state.gate * 100;
  $("#note-gate-value").textContent = Math.round(state.gate * 100) + "%";
  $("#note-swing").value = state.swing * 100;
  $("#note-swing-value").textContent = Math.round(state.swing * 100) + "%";
  $("#repeat-length").value = state.repeatLength;
  if (p.design) {
    Object.assign(combination, p.design);
    combination.history = [];
    combination.redo = [];
    renderCombinations();
  }
  $("#midi-bpm").value = state.midiBpm;
  $("#step-division").value = state.stepDivision;
  $("#arp-mode").value = state.arpMode;
  setArpOctave(p.arpOctave);
  setGlobalOctave(p.globalOctave);
  resetHardwareSelection();
  renderHardware();
  renderStudio();
  renderSequencer();
  refreshSequenceTargets();
  syncTempoCoach();
  syncAudioButtons();
  rebuildAudioGraph();
  $("#preset-name").value = p.name;
  $("#presets-dialog").close();
  announce(`Loaded ${p.name}. Press Start to hear it.`);
}
function initStudioRepairs() {
  $("#step-octaves").addEventListener("change", (e) => {
    if (e.target.dataset.stepOctave != null)
      state.stepOctaves[+e.target.dataset.stepOctave] = +e.target.value;
  });
  $("#sequence-target").addEventListener("change", async (e) => {
    state.sequenceTarget = e.target.value;
    if (state.sequencerRunning) {
      state.source = state.sequenceTarget.startsWith("guitar")
        ? "microphone"
        : "sequencer";
      $("#source-select").value = state.source;
      rebuildAudioGraph();
      await startSource();
    }
  });
  $("#note-gate").addEventListener("input", (e) => {
    state.gate = +e.target.value / 100;
    $("#note-gate-value").textContent = e.target.value + "%";
  });
  $("#note-swing").addEventListener("input", (e) => {
    state.swing = +e.target.value / 100;
    $("#note-swing-value").textContent = e.target.value + "%";
  });
  $("#repeat-length").addEventListener("change", (e) => {
    state.repeatLength = +e.target.value;
    state.repeatCursor = 0;
    state.repeatStart =
      Math.floor(state.sequencerStep / state.repeatLength) * state.repeatLength;
  });
  $("#global-octave").addEventListener("input", () => rebuildAudioGraph());
  new MutationObserver(refreshSequenceTargets).observe($("#signal-chain"), {
    childList: true,
  });
  $("#open-presets").addEventListener("click", () => {
    renderPresets();
    $("#presets-dialog").showModal();
  });
  $("#close-presets").addEventListener("click", () =>
    $("#presets-dialog").close(),
  );
  $("#save-my-circuit").addEventListener("click", () => {
    try {
      const data = readPresets();
      if (data.length >= 100)
        throw Error("Export and remove an older preset first (100 maximum).");
      const p = presetSnapshot();
      CircuitCore.validatePreset(p, MODULES, window.HARDWARE_PRESETS);
      data.push(p);
      writePresets(data);
      renderPresets();
      $("#preset-status").textContent = `Saved ${p.name}.`;
    } catch (e) {
      $("#preset-status").textContent = e.message;
    }
  });
  $("#my-circuits-list").addEventListener("click", (e) => {
    const b = e.target.closest("[data-preset-action]");
    if (!b) return;
    const data = readPresets(),
      i = +b.dataset.presetIndex,
      p = data[i];
    if (!p) return;
    try {
      if (b.dataset.presetAction === "load") return loadSnapshot(p);
      if (b.dataset.presetAction === "delete") data.splice(i, 1);
      if (b.dataset.presetAction === "duplicate")
        data.push({ ...structuredClone(p), name: p.name + " copy" });
      if (b.dataset.presetAction === "rename") {
        const name = $("#preset-name").value.trim();
        if (!name) throw Error("Enter a new name in the name field first.");
        p.name = name;
      }
      writePresets(data);
      renderPresets();
    } catch (error) {
      $("#preset-status").textContent = error.message;
    }
  });
  $("#export-presets").addEventListener("click", () =>
    downloadBlob(
      "my-circuits.json",
      JSON.stringify(readPresets(), null, 2),
      "application/json",
    ),
  );
  $("#import-presets").addEventListener("change", async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 2e6) throw Error("Library file is too large.");
      const imported = JSON.parse(await file.text());
      if (!Array.isArray(imported) || imported.length > 100)
        throw Error("Expected a library of at most 100 circuits.");
      for (const p of imported) {
        CircuitCore.validatePreset(p, MODULES, window.HARDWARE_PRESETS);
        if (typeof p.name !== "string" || p.name.length > 80)
          throw Error("Invalid preset name");
      }
      const all = [...readPresets(), ...imported];
      if (all.length > 100)
        throw Error("Combined library exceeds 100 circuits.");
      writePresets(all);
      renderPresets();
      $("#preset-status").textContent = `Imported ${imported.length} circuits.`;
    } catch (error) {
      $("#preset-status").textContent = error.message;
    } finally {
      e.target.value = "";
    }
  });
  // Main Stop also stops a physical combination preview.
  $("#audio-toggle").addEventListener("click", () => {
    if (combination.node) previewCombination(true);
  });
  $("#macro-knobs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-clear-macro]");
    if (!b) return;
    Object.assign(state.macros[+b.dataset.clearMacro], {
      target: null,
      moduleId: null,
      paramKey: null,
      midiCc: null,
    });
    renderMacroPanel();
    announce("Macro cleared.");
  });
  $("#macro-knobs").addEventListener("dblclick", (e) => {
    const card = e.target.closest("[data-macro-card]");
    if (!card) return;
    const m = state.macros[+card.dataset.macroCard];
    Object.assign(m, {
      target: null,
      moduleId: null,
      paramKey: null,
      midiCc: null,
    });
    renderMacroPanel();
    announce("Macro cleared.");
  });
  renderCombinations();
  bindCombinations();
  renderSequencer();
  refreshSequenceTargets();
  setGlobalOctave(0);
  syncTempoCoach();
}
initStudioRepairs();

// All physical views use the same generated plan, including parts and downloads.
$("#construction-panel").addEventListener("click", (e) => {
  const part = e.target.closest("[data-design-part]");
  if (!part) return;
  const preset = hardwarePreset(),
    plan = physicalPlanForPreset(preset),
    c = plan.components[+part.dataset.designPart];
  if (!c) return;
  const key = physicalComponentControl(c, preset);
  const index = preset.components.findIndex((x) => x.ref === c.ref);
  if (index >= 0) {
    state.hardwareSelectedIndex = index;
    state.hardwareSelectedRef = c.ref;
    state.hardwareSelectedKey = key || "";
    renderHardwareControls();
  }
  announce(
    `${c.ref}: ${plan.layout.leads[c.ref].join(" to ")} · ${E().value(c.value)}`,
  );
});
$("#download-guide").addEventListener("click", (e) => {
  e.preventDefault();
  const p = physicalPlanForPreset(hardwarePreset());
  const html = `<!doctype html><meta charset="utf-8"><title>${esc(p.recipe.name)} build guide</title><style>body{font:14px system-ui;margin:32px;color:#17212a}svg{width:100%;height:auto}table{border-collapse:collapse;width:100%}td,th{padding:6px;border:1px solid #aaa}li{margin:8px 0}input{display:none}@media print{svg{max-height:650px}h2{break-before:page}}</style><h1>${esc(p.recipe.name)}</h1><p>${p.settings.supply} V DC · calculated teaching design · not physically tested</p><p>${esc(p.recipe.lesson)}</p>${schematicPlan(p)}<h2>Breadboard</h2>${boardSvg(p)}<h2>Exact connections</h2>${connectionsPlan(p)}<h2>Assembly</h2>${assemblyPlan(p)}<h2>Sources</h2>${p.sources.map((s) => `<p><a href="${s}">${s}</a></p>`).join("")}`;
  downloadBlob(p.id + "-build-guide.html", html, "text/html");
});
