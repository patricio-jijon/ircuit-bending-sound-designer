"use strict";

window.HARDWARE_PINOUTS = {
  NE555P: {
    identity: "Texas Instruments NE555P, PDIP-8 (P), top view",
    orientation: "Notch left when placed horizontally across the breadboard trench; numbering proceeds counterclockwise.",
    source: "https://www.ti.com/lit/ds/symlink/ne555.pdf",
    pins: [[1,"GND","Ground"],[2,"TRIGGER","Starts timing below 1/3 VCC"],[3,"OUTPUT","Timer output"],[4,"RESET","Active-low reset; held high here"],[5,"CONTROL","Threshold control; bypassed to ground"],[6,"THRESHOLD","Ends timing above 2/3 VCC"],[7,"DISCHARGE","Discharges timing capacitor"],[8,"VCC","Positive supply"]]
  },
  TL072CP: {
    identity: "Texas Instruments TL072CP, PDIP-8 (P), top view",
    orientation: "Notch left when placed horizontally across the breadboard trench; numbering proceeds counterclockwise.",
    source: "https://www.ti.com/product/TL072/part-details/TL072CP",
    pins: [[1,"1OUT","Amplifier A output"],[2,"1IN−","Amplifier A inverting input"],[3,"1IN+","Amplifier A non-inverting input"],[4,"VCC−","Negative supply; ground here"],[5,"2IN+","Amplifier B non-inverting input"],[6,"2IN−","Amplifier B inverting input"],[7,"2OUT","Amplifier B output"],[8,"VCC+","Positive supply"]]
  },
  CD40106BE: {
    identity: "Texas Instruments CD40106BE, PDIP-14 (N), top view",
    orientation: "Notch left when placed horizontally across the breadboard trench; numbering proceeds counterclockwise.",
    source: "https://www.ti.com/lit/ds/symlink/cd40106b.pdf",
    pins: [[1,"A","Inverter A input"],[2,"G=/A","Inverter A output"],[3,"B","Inverter B input"],[4,"H=/B","Inverter B output"],[5,"C","Inverter C input"],[6,"I=/C","Inverter C output"],[7,"VSS","Ground"],[8,"J=/D","Inverter D output"],[9,"D","Inverter D input"],[10,"K=/E","Inverter E output"],[11,"E","Inverter E input"],[12,"L=/F","Inverter F output"],[13,"F","Inverter F input"],[14,"VDD","Positive supply"]]
  }
};

