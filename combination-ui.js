/* Educational guided assembly and the audio approximation of the same plan. */
let combination = {
  id: "tone555",
  settings: {},
  view: "breadboard",
  inventory: ["NE555P"],
  node: null,
  selectedNet: null,
  history: [],
  redo: [],
};
const E = () => window.CircuitEngine;
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function point(h) {
  const rail = h.match(/^(b?[+-])(\d+)$/);
  if (rail)
    return {
      x: 54 + (+rail[2] - 1) * 29,
      y: { "+": 53, "-": 77, "b+": 383, "b-": 407 }[rail[1]],
    };
  const ys = {
    A: 132,
    B: 152,
    C: 172,
    D: 192,
    E: 212,
    F: 262,
    G: 282,
    H: 302,
    I: 322,
    J: 342,
  };
  return { x: 54 + (+h.slice(1) - 1) * 24, y: ys[h[0]] };
}
function netColor(n) {
  return n === "VCC"
    ? "#e75858"
    : n === "GND"
      ? "#526476"
      : n === "OUTPUT"
        ? "#1373c5"
        : n.includes("RC")
          ? "#a15e13"
          : "#8058a0";
}
function boardSvg(plan) {
  const l = plan.layout;
  let holes = "";
  for (let n = 1; n <= 30; n++) {
    const x = 54 + (n - 1) * 24;
    holes += `<text x="${x}" y="116" text-anchor="middle">${n}</text>`;
    for (const letter of "ABCDEFGHIJ") {
      const h = letter + n,
        p = point(h);
      holes += `<circle cx="${p.x}" cy="${p.y}" r="3" fill="${l.used[h] ? netColor(l.used[h].net) : "#84909a"}"><title>${h}${l.used[h] ? " · " + esc(l.used[h].label) : ""}</title></circle>`;
    }
  }
  for (const prefix of ["+", "-", "b+", "b-"]) {
    const y = point(prefix + "1").y;
    holes += `<path d="M36 ${y - 8}H770" stroke="${prefix.includes("+") ? "#d34d4d" : "#4a77aa"}"/><text x="24" y="${y + 4}">${prefix.includes("+") ? "+" : "−"}</text>`;
    for (let n = 1; n <= 25; n++) {
      const p = point(prefix + n);
      holes += `<circle cx="${p.x}" cy="${p.y}" r="3" fill="#84909a"/>`;
    }
  }
  const ports = plan.ports
    .map((port) => {
      const pt = point(l.leads["Jack " + port][0]);
      return `<g><circle cx="${pt.x}" cy="${pt.y}" r="6" fill="none" stroke="#1761aa"/><text x="${pt.x + 7}" y="${pt.y + 10}" style="font-size:8px">${port} jack</text></g>`;
    })
    .join("");
  const wires = l.jumps
    .map((w, i) => {
      const a = point(w.from),
        b = point(w.to);
      return `<path data-design-net="${esc(w.net)}" class="design-jumper${combination.selectedNet === w.net ? " selected" : ""}" d="M${a.x} ${a.y}Q${(a.x + b.x) / 2} ${Math.max(18, Math.min(a.y, b.y) - 25 - (i % 4) * 8)} ${b.x} ${b.y}" fill="none" stroke="${netColor(w.net)}" stroke-width="2.5"><title>${esc(w.net)}: ${w.from} → ${w.to}</title></path>`;
    })
    .join("");
  const chips = plan.chips
    .map((c) => {
      const n = E().CHIPS[c.type].pins.length / 2,
        x = 54 + (c.col - 1) * 24 - 8,
        width = (n - 1) * 24 + 16;
      return `<g><rect x="${x}" y="218" width="${width}" height="38" rx="4" fill="#252b31" stroke="#101820"/><path d="M${x} 229a8 8 0 0 1 0 16" fill="#e7e7de"/><circle cx="${x + 10}" cy="248" r="2.5" fill="#eee"/><text x="${x + width / 2}" y="240" text-anchor="middle" fill="#fff" style="fill:#fff;font-size:9px">${c.ref} ${c.type}</text>${Array.from(
        { length: 2 * n },
        (_, i) => {
          const p = point(l.pinHoles[c.ref + "." + (i + 1)]);
          return `<path d="M${p.x} ${p.y}v${i < n ? -7 : 7}" stroke="#777" stroke-width="3"/><text x="${p.x}" y="${i < n ? 276 : 204}" text-anchor="middle" style="font-size:8px">${i + 1}</text>`;
        },
      ).join("")}</g>`;
    })
    .join("");
  const parts = plan.components
    .map((c, i) => {
      const [a, b] = l.leads[c.ref].map(point),
        x = (a.x + b.x) / 2,
        y = (a.y + b.y) / 2;
      let body = "";
      if (c.kind === "pot")
        body = `<circle cx="${x}" cy="${y}" r="11" fill="#39495b" stroke="#18212c"/><path d="M${x} ${y}v-9" stroke="#fff" stroke-width="2"/>${l.leads[c.ref][2] ? `<path d="M${x} ${y}L${point(l.leads[c.ref][2]).x} ${point(l.leads[c.ref][2]).y}" stroke="#777" stroke-width="1.5"/>` : ""}`;
      else if (c.kind === "resistor")
        body = `<rect x="${x - 17}" y="${y - 6}" width="34" height="12" rx="4" fill="#d8bc87" stroke="#785f32"/><path d="M${x - 10} ${y - 6}v12m8-12v12m8-12v12" stroke="#825329" stroke-width="3"/>`;
      else if (c.kind === "diode")
        body = `<rect x="${x - 12}" y="${y - 5}" width="24" height="10" fill="#c57b46"/><path d="M${x + 8} ${y - 5}v10" stroke="#20252b" stroke-width="4"/>`;
      else if (c.kind === "switch")
        body = `<path d="M${x - 12} ${y}l24 -10" stroke="#263546" stroke-width="3"/>`;
      else
        body = `<rect x="${x - 8}" y="${y - 9}" width="16" height="18" rx="3" fill="${c.kind === "electrolytic" ? "#30485e" : "#bd9643"}" stroke="#4c4b48"/>${c.kind === "electrolytic" ? `<text x="${x - 14}" y="${y - 8}">+</text>` : ""}`;
      return `<g class="design-part" data-design-part="${i}" role="button" tabindex="0" aria-label="Inspect ${esc(c.ref)} ${esc(E().value(c.value))}"><title>${esc(c.ref)} · ${esc(E().value(c.value))}: ${l.leads[c.ref].join(" → ")}</title><path d="M${a.x} ${a.y}L${x} ${y}L${b.x} ${b.y}" stroke="#777d83" fill="none" stroke-width="1.7"/>${body}<text x="${x}" y="${y - 12}" text-anchor="middle" style="font-size:7px">${esc(c.ref)}</text></g>`;
    })
    .join("");
  return `<svg viewBox="0 0 800 450" class="design-board" role="img" aria-label="${esc(plan.recipe.name)} BB400 placement with four power rails"><rect x="8" y="14" width="780" height="424" rx="10" fill="#eeeede" stroke="#b4b6ac"/><rect x="30" y="230" width="742" height="14" rx="4" fill="#bfc3ba"/>${Object.entries(
    {
      A: 132,
      B: 152,
      C: 172,
      D: 192,
      E: 212,
      F: 262,
      G: 282,
      H: 302,
      I: 322,
      J: 342,
    },
  )
    .map(([a, y]) => `<text x="22" y="${y + 3}">${a}</text>`)
    .join(
      "",
    )}${holes}${wires}${parts}${chips}${ports}<text x="400" y="434" text-anchor="middle" style="font-size:9px">BB400 · 30 × 10 terminals · four 25-point rails · notch left · power disconnected</text></svg>`;
}
function schematicPlan(plan) {
  let chips = plan.chips
    .map((c, j) => {
      const d = E().CHIPS[c.type],
        n = d.pins.length / 2,
        x = 105 + j * 310,
        y = 65;
      return `<g><rect x="${x}" y="${y}" width="125" height="${n * 26 + 25}" rx="4" fill="#fff" stroke="#202d38"/><path d="M${x + 48} ${y}a14 14 0 0 0 28 0" fill="none" stroke="#202d38"/><circle cx="${x + 8}" cy="${y + 21}" r="3" fill="#202d38"/><text x="${x + 62}" y="${y + 14}" text-anchor="middle" style="fill:#fff;font-size:9px">${c.ref} ${c.type}</text>${d.pins
        .map((label, i) => {
          const p = i + 1,
            left = p <= n,
            yy = y + 32 + (left ? i : 2 * n - p) * 26,
            xx = left ? x : x + 125,
            net = plan.pinNets[c.ref + "." + p] || "NC";
          return `<path d="M${xx} ${yy}h${left ? -18 : 18}" stroke="${netColor(net)}"/><text x="${xx + (left ? 4 : -4)}" y="${yy - 4}" text-anchor="${left ? "start" : "end"}" style="font-size:8px">${p} ${label}</text><text x="${xx + (left ? -20 : 20)}" y="${yy + 3}" text-anchor="${left ? "end" : "start"}" fill="${netColor(net)}" style="font-size:7px">${esc(net)}</text>`;
        })
        .join("")}</g>`;
    })
    .join("");
  const rows = plan.components
    .map((c, i) => {
      const col = i % 4,
        row = Math.floor(i / 4),
        x = 25 + col * 230,
        y = 350 + row * 80;
      const symbol = ["resistor", "pot"].includes(c.kind)
        ? `<rect x="${x + 85}" y="${y - 7}" width="45" height="14" fill="#fff" stroke="#222"/>${c.kind === "pot" ? `<path d="M${x + 108} ${y + 13}v-13l-4 4m4-4l4 4" stroke="#222" fill="none"/>` : ""}`
        : c.kind === "diode"
          ? `<path d="M${x + 95} ${y - 9}l17 9 -17 9zM${x + 113} ${y - 10}v20" fill="none" stroke="#222"/>`
          : c.kind === "switch"
            ? `<path d="M${x + 85} ${y}l45 ${c.value === "closed" ? 0 : -12}" stroke="#222"/>`
            : `<path d="M${x + 101} ${y - 10}v20m9-20v20" stroke="#222"/>`;
      return `<g class="design-part" data-design-part="${i}" tabindex="0" role="button" aria-label="Inspect ${esc(c.ref)}"><text x="${x + 108}" y="${y - 21}" text-anchor="middle" style="font-size:10px">${esc(c.ref)} · ${esc(E().value(c.value))}</text><path d="M${x + 55} ${y}h30m45 0h30" stroke="#222"/>${symbol}<text x="${x + 53}" y="${y + 17}" text-anchor="end" style="font-size:8px">${esc(c.nets[0])}</text><text x="${x + 164}" y="${y + 17}" style="font-size:8px">${esc(c.nets[1])}</text></g>`;
    })
    .join("");
  return `<svg class="design-schematic" viewBox="0 0 950 ${390 + Math.ceil(plan.components.length / 4) * 80}" role="img" aria-label="Complete net-label schematic, physical notch-up pin order"><rect width="950" height="100%" fill="#f7f7ef"/><text x="24" y="24" style="font-size:14px">${esc(plan.recipe.name)} · ${plan.settings.supply} V · physical TOP VIEW</text><text x="24" y="43" style="font-size:10px">Matching net names connect electrically. NC pins are deliberately unconnected. Diodes: anode on left, cathode on right.</text>${chips}${rows}</svg>`;
}
function connectionsPlan(plan) {
  const rows = [];
  for (const c of plan.chips)
    E().CHIPS[c.type].pins.forEach((label, i) =>
      rows.push([
        `${c.ref} pin ${i + 1} ${label}`,
        plan.layout.pinHoles[c.ref + "." + (i + 1)],
        plan.pinNets[c.ref + "." + (i + 1)] || "NC",
      ]),
    );
  plan.components.forEach((c) =>
    c.nets.forEach((n, i) =>
      rows.push([
        c.ref + " terminal " + (i + 1),
        plan.layout.leads[c.ref][i],
        n,
      ]),
    ),
  );
  plan.ports.forEach((port) =>
    rows.push(["Jack " + port, plan.layout.leads["Jack " + port][0], port]),
  );
  plan.layout.jumps.forEach((w) =>
    rows.push(["Jumper " + w.net, w.from + " → " + w.to, w.net]),
  );
  return `<p>Each terminal occupies its own hole. A–E share a strip at one numbered column; F–J share a separate strip. The trench separates them. +/− refer to top rails; b+/b− refer to bottom rails. Potentiometer terminals 2 and 3 are tied as a rheostat. Diode terminal 2 is the cathode; electrolytic terminal 1 is positive.</p><div class="connection-table-wrap"><table class="connection-table"><thead><tr><th>Endpoint</th><th>Exact hole</th><th>Electrical net</th></tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function assemblyPlan(p) {
  const steps = [
    "Disconnect power. Use a regulated " +
      p.settings.supply +
      " V DC supply. Check both rail pairs with a continuity meter.",
    ...p.chips.map(
      (c) =>
        `Place ${c.ref} ${c.type} across E/F, columns ${c.col}–${c.col + E().CHIPS[c.type].pins.length / 2 - 1}, notch facing left. Pin 1: ${p.layout.pinHoles[c.ref + ".1"]}.`,
    ),
    ...p.components.map(
      (c) =>
        `Install ${c.ref} (${E().value(c.value)}) at ${p.layout.leads[c.ref].join(" → ")}.${c.kind === "electrolytic" ? " Positive lead at the first hole." : c.kind === "diode" ? " Cathode band at the second hole." : ""}`,
    ),
    ...p.layout.jumps.map((w) => `Wire ${w.net}: ${w.from} → ${w.to}.`),
    ...p.chips.map(
      (c) =>
        `Before listening, measure ${c.ref} pin ${E().CHIPS[c.type].power} to pin ${E().CHIPS[c.type].ground}: expect approximately ${p.settings.supply} V DC.`,
    ),
    "Connect OUTPUT and GND only to a high-impedance powered speaker/amplifier input at low volume. The output is attenuated and AC coupled. Check the receiving input rating.",
  ];
  return `<ol class="assembly-checklist">${steps.map((s, i) => `<li><label><input type="checkbox" data-design-check="${i}"${combination.completed?.includes(i) ? " checked" : ""}> ${esc(s)}</label></li>`).join("")}</ol>`;
}
function renderCombinations() {
  const p = E().build(combination.id, combination.settings);
  combination.plan = p;
  const need = (r) =>
    r.chips.every(
      (c, i) =>
        combination.inventory.filter((x) => x === c).length >=
        r.chips.slice(0, i + 1).filter((x) => x === c).length,
    );
  const root = $("#combination-app");
  if (!root) return;
  root.innerHTML = `<header class="design-heading"><div><span class="eyebrow">PHYSICAL COMPUTING / SOUND EXPLORATION</span><h1>Small chips.<br><em>Unexpected sounds.</em></h1><p>Build a tone. Bend a component. Hear the relationship.</p></div><div class="design-status"><strong>${p.checks.passed ? "Connection checks pass" : "Check connections"}</strong><span>${p.chips.length} package${p.chips.length > 1 ? "s" : ""} · ${p.checks.holes} occupied holes</span><small>Calculated + behavioral audio<br>Not physically measured</small></div></header>
 <div class="design-layout"><aside class="design-library"><h2>Your chip tray</h2><p>The tray suggests templates. Choosing a design places its chips on the board.</p><label>Add a chip<select id="chip-add-select">${E()
   .CATALOG.map(
     (c) =>
       `<option value="${c.id}"${c.id === "NE555P" ? " selected" : ""}>${c.name}</option>`,
   )
   .join(
     "",
   )}</select></label><button id="add-design-chip">+ Add to tray</button><div class="chip-tray">${combination.inventory.map((id, i) => `<button data-remove-chip="${i}" title="Remove ${id}"><span class="chip-icon">${esc(id)}</span> ×</button>`).join("")}</div><h2>Predesigned combinations</h2>${E()
   .RECIPES.map(
     (r) =>
       `<button class="recipe-card${r.id === p.id ? " active" : ""}" data-recipe="${r.id}"><span>${r.chips.length} PACKAGE${r.chips.length > 1 ? "S" : ""}${need(r) ? " · IN YOUR TRAY" : ""}</span><strong>${r.name}</strong><small>${r.chips.join(" + ")}</small></button>`,
   )
   .join("")}<details><summary>All chip capabilities</summary>${E()
   .CATALOG.map(
     (c) =>
       `<article><strong>${c.name}</strong><p>${c.role}</p><small>${c.status}</small> · <a href="${c.source}" target="_blank" rel="noopener">Datasheet ↗</a></article>`,
   )
   .join("")}</details></aside>
 <div class="design-main"><div class="design-toolbar"><label>Design<select id="design-select">${E()
   .RECIPES.map(
     (r) =>
       `<option value="${r.id}"${r.id === p.id ? " selected" : ""}>${r.name}</option>`,
   )
   .join("")}</select></label><label>Supply<select id="design-supply">${[
   5, 9, 12,
 ]
   .filter(
     (n) =>
       n >= (p.id === "fuzz" ? 9 : 5) && (p.id !== "randompitch" || n === 5),
   )
   .map(
     (n) =>
       `<option${n === p.settings.supply ? " selected" : ""}>${n}</option>`,
   )
   .join(
     "",
   )}</select></label><button id="design-listen">${combination.node ? "■ Stop preview" : "▶ Hear this circuit"}</button><button id="design-to-studio">Open sound in Studio</button><button id="design-undo"${combination.history.length ? "" : " disabled"}>Undo</button><button id="design-redo"${combination.redo.length ? "" : " disabled"}>Redo</button></div>
 <p class="design-lesson">${p.recipe.lesson}</p><div class="design-parameters">${[
   ["rb", "Pitch resistance", 1000, 100000, 1000],
   ["rb2", "Second pitch resistance", 1000, 100000, 1000],
   ["c", "Timing capacitor", 1, 100, 1],
   ["lfoR", "Slow clock resistance", 1000, 1000000, 1000],
   ["lfoC", "Slow clock capacitor", 0.1, 10, 0.1],
 ]
   .map(
     ([key, label, min, max, step]) =>
       `<label>${label}<input type="range" data-design-setting="${key}" min="${min}" max="${max}" step="${step}" value="${key === "c" ? p.settings[key] * 1e9 : key === "lfoC" ? p.settings[key] * 1e6 : p.settings[key]}"><output>${E().value(p.settings[key])}</output></label>`,
   )
   .join("")}</div>
 ${p.id === "highmute" || p.id === "tone4093" ? `<div class="design-switches">${p.id === "highmute" ? `<button data-design-switch="high" aria-pressed="${p.settings.high}">HIGH pitch</button>` : ""}<button data-design-switch="mute" aria-pressed="${p.settings.mute}">MUTE / gate off</button></div>` : ""}
 <div class="design-readouts"><span><b>${p.sound.frequency.toFixed(1)}</b> Hz carrier</span><span><b>${p.sound.clock.toFixed(2)}</b> Hz slow clock</span><span><b>${p.settings.supply}</b> V supply</span><span>${p.id.includes("40106") || p.id === "tone4093" ? "Schmitt threshold estimate" : "f = 1 / [ln(2) · (RA + 2RB) · C]"}</span></div>
 <nav class="design-tabs" aria-label="Combination views">${["breadboard", "schematic", "connections", "assembly", "parts"].map((v) => `<button data-design-view="${v}" aria-pressed="${v === combination.view}">${v}</button>`).join("")}</nav><div id="design-drawing">${combination.view === "breadboard" ? boardSvg(p) : combination.view === "schematic" ? schematicPlan(p) : combination.view === "connections" ? connectionsPlan(p) : combination.view === "assembly" ? assemblyPlan(p) : `<table class="connection-table"><thead><tr><th>Reference</th><th>Part / value</th></tr></thead><tbody>${p.chips.map((c) => `<tr><td>${c.ref}</td><td>${c.type} · PDIP-${E().CHIPS[c.type].pins.length}</td></tr>`).join("")}${p.components.map((c) => `<tr><td>${c.ref}</td><td>${c.kind} · ${E().value(c.value)}</td></tr>`).join("")}<tr><td>BB1</td><td>BB400 breadboard, jumper wires, regulated supply and audio connector</td></tr></tbody></table>`}</div>
 <div id="design-part-inspector" class="design-part-inspector">Select an illustrated component to inspect its exact terminals and electrical role.</div><details class="design-checks"><summary>Electrical checks and model limits</summary><ul>${p.checks.notes.map((n) => `<li>${n}</li>`).join("")}</ul><p>Physical 555 duty cycles, supply headroom, component tolerance and Schmitt thresholds affect real sound. The preview approximates those relationships; it is not transistor-level simulation. Modulation is a bounded teaching approximation. Glitch patterns here are deterministic. Chorus/flanger and true random sources require additional designs.</p>${p.sources.map((s) => `<a href="${s}" target="_blank" rel="noopener">Manufacturer datasheet ↗</a>`).join(" · ")}</details><button id="export-design">Export circuit and exact-hole connections</button></div></div>`;
}
function saveDesignHistory() {
  combination.history.push(
    JSON.stringify({
      id: combination.id,
      settings: combination.settings,
      inventory: combination.inventory,
    }),
  );
  combination.redo = [];
}
async function previewCombination(stop = false) {
  if (combination.node) {
    combination.node.forEach((n) => {
      try {
        n.stop?.();
        n.disconnect();
      } catch (_) {}
    });
    combination.node = null;
  }
  if (stop) return;
  await ensureAudio();
  stopSource();
  audio.moduleNodes.forEach((n) => {
    try {
      n.stop?.();
      n.disconnect();
    } catch (_) {}
  });
  audio.moduleNodes = [];
  audio.sourceBus.disconnect();
  audio.sourceBus.connect(audio.master);
  state.audioOn = true;
  const ctx = audio.context,
    p = combination.plan,
    s = p.sound,
    nodes = [];
  const out = ctx.createGain();
  out.gain.value = s.mute ? 0 : s.level * 0.13;
  out.connect(audio.sourceBus);
  nodes.push(out);
  const tone = ctx.createOscillator();
  tone.type = "square";
  tone.frequency.value = s.frequency;
  const gate = ctx.createGain();
  gate.gain.value = 1;
  tone.connect(gate);
  gate.connect(out);
  tone.start();
  nodes.push(tone, gate);
  if (["beat", "cluster"].includes(s.mode)) {
    for (const f of s.mode === "cluster" ? [s.second, s.third] : [s.second]) {
      const o = ctx.createOscillator();
      o.type = "square";
      o.frequency.value = f;
      o.connect(out);
      o.start();
      nodes.push(o);
    }
  }
  if (["gate", "glitch"].includes(s.mode)) {
    gate.gain.value = 0.5;
    const o = ctx.createOscillator(),
      g = ctx.createGain();
    o.type = "square";
    o.frequency.value = s.clock;
    g.gain.value = 0.5;
    o.connect(g);
    g.connect(gate.gain);
    o.start();
    nodes.push(o, g);
  }
  if (s.mode === "randompitch") {
    let shift = 0,
      next = ctx.currentTime;
    const interval = 1 / s.clock;
    const fill = () => {
      if (combination.node !== nodes) return;
      while (next < ctx.currentTime + 0.3) {
        shift = E().lfsrStep(shift);
        tone.frequency.setValueAtTime(
          E().randomPitchFrequency(shift, p.settings),
          next,
        );
        next += interval;
      }
      audio.riffTimer = setTimeout(fill, 30);
    };
    setTimeout(fill, 0);
  }
  if (["glitch", "modulation"].includes(s.mode)) {
    const o = ctx.createOscillator(),
      g = ctx.createGain();
    o.type = "square";
    o.frequency.value = s.modRate;
    g.gain.value = s.frequency * 0.12;
    o.connect(g);
    g.connect(tone.frequency);
    o.start();
    nodes.push(o, g);
  }
  if (s.mode === "fuzz") {
    tone.type = "sawtooth";
    const shaper = ctx.createWaveShaper();
    shaper.curve = makeCurve(47, 0.7);
    gate.disconnect();
    gate.connect(shaper);
    shaper.connect(out);
    nodes.push(shaper);
  }
  combination.node = nodes;
  audio.sourceNodes.push(...nodes);
  syncAudioButtons();
  renderCombinations();
}
function inspectDesignPart(i) {
  const p = combination.plan,
    c = p.components[i];
  if (!c) return;
  $("#design-part-inspector").innerHTML =
    `<strong>${esc(c.ref)} · ${esc(E().value(c.value))}</strong><p>${c.nets.map((n, j) => `Terminal ${j + 1}: <b>${esc(n)}</b> at ${p.layout.leads[c.ref][j]}`).join(" · ")}</p><p>${c.kind === "resistor" ? "Resistance limits current or sets an RC timing relationship. Use the named pitch and clock controls above to substitute a supported value." : c.kind === "diode" ? "The banded cathode is terminal 2. Opposite diodes clip opposite signal polarities." : c.kind === "electrolytic" ? "Positive terminal 1 must face the higher DC potential. Use a voltage rating above the selected supply." : "Capacitance stores charge; increasing a timing capacitance lowers oscillator frequency."}</p>`;
}
function bindCombinations() {
  $("#combination-app").addEventListener("click", async (e) => {
    const t = e.target.closest("button,[data-design-part]");
    if (!t) return;
    if (t.dataset.recipe) {
      saveDesignHistory();
      combination.id = t.dataset.recipe;
      combination.settings = {};
      combination.completed = [];
      combination.inventory = [
        ...E().RECIPES.find((r) => r.id === combination.id).chips,
      ];
      await previewCombination(true);
      return renderCombinations();
    }
    if (t.dataset.designView) {
      combination.view = t.dataset.designView;
      return renderCombinations();
    }
    if (t.dataset.designPart != null)
      return inspectDesignPart(+t.dataset.designPart);
    if (t.dataset.removeChip != null) {
      saveDesignHistory();
      combination.inventory.splice(+t.dataset.removeChip, 1);
      return renderCombinations();
    }
    if (t.dataset.designSwitch) {
      saveDesignHistory();
      const k = t.dataset.designSwitch;
      combination.settings[k] = !combination.plan.settings[k];
      const playing = !!combination.node;
      renderCombinations();
      if (playing) await previewCombination();
      return;
    }
    if (t.id === "add-design-chip") {
      saveDesignHistory();
      combination.inventory.push($("#chip-add-select").value);
      return renderCombinations();
    }
    if (t.id === "design-listen") {
      const playing = !!combination.node;
      await previewCombination(playing);
      if (playing) {
        state.audioOn = false;
        syncAudioButtons();
        renderCombinations();
      }
      return;
    }
    if (t.id === "design-undo" || t.id === "design-redo") {
      const from =
          t.id === "design-undo" ? combination.history : combination.redo,
        to = t.id === "design-undo" ? combination.redo : combination.history;
      if (!from.length) return;
      to.push(
        JSON.stringify({
          id: combination.id,
          settings: combination.settings,
          inventory: combination.inventory,
        }),
      );
      Object.assign(combination, JSON.parse(from.pop()));
      await previewCombination(true);
      return renderCombinations();
    }
    if (t.id === "design-to-studio") {
      await previewCombination(true);
      const p = combination.plan;
      state.modules = [];
      if (p.sound.mode === "fuzz") {
        const m = addModule("fuzz");
        m.params.rf = 470;
      } else {
        const m = addModule("oscillator");
        m.params.r1 = p.settings.ra / 1000;
        m.params.r2 = p.settings.rb / 1000;
        m.params.r2b = p.settings.rb2 / 1000;
        m.params.c = p.settings.c * 1e9;
        m.params.voices = ["beat", "cluster"].includes(p.sound.mode)
          ? "dual"
          : "single";
      }
      if (["gate", "glitch"].includes(p.sound.mode)) addModule("glitch");
      state.sequenceTarget = "chain";
      $("#sequence-target").value = "chain";
      state.source = "tone";
      $("#source-select").value = "tone";
      state.audioOn = false;
      renderStudio();
      rebuildAudioGraph();
      syncAudioButtons();
      showView("studio");
      announce(
        "Sound approximation copied to Studio. Physical plan remains in Chip combinations.",
      );
      return;
    }
    if (t.id === "export-design")
      downloadBlob(
        combination.id + "-circuit.json",
        JSON.stringify(
          {
            schema: 1,
            id: combination.id,
            settings: combination.settings,
            netlist: combination.plan.pinNets,
            components: combination.plan.components,
            layout: combination.plan.layout,
          },
          null,
          2,
        ),
        "application/json",
      );
  });
  $("#combination-app").addEventListener("keydown", (e) => {
    if (e.target.dataset.designPart != null && ["Enter", " "].includes(e.key)) {
      e.preventDefault();
      inspectDesignPart(+e.target.dataset.designPart);
    }
  });
  $("#combination-app").addEventListener("change", async (e) => {
    if (e.target.dataset.designCheck != null) {
      const n = +e.target.dataset.designCheck;
      combination.completed ??= [];
      combination.completed = combination.completed.filter((i) => i !== n);
      if (e.target.checked) combination.completed.push(n);
      return;
    }
    if (e.target.id === "design-select") {
      saveDesignHistory();
      combination.id = e.target.value;
      combination.settings = {};
      combination.completed = [];
      await previewCombination(true);
      return renderCombinations();
    }
    if (e.target.id === "design-supply" || e.target.dataset.designSetting) {
      saveDesignHistory();
      const k = e.target.dataset.designSetting || "supply";
      combination.settings[k] =
        +e.target.value * (k === "c" ? 1e-9 : k === "lfoC" ? 1e-6 : 1);
      const playing = !!combination.node;
      renderCombinations();
      if (playing) await previewCombination();
    }
  });
}
