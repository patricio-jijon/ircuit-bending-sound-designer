/* Circuit plans: one netlist drives placement, schematic, BOM and sound settings. */
(function (root) {
  "use strict";
  const SOURCE = {
    NE555P: "https://www.ti.com/lit/ds/symlink/ne555.pdf",
    NE556N: "https://www.ti.com/lit/ds/symlink/ne556.pdf",
    CD40106BE: "https://www.ti.com/lit/ds/symlink/cd40106b.pdf",
    CD4093BE: "https://www.ti.com/lit/ds/symlink/cd4093b.pdf",
    TL072CP: "https://www.ti.com/lit/ds/symlink/tl072.pdf",
  };
  SOURCE.SN74HC164N = "https://www.ti.com/lit/ds/symlink/sn74hc164.pdf";
  SOURCE.SN74HC86N = "https://www.ti.com/lit/ds/symlink/sn74hc86.pdf";
  const CHIPS = {
    SN74HC164N: {
      pins: [
        "A",
        "B",
        "QA",
        "QB",
        "QC",
        "QD",
        "GND",
        "CLK",
        "CLR",
        "QE",
        "QF",
        "QG",
        "QH",
        "VCC",
      ],
      power: 14,
      ground: 7,
      range: [5, 5],
      role: "8-bit serial shift register; clocked pseudorandom pitch with feedback logic.",
    },
    SN74HC86N: {
      pins: [
        "1A",
        "1B",
        "1Y",
        "2A",
        "2B",
        "2Y",
        "GND",
        "3Y",
        "3A",
        "3B",
        "4Y",
        "4A",
        "4B",
        "VCC",
      ],
      power: 14,
      ground: 7,
      range: [5, 5],
      role: "Four XOR gates; combines LFSR feedback taps. This teaching design is 5 V only.",
    },
    NE555P: {
      pins: ["GND", "TRIG", "OUT", "RESET", "CONT", "THRES", "DISCH", "VCC"],
      power: 8,
      ground: 1,
      range: [5, 12],
      role: "One RC timer; audio oscillator, slow clock or gate.",
    },
    NE556N: {
      pins: [
        "1 DISCH",
        "1 THRES",
        "1 CONT",
        "1 RESET",
        "1 OUT",
        "1 TRIG",
        "GND",
        "2 TRIG",
        "2 OUT",
        "2 RESET",
        "2 CONT",
        "2 THRES",
        "2 DISCH",
        "VCC",
      ],
      power: 14,
      ground: 7,
      range: [5, 12],
      role: "Two independent 555 timers in one PDIP-14 package. Different pinout from a 555.",
    },
    CD40106BE: {
      pins: [
        "1A",
        "1Y",
        "2A",
        "2Y",
        "3A",
        "3Y",
        "VSS",
        "4Y",
        "4A",
        "5Y",
        "5A",
        "6Y",
        "6A",
        "VDD",
      ],
      power: 14,
      ground: 7,
      range: [5, 12],
      role: "Six Schmitt inverters; multiple RC tones and slow modulation.",
    },
    CD4093BE: {
      pins: [
        "1A",
        "1B",
        "1Y",
        "2Y",
        "2A",
        "2B",
        "VSS",
        "3A",
        "3B",
        "3Y",
        "4Y",
        "4A",
        "4B",
        "VDD",
      ],
      power: 14,
      ground: 7,
      range: [5, 12],
      role: "Four Schmitt NAND gates; oscillation with an enable input.",
    },
    TL072CP: {
      pins: ["1OUT", "1IN−", "1IN+", "V−", "2IN+", "2IN−", "2OUT", "V+"],
      power: 8,
      ground: 4,
      range: [9, 12],
      role: "Audio gain, mixing, clipping and filtering; requires a bias reference on one supply.",
    },
  };
  const CATALOG = [
    ...Object.entries(CHIPS).map(([id, d]) => ({
      id,
      name: id,
      role: d.role,
      source: SOURCE[id],
      status: "Physical template available",
    })),
    {
      id: "CD4046BE",
      name: "CD4046BE PLL / VCO",
      role: "Voltage-controlled tones and pitch tracking. External filter, bias and calibration required.",
      source: "https://www.ti.com/lit/ds/symlink/cd4046b.pdf",
      status: "Architecture study",
    },
    {
      id: "CD4017BE",
      name: "CD4017BE decade counter",
      role: "Clocked pitch steps using a resistor/diode network; it is a sequencer, not an audio oscillator.",
      source: "https://www.ti.com/lit/ds/symlink/cd4017b.pdf",
      status: "Architecture study",
    },
    {
      id: "CD4040BE",
      name: "CD4040BE divider",
      role: "Square-wave sub-octaves from an incoming clock.",
      source: "https://www.ti.com/lit/ds/symlink/cd4040b.pdf",
      status: "Architecture study",
    },

    {
      id: "LM13700N",
      name: "LM13700N dual OTA",
      role: "Voltage-controlled filters and phaser stages with bias and modulation support circuitry.",
      source: "https://www.ti.com/lit/ds/symlink/lm13700.pdf",
      status: "Architecture study",
    },
    {
      id: "PT2399",
      name: "PT2399 delay processor",
      role: "5 V delay with filtering. Very short chorus/flanger delay ranges require a different qualified design.",
      source: "https://www.princeton.com.tw/Portals/0/Product/PT2399_1.pdf",
      status: "Architecture study",
    },
    {
      id: "BBD",
      name: "BBD delay + clock",
      role: "Chorus/flanger need a short modulated delay, anti-alias/reconstruction filters and suitable clock circuitry.",
      source: "https://www.coolaudio.com/docs/COOLAUDIO_V3207_DATASHEET.pdf",
      status: "Architecture study",
    },
  ];
  const RECIPES = [
    {
      id: "randompitch",
      name: "4 chips · pseudorandom pitch",
      chips: ["CD40106BE", "SN74HC164N", "SN74HC86N", "NE555P"],
      mode: "randompitch",
      lesson:
        "A Schmitt clock advances an 8-bit shift register. Four XOR gates implement inverted feedback from QH, QF, QE and QD. A resistor-weighted output changes the 555 CONTROL voltage. Press the reset switch, then release it: the 255-step sequence repeats; it is pseudorandom, not true noise.",
    },
    {
      id: "tone555",
      name: "555 · first tone",
      chips: ["NE555P"],
      mode: "tone",
      lesson:
        "Predict the pitch, double the timing capacitor, then listen again. Doubling C halves the ideal frequency.",
    },
    {
      id: "highmute",
      name: "555 · high pitch + mute",
      chips: ["NE555P"],
      mode: "highmute",
      lesson:
        "HIGH bypasses the pitch resistor through a protected 1 kΩ timing path. MUTE pulls RESET low. This is a new documented teaching circuit, not a reconstruction of the missing PDF.",
    },
    {
      id: "dual555",
      name: "2 × 555 · beating drone",
      chips: ["NE555P", "NE555P"],
      mode: "beat",
      lesson:
        "Two independent tones mix through separate resistors. Small frequency differences create audible beats; never directly join active outputs.",
    },
    {
      id: "gate555",
      name: "2 × 555 · rhythmic gate",
      chips: ["NE555P", "NE555P"],
      mode: "gate",
      lesson:
        "The slow timer drives RESET on the audio timer. A low RESET silences the carrier; a high RESET enables it.",
    },
    {
      id: "triple555",
      name: "3 × 555 · gated pitch bends",
      chips: ["NE555P", "NE555P", "NE555P"],
      mode: "glitch",
      lesson:
        "Timer 1 creates sound. Timer 2 gates RESET. Timer 3 changes CONTROL through a 47 kΩ resistor. Changing clock ratios creates repeating glitch patterns, not true randomness.",
    },
    {
      id: "tone556",
      name: "556 · two tones, one chip",
      chips: ["NE556N"],
      mode: "beat",
      lesson:
        "A dual timer combines two RC networks in one package. Its pin numbering is different from two separate 555 packages.",
    },
    {
      id: "tone40106",
      name: "40106 · Schmitt tone",
      chips: ["CD40106BE"],
      mode: "schmitt",
      lesson:
        "A feedback resistor and capacitor repeatedly cross the inverter thresholds. Frequency depends on the actual threshold ratios and RC values.",
    },
    {
      id: "triple40106",
      name: "40106 · three-voice cluster",
      chips: ["CD40106BE"],
      mode: "cluster",
      lesson:
        "Three gates make independent RC oscillators, mixed through isolation resistors. Slight detuning creates beating; this is not a true chorus delay.",
    },
    {
      id: "tone4093",
      name: "4093 · enabled tone",
      chips: ["CD4093BE"],
      mode: "nand",
      lesson:
        "A NAND Schmitt gate oscillates while its enable input is high. Pull enable low to stop it. Every unused input is tied to ground.",
    },
    {
      id: "mixed",
      name: "555 + 40106 · pitch modulation",
      chips: ["NE555P", "CD40106BE"],
      mode: "modulation",
      lesson:
        "The 40106 makes a slow square-wave modulation source. A 47 kΩ resistor feeds the 555 CONTROL node; resistor division limits modulation depth.",
    },
    {
      id: "fuzz",
      name: "TL072 · diode distortion",
      chips: ["TL072CP"],
      mode: "fuzz",
      lesson:
        "A buffered half-supply reference biases the inverting amplifier. Antiparallel feedback diodes limit its signal swing; an RC filter shapes the harmonics.",
    },
  ];
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  function lfsrStep(shift) {
    return (
      ((shift << 1) |
        (1 ^
          ((shift >> 7) & 1) ^
          ((shift >> 5) & 1) ^
          ((shift >> 4) & 1) ^
          ((shift >> 3) & 1))) &
      255
    );
  }
  function controlFrequency(vcc, cv, ra, rb, c) {
    const hi = Math.min(vcc * 0.95, Math.max(vcc * 0.1, cv)),
      lo = hi / 2;
    return (
      1 /
      ((ra + rb) * c * Math.log((vcc - lo) / (vcc - hi)) +
        rb * c * Math.log(hi / lo))
    );
  }
  function randomPitchFrequency(shift, v) {
    const weights = [10000, 20000, 40000];
    let numerator = v.supply / 5000,
      denominator = 1 / 5000 + 1 / 10000;
    weights.forEach((r, i) => {
      numerator += (((shift >> i) & 1) * v.supply) / r;
      denominator += 1 / r;
    });
    return controlFrequency(v.supply, numerator / denominator, v.ra, v.rb, v.c);
  }
  function timerFrequency(ra, rb, c) {
    return 1 / (Math.log(2) * (ra + 2 * rb) * c);
  }
  function schmittFrequency(r, c, lo = 1 / 3, hi = 2 / 3) {
    return 1 / (r * c * (Math.log((1 - lo) / (1 - hi)) + Math.log(hi / lo)));
  }
  function build(id, settings = {}) {
    const recipe = RECIPES.find((r) => r.id === id);
    if (!recipe) throw Error("Unknown combination");
    const v = {
      supply: id === "randompitch" ? 5 : 9,
      ra: 10000,
      rb: 22000,
      rb2: 23000,
      c: 10e-9,
      lfoR: 100000,
      lfoC: 1e-6,
      mix: 0.25,
      high: false,
      mute: false,
      rf: 470000,
      rin: 10000,
      toneC: 22e-9,
      diode: "silicon",
      ...settings,
    };
    const min = recipe.chips.includes("TL072CP") ? 9 : 5;
    const max = id === "randompitch" ? 5 : 12;
    if (!Number.isFinite(v.supply) || v.supply < min || v.supply > max)
      throw Error("Supply outside supported design range");
    for (const key of ["ra", "rb", "rb2", "lfoR"])
      if (!Number.isFinite(v[key]) || v[key] < 1000 || v[key] > 1e6)
        throw Error("Resistance outside supported range");
    for (const key of ["c", "lfoC"])
      if (!Number.isFinite(v[key]) || v[key] < 1e-9 || v[key] > 1e-4)
        throw Error("Capacitance outside supported range");
    let chipCol =
      recipe.chips.length === 1 ? 12 : recipe.chips.length === 2 ? 5 : 1;
    const chips = recipe.chips.map((type, i) => {
      const chip = { ref: "U" + (i + 1), type, col: chipCol };
      chipCol += CHIPS[type].pins.length / 2 + 1;
      return chip;
    });
    const components = [],
      pinNets = {},
      connect = (ref, pin, net) => {
        pinNets[`${ref}.${pin}`] = net;
      };
    const add = (ref, kind, value, a, b, extra = {}) =>
      components.push({ ref, kind, value, nets: [a, b], ...extra });
    const wireChip = (chip) => {
      const def = CHIPS[chip.type];
      connect(chip.ref, def.power, "VCC");
      connect(chip.ref, def.ground, "GND");
      add(chip.ref + " decouple", "capacitor", 100e-9, "VCC", "GND");
    };
    chips.forEach(wireChip);
    function timer(chip, index, role = "audio", unit = 0) {
      const ref = chip.ref,
        prefix = ref + (unit ? "B" : "A");
      const pins =
        chip.type === "NE556N"
          ? unit
            ? {
                reset: 10,
                control: 11,
                threshold: 12,
                discharge: 13,
                trigger: 8,
                out: 9,
              }
            : {
                reset: 4,
                control: 3,
                threshold: 2,
                discharge: 1,
                trigger: 6,
                out: 5,
              }
          : {
              reset: 4,
              control: 5,
              threshold: 6,
              discharge: 7,
              trigger: 2,
              out: 3,
            };
      const slow = role !== "audio",
        timing = prefix + "_RC",
        discharge = prefix + "_DIS",
        out = prefix + "_OUT",
        control = prefix + "_CV";
      connect(ref, pins.trigger, timing);
      connect(ref, pins.threshold, timing);
      connect(ref, pins.discharge, discharge);
      connect(ref, pins.control, control);
      connect(ref, pins.out, out);
      connect(
        ref,
        pins.reset,
        index === 0 && ["gate", "glitch"].includes(recipe.mode)
          ? "U2A_OUT"
          : recipe.mode === "highmute"
            ? "RESET"
            : "VCC",
      );
      add(prefix + " RA", "resistor", slow ? 1000 : v.ra, "VCC", discharge);
      add(
        prefix + " RB",
        "pot",
        slow ? v.lfoR : index || unit ? v.rb2 : v.rb,
        discharge,
        timing,
        { adjustable: true },
      );
      components.at(-1).nets.push(timing);
      add(
        prefix + " timing C",
        "capacitor",
        slow ? v.lfoC : v.c,
        timing,
        "GND",
      );
      add(prefix + " control C", "capacitor", 10e-9, control, "GND");
      if (recipe.mode === "highmute") {
        add("HIGH protection R", "resistor", 1000, discharge, "HIGH_SWITCH");
        add(
          "HIGH switch",
          "switch",
          v.high ? "closed" : "open",
          "HIGH_SWITCH",
          timing,
        );
      }
      return out;
    }
    function schmitt(chip, count = 1, slow = false, nand = false) {
      const ins = nand ? [1] : [1, 3, 5],
        outs = nand ? [3] : [2, 4, 6];
      for (let i = 0; i < count; i++) {
        const input = `${chip.ref}_RC${i}`,
          out = `${chip.ref}_OSC${i}`;
        connect(chip.ref, ins[i], input);
        connect(chip.ref, outs[i], out);
        add(
          chip.ref + " R" + (i + 1),
          "resistor",
          slow ? v.lfoR : v.rb * (1 + i * 0.021),
          out,
          input,
          { adjustable: true },
        );
        add(
          chip.ref + " C" + (i + 1),
          "capacitor",
          slow ? v.lfoC : v.c,
          input,
          "GND",
        );
        if (!slow)
          add("mix " + chip.ref + (i + 1), "resistor", 10000, out, "MIX");
      }
      if (nand) {
        connect(chip.ref, 2, "ENABLE");
        add("enable pullup", "resistor", 10000, "VCC", "ENABLE");
        add(
          "enable switch",
          "switch",
          v.mute ? "closed" : "open",
          "ENABLE",
          "GND",
        );
      }
      const unused = nand
        ? [5, 6, 8, 9, 12, 13]
        : [1, 3, 5, 9, 11, 13].slice(count);
      unused.forEach((pin) => connect(chip.ref, pin, "GND"));
      return `${chip.ref}_OSC0`;
    }
    if (recipe.mode === "randompitch") {
      const clock = schmitt(chips[0], 1, true);
      const shift = chips[1],
        xor = chips[2],
        osc = chips[3];
      [
        [1, "FEEDBACK"],
        [2, "VCC"],
        [8, clock],
        [9, "CLEAR"],
        [3, "QA"],
        [4, "QB"],
        [5, "QC"],
        [6, "QD"],
        [10, "QE"],
        [11, "QF"],
        [12, "QG"],
        [13, "QH"],
      ].forEach(([p, n]) => connect(shift.ref, p, n));
      [
        [1, "QH"],
        [2, "QF"],
        [3, "X1"],
        [4, "QE"],
        [5, "QD"],
        [6, "X2"],
        [9, "X1"],
        [10, "X2"],
        [8, "X3"],
        [12, "X3"],
        [13, "VCC"],
        [11, "FEEDBACK"],
      ].forEach(([p, n]) => connect(xor.ref, p, n));
      add("CLEAR pullup", "resistor", 10000, "VCC", "CLEAR");
      add("CLEAR switch", "switch", "open", "CLEAR", "GND");
      const out = timer(osc, 0);
      add("mix R", "resistor", 10000, out, "MIX");
      add("DAC R1", "resistor", 10000, "QA", "U4A_CV");
      add("DAC R2", "resistor", 20000, "QB", "U4A_CV");
      add("DAC R3", "resistor", 40000, "QC", "U4A_CV");
    } else if (recipe.mode === "fuzz") {
      const chip = chips[0];
      [
        [5, "BIAS"],
        [6, "VREF"],
        [7, "VREF"],
        [3, "VREF"],
        [2, "INV"],
        [1, "AMP"],
      ].forEach(([p, n]) => connect(chip.ref, p, n));
      add("bias R1", "resistor", 100000, "VCC", "BIAS");
      add("bias R2", "resistor", 100000, "BIAS", "GND");
      add("bias C", "electrolytic", 10e-6, "BIAS", "GND");
      add("input C", "capacitor", 100e-9, "INPUT", "IN_AC");
      add("input R", "resistor", v.rin, "IN_AC", "INV");
      add("feedback R", "resistor", v.rf, "AMP", "INV", { adjustable: true });
      add("D1", "diode", v.diode, "AMP", "INV");
      add("D2", "diode", v.diode, "INV", "AMP");
      add("tone R", "resistor", 10000, "AMP", "MIX");
      add("tone C", "capacitor", v.toneC, "MIX", "GND");
    } else if (chips[0].type === "NE556N") {
      for (let unit = 0; unit < 2; unit++)
        add(
          "mix R" + unit,
          "resistor",
          10000,
          timer(chips[0], 0, "audio", unit),
          "MIX",
        );
    } else if (chips[0].type === "CD40106BE")
      schmitt(chips[0], recipe.mode === "cluster" ? 3 : 1);
    else if (chips[0].type === "CD4093BE") schmitt(chips[0], 1, false, true);
    else {
      chips.forEach((chip, i) => {
        if (chip.type === "CD40106BE") {
          const out = schmitt(chip, 1, true);
          add("mod depth R", "resistor", 47000, out, "U1A_CV");
        } else {
          const role =
            i > 0 && ["gate", "glitch", "modulation"].includes(recipe.mode)
              ? "slow"
              : "audio";
          const out = timer(chip, i, role);
          if (role === "audio") add("mix R" + i, "resistor", 10000, out, "MIX");
          if (i === 2) add("mod depth R", "resistor", 47000, out, "U1A_CV");
        }
      });
    }
    if (recipe.mode === "highmute") {
      add("reset pullup", "resistor", 10000, "VCC", "RESET");
      add("mute switch", "switch", v.mute ? "closed" : "open", "RESET", "GND");
    }
    // All outputs are AC coupled and attenuated for a high-impedance powered input.
    add("output load", "resistor", 10000, "MIX", "GND");
    add("output C", "electrolytic", 1e-6, "MIX", "OUT_AC");
    add("output limit R", "resistor", 47000, "OUT_AC", "OUTPUT");
    add("output attenuator R", "resistor", 10000, "OUTPUT", "GND");
    const plan = {
      id,
      recipe,
      settings: v,
      chips,
      components,
      pinNets,
      sources: [...new Set(chips.map((c) => SOURCE[c.type]))],
      ports:
        recipe.mode === "fuzz" ? ["INPUT", "OUTPUT", "GND"] : ["OUTPUT", "GND"],
    };
    plan.layout = place(plan);
    plan.checks = validate(plan);
    const f =
      recipe.mode !== "randompitch" && chips[0].type.startsWith("CD4")
        ? schmittFrequency(v.rb, v.c)
        : timerFrequency(v.ra, v.high ? 1 / (1 / 1000 + 1 / v.rb) : v.rb, v.c);
    plan.sound = {
      mode: recipe.mode,
      frequency: clamp(f, 10, 16000),
      second: clamp(
        chips[0].type.startsWith("CD4")
          ? f * 1.021
          : timerFrequency(v.ra, v.rb2, v.c),
        10,
        16000,
      ),
      third: clamp(f * 1.042, 10, 16000),
      clock: timerFrequency(1000, v.lfoR, v.lfoC),
      modRate: timerFrequency(1000, v.lfoR * 0.73, v.lfoC),
      level: v.mix,
      mute: v.mute,
    };
    return plan;
  }
  function place(plan) {
    const used = {},
      stripNet = {},
      netStrips = {},
      jumps = [],
      leads = {},
      pinHoles = {};
    const letters = "ABCDEFGHIJ";
    const strip = (h) =>
      /^(?:b[+-]|[+-])/.test(h)
        ? h.startsWith("b")
          ? h.slice(0, 2)
          : h[0]
        : "ABCDEFGHIJ".indexOf(h[0]) < 5
          ? "L" + h.slice(1)
          : "R" + h.slice(1);
    const holes = (s) =>
      ["+", "-", "b+", "b-"].includes(s)
        ? Array.from({ length: 25 }, (_, i) => s + (i + 1))
        : Array.from(
            { length: 5 },
            (_, i) => letters[(s[0] === "L" ? 0 : 5) + i] + s.slice(1),
          );
    function reserve(h, net, label) {
      if (used[h]) throw Error("Occupied hole " + h);
      const st = strip(h);
      if (stripNet[st] && stripNet[st] !== net)
        throw Error("Shorted strips " + st);
      stripNet[st] = net;
      used[h] = { net, label };
      netStrips[net] ??= [];
      if (!netStrips[net].includes(st)) netStrips[net].push(st);
    }
    for (const chip of plan.chips) {
      const n = CHIPS[chip.type].pins.length / 2;
      for (let pin = 1; pin <= n * 2; pin++) {
        const h =
          pin <= n
            ? "F" + (chip.col + pin - 1)
            : "E" + (chip.col + 2 * n - pin);
        const net =
          plan.pinNets[chip.ref + "." + pin] || chip.ref + "_NC" + pin;
        reserve(h, net, chip.ref + " pin " + pin);
        pinHoles[chip.ref + "." + pin] = h;
      }
    }
    reserve("+1", "VCC", "Supply positive");
    reserve("-1", "GND", "Supply ground");
    reserve("b+1", "VCC", "Bottom positive bridge");
    reserve("b-1", "GND", "Bottom ground bridge");
    function take(net, label, exclude) {
      for (const st of netStrips[net] || []) {
        if (st === exclude) continue;
        const free = holes(st).filter((h) => !used[h]);
        if (free.length > 2) {
          const h = free[0];
          reserve(h, net, label);
          return h;
        }
      }
      for (let col = 1; col <= 30; col++)
        for (const side of ["L", "R"]) {
          const st = side + col;
          if (!stripNet[st]) {
            const h = holes(st)[0];
            reserve(h, net, label);
            return h;
          }
        }
      throw Error("This template exceeds one BB400; use another board.");
    }
    for (const c of plan.components) {
      leads[c.ref] = c.nets.map((n, i) =>
        take(n, c.ref + " terminal " + (i + 1)),
      );
    }
    for (const port of plan.ports)
      leads["Jack " + port] = [take(port, "Jack " + port)];
    // Bridge all independent strips carrying one net. Endpoints have their own holes.
    for (const [net, strips] of Object.entries(netStrips)) {
      const unique = [...strips];
      for (let i = 1; i < unique.length; i++) {
        const get = (s) => {
          const h = holes(s).find((h) => !used[h]);
          if (!h) throw Error("No free jumper hole on " + s);
          reserve(h, net, "Jumper " + net);
          return h;
        };
        jumps.push({ net, from: get(unique[i - 1]), to: get(unique[i]) });
      }
    }
    return { used, stripNet, leads, pinHoles, jumps };
  }
  function validate(plan) {
    const errors = [];
    for (const chip of plan.chips) {
      const d = CHIPS[chip.type];
      if (plan.pinNets[chip.ref + "." + d.power] !== "VCC")
        errors.push(chip.ref + " missing VCC");
      if (plan.pinNets[chip.ref + "." + d.ground] !== "GND")
        errors.push(chip.ref + " missing ground");
      if (
        plan.settings.supply < d.range[0] ||
        plan.settings.supply > d.range[1]
      )
        errors.push(chip.ref + " supply mismatch");
    }
    for (const c of plan.components) {
      if (c.nets[0] === c.nets[1]) errors.push(c.ref + " is shorted");
      if (c.kind === "resistor" && (!Number.isFinite(c.value) || c.value <= 0))
        errors.push(c.ref + " invalid resistance");
    }
    const layout = plan.layout,
      used = layout.used;
    const parent = {},
      find = (x) => {
        parent[x] ??= x;
        return parent[x] === x ? x : (parent[x] = find(parent[x]));
      },
      join = (a, b) => (parent[find(a)] = find(b));
    const strip = (h) =>
      /^(?:b[+-]|[+-])/.test(h)
        ? h.startsWith("b")
          ? h.slice(0, 2)
          : h[0]
        : ("ABCDE".includes(h[0]) ? "L" : "R") + h.slice(1);
    const valid = (h) =>
      /^(?:[A-J](?:[1-9]|[12]\d|30)|b?[+-](?:[1-9]|1\d|2[0-5]))$/.test(h);
    const occupied = new Set();
    function endpoint(h, net) {
      if (!valid(h)) errors.push("Invalid hole " + h);
      if (!used[h] || used[h].net !== net) errors.push("Wrong net at " + h);
      if (occupied.has(h)) errors.push("Duplicate hole " + h);
      occupied.add(h);
    }
    for (const c of plan.chips)
      CHIPS[c.type].pins.forEach((_, i) =>
        endpoint(
          layout.pinHoles[c.ref + "." + (i + 1)],
          plan.pinNets[c.ref + "." + (i + 1)] || c.ref + "_NC" + (i + 1),
        ),
      );
    for (const c of plan.components)
      c.nets.forEach((net, i) => endpoint(layout.leads[c.ref][i], net));
    for (const w of layout.jumps) {
      endpoint(w.from, w.net);
      endpoint(w.to, w.net);
      join(strip(w.from), strip(w.to));
    }
    const netRoots = {};
    for (const [h, info] of Object.entries(used)) {
      const st = strip(h);
      if (layout.stripNet[st] !== info.net) errors.push("Strip short at " + h);
      const r = find(st);
      if (netRoots[info.net] && find(netRoots[info.net]) !== r)
        errors.push("Disconnected net " + info.net);
      netRoots[info.net] = r;
    }
    const count = Object.keys(plan.layout.used).length;
    return {
      errors,
      passed: !errors.length,
      holes: count,
      notes: [
        "Every occupied hole has one endpoint.",
        "Every wire endpoint and component terminal belongs to a named net.",
        "Power and ground are checked against the exact chip package.",
        "Documentation and connection checks only; not physically assembled or measured.",
      ],
    };
  }
  function value(v) {
    if (typeof v === "string") return v;
    if (v >= 1e6) return +(v / 1e6).toPrecision(3) + " MΩ";
    if (v >= 1000) return +(v / 1000).toPrecision(3) + " kΩ";
    if (v >= 1) return v + " Ω";
    if (v >= 1e-6) return +(v * 1e6).toPrecision(3) + " µF";
    return +(v * 1e9).toPrecision(3) + " nF";
  }
  if (root.DEVICE_LIBRARY) {
    for (const chip of CATALOG) {
      const id = chip.id.toLowerCase();
      const existing = root.DEVICE_LIBRARY.find((d) => d.id === id);
      if (existing) {
        existing.standalone = true;
        continue;
      }
      root.DEVICE_LIBRARY.push({
        id,
        name: chip.name,
        model: chip.id,
        category: "Sound circuit ICs",
        logic: "analog",
        supply: chip.id.startsWith("SN74HC")
          ? "5 V in this teaching design"
          : "Exact circuit supply required",
        interfaces: ["analog"],
        standalone: true,
        verify: true,
        note:
          chip.role +
          " " +
          chip.status +
          ". Use the circuit template rather than a direct controller GPIO connection.",
        source: chip.source,
      });
    }
  }
  root.CircuitEngine = {
    CHIPS,
    CATALOG,
    RECIPES,
    build,
    place,
    validate,
    timerFrequency,
    schmittFrequency,
    lfsrStep,
    controlFrequency,
    randomPitchFrequency,
    value,
  };
})(typeof window === "undefined" ? globalThis : window);