window.HARDWARE_PRESETS = {
  dual555: {
    id: "dual555",
    guide: "guides/dual-555-drone-build-guide.pdf",
    name: "Dual 555 Drone",
    summary: "Two independently timed NE555P astable oscillators mixed to one line-level output.",
    chain: ["oscillator"],
    pinouts: ["NE555P"],
    color: "#71c7ff",
    values: { r1: 10, r2: 22, r2b: 33, c: 10, mix: 34 },
    controls: [
      { key: "r1", ref: "R1/R3", label: "Fixed timing resistors", unit: "kΩ", min: 1, max: 100, step: 1, audio: { module: 0, key: "r1" } },
      { key: "r2", ref: "P1", label: "Voice A pitch pot", unit: "kΩ", min: 1, max: 100, step: 1, audio: { module: 0, key: "r2" } },
      { key: "r2b", ref: "P2", label: "Voice B pitch pot", unit: "kΩ", min: 1, max: 100, step: 1, audio: { module: 0, key: "r2b" } },
      { key: "c", ref: "C1/C3", label: "Timing capacitors", unit: "nF", min: 1, max: 100, step: 1, audio: { module: 0, key: "c" } },
      { key: "mix", ref: "P3", label: "Output level", unit: "%", min: 0, max: 100, step: 1, audio: { module: 0, key: "mix" } }
    ],
    components: [
      { ref: "BB1", kind: "breadboard", name: "BusBoard BB830-style breadboard", value: "830 tie points", qty: 1, cost: 9.50, query: "BusBoard BB830 breadboard", note: "Verify rail continuity with power removed." },
      { ref: "U1,U2", kind: "dip8", name: "Texas Instruments NE555P", value: "PDIP-8", qty: 2, cost: 0.85, query: "Texas Instruments NE555P DIP 8", note: "Top view, notch left in this layout." },
      { ref: "R1,R3", kind: "resistor", name: "Metal-film resistor", valueKey: "r1", suffix: " kΩ", qty: 2, cost: 0.10, query: "metal film resistor assortment quarter watt", note: "1/4 W or greater." },
      { ref: "P1,P2", kind: "pot", name: "Bourns PTV09A-4020F-B104", value: "100 kΩ linear", qty: 2, cost: 1.65, query: "Bourns PTV09A 100k linear potentiometer", note: "Wire as rheostat: terminal 2 wiper tied to the used outer terminal." },
      { ref: "C1,C3", kind: "capacitor", name: "Film timing capacitor", valueKey: "c", suffix: " nF", qty: 2, cost: 0.25, query: "film capacitor assortment 50V", note: "Non-polarized, 25 V or greater." },
      { ref: "C2,C4", kind: "capacitor", name: "Ceramic capacitor", value: "10 nF", qty: 2, cost: 0.12, query: "10nF ceramic capacitor", note: "CONTROL-to-ground bypass." },
      { ref: "R5,R6", kind: "resistor", name: "Mixing resistor", value: "10 kΩ, 1/4 W", qty: 2, cost: 0.10, query: "10k metal film resistor quarter watt", note: "Prevents timer outputs from driving each other." },
      { ref: "P3", kind: "pot", name: "Bourns PTV09A-4020F-B104", value: "100 kΩ linear", qty: 1, cost: 1.65, query: "Bourns PTV09A 100k linear potentiometer", note: "Terminal 2 is the wiper; master output level." },
      { ref: "C5", kind: "electrolytic", name: "Electrolytic output capacitor", value: "1 µF, 25 V", qty: 1, cost: 0.20, query: "1uF 25V electrolytic capacitor", note: "Positive lead faces P3 wiper." },
      { ref: "C6", kind: "capacitor", name: "Supply bypass capacitor", value: "100 nF ceramic", qty: 1, cost: 0.12, query: "100nF ceramic capacitor", note: "Place close to U1/U2 supply pins." },
      { ref: "J1", kind: "jack", name: "6.35 mm mono output jack", value: "Panel mount", qty: 1, cost: 1.10, query: "quarter inch mono audio jack panel mount", note: "Tip is signal; sleeve is ground." },
      { ref: "PS1", kind: "supply", name: "Regulated DC supply", value: "9 V, current-limited", qty: 1, cost: 9.50, query: "9V regulated guitar pedal power supply", note: "Do not use household mains on the breadboard." }
    ],
    connections: [
      ["+9V", "BB1 + rail", "U1 VCC", "pin 8 · E10", "red", "Power"],
      ["+9V", "BB1 + rail", "U1 RESET", "pin 4 · F13", "red", "Hold enabled"],
      ["GND", "BB1 − rail", "U1 GND", "pin 1 · F10", "black", "Ground"],
      ["A_TIMING", "U1 TRIGGER", "pin 2 · F11", "U1 THRESHOLD", "pin 6 · E12", "blue", "Jumper across center trench"],
      ["A_CHARGE", "+9V", "R1", "U1 DISCHARGE · pin 7 · E11", "red", "R1 = timing value"],
      ["A_TIMING", "U1 DISCHARGE", "pin 7 · E11 via P1", "A_TIMING", "blue", "Tie P1 wiper to end lug"],
      ["A_TIMING", "A_TIMING", "C1", "GND", "black", "C1 non-polarized"],
      ["CONTROL_A", "U1 CONTROL", "pin 5 · E13", "C2 then GND", "black", "Noise bypass"],
      ["VOICE_A", "U1 OUTPUT", "pin 3 · F12", "R5 then MIX", "yellow", "10 kΩ mixing resistor"],
      ["+9V", "BB1 + rail", "U2 VCC", "pin 8 · E20", "red", "Power"],
      ["+9V", "BB1 + rail", "U2 RESET", "pin 4 · F23", "red", "Hold enabled"],
      ["GND", "BB1 − rail", "U2 GND", "pin 1 · F20", "black", "Ground"],
      ["B_TIMING", "U2 TRIGGER", "pin 2 · F21", "U2 THRESHOLD", "pin 6 · E22", "blue", "Jumper across center trench"],
      ["B_CHARGE", "+9V", "R3", "U2 DISCHARGE · pin 7 · E21", "red", "R3 = timing value"],
      ["B_TIMING", "U2 DISCHARGE", "pin 7 · E21 via P2", "B_TIMING", "blue", "Set second pitch by ear"],
      ["B_TIMING", "B_TIMING", "C3", "GND", "black", "C3 non-polarized"],
      ["CONTROL_B", "U2 CONTROL", "pin 5 · E23", "C4 then GND", "black", "Noise bypass"],
      ["VOICE_B", "U2 OUTPUT", "pin 3 · F22", "R6 then MIX", "orange", "10 kΩ mixing resistor"],
      ["MIX", "R5 + R6 junction", "P3 lug 3", "level input", "green", "Do not short U1/U2 outputs"],
      ["GND", "P3 lug 1", "ground rail", "BB1 − rail", "black", "Volume return"],
      ["OUTPUT", "P3 wiper lug 2", "C5 positive", "C5 negative to J1 tip", "green", "Polarized capacitor"],
      ["GND", "J1 sleeve", "ground rail", "BB1 − rail", "black", "Shared audio ground"],
      ["SUPPLY", "+9V rail", "C6", "GND rail", "black", "100 nF close to ICs"]
    ],
    placements: [
      { kind: "dip8", ref: "U1", col: 10, label: "NE555P" },
      { kind: "dip8", ref: "U2", col: 20, label: "NE555P" },
      { kind: "resistor", ref: "R1", from: "+10", to: "A11", label: "R1", valueKey: "r1" },
      { kind: "resistor", ref: "R3", from: "+20", to: "A21", label: "R3", valueKey: "r1" },
      { kind: "capacitor", ref: "C1", from: "A12", to: "-12", label: "C1", valueKey: "c" },
      { kind: "capacitor", ref: "C3", from: "A22", to: "-22", label: "C3", valueKey: "c" },
      { kind: "capacitor", ref: "C2", from: "A13", to: "-13", label: "C2" },
      { kind: "capacitor", ref: "C4", from: "A23", to: "-23", label: "C4" },
      { kind: "resistor", ref: "R5", from: "J12", to: "J16", label: "R5" },
      { kind: "resistor", ref: "R6", from: "J22", to: "J16", label: "R6" }
    ],
    boardWires: [["F11","A12","blue"],["F13","+13","red"],["F10","-10","black"],["F21","A22","blue"],["F23","+23","red"],["F20","-20","black"],["J16","J27","green"]],
    assembly: [
      "Disconnect the 9 V supply. Confirm which breadboard rail segments are internally connected using continuity mode.",
      "Place U1 across the center trench at columns 10–13 and U2 at columns 20–23. Both notches face left; confirm pin 1 before wiring.",
      "Wire each IC’s pin 1 to ground, pin 8 to +9 V, and pin 4 to +9 V.",
      "For U1, join pins 2 and 6. Install R1 from +9 V to pin 7, P1 from pin 7 to pins 2/6, and C1 from pins 2/6 to ground.",
      "Repeat the timing network for U2 using R3, P2, and C3.",
      "Install C2 and C4 from each CONTROL pin 5 to ground, then C6 across the supply rails near the ICs.",
      "Connect U1 pin 3 through R5 and U2 pin 3 through R6. Join only the far ends of R5 and R6 to make MIX.",
      "Connect MIX to P3 lug 3, P3 lug 1 to ground, and the wiper through C5 to the output jack tip. Connect jack sleeve to ground.",
      "Set both pitch pots near mid-position and P3 low. Recheck every power connection before applying current-limited 9 V.",
      "Measure pin 8 to pin 1 on both ICs: expect about 9 V DC. Then connect a powered speaker or audio interface and raise P3 slowly."
    ],
    sources: [
      ["TI NE555P datasheet", "https://www.ti.com/lit/ds/symlink/ne555.pdf"],
      ["NE555P product/package", "https://www.ti.com/product/NE555/part-details/NE555P"],
      ["Bourns PTV09 series datasheet", "https://www.bourns.com/docs/product-datasheets/PTV09.pdf"]
    ]
  },

  opampFuzz: {
    id: "opampFuzz",
    guide: "guides/tl072-diode-fuzz-build-guide.pdf",
    name: "TL072 Diode Fuzz",
    summary: "A single-supply inverting gain stage with a buffered 4.5 V reference, feedback diodes, and RC tone filter.",
    chain: ["fuzz"],
    pinouts: ["TL072CP"],
    color: "#ff795f",
    values: { rin: 10, rf: 470, toneC: 22, diode: "silicon", level: 58 },
    controls: [
      { key: "rin", ref: "R3", label: "Input resistor", unit: "kΩ", min: 1, max: 100, step: 1, audio: { module: 0, key: "rin" } },
      { key: "rf", ref: "R4", label: "Feedback resistor", unit: "kΩ", min: 10, max: 1000, step: 10, audio: { module: 0, key: "rf" } },
      { key: "toneC", ref: "C4", label: "Tone capacitor", unit: "nF", min: 1, max: 220, step: 1, audio: { module: 0, key: "toneC" } },
      { key: "diode", ref: "D1/D2", label: "Clipping diode pair", type: "select", options: [
        { value: "silicon", label: "1N4148 silicon · tighter" },
        { value: "schottky", label: "1N5817 Schottky · STEM stock / softer" },
        { value: "germanium", label: "1N34A germanium · earlier/softer" },
        { value: "led", label: "3 mm red LED · louder/more open" }
      ], audio: { module: 0, key: "diode" } },
      { key: "level", ref: "P1", label: "Output level", unit: "%", min: 5, max: 100, step: 1, audio: { module: 0, key: "level" } }
    ],
    components: [
      { ref: "BB1", kind: "breadboard", name: "BusBoard BB830-style breadboard", value: "830 tie points", qty: 1, cost: 9.50, query: "BusBoard BB830 breadboard", note: "Verify rail continuity first." },
      { ref: "U1", kind: "dip8", name: "Texas Instruments TL072CP", value: "PDIP-8", qty: 1, cost: 0.95, query: "Texas Instruments TL072CP DIP 8", note: "Top view, notch left in this layout." },
      { ref: "R1,R2", kind: "resistor", name: "Bias-divider resistor", value: "100 kΩ, 1/4 W", qty: 2, cost: 0.10, query: "100k metal film resistor quarter watt", note: "Creates about 4.5 V before buffering." },
      { ref: "R3", kind: "resistor", name: "Input resistor", valueKey: "rin", suffix: " kΩ", qty: 1, cost: 0.10, query: "metal film resistor assortment quarter watt", note: "Part of the gain ratio." },
      { ref: "R4", kind: "resistor", name: "Feedback resistor", valueKey: "rf", suffix: " kΩ", qty: 1, cost: 0.10, query: "metal film resistor assortment quarter watt", note: "Gain magnitude ≈ R4/R3 before clipping." },
      { ref: "D1,D2", kind: "diode", name: "Selected clipping diode pair", valueKey: "diode", qty: 2, cost: 0.10, query: "guitar pedal clipping diode assortment 1N4148 1N34A LED", note: "Replace both together. Pin polarity and forward voltage change the clipping sound." },
      { ref: "R5", kind: "resistor", name: "Tone resistor", value: "10 kΩ, 1/4 W", qty: 1, cost: 0.10, query: "10k metal film resistor quarter watt", note: "Forms low-pass filter with C4." },
      { ref: "C4", kind: "capacitor", name: "Film tone capacitor", valueKey: "toneC", suffix: " nF", qty: 1, cost: 0.25, query: "film capacitor assortment 50V", note: "Non-polarized." },
      { ref: "C1", kind: "electrolytic", name: "Bias reservoir capacitor", value: "10 µF, 25 V", qty: 1, cost: 0.20, query: "10uF 25V electrolytic capacitor", note: "Positive lead faces VBIAS." },
      { ref: "C2", kind: "capacitor", name: "Input coupling capacitor", value: "100 nF film", qty: 1, cost: 0.25, query: "100nF film capacitor", note: "Blocks source DC." },
      { ref: "C3", kind: "electrolytic", name: "Output coupling capacitor", value: "1 µF, 25 V", qty: 1, cost: 0.20, query: "1uF 25V electrolytic capacitor", note: "Positive lead faces P1 wiper." },
      { ref: "C5", kind: "capacitor", name: "Supply bypass capacitor", value: "100 nF ceramic", qty: 1, cost: 0.12, query: "100nF ceramic capacitor", note: "Close to U1 pins 8 and 4." },
      { ref: "P1", kind: "pot", name: "Bourns PTV09A-4020F-B104", value: "100 kΩ linear", qty: 1, cost: 1.65, query: "Bourns PTV09A 100k linear potentiometer", note: "Terminal 2 is the wiper; output level control." },
      { ref: "J1,J2", kind: "jack", name: "6.35 mm mono audio jack", value: "Panel mount", qty: 2, cost: 1.10, query: "quarter inch mono audio jack panel mount", note: "Tip signal, sleeve ground." },
      { ref: "PS1", kind: "supply", name: "Regulated DC supply", value: "9 V, current-limited", qty: 1, cost: 9.50, query: "9V regulated guitar pedal power supply", note: "Center polarity must match your connector." }
    ],
    connections: [
      ["POWER", "+9V rail", "U1 V+", "pin 8 · E12", "red", "TL072 supply"],
      ["GND", "GND rail", "U1 V−", "pin 4 · F15", "black", "Single-supply ground"],
      ["VBIAS", "+9V", "R1 100 kΩ", "VBIAS junction", "red", "Divider top"],
      ["VBIAS", "VBIAS junction", "R2 100 kΩ", "GND", "black", "Divider bottom"],
      ["VBIAS", "VBIAS junction", "C1 positive", "C1 negative to GND", "black", "10 µF polarized"],
      ["VREF", "VBIAS", "U1B +IN", "pin 5 · E15", "purple", "Buffer input"],
      ["VREF", "U1B OUT", "pin 7 · E13", "U1B −IN pin 6 · E14", "purple", "Voltage follower"],
      ["VREF", "U1B OUT", "pin 7 · E13", "U1A +IN pin 3 · F14", "purple", "Signal reference"],
      ["INPUT", "J1 tip", "C2", "R3 then U1A −IN pin 2 · F13", "blue", "Input coupling"],
      ["GND", "J1 sleeve", "GND rail", "shared ground", "black", "Input ground"],
      ["FEEDBACK", "U1A OUT", "pin 1 · F12", "R4 then U1A −IN pin 2", "orange", "Sets closed-loop gain"],
      ["CLIP+", "U1A OUT", "D1 anode", "D1 cathode to U1A −IN", "yellow", "Band toward pin 2"],
      ["CLIP−", "U1A −IN", "D2 anode", "D2 cathode to U1A OUT", "yellow", "Opposite D1"],
      ["TONE", "U1A OUT", "R5 10 kΩ", "TONE node", "green", "Series tone resistor"],
      ["TONE", "TONE node", "C4", "GND", "black", "Low-pass capacitor"],
      ["LEVEL", "TONE node", "P1 lug 3", "level input", "green", "Output pot"],
      ["GND", "P1 lug 1", "GND rail", "shared ground", "black", "Level return"],
      ["OUTPUT", "P1 wiper lug 2", "C3 positive", "C3 negative to J2 tip", "green", "DC blocking"],
      ["GND", "J2 sleeve", "GND rail", "shared ground", "black", "Output ground"],
      ["DECOUPLE", "+9V", "C5", "GND", "black", "100 nF at U1"]
    ],
    placements: [
      { kind: "dip8", ref: "U1", col: 12, label: "TL072CP" },
      { kind: "resistor", ref: "R1", from: "+5", to: "A5", label: "100k" },
      { kind: "resistor", ref: "R2", from: "A5", to: "-5", label: "100k" },
      { kind: "electrolytic", ref: "C1", from: "B5", to: "-6", label: "10µF" },
      { kind: "resistor", ref: "R3", from: "J7", to: "J13", label: "Rin", valueKey: "rin" },
      { kind: "resistor", ref: "R4", from: "H12", to: "H13", label: "Rf", valueKey: "rf" },
      { kind: "diode", ref: "D1", from: "G12", to: "G13", label: "clip", valueKey: "diode" },
      { kind: "diode", ref: "D2", from: "I13", to: "I12", label: "clip", valueKey: "diode" },
      { kind: "resistor", ref: "R5", from: "J12", to: "J20", label: "10k" },
      { kind: "capacitor", ref: "C4", from: "I20", to: "-20", label: "Tone", valueKey: "toneC" }
    ],
    boardWires: [["E12","+12","red"],["F15","-15","black"],["A5","A15","purple"],["E13","E14","purple"],["E13","F14","purple"],["J20","J25","green"]],
    assembly: [
      "Disconnect power and map the breadboard rails with continuity mode. Place U1 across the center trench at columns 12–15, notch left.",
      "Connect U1 pin 8 to +9 V and pin 4 to ground. Install C5 directly between those supply nets near U1.",
      "Build VBIAS with R1 from +9 V to the junction and R2 from the junction to ground. Add C1 with positive to VBIAS and negative to ground.",
      "Connect VBIAS to U1 pin 5. Join pins 6 and 7 to configure U1B as a buffer; pin 7 is now VREF.",
      "Connect VREF from pin 7 to U1A pin 3. With power temporarily applied, pin 7 should measure about 4.5 V relative to ground. Remove power again.",
      "Connect J1 tip through C2 and R3 to U1 pin 2. Connect J1 sleeve to ground.",
      "Install R4 from pin 1 to pin 2. Install D1 and D2 antiparallel across R4, checking both cathode bands carefully.",
      "Connect pin 1 through R5 to TONE, then C4 from TONE to ground. Connect TONE to P1 lug 3 and P1 lug 1 to ground.",
      "Connect the P1 wiper to C3 positive, C3 negative to J2 tip, and J2 sleeve to ground.",
      "Set P1 low. Recheck U1 orientation, diode directions, and electrolytic polarity before applying current-limited 9 V and connecting a powered audio input."
    ],
    sources: [
      ["TI TL072 datasheet/product", "https://www.ti.com/product/TL072"],
      ["TI TL072CP PDIP-8 package", "https://www.ti.com/product/TL072/part-details/TL072CP"],
      ["onsemi 1N4148 family", "https://www.onsemi.com/pdf/datasheet/1n914-d.pdf"],
      ["Bourns PTV09 series datasheet", "https://www.bourns.com/docs/product-datasheets/PTV09.pdf"]
    ]
  },

  glitchClock: {
    id: "glitchClock",
    guide: "guides/40106-glitch-clock-build-guide.pdf",
    name: "40106 Glitch Clock",
    summary: "A CD40106BE Schmitt-trigger RC oscillator producing a sharp, adjustable pulse tone.",
    chain: ["glitch"],
    pinouts: ["CD40106BE"],
    color: "#d7ff3f",
    values: { clockR: 47, clockC: 0.1, depth: 76 },
    controls: [
      { key: "clockR", ref: "P1", label: "Clock resistance", unit: "kΩ", min: 1, max: 500, step: 1, audio: { module: 0, key: "clockR" } },
      { key: "clockC", ref: "C1", label: "Clock capacitance", unit: "µF", min: 0.01, max: 1, step: 0.01, audio: { module: 0, key: "clockC" } },
      { key: "depth", ref: "P2", label: "Output level / glitch depth", unit: "%", min: 0, max: 100, step: 1, audio: { module: 0, key: "depth" } }
    ],
    components: [
      { ref: "BB1", kind: "breadboard", name: "BusBoard BB830-style breadboard", value: "830 tie points", qty: 1, cost: 9.50, query: "BusBoard BB830 breadboard", note: "Verify rail continuity first." },
      { ref: "U1", kind: "dip14", name: "Texas Instruments CD40106BE", value: "PDIP-14", qty: 1, cost: 0.85, query: "Texas Instruments CD40106BE DIP 14", note: "Top view, notch left in this layout." },
      { ref: "P1", kind: "pot", name: "Bourns PTV09A-4020F-B504", value: "500 kΩ linear", qty: 1, cost: 1.75, query: "Bourns PTV09A 500k linear potentiometer", note: "Tie terminal 2 wiper to one outer terminal; R1 protects the minimum setting." },
      { ref: "R1", kind: "resistor", name: "Minimum timing resistor", value: "1 kΩ, 1/4 W", qty: 1, cost: 0.10, query: "1k metal film resistor quarter watt", note: "Limits current at minimum P1 setting." },
      { ref: "R2", kind: "resistor", name: "Output resistor", value: "10 kΩ, 1/4 W", qty: 1, cost: 0.10, query: "10k metal film resistor quarter watt", note: "Isolates the logic output." },
      { ref: "C1", kind: "capacitor", name: "Film timing capacitor", valueKey: "clockC", suffix: " µF", qty: 1, cost: 0.25, query: "film capacitor assortment 50V", note: "Non-polarized." },
      { ref: "C2", kind: "electrolytic", name: "Output coupling capacitor", value: "1 µF, 25 V", qty: 1, cost: 0.20, query: "1uF 25V electrolytic capacitor", note: "Positive lead faces R2." },
      { ref: "C3", kind: "capacitor", name: "Supply bypass capacitor", value: "100 nF ceramic", qty: 1, cost: 0.12, query: "100nF ceramic capacitor", note: "Place at pins 14 and 7." },
      { ref: "P2", kind: "pot", name: "Bourns PTV09A-4020F-B104", value: "100 kΩ linear", qty: 1, cost: 1.65, query: "Bourns PTV09A 100k linear potentiometer", note: "Terminal 2 is the wiper; output level." },
      { ref: "J1", kind: "jack", name: "6.35 mm mono output jack", value: "Panel mount", qty: 1, cost: 1.10, query: "quarter inch mono audio jack panel mount", note: "Tip signal, sleeve ground." },
      { ref: "PS1", kind: "supply", name: "Regulated DC supply", value: "9 V, current-limited", qty: 1, cost: 9.50, query: "9V regulated guitar pedal power supply", note: "3–12 V is within this lesson boundary; calculations assume 9 V." }
    ],
    connections: [
      ["POWER", "+9V rail", "U1 VDD", "pin 14 · E10", "red", "Supply"],
      ["GND", "GND rail", "U1 VSS", "pin 7 · F16", "black", "Ground"],
      ["CLOCK", "U1A output", "pin 2 · F11", "R1 + P1 then U1A input pin 1 · F10", "blue", "Feedback timing path"],
      ["CLOCK", "U1A input", "pin 1 · F10", "C1 then GND", "black", "Timing capacitor"],
      ["UNUSED", "U1 inputs 3,5,9,11,13", "pins F12,F14,E15,E13,E11", "GND", "black", "Never leave CMOS inputs floating"],
      ["OUTPUT", "U1A output", "pin 2 · F11", "R2 10 kΩ", "yellow", "Output isolation"],
      ["OUTPUT", "R2", "C2 positive", "C2 negative to P2 lug 3", "green", "DC blocking"],
      ["GND", "P2 lug 1", "GND rail", "shared ground", "black", "Level return"],
      ["OUTPUT", "P2 wiper lug 2", "J1 tip", "line output", "green", "To powered speaker/interface"],
      ["GND", "J1 sleeve", "GND rail", "shared ground", "black", "Output ground"],
      ["DECOUPLE", "U1 pin 14", "C3", "U1 pin 7", "black", "100 nF close to package"]
    ],
    placements: [
      { kind: "dip14", ref: "U1", col: 10, label: "CD40106BE" },
      { kind: "resistor", ref: "R1", from: "J11", to: "J20", label: "1k" },
      { kind: "capacitor", ref: "C1", from: "J10", to: "-10", label: "C1", valueKey: "clockC" },
      { kind: "resistor", ref: "R2", from: "H11", to: "H24", label: "10k" },
      { kind: "capacitor", ref: "C3", from: "+10", to: "-16", label: "100n" }
    ],
    boardWires: [["E10","+10","red"],["F16","-16","black"],["F12","-12","black"],["F14","-14","black"],["E15","-15","black"],["E13","-13","black"],["E11","-11","black"],["J20","J10","blue"],["H24","J27","green"]],
    assembly: [
      "Disconnect power and verify breadboard rail continuity. Place U1 across the center trench at columns 10–16, notch left.",
      "Connect U1 pin 14 to +9 V and pin 7 to ground. Install C3 close to those pins.",
      "Connect U1 pin 2 through R1 and P1 back to pin 1. Tie the P1 wiper to the outer lug used in this path.",
      "Connect C1 from pin 1 to ground. This RC path makes the Schmitt inverter repeatedly switch.",
      "Tie every unused inverter input—pins 3, 5, 9, 11, and 13—to ground. Leave their outputs unconnected.",
      "Connect pin 2 through R2 and then C2 to P2 lug 3. C2 positive faces R2.",
      "Connect P2 lug 1 to ground, its wiper to J1 tip, and J1 sleeve to ground.",
      "Set P1 near maximum resistance and P2 low. Recheck pins 14 and 7 before applying current-limited 9 V.",
      "Measure pin 14 to pin 7: expect about 9 V DC. Connect a powered audio input and raise P2 slowly; change P1 to sweep pulse rate."
    ],
    sources: [
      ["TI CD40106B datasheet", "https://www.ti.com/lit/ds/symlink/cd40106b.pdf"],
      ["TI CD40106BE PDIP-14 package", "https://www.ti.com/product/CD40106B/part-details/CD40106BE"],
      ["Bourns PTV09 series datasheet", "https://www.bourns.com/docs/product-datasheets/PTV09.pdf"]
    ]
  }
};
