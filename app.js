"use strict";

const COLORS = {
  oscillator: "#71c7ff",
  fuzz: "#ff795f",
  overdrive: "#f08bc8",
  distortion: "#f8bd4b",
  octave: "#bb91ff",
  delay: "#55d7a1",
  glitch: "#f3f4e9",
  ladder: "#73d0b4",
  korgfilter: "#f2d15f",
  brute: "#ef856f"
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
      { key: "r2b", label: "Second timer resistor R2B", unit: "kΩ", min: 1, max: 100, step: 1, value: 33, role: "Sets the independent pitch of the second NE555 voice." },
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
      { key: "diode", label: "Clipping material", type: "select", value: "germanium", options: [{ value: "germanium", label: "1N34A germanium · soft / early" }, { value: "schottky", label: "1N5817 Schottky · STEM stock" }, { value: "silicon", label: "1N4148 silicon · tighter" }, { value: "led", label: "3 mm LED · loud / open" }], role: "Different forward-voltage models change when clipping begins." },
      { key: "transistor", label: "Transistor model", type: "select", value: "2n3904", options: [{ value: "2n3904", label: "onsemi 2N3904 · general purpose" }, { value: "2n5088", label: "onsemi 2N5088 · higher gain" }], role: "The browser model changes gain character. Both selections require verified TO-92 E-B-C orientation before a physical swap." },
      { key: "level", label: "Output level", unit: "%", min: 5, max: 100, step: 1, value: 58, role: "Attenuates the processed output after clipping." }
    ],
    bom: [
      ["NPN transistor pair (2N3904 or 2N5088)", 2, 0.22, "2N3904 2N5088 transistor TO-92"],
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
  },
  ladder: {
    name: "Moog-style Ladder",
    shortName: "LADR",
    description: "A behavioral four-pole low-pass response inspired by classic ladder-filter signal flow; not a transistor-level Moog circuit simulation.",
    color: COLORS.ladder,
    params: [
      { key: "cutoff", label: "Cutoff frequency", unit: "Hz", min: 40, max: 12000, step: 10, value: 1200, role: "Lowers or raises the frequency above which harmonics are attenuated." },
      { key: "resonance", label: "Resonance", unit: "%", min: 0, max: 95, step: 1, value: 38, role: "Emphasizes frequencies near cutoff; high settings can ring." },
      { key: "drive", label: "Input drive", unit: "%", min: 0, max: 100, step: 1, value: 30, role: "Adds a soft nonlinear stage before the filter." },
      { key: "mix", label: "Wet mix", unit: "%", min: 0, max: 100, step: 1, value: 100, role: "Blends filtered and direct signal." }
    ],
    bom: [["Educational four-pole filter model",1,0,"official Werkstatt schematic reference; not a construction BOM"]]
  },
  korgfilter: {
    name: "Korg monotron-style VCF",
    shortName: "K-VCF",
    description: "A resonant behavioral VCF informed by Korg's public monotron signal path; it does not reproduce the copyrighted schematic.",
    color: COLORS.korgfilter,
    params: [
      { key: "cutoff", label: "Cutoff frequency", unit: "Hz", min: 40, max: 12000, step: 10, value: 1800, role: "Sets the main spectral boundary." },
      { key: "resonance", label: "Peak / resonance", unit: "%", min: 0, max: 96, step: 1, value: 55, role: "Raises the level around cutoff." },
      { key: "mode", label: "Filter mode", type: "select", value: "lowpass", options: [{value:"lowpass",label:"Low-pass"},{value:"highpass",label:"High-pass"}], role: "Selects which side of the cutoff is retained." },
      { key: "mix", label: "Wet mix", unit: "%", min: 0, max: 100, step: 1, value: 100, role: "Blends filtered and direct signal." }
    ],
    bom: [["Educational resonant VCF model",1,0,"Korg public schematic reference; not a construction BOM"]]
  },
  brute: {
    name: "Arturia-style Steiner Filter",
    shortName: "BRUTE",
    description: "A behavioral multimode filter and feedback-drive stage based on the documented MicroBrute architecture, not an Arturia schematic.",
    color: COLORS.brute,
    params: [
      { key: "cutoff", label: "Cutoff frequency", unit: "Hz", min: 40, max: 12000, step: 10, value: 2100, role: "Sets the multimode filter corner." },
      { key: "resonance", label: "Resonance", unit: "%", min: 0, max: 95, step: 1, value: 42, role: "Emphasizes the cutoff region." },
      { key: "mode", label: "Filter mode", type: "select", value: "lowpass", options: [{value:"lowpass",label:"Low-pass"},{value:"bandpass",label:"Band-pass"},{value:"highpass",label:"High-pass"}], role: "Matches the documented low-, band-, and high-pass architecture." },
      { key: "brute", label: "Feedback drive", unit: "%", min: 0, max: 100, step: 1, value: 35, role: "Models the increasing saturation of a feedback-drive control." }
    ],
    bom: [["Educational multimode filter model",1,0,"Arturia manual architecture reference; no construction schematic"]]
  }
};

const EFFECT_CIRCUITS = [
  {id:"effect-oscillator",moduleType:"oscillator",maker:"Studio circuit",name:"NE555 oscillator",status:"Calculated astable teaching circuit",blocks:["DC supply","R1 + pitch pot","Timing capacitor","NE555 thresholds","Square output","Level mix"]},
  {id:"effect-fuzz",moduleType:"fuzz",maker:"Studio circuit",name:"Transistor / diode fuzz",status:"Interactive behavioral circuit study",blocks:["Input coupling","Gain stage","Clipping diodes","RC tone","Level"]},
  {id:"effect-overdrive",moduleType:"overdrive",maker:"Studio circuit",name:"Soft-clipping overdrive",status:"Interactive behavioral circuit study",blocks:["Input high-pass","Op-amp gain","Feedback clipping","Wet / dry mix","Output"]},
  {id:"effect-distortion",moduleType:"distortion",maker:"Studio circuit",name:"Hard-clipping distortion",status:"Interactive behavioral circuit study",blocks:["Input","Gain stage","Diode clipper","RC low-pass","Output"]},
  {id:"effect-octave",moduleType:"octave",maker:"Studio circuit",name:"Full-wave octave",status:"Interactive behavioral circuit study",blocks:["Input coupling","Precision rectifier","Full-wave sum","DC block","Blend"]},
  {id:"effect-delay",moduleType:"delay",maker:"Studio circuit",name:"Clocked delay",status:"Timing and feedback teaching model",blocks:["Input buffer","Clock","Delay memory","Feedback path","Wet / dry mix"]},
  {id:"effect-glitch",moduleType:"glitch",maker:"Studio circuit",name:"40106 glitch gate",status:"Calculated Schmitt RC teaching circuit",blocks:["RC clock","Schmitt trigger","Pulse gate","Bit reduction","Mix"]},
  {id:"effect-ladder",moduleType:"ladder",maker:"Studio circuit",name:"Four-pole ladder behavior",status:"Behavioral filter study · not Moog transistor schematic",blocks:["Input drive","Pole 1","Pole 2","Pole 3","Pole 4","Resonance feedback"]},
  {id:"effect-korgfilter",moduleType:"korgfilter",maker:"Studio circuit",name:"Korg-style resonant VCF",status:"Behavioral filter study · official source linked separately",blocks:["Input","Drive","Two-pole VCF","Resonance","Wet / dry"]},
  {id:"effect-brute",moduleType:"brute",maker:"Studio circuit",name:"Steiner-style multimode filter",status:"Behavioral filter study · official architecture reference",blocks:["Input","Mode selector","Multimode VCF","Feedback drive","Output"]}
];

const BASE_BOM = [
  ["Solderless breadboard, full size", 1, 8.50, "full size solderless breadboard"],
  ["Breadboard jumper wire kit", 1, 6.50, "breadboard jumper wire kit"],
  ["6.35 mm mono audio jack", 2, 1.10, "quarter inch mono audio jack panel mount"],
  ["9 V regulated DC adapter", 1, 9.50, "9V regulated guitar pedal power supply center negative"],
  ["100 nF ceramic bypass capacitor", 2, 0.12, "100nF ceramic capacitor"],
  ["10 µF electrolytic capacitor, 25 V", 2, 0.18, "10uF 25V electrolytic capacitor"]
];

const SYNTH_REFERENCES = [
  { id:"ne555-oscillator", maker:"TI", name:"NE555 astable oscillator", status:"Official IC datasheet and calculated teaching circuit", source:"https://www.ti.com/lit/ds/symlink/ne555.pdf", blocks:["5-12 V DC","R1 charge path","R2 charge/discharge","Timing capacitor","NE555 threshold + discharge","Square-wave output"], note:"This functional circuit map follows the TI NE555 astable relationship. Exact breadboard construction remains available in the Oscillator circuit folder." },
  { id:"moog-werkstatt", maker:"Moog", name:"Werkstatt-01", status:"Manufacturer-published schematic", source:"https://api.moogmusic.com/sites/default/files/2020-11/Werkstatt_01_Manual_2020.pdf", blocks:["Keyboard CV / Gate","VCO","4-pole ladder VCF","VCA","LFO / EG","Audio out"], note:"Moog's official manual includes a schematic under its download agreement. This app shows an educational signal-flow summary and links to the original; it does not reproduce the schematic." },
  { id:"korg-monotron", maker:"Korg", name:"monotron", status:"Manufacturer-published schematic", source:"https://www.korg.com/us/support/download/others/0/311/1893/", blocks:["Ribbon CV / Gate","VCO","Resonant VCF","VCA","Headphone amp"], note:"Korg officially publishes the monotron schematic with license and warranty conditions. Open the source to view the authentic drawing." },
  { id:"korg-monotron-delay", maker:"Korg", name:"monotron DELAY", status:"Manufacturer-published schematic", source:"https://www.korg.com/us/support/download/product/0/116/", blocks:["Ribbon keyboard","VCO","MS-20-style VCF","LFO","Analog delay","Audio out"], note:"Korg publishes the complete monotron DELAY schematic. The app separates its oscillator, filter, LFO, delay, and output blocks for study without copying the protected drawing." },
  { id:"korg-monotron-duo", maker:"Korg", name:"monotron DUO", status:"Manufacturer-published schematic", source:"https://www.korg.com/download/global/monotron_duo_schematic/monotron_DUO_sch.pdf", blocks:["Ribbon keyboard","VCO 1","VCO 2 / X-MOD","MS-20-style VCF","VCA","Audio out"], note:"The official public-release schematic documents two oscillators, cross modulation, filter, amplifier, and output stages. Use Korg's source for exact parts and connections." },
  { id:"moog-matriarch", maker:"Moog", name:"Matriarch stereo delay", status:"Official architecture and operating manual", source:"https://api.moogmusic.com/sites/default/files/2020-09/Matriarch%20Dark%20Manual.pdf", blocks:["Four VCOs","Mixer","Stereo ladder VCF","Dual VCA","Dual BBD stereo delay","Main outputs"], note:"Moog documents two BBD-based analog delays after the VCAs, with time, spacing, feedback, mix, and clock synchronization. This is a signal-flow reference, not a reproduced service schematic." },
  { id:"arturia-microbrute", maker:"Arturia", name:"MicroBrute", status:"Official architecture manual · no public construction schematic used", source:"https://downloads.arturia.com/products/microbrute/manual/MicroBrute_Manual_EN.pdf", blocks:["VCO + wave shapers","Oscillator mixer","Steiner-Parker VCF","Brute feedback","VCA","ADSR / LFO / sequencer"], note:"The official manual documents a 100% analog voice path, multimode filter, modulation matrix, MIDI and 64-step sequencing. The app models those blocks behaviorally." },
  { id:"yamaha-modx", maker:"Yamaha", name:"MODX / MODX M", status:"Official MIDI and signal-flow manuals · digital architecture", source:"https://usa.yamaha.com/products/music_production/synthesizers/modx/downloads.html", blocks:["Keyboard / MIDI in","Arpeggiator","AWM2 / FM-X / AN-X engines","Motion sequencer","Effects","Audio / MIDI out"], note:"Yamaha documents MIDI clock, arpeggiator, tone-generator and sequencer routing. This is an architecture reference, not a service schematic." },
  { id:"casio-mzx", maker:"Casio", name:"MZ-X series", status:"Official user/MIDI documentation · digital architecture", source:"https://support.casio.com/en/support/download.php?cid=008&pid=1209", blocks:["Keys / pads / MIDI","Pattern recorder","Tone generator","Mixer","DSP effects","Audio / MIDI out"], note:"Casio publishes operating, pattern-recorder and MIDI documentation. No manufacturer construction schematic is represented here." }
];

let nextId = 1;
const state = {
  modules: [],
  selectedId: null,
  audioOn: false,
  audioStarting: false,
  source: "demo",
  synthProfile: "osc-555",
  synthWaveform: "square",
  voiceParams: {cutoff:9000,resonance:1,attack:2,release:12,fmAmount:0,subMix:0},
  arpMode: "pattern",
  arpOctave: 0,
  globalOctave: 0,
  kaossX: 0.5,
  kaossY: 0.5,
  midiBpm: 120,
  stepDivision: 4,
  patternDuration: 0,
  startDelay: "0",
  sequencerBar: 0,
  sequencerStep: 0,
  sequencerRunning: false,
  keyboardNote: null,
  selectedSynthReference: "effect-oscillator",
  effectCircuitValues: Object.fromEntries(Object.keys(MODULES).map((type)=>[type,Object.fromEntries(MODULES[type].params.map((param)=>[param.key,param.value]))])),
  sequencePattern: [48,null,52,null,55,null,59,null,60,null,55,null,52,null,48,50,52,55,57,55,52,50,null,null,null,null,null,null,null,null,null,null],
  lastMidiMessage: "MIDI: waiting · channel 1",
  performance: { repeat:false, freeze:false, mute:false },
  midiLearnMode: false,
  activeMacro: null,
  macros: Array.from({length:8},(_,index)=>({name:`Macro ${index+1}`,target:null,moduleId:null,paramKey:null,midiCc:null,value:64})),
  prices: {},
  hardwarePreset: "dual555",
  hardwareLoadedId: null,
  constructionView: "breadboard",
  hardwareSelectedKey: "r1",
  hardwareSelectedRef: "R1/R3",
  hardwareSelectedIndex: 2,
  hardwareHistory: [],
  hardwareRedo: [],
  partsFilter: "",
  workspaceZoom: 100,
  plannerController: "uno-r4",
  selectedDeviceIds: [],
  deviceSearch: "",
  deviceCategory: "All",
  deviceSubcategory: "All",
  hardwarePartSubcategory: "All",
  catalogPickerMode: "",
  catalogPickerTarget: "",
  catalogPickerSearch: "",
  catalogPickerCategory: "All",
  catalogPickerSubcategory: "All",
  hardwareBaseCount: 0,
  selectedWireIndex: -1,
  knobStyle: "pointer",
  helpTopic: "mixing",
  helpPage: 0,
  knobDrag: null,
  suppressKnobClickUntil: 0,
  assemblyStep: 0,
  assemblyCompleted: {}
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
  limiter: null,
  sequenceStartTimer: null,
  sequenceTimer: null,
  sequenceStopTimer: null,
  sequencerVoice: null,
  midiAccess: null
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const ENGINEERING_HELP = {
  mixing: [
    { title: "Mixing starts with order", body: "Each stage processes the output of the stage before it. Clipping before a filter creates harmonics that the filter can remove; filtering before clipping changes which frequencies generate those harmonics.", formula: "source → gain/clipping → tone → level" },
    { title: "Avoid passive output fights", body: "Never tie two active outputs directly together. The Dual 555 uses one 10 kΩ mixing resistor per timer so neither output forces current into the other.", formula: "I between outputs ≈ ΔV / (R5 + R6)" },
    { title: "Gain and headroom", body: "Gain makes a signal larger; headroom is the remaining voltage swing before the circuit clips. Raising supply voltage can increase headroom, but only within every component rating.", formula: "headroom depends on supply and output-stage limits" },
    { title: "One change at a time", body: "Predict, change one component, listen, and compare the calculation. This separates the effect of resistance, capacitance, clipping threshold, and stage order.", formula: "prediction → change → observation → explanation" }
  ],
  circuit: [
    { title: "Verified circuit folders", body: "Oscillator and distortion folders contain only the three circuits with audited connection tables, package pinouts, and browser sound models. Selecting a circuit replaces the full physical plan.", formula: "circuit selection changes wiring + BOM + math + sound" },
    { title: "Simulation boundary", body: "The audio is a behavioral model driven by the displayed equations. It is not SPICE and it is not a physical measurement. Real parts add tolerance, noise, loading, and bandwidth limits.", formula: "calculated ≠ simulated ≠ measured" }
  ],
  dip8: [
    { title: "NE555 and TL072 orientation", body: "The notch and pin-1 marker define orientation. Pin numbering runs counterclockwise in the top view. Confirm the exact printed part number before wiring because two 8-pin packages can have completely different pin functions.", formula: "top view: pin 1 begins beside the notch" },
    { title: "NE555 sound physics", body: "In astable mode the timing capacitor repeatedly charges toward 2/3 VCC and discharges toward 1/3 VCC. Larger R or C means a longer period and lower pitch.", formula: "f ≈ 1.44 / ((RA + 2RB)C)" },
    { title: "TL072 sound physics", body: "The feedback-to-input resistance ratio sets ideal inverting gain. Antiparallel diodes in the feedback path reduce gain when their forward threshold is reached, rounding or clipping the waveform.", formula: "|A| ≈ RF / RIN" }
  ],
  dip14: [
    { title: "CD40106 Schmitt oscillator", body: "A Schmitt inverter has two switching thresholds. The resistor feeds the output back to the input while the capacitor charges and discharges between those thresholds.", formula: "f ≈ 1 / (2.2RC), approximate" },
    { title: "Unused CMOS inputs", body: "Unused CD40106 inputs must be tied to a defined logic level. Floating CMOS inputs can oscillate, draw extra current, and inject noise.", formula: "unused input → GND or VDD; output left open" }
  ],
  resistor: [
    { title: "Read the five color bands", body: "The first three bands are significant digits, the fourth is the multiplier, and the fifth is tolerance. Brown tolerance means ±1%. The illustration updates from the installed resistance.", formula: "digits × 10^multiplier Ω ± tolerance" },
    { title: "Resistance changes sound", body: "A timing resistor changes oscillator pitch, a feedback resistor changes gain, and a resistor paired with a capacitor changes a filter corner. Location determines the audible job.", formula: "fc = 1 / (2πRC)" },
    { title: "Power check", body: "Resistance also dissipates heat. For these low-voltage lessons, verify P = I²R or V²/R and choose a resistor rating with margin before physical construction.", formula: "P = I²R = V²/R" }
  ],
  capacitor: [
    { title: "Capacitance stores charge", body: "A larger capacitor changes voltage more slowly. In timing circuits that lowers frequency; in coupling circuits it passes lower frequencies more effectively.", formula: "Q = CV; τ = RC" },
    { title: "Film and ceramic parts", body: "These are normally non-polarized. Film capacitors are useful for stable audio timing and filtering; small ceramic capacitors are common for supply bypassing.", formula: "fc = 1 / (2πRC)" }
  ],
  electrolytic: [
    { title: "Electrolytic polarity", body: "The stripe normally marks the negative terminal. Reverse polarity can damage the part. Disconnect power and confirm which node is more positive before installation.", formula: "rated voltage must exceed applied voltage" },
    { title: "Audio coupling", body: "A series output capacitor blocks DC while passing audio. Its value and the following input resistance form a high-pass filter.", formula: "fc = 1 / (2πRloadC)" }
  ],
  pot: [
    { title: "Potentiometer anatomy", body: "The center terminal is the wiper. Used as a divider, all three lugs set a variable voltage. Used as a rheostat, the wiper is tied to one outer lug for safer variable resistance.", formula: "Rwiper changes with shaft position" },
    { title: "Knob taper matters", body: "Linear taper changes resistance evenly with rotation. Audio taper changes level more naturally to human hearing. The verified timing controls use linear parts unless the exact preset says otherwise.", formula: "linear position ≠ perceived loudness" },
    { title: "Choose a knob style", body: "Pointer, skirted, and aluminum choices change the physical control appearance only. The resistance, taper, wiring, and sound calculation remain unchanged.", formula: "appearance only; electrical model unchanged" }
  ],
  diode: [
    { title: "Clipping threshold", body: "A lower forward voltage starts clipping sooner. Schottky and germanium sound more compressed; silicon is tighter; LEDs leave more amplitude before clipping.", formula: "approximately 0.25–0.3 V, 0.7 V, or 1.8 V" },
    { title: "Band marks the cathode", body: "A diode conducts mainly in one direction. Antiparallel pairs clip positive and negative waveform halves. Install both orientations exactly as shown.", formula: "anode →| cathode band" }
  ],
  supply: [
    { title: "Supply voltage changes headroom", body: "A higher supply can increase output swing and loudness before clipping, but it does not automatically change ideal 555 timing because the thresholds scale with VCC.", formula: "555 thresholds ≈ 1/3 VCC and 2/3 VCC" },
    { title: "Stay inside ratings", body: "Use only the listed regulated values. Disconnect power before rewiring, use current limiting, share grounds for connected signals, and verify capacitor voltage ratings and polarity.", formula: "allowed here: 5–12 V DC, circuit dependent" }
  ],
  wire: [
    { title: "Wires define the signal path", body: "A wire should join nodes that are electrically the same. Clicking a wire in this app adds a behavioral sound stage, but does not silently rewrite the audited physical netlist.", formula: "same net → approximately same voltage" }
  ]
};

function renderEngineeringHelp() {
  const pages = ENGINEERING_HELP[state.helpTopic] || ENGINEERING_HELP.mixing;
  state.helpPage = (state.helpPage + pages.length) % pages.length;
  const page = pages[state.helpPage];
  $("#engineering-help-title").textContent = page.title;
  $("#engineering-help-content").innerHTML = `<p>${page.body}</p><code>${page.formula}</code><small>${hardwarePreset().name} · calculated/browser-simulated guidance · not a physical measurement</small>`;
  $("#help-position").textContent = `${state.helpPage + 1} / ${pages.length}`;
  $("#help-previous").disabled = pages.length < 2;
  $("#help-next").disabled = pages.length < 2;
}

function showHelp(topic = "mixing", reset = true) {
  if (!ENGINEERING_HELP[topic]) topic = "mixing";
  if (state.helpTopic !== topic || reset) state.helpPage = 0;
  state.helpTopic = topic;
  $("#engineering-help").hidden = false;
  renderEngineeringHelp();
}

const SEQUENCER_ROWS = [72, 69, 67, 64, 60, 57, 55, 52];
const SYNTH_PROFILES = {
  "osc-555": { wave:"square", cutoff:9000, resonance:1, attack:2, release:12, fmAmount:0, subMix:0, label:"555 pulse oscillator behavioral voice" },
  werkstatt: { wave:"sawtooth", cutoff:1300, resonance:7, attack:9, release:25, sub:true, subMix:28, fmAmount:0, label:"Moog Werkstatt-style behavioral voice" },
  "moog-bass": { wave:"sawtooth", cutoff:680, resonance:12, attack:4, release:90, sub:true, subMix:48, fmAmount:0, label:"Moog ladder bass behavioral voice" },
  monotron: { wave:"sawtooth", cutoff:1900, resonance:10, attack:5, release:35, subMix:0, fmAmount:0, label:"Korg monotron-style behavioral voice" },
  "korg-delay": { wave:"square", cutoff:1350, resonance:14, attack:3, release:115, subMix:0, fmAmount:0, chorus:true, label:"Korg delay dub behavioral voice" },
  microbrute: { wave:"sawtooth", cutoff:2400, resonance:6, attack:4, release:42, sub:true, subMix:22, fmAmount:0, label:"Arturia MicroBrute-style behavioral voice" },
  "yamaha-fm": { wave:"sine", cutoff:6200, resonance:1, attack:2, release:180, fm:true, fmRatio:2, fmAmount:72, subMix:0, label:"Yamaha FM bell behavioral voice" },
  "yamaha-bass": { wave:"sine", cutoff:3200, resonance:2, attack:3, release:65, fm:true, fmRatio:1, fmAmount:38, subMix:0, label:"Yamaha FM bass behavioral voice" },
  "casio-pcm": { wave:"triangle", cutoff:4800, resonance:2, attack:6, release:120, fmAmount:0, subMix:0, chorus:true, label:"Casio PCM-style behavioral voice" }
};

const VOICE_PARAMETERS = [
  {key:"cutoff",label:"Filter cutoff",unit:"Hz",min:80,max:12000,step:10},
  {key:"resonance",label:"Resonance",unit:"Q",min:.1,max:20,step:.1},
  {key:"attack",label:"Attack",unit:"ms",min:1,max:500,step:1},
  {key:"release",label:"Release",unit:"ms",min:5,max:1000,step:1},
  {key:"fmAmount",label:"FM amount",unit:"%",min:0,max:100,step:1},
  {key:"subMix",label:"Sub mix",unit:"%",min:0,max:100,step:1}
];

const PRIMARY_PARAMETERS = {
  oscillator:"r2", fuzz:"rf", overdrive:"drive", distortion:"drive", octave:"blend",
  delay:"clockR2", glitch:"clockR", ladder:"cutoff", korgfilter:"cutoff", brute:"cutoff"
};

function midiToName(note) {
  const names = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  return `${names[note % 12]}${Math.floor(note / 12) - 1}`;
}

function noteNameToMidi(token) {
  const match = String(token).trim().match(/^([A-Ga-g])([#b]?)(-?\d)$/);
  if (!match) return null;
  const base = {C:0,D:2,E:4,F:5,G:7,A:9,B:11}[match[1].toUpperCase()];
  const accidental = match[2] === "#" ? 1 : match[2] === "b" ? -1 : 0;
  return clamp((Number(match[3]) + 1) * 12 + base + accidental, 0, 127);
}

function midiFrequency(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

function patternText(bar = 0) {
  return state.sequencePattern.slice(bar * 16, bar * 16 + 16).map((note) => note == null ? "-" : midiToName(note)).join(" ");
}

function renderSynthKeyboard() {
  const blackPitchClasses = new Set([1,3,6,8,10]);
  let whiteIndex = 0;
  const keys = [];
  for (let note = 48; note <= 71; note += 1) {
    const isBlack = blackPitchClasses.has(note % 12);
    if (isBlack) {
      keys.push(`<button type="button" class="piano-key piano-key-black" style="--key-left:${whiteIndex / 14 * 100}%" data-keyboard-note="${note}" aria-label="Play ${midiToName(note)}"><span>${midiToName(note)}</span></button>`);
    } else {
      keys.push(`<button type="button" class="piano-key piano-key-white" data-keyboard-note="${note}" aria-label="Play ${midiToName(note)}"><span>${midiToName(note)}</span></button>`);
      whiteIndex += 1;
    }
  }
  $("#synth-keyboard").innerHTML = keys.join("");
}

function renderVoiceControls() {
  $("#voice-parameter-knobs").innerHTML = VOICE_PARAMETERS.map((parameter)=>{
    const value=Number(state.voiceParams[parameter.key] ?? parameter.min);
    const angle=-135+(value-parameter.min)/(parameter.max-parameter.min)*270;
    return `<label><span>${parameter.label}</span><button type="button" class="parameter-map-target voice-map-target" data-assign-voice-param="${parameter.key}">Map</button><span class="voice-dial" style="--voice-angle:${angle}deg"><i></i></span><input type="range" min="${parameter.min}" max="${parameter.max}" step="${parameter.step}" value="${value}" data-voice-param="${parameter.key}"><output>${Number(value.toFixed(1))} ${parameter.unit}</output></label>`;
  }).join("");
}

function applySynthProfile(profileId) {
  const profile=SYNTH_PROFILES[profileId];
  state.synthProfile=profileId;
  state.synthWaveform=profile.wave;
  state.voiceParams=Object.fromEntries(VOICE_PARAMETERS.map((parameter)=>[parameter.key,profile[parameter.key] ?? parameter.min]));
  $("#synth-waveform").value=state.synthWaveform;
  renderVoiceControls();
}

function updateVoiceParameter(key,value) {
  const parameter=VOICE_PARAMETERS.find((item)=>item.key===key);
  if(!parameter) return;
  state.voiceParams[key]=clamp(Number(value),parameter.min,parameter.max);
  const voice=audio.sequencerVoice;
  if(voice&&audio.context){
    if(key==="cutoff") voice.filter.frequency.setTargetAtTime(state.voiceParams.cutoff,audio.context.currentTime,.01);
    if(key==="resonance") voice.filter.Q.setTargetAtTime(state.voiceParams.resonance,audio.context.currentTime,.01);
    if(key==="fmAmount"&&voice.modGain) voice.modGain.gain.setTargetAtTime((voice.carrier.frequency.value||110)*state.voiceParams.fmAmount/100,audio.context.currentTime,.01);
    if(key==="subMix"&&voice.subGain) voice.subGain.gain.setTargetAtTime(state.voiceParams.subMix/100,audio.context.currentTime,.01);
  }
  const control=$(`[data-voice-param="${key}"]`);
  if(control){
    const dial=control.closest("label")?.querySelector(".voice-dial");
    const output=control.closest("label")?.querySelector("output");
    if(dial) dial.style.setProperty("--voice-angle",`${-135+(state.voiceParams[key]-parameter.min)/(parameter.max-parameter.min)*270}deg`);
    if(output) output.textContent=`${Number(state.voiceParams[key].toFixed(1))} ${parameter.unit}`;
  }
}

function renderSequencer() {
  const start = state.sequencerBar * 16;
  $("#arp-grid").innerHTML = `<div class="arp-step-numbers"><span></span>${Array.from({length:16},(_,index)=>`<b>${index + 1}</b>`).join("")}</div>${SEQUENCER_ROWS.map((note) => `<div class="arp-note-row" role="row"><span>${midiToName(note)}</span>${Array.from({length:16},(_,index)=>{const patternIndex=start+index;const active=state.sequencePattern[patternIndex]===note;return `<button type="button" role="gridcell" data-pattern-step="${patternIndex}" data-pattern-note="${note}" aria-pressed="${active}" aria-label="${midiToName(note)}, bar ${state.sequencerBar+1}, step ${index+1}"><i></i></button>`;}).join("")}</div>`).join("")}`;
  $$('[data-pattern-bar]').forEach((button)=>button.setAttribute("aria-selected",String(Number(button.dataset.patternBar)===state.sequencerBar)));
  $("#midi-pattern").value = patternText(0);
  $("#midi-pattern-bar-2").value = patternText(1);
  updateSequencerPlayhead();
}

function updateSequencerPlayhead() {
  const localStep = state.sequencerStep % 16;
  const bar = Math.floor(state.sequencerStep / 16);
  $("#sequencer-status").textContent = `${state.sequencerRunning ? "Running" : "Stopped"} · bar ${bar + 1} · step ${localStep + 1}`;
  $("#midi-message").textContent = state.lastMidiMessage;
  $$("#arp-grid [data-pattern-step]").forEach((button) => button.classList.toggle("is-playing", Number(button.dataset.patternStep) === state.sequencerStep));
}

function applyMidiText() {
  const parseBar = (selector) => {
    const notes = $(selector).value.split(/[\s,]+/).filter(Boolean).slice(0,16).map((token) => token === "-" || /^rest$/i.test(token) ? null : noteNameToMidi(token));
    while (notes.length < 16) notes.push(null);
    return notes;
  };
  state.sequencePattern = [...parseBar("#midi-pattern"), ...parseBar("#midi-pattern-bar-2")];
  renderSequencer();
  announce("Two-bar MIDI note pattern applied.");
}

function sequenceNoteForStep(step) {
  const active = state.sequencePattern.filter((note) => note != null);
  if (!active.length) return null;
  let note = null;
  if (state.arpMode === "up") note = [...new Set(active)].sort((a,b)=>a-b)[step % new Set(active).size];
  else if (state.arpMode === "down") note = [...new Set(active)].sort((a,b)=>b-a)[step % new Set(active).size];
  else if (state.arpMode === "random") note = active[Math.floor(Math.random() * active.length)];
  else {
    note = state.sequencePattern[step];
    if (state.arpMode === "glitch" && note != null && Math.random() > .62) note += Math.random() > .5 ? 12 : -12;
  }
  return note == null ? null : clamp(note + (state.arpOctave + state.globalOctave) * 12, 0, 127);
}

function triggerSequenceStep() {
  if (!state.sequencerRunning || !audio.sequencerVoice) return;
  if (state.performance.freeze) return;
  const note = sequenceNoteForStep(state.sequencerStep);
  gateSynthNote(state.performance.mute ? null : note, sequenceIntervalMs() / 1000 * .72, "sequencer");
  updateSequencerPlayhead();
  if (!state.performance.repeat) state.sequencerStep = (state.sequencerStep + 1) % 32;
}

function sequenceIntervalMs() {
  return (60000 / state.midiBpm) / state.stepDivision;
}

function tempoMotionForBpm(bpm) {
  if (bpm < 55) return { mode: "worm", name: "Slow crawl", range: "30–54 BPM" };
  if (bpm < 100) return { mode: "ballad", name: "Ballad couple", range: "55–99 BPM" };
  if (bpm < 150) return { mode: "party", name: "Dance party", range: "100–149 BPM" };
  if (bpm < 190) return { mode: "horse", name: "Running horse", range: "150–189 BPM" };
  return { mode: "eagle", name: "Fast flight", range: "190–300 BPM" };
}

function syncTempoCoach(bpm = state.midiBpm) {
  const safeBpm = clamp(Number(bpm) || state.midiBpm, 30, 300);
  const beatMs = 60000 / safeBpm;
  const station = $("#midi-tempo-station");
  const motion = tempoMotionForBpm(safeBpm);
  if (station) {
    station.style.setProperty("--tempo-beat-ms", `${beatMs}ms`);
    station.style.setProperty("--tempo-turn", `${-135 + ((safeBpm - 30) / 270) * 270}deg`);
    station.classList.remove("tempo-mode-worm","tempo-mode-ballad","tempo-mode-party","tempo-mode-horse","tempo-mode-eagle");
    station.classList.add(`tempo-mode-${motion.mode}`);
  }
  const knob = $("#tempo-knob");
  if (knob) knob.setAttribute("aria-valuenow", String(Math.round(safeBpm)));
  const readout = $("#tempo-motion-label");
  if (readout) readout.textContent = `${Math.round(beatMs)} ms / beat`;
  const name = $("#tempo-motion-name");
  if (name) name.textContent = motion.name;
  const range = $("#tempo-motion-range");
  if (range) range.textContent = motion.range;
}

function setMidiTempo(value, restart = false) {
  state.midiBpm = clamp(Math.round(Number(value) || 120), 30, 300);
  const input = $("#midi-bpm");
  if (input) input.value = state.midiBpm;
  syncTempoCoach(state.midiBpm);
  if (restart && state.sequencerRunning) startSource();
}

function randomizePattern(glitch = false) {
  const density = glitch ? .72 : .48;
  state.sequencePattern = Array.from({length:32},(_,index) => Math.random() < density ? SEQUENCER_ROWS[(index + Math.floor(Math.random() * SEQUENCER_ROWS.length)) % SEQUENCER_ROWS.length] + (glitch && Math.random() > .76 ? 12 : 0) : null);
  renderSequencer();
  announce(glitch ? "Glitch fill generated across two bars." : "Two-bar pattern randomized.");
}

async function startSequencerTransport() {
  primeAudioFromGesture();
  state.source = "sequencer";
  $("#source-select").value = "sequencer";
  await ensureAudio();
  stopSource();
  state.audioOn = true;
  rebuildAudioGraph();
  const delay = state.startDelay === "bars" ? (8 * 60000 / state.midiBpm) : Number(state.startDelay) * 1000;
  $("#sequencer-status").textContent = delay ? `Count-in · ${(delay/1000).toFixed(1)} s` : "Starting";
  window.clearTimeout(audio.sequenceStartTimer);
  audio.sequenceStartTimer = window.setTimeout(startSource, delay);
  syncAudioButtons();
}

async function stopSequencerTransport() {
  stopSource();
  state.audioOn = false;
  if (audio.context) await audio.context.suspend();
  syncAudioButtons();
  updateSequencerPlayhead();
}

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
  return instance;
}

function removeModule(id) {
  const index = state.modules.findIndex((item) => item.id === id);
  if (index < 0) return;
  const [removed] = state.modules.splice(index, 1);
  state.macros.forEach((macro)=>{if(macro.target==="module"&&macro.moduleId===id){macro.target=null;macro.moduleId=null;macro.paramKey=null;}});
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

function nudgeModule(id, direction) {
  if (direction === "left" || direction === "right") return moveModule(id, direction === "left" ? -1 : 1);
  const instance = state.modules.find((item) => item.id === id);
  if (!instance) return;
  const definition = MODULES[instance.type];
  const preferred = ["mix","level","depth","drive","feedback","resonance","brute","blend"];
  const parameter = preferred.map((key) => definition.params.find((item) => item.key === key && item.type !== "select")).find(Boolean)
    || definition.params.find((item) => item.type !== "select");
  if (!parameter) return;
  const span = Number(parameter.max) - Number(parameter.min);
  const change = Math.max(Number(parameter.step) || 1, span / 10) * (direction === "up" ? 1 : -1);
  instance.params[parameter.key] = clamp(Number(instance.params[parameter.key]) + change, Number(parameter.min), Number(parameter.max));
  state.selectedId = id;
  renderStudio();
  rebuildAudioGraph();
  announce(`${definition.name} ${parameter.label.toLowerCase()} ${direction === "up" ? "increased" : "decreased"}.`);
}

function formatValue(param, value) {
  return `${Number.isFinite(Number(value)) && param.type !== "select" ? Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 }) : value}${param.unit ? ` ${param.unit}` : ""}`;
}

function calculateModule(instance) {
  const p = instance.params;
  if (instance.type === "oscillator") {
    const frequency = 1 / (0.693 * ((p.r1 + 2 * p.r2) * 1000) * (p.c * 1e-9));
    const second = 1 / (0.693 * ((p.r1 + 2 * p.r2b) * 1000) * (p.c * 1e-9));
    return {
      title: "Astable timing frequency",
      formula: "T = 0.693(R1 + 2R2)C; f = 1/T",
      substitution: `1 ÷ [0.693 × (${p.r1} kΩ + 2 × ${p.r2} kΩ) × ${p.c} nF]`,
      result: `${frequency.toFixed(1)} Hz${p.voices === "dual" ? ` + ${second.toFixed(1)} Hz second voice` : ""}`,
      why: "Raising either timing resistance or capacitance increases the charge time, so pitch falls. This is a calculated NE555 astable estimate; real tolerances shift it. The audible browser model is limited to 12 kHz.",
      frequency,
      secondFrequency: second
    };
  }
  if (instance.type === "fuzz") {
    const gain = 1 + p.rf / p.rin;
    const cutoff = 1 / (2 * Math.PI * 10000 * p.toneC * 1e-9);
    return {
      title: "Gain and tone estimate",
      formula: "Gain ≈ 1 + Rf ÷ Rin;  fc = 1 ÷ (2πRC)",
      substitution: `1 + ${p.rf} kΩ ÷ ${p.rin} kΩ; R = 10 kΩ, C = ${p.toneC} nF`,
      result: `${gain.toFixed(1)}× gain · ${cutoff.toFixed(0)} Hz tone corner · ${p.transistor === "2n5088" ? "2N5088" : "2N3904"} model`,
      why: "More gain drives the virtual clipper harder. Increasing the tone capacitor lowers the filter corner. The transistor selection changes the behavioral gain character; physical gain varies from part to part, so verify the exact package and pin order."
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
  if (["ladder","korgfilter","brute"].includes(instance.type)) {
    const mode = p.mode || "lowpass";
    const poles = instance.type === "ladder" ? 4 : 2;
    return {
      title: `${poles}-pole behavioral filter response`,
      formula: `fc = ${Number(p.cutoff).toFixed(0)} Hz; slope ≈ ${poles * 6} dB/octave`,
      substitution: `resonance = ${Number(p.resonance).toFixed(0)}% · mode = ${mode}`,
      result: `${Number(p.cutoff).toFixed(0)} Hz ${mode} · ${poles}-pole educational model`,
      why: `${MODULES[instance.type].name} follows the manufacturer-documented signal-flow idea, but Web Audio biquads and waveshaping do not reproduce the original transistor, OTA, or feedback circuit.`
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

function macroAssignmentLabel(macro) {
  if(macro.target==="voice") return `Voice · ${VOICE_PARAMETERS.find((item)=>item.key===macro.paramKey)?.label || macro.paramKey}`;
  const instance = state.modules.find((item)=>item.id===macro.moduleId);
  const definition = instance ? MODULES[instance.type] : null;
  const parameter = definition?.params.find((item)=>item.key===macro.paramKey);
  return instance && parameter ? `${definition.shortName} #${instance.id} · ${parameter.label}` : "Unassigned";
}

function renderMacroPanel() {
  document.body.classList.toggle("midi-learn-mode", state.midiLearnMode);
  $("#midi-learn-toggle").setAttribute("aria-pressed",String(state.midiLearnMode));
  $("#midi-learn-status").textContent = state.midiLearnMode
    ? `${state.activeMacro == null ? "Select a macro" : `Macro ${state.activeMacro+1} armed`} · choose a violet parameter or move a MIDI CC`
    : "Learn mode off";
  $("#macro-knobs").innerHTML = state.macros.map((macro,index)=>{
    const active = state.activeMacro===index;
    const angle = -135 + Number(macro.value) / 127 * 270;
    return `<article class="macro-control${active?" is-armed":""}" data-macro-card="${index}"><button type="button" class="macro-select" data-macro-select="${index}" aria-pressed="${active}"><span>M${index+1}</span><small>${macro.midiCc==null?"CC --":`CC ${macro.midiCc}`}</small></button><label for="macro-${index}"><span class="macro-dial" style="--macro-angle:${angle}deg"><i></i></span><input id="macro-${index}" class="macro-range" type="range" min="0" max="127" value="${macro.value}" data-macro-value="${index}" aria-label="Macro ${index+1}, ${macroAssignmentLabel(macro)}"><strong>${macroAssignmentLabel(macro)}</strong></label></article>`;
  }).join("");
}

function updateMappedModule(moduleId, paramKey, normalizedValue) {
  const instance = state.modules.find((item)=>item.id===moduleId);
  const parameter = instance ? MODULES[instance.type].params.find((item)=>item.key===paramKey) : null;
  if (!instance || !parameter || parameter.type==="select") return;
  const raw = parameter.min + clamp(normalizedValue,0,127) / 127 * (parameter.max-parameter.min);
  const snapped = Math.round(raw / parameter.step) * parameter.step;
  instance.params[paramKey] = clamp(Number(snapped.toFixed(6)),parameter.min,parameter.max);
  renderChain();
  if (state.selectedId===moduleId) renderInspector();
  renderBom();
  rebuildAudioGraph();
}

function setMacroValue(index,value) {
  const macro = state.macros[index];
  if (!macro) return;
  macro.value = clamp(Number(value)||0,0,127);
  if (macro.target==="module"&&macro.moduleId!=null) updateMappedModule(macro.moduleId,macro.paramKey,macro.value);
  if (macro.target==="voice") {
    const parameter=VOICE_PARAMETERS.find((item)=>item.key===macro.paramKey);
    if(parameter) updateVoiceParameter(parameter.key,parameter.min+macro.value/127*(parameter.max-parameter.min));
  }
  const control=$(`[data-macro-value="${index}"]`);
  if(control) control.value=macro.value;
  const dial=control?.closest("label")?.querySelector(".macro-dial");
  if(dial) dial.style.setProperty("--macro-angle",`${-135+macro.value/127*270}deg`);
}

function assignMacroToParameter(moduleId,paramKey) {
  let index = state.activeMacro;
  if (index==null) index = state.macros.findIndex((macro)=>macro.target==null);
  if (index<0) index=0;
  const macro=state.macros[index];
  macro.target="module";
  macro.moduleId=moduleId;
  macro.paramKey=paramKey;
  state.activeMacro=index;
  const instance=state.modules.find((item)=>item.id===moduleId);
  const parameter=instance && MODULES[instance.type].params.find((item)=>item.key===paramKey);
  if (instance && parameter) macro.value=Math.round((Number(instance.params[paramKey])-parameter.min)/(parameter.max-parameter.min)*127);
  renderMacroPanel(); renderChain(); renderInspector();
  announce(`Macro ${index+1} assigned to ${macroAssignmentLabel(macro)}.`);
}

function assignMacroToVoice(paramKey) {
  let index=state.activeMacro;
  if(index==null) index=state.macros.findIndex((macro)=>macro.target==null);
  if(index<0) index=0;
  const macro=state.macros[index];
  const parameter=VOICE_PARAMETERS.find((item)=>item.key===paramKey);
  macro.target="voice"; macro.moduleId=null; macro.paramKey=paramKey;
  macro.value=Math.round((state.voiceParams[paramKey]-parameter.min)/(parameter.max-parameter.min)*127);
  state.activeMacro=index;
  renderMacroPanel(); renderVoiceControls();
  announce(`Macro ${index+1} assigned to ${macroAssignmentLabel(macro)}.`);
}

function handleMidiMessage(event) {
  const [status,controller,value]=event.data;
  if ((status&0xf0)!==0xb0) return;
  if (state.midiLearnMode && state.activeMacro!=null) {
    state.macros[state.activeMacro].midiCc=controller;
    setMacroValue(state.activeMacro,value);
    const ccLabel=$(`[data-macro-select="${state.activeMacro}"] small`);
    if(ccLabel) ccLabel.textContent=`CC ${controller}`;
    announce(`Macro ${state.activeMacro+1} learned MIDI CC ${controller}.`);
    return;
  }
  state.macros.forEach((macro,index)=>{if(macro.midiCc===controller)setMacroValue(index,value);});
}

async function connectMidiLearn() {
  if (!navigator.requestMIDIAccess || audio.midiAccess) return;
  try {
    audio.midiAccess=await navigator.requestMIDIAccess();
    const bind=()=>audio.midiAccess.inputs.forEach((input)=>{input.onmidimessage=handleMidiMessage;});
    bind(); audio.midiAccess.onstatechange=bind;
  } catch (_) { announce("MIDI permission was not granted. On-screen macro assignment still works."); }
}

function toggleMidiLearn(force) {
  state.midiLearnMode=typeof force==="boolean"?force:!state.midiLearnMode;
  if (!state.midiLearnMode) state.activeMacro=null;
  else connectMidiLearn();
  renderMacroPanel(); renderChain(); renderInspector();
  announce(state.midiLearnMode?"MIDI learn on. Select a macro, then a violet parameter.":"MIDI learn off.");
}

function renderChain() {
  const chain = $("#signal-chain");
  if (!state.modules.length) {
    chain.innerHTML = '<p class="chain-empty">Your chain is empty.<br>Add a module from the library.</p>';
    return;
  }
  chain.innerHTML = state.modules.map((instance, index) => {
    const definition = MODULES[instance.type];
    const primaryKey = PRIMARY_PARAMETERS[instance.type] || definition.params.find((param)=>param.type!=="select")?.key;
    const primary = definition.params.find((param)=>param.key===primaryKey);
    const knobs = definition.params.filter((param) => param.type !== "select").slice(0, 3).map((param) => {
      const turn = ((Number(instance.params[param.key]) - param.min) / (param.max - param.min)) * 75 + 5;
      return `<span class="mini-knob" style="--turn:${turn}%" title="${param.label}: ${formatValue(param, instance.params[param.key])}"></span>`;
    }).join("");
    return `<article class="effect-module${state.selectedId === instance.id ? " is-selected" : ""}${instance.bypassed ? " is-bypassed" : ""}" draggable="true" tabindex="0" data-select="${instance.id}" style="--module-color:${definition.color}" aria-label="Select ${definition.name}, position ${index + 1}${instance.bypassed ? ", bypassed" : ""}">
      <span class="effect-title"><strong>${definition.name}</strong><span>#${String(instance.id).padStart(2, "0")}</span><button type="button" class="module-delete" data-remove="${instance.id}" aria-label="Delete ${definition.name}" title="Delete module">×</button></span>
      <span class="mini-knobs" aria-hidden="true">${knobs}</span>
      <button type="button" class="macro-assign-target" data-assign-module="${instance.id}" data-assign-param="${primaryKey}">Assign ${primary?.label || "main control"}</button>
      <span class="effect-footer"><span>${instance.bypassed ? "MUTED" : "ACTIVE"}</span><span class="effect-led"></span></span>
      <span class="module-nudges" aria-label="Move or alter module"><button type="button" data-module-nudge="left" data-module-id="${instance.id}" title="Move left">←</button><button type="button" data-module-nudge="up" data-module-id="${instance.id}" title="Increase main amount">↑</button><button type="button" data-module-nudge="down" data-module-id="${instance.id}" title="Decrease main amount">↓</button><button type="button" data-module-nudge="right" data-module-id="${instance.id}" title="Move right">→</button></span>
    </article>`;
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
    return `<div class="component-control"><div class="component-label"><label for="param-${instance.id}-${param.key}">${param.label}</label><output id="value-${param.key}">${formatValue(param, instance.params[param.key])}</output><button type="button" class="parameter-map-target" data-assign-module="${instance.id}" data-assign-param="${param.key}">Map</button></div>
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

function selectedModulePrimaryParameter() {
  const instance = state.modules.find((item)=>item.id===state.selectedId);
  if (!instance) return null;
  const definition = MODULES[instance.type];
  const key = PRIMARY_PARAMETERS[instance.type] || definition.params.find((param)=>param.type!=="select")?.key;
  const parameter = definition.params.find((param)=>param.key===key && param.type!=="select");
  return parameter ? {instance,parameter} : null;
}

function applyKaossPosition(x,y,render=true) {
  state.kaossX=clamp(Number(x),0,1); state.kaossY=clamp(Number(y),0,1);
  const cutoff=80+state.kaossX*(12000-80);
  updateVoiceParameter("cutoff",cutoff);
  const target=selectedModulePrimaryParameter();
  if(target){
    const p=target.parameter;
    const value=p.min+state.kaossY*(p.max-p.min);
    target.instance.params[p.key]=Number((Math.round(value/p.step)*p.step).toFixed(6));
    rebuildAudioGraph(); renderChain(); renderBom();
    if(render) renderInspector();
  }
  const pad=$("#kaoss-pad");
  if(pad){pad.style.setProperty("--kaoss-x",(state.kaossX*100)+"%");pad.style.setProperty("--kaoss-y",((1-state.kaossY)*100)+"%");}
  const xOut=$("#kaoss-x-value"); if(xOut)xOut.textContent=`X · ${Math.round(state.kaossX*100)}% · cutoff ${Math.round(cutoff).toLocaleString()} Hz`;
  const yOut=$("#kaoss-y-value"); if(yOut)yOut.textContent=target?`Y · ${Math.round(state.kaossY*100)}% · ${target.parameter.label}: ${formatValue(target.parameter,target.instance.params[target.parameter.key])}`:`Y · ${Math.round(state.kaossY*100)}% · select an effect`;
  const targetOut=$("#kaoss-target"); if(targetOut)targetOut.textContent=target?`Selected module: ${MODULES[target.instance.type].name} #${target.instance.id}`:"Selected module: none";
}

function renderKaossPad() { applyKaossPosition(state.kaossX,state.kaossY,false); }

function setArpOctave(value) {
  state.arpOctave=clamp(Math.round(Number(value)||0),-3,3);
  $("#arp-octave").value=state.arpOctave;
  $("#arp-octave-value").textContent=(state.arpOctave>0?"+":"")+state.arpOctave+" oct";
  const windowEl=$(".arp-octave-window");
  if(windowEl) windowEl.style.setProperty("--arp-octave-position",((3-state.arpOctave)/6*100)+"%");
}
function setGlobalOctave(value) {
  state.globalOctave=clamp(Math.round(Number(value)||0),-2,2);
  $("#global-octave").value=state.globalOctave; $("#global-octave-value").textContent=(state.globalOctave>0?"+":"")+state.globalOctave+" oct";
}

function renderStudio() {
  renderMacroPanel();
  renderChain();
  renderInspector();
  renderLessons();
  renderBom();
  renderKaossPad();
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

function createAudioContextNow() {
  if (audio.context) return audio.context;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) throw new Error("This browser does not support the Web Audio API.");
  audio.context = new AudioContext();
  audio.sourceBus = audio.context.createGain();
  audio.master = audio.context.createGain();
  audio.master.gain.value = Number($("#master-volume")?.value || 70) / 100;
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
  return audio.context;
}

function primeAudioFromGesture() {
  const ctx = createAudioContextNow();
  try {
    const buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch (_) { /* unlock pulse is best-effort */ }
  if (ctx.state !== "running") ctx.resume().catch(()=>{});
  const status = $("#audio-device-status");
  if (status) status.textContent = "Audio unlocked · ready";
  return ctx;
}

async function ensureAudio() {
  const ctx = createAudioContextNow();
  if (ctx.state !== "running") await ctx.resume();
  const status = $("#audio-device-status");
  if (status) status.textContent = ctx.state === "running" ? "Audio engine running" : `Audio engine ${ctx.state}`;
  return ctx;
}

function playAudioConfirmation() {
  if (!audio.context || audio.context.state !== "running") return;
  const ctx=audio.context;
  const osc=ctx.createOscillator();
  const gain=ctx.createGain();
  osc.type="sine"; osc.frequency.value=523.25;
  gain.gain.setValueAtTime(0.0001,ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.035,ctx.currentTime+0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.09);
  osc.connect(gain); gain.connect(audio.master);
  osc.start(ctx.currentTime); osc.stop(ctx.currentTime+0.1);
}

function stopSource() {
  window.clearInterval(audio.riffTimer);
  window.clearInterval(audio.sequenceTimer);
  window.clearTimeout(audio.sequenceStopTimer);
  window.clearTimeout(audio.sequenceStartTimer);
  audio.riffTimer = null;
  audio.sequenceTimer = null;
  audio.sequenceStopTimer = null;
  audio.sequenceStartTimer = null;
  audio.sequencerVoice = null;
  state.sequencerRunning = false;
  state.keyboardNote = null;
  $$('[data-keyboard-note]').forEach((key) => key.classList.remove("is-playing"));
  audio.sourceNodes.forEach((node) => {
    try { if (typeof node.stop === "function") node.stop(); } catch (_) { /* already stopped */ }
    try { node.disconnect(); } catch (_) { /* already disconnected */ }
  });
  audio.sourceNodes = [];
  if (audio.stream) {
    audio.stream.getTracks().forEach((track) => track.stop());
    audio.stream = null;
  }
  if ($("#sequencer-status")) updateSequencerPlayhead();
}

function createSynthVoice() {
  if (audio.sequencerVoice) return audio.sequencerVoice;
  const ctx = audio.context;
  const profile = SYNTH_PROFILES[state.synthProfile];
  const voiceParams = state.voiceParams;
  const carrier = ctx.createOscillator();
  const envelope = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  carrier.type = state.synthWaveform || profile.wave;
  carrier.frequency.value = 130.81;
  envelope.gain.value = 0.0001;
  filter.type = "lowpass";
  filter.frequency.value = voiceParams.cutoff;
  filter.Q.value = voiceParams.resonance;
  carrier.connect(envelope);
  let sub = null;
  let subGain = null;
  if (profile.sub) {
    sub = ctx.createOscillator();
    subGain = ctx.createGain();
    sub.type = "square";
    sub.frequency.value = 65.41;
    subGain.gain.value = voiceParams.subMix / 100;
    sub.connect(subGain); subGain.connect(envelope); sub.start();
    audio.sourceNodes.push(sub, subGain);
  }
  let modulator = null;
  let modGain = null;
  if (profile.fm) {
    modulator = ctx.createOscillator();
    modGain = ctx.createGain();
    modulator.type = "sine";
    modulator.frequency.value = 130.81 * (profile.fmRatio || 2);
    modGain.gain.value = 130.81 * voiceParams.fmAmount / 100;
    modulator.connect(modGain); modGain.connect(carrier.frequency); modulator.start();
    audio.sourceNodes.push(modulator, modGain);
  }
  if (profile.chorus) {
    const chorus = ctx.createDelay(.03);
    const chorusGain = ctx.createGain();
    chorus.delayTime.value = .012;
    chorusGain.gain.value = .35;
    envelope.connect(chorus); chorus.connect(chorusGain); chorusGain.connect(filter);
    audio.sourceNodes.push(chorus, chorusGain);
  }
  envelope.connect(filter); filter.connect(audio.sourceBus); carrier.start();
  audio.sourceNodes.push(carrier, envelope, filter);
  audio.sequencerVoice = { carrier, envelope, filter, sub, subGain, modulator, modGain };
  return audio.sequencerVoice;
}

function gateSynthNote(note, gateSeconds = null, origin = "keyboard") {
  if (!audio.sequencerVoice || !audio.context) return;
  const { carrier, modulator, modGain, sub, envelope } = audio.sequencerVoice;
  const profile=SYNTH_PROFILES[state.synthProfile];
  const attack=Math.max(.001,state.voiceParams.attack/1000);
  const release=Math.max(.005,state.voiceParams.release/1000);
  const effectiveAttack=gateSeconds==null?attack:Math.min(attack,gateSeconds*.24);
  const time = audio.context.currentTime;
  envelope.gain.cancelScheduledValues(time);
  envelope.gain.setValueAtTime(Math.max(0.0001, envelope.gain.value), time);
  if (note == null || state.performance.mute) {
    envelope.gain.setTargetAtTime(0.0001, time, Math.max(.004,release/4));
    state.lastMidiMessage = `MIDI: Note Off · ${origin} · channel 1`;
    return;
  }
  const frequency = midiFrequency(note);
  carrier.frequency.setTargetAtTime(frequency, time, .006);
  if (sub) sub.frequency.setTargetAtTime(frequency / 2, time, .006);
  if (modulator) {
    modulator.frequency.setTargetAtTime(frequency * (profile.fmRatio || 2), time, .006);
    modGain.gain.setTargetAtTime(frequency * state.voiceParams.fmAmount / 100, time, .01);
  }
  envelope.gain.linearRampToValueAtTime(.18, time + effectiveAttack);
  envelope.gain.exponentialRampToValueAtTime(.11, time + effectiveAttack + .035);
  if (gateSeconds != null) {
    const releaseDuration=Math.min(release,Math.max(.01,gateSeconds*.55));
    const releaseStart = time + Math.max(effectiveAttack+.04, gateSeconds-releaseDuration);
    envelope.gain.setValueAtTime(.11, releaseStart);
    envelope.gain.exponentialRampToValueAtTime(.0001, time + Math.max(effectiveAttack+.055, gateSeconds));
  }
  state.lastMidiMessage = `MIDI: Note On ${midiToName(note)} · note ${note} · velocity 100 · ${origin} · channel 1`;
}

async function startKeyboardNote(note) {
  primeAudioFromGesture();
  await ensureAudio();
  if (audio.context?.state !== "running") await audio.context.resume();
  if (state.source !== "sequencer" || !audio.sequencerVoice) {
    stopSource();
    state.source = "sequencer";
    state.audioOn = true;
    $("#source-select").value = "sequencer";
    rebuildAudioGraph();
    createSynthVoice();
  }
  state.keyboardNote = note;
  gateSynthNote(note, null, "keyboard");
  $$('[data-keyboard-note]').forEach((key) => key.classList.toggle("is-playing", Number(key.dataset.keyboardNote) === note));
  $("#midi-message").textContent = state.lastMidiMessage;
  syncAudioButtons();
}

function stopKeyboardNote(note) {
  if (state.keyboardNote !== note) return;
  state.keyboardNote = null;
  gateSynthNote(null, null, "keyboard");
  $$('[data-keyboard-note]').forEach((key) => key.classList.remove("is-playing"));
  $("#midi-message").textContent = state.lastMidiMessage;
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
  if (state.source === "sequencer") {
    const profile = SYNTH_PROFILES[state.synthProfile];
    createSynthVoice();
    state.sequencerRunning = true;
    triggerSequenceStep();
    audio.sequenceTimer = window.setInterval(triggerSequenceStep, sequenceIntervalMs());
    if (state.patternDuration > 0) audio.sequenceStopTimer = window.setTimeout(stopSequencerTransport, state.patternDuration * 60000);
    announce(`${profile.label} running at ${state.midiBpm} BPM.`);
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
  return material === "germanium" ? 0.3 : material === "schottky" ? 0.25 : material === "led" ? 1.8 : 0.7;
}

function createModuleProcessor(instance) {
  const ctx = audio.context;
  const input = ctx.createGain();
  const output = ctx.createGain();
  const nodes = [input, output];
  const p = instance.params;
  const supplyScale = clamp(Number(p.supply || 9) / 9, 0.55, 1.34);

  if (instance.type === "oscillator") {
    if (!p.hardwareOnly || state.source === "sequencer") input.connect(output);
    if (state.source === "sequencer") return { input, output, nodes };
    const result = calculateModule(instance);
    const frequency = clamp(result.frequency, 20, 12000);
    const toneGain = ctx.createGain();
    toneGain.gain.value = p.mix / 100 * 0.14 * supplyScale;
    toneGain.connect(output);
    const osc1 = ctx.createOscillator();
    osc1.type = "square"; osc1.frequency.value = frequency; osc1.connect(toneGain); osc1.start();
    nodes.push(toneGain, osc1);
    if (p.voices === "dual") {
      const osc2 = ctx.createOscillator();
      osc2.type = "square"; osc2.frequency.value = clamp(result.secondFrequency, 20, 12000); osc2.connect(toneGain); osc2.start();
      nodes.push(osc2);
    }
  } else if (instance.type === "fuzz" || instance.type === "overdrive" || instance.type === "distortion") {
    const dry = ctx.createGain();
    const wet = ctx.createGain();
    const shaper = ctx.createWaveShaper();
    const filter = ctx.createBiquadFilter();
    const threshold = diodeThreshold(p.diode);
    const transistorFactor = p.transistor === "2n5088" ? 1.22 : 1;
    const drive = instance.type === "fuzz" ? clamp((1 + p.rf / p.rin) * 2.1 * transistorFactor, 1, 100) : instance.type === "overdrive" ? clamp((1 + p.drive / p.rin) * 1.35, 1, 75) : clamp((1 + p.drive / 4.7) * 2.8, 1, 100);
    shaper.curve = makeCurve(drive, threshold);
    shaper.oversample = "4x";
    filter.type = instance.type === "overdrive" ? "highpass" : "lowpass";
    const resistance = instance.type === "fuzz" ? 10000 : instance.type === "overdrive" ? p.rin * 1000 : p.toneR * 1000;
    const capacitance = instance.type === "overdrive" ? p.couplingC * 1e-6 : p.toneC * 1e-9;
    filter.frequency.value = clamp(1 / (2 * Math.PI * resistance * capacitance), 20, 16000);
    const mix = instance.type === "fuzz" ? 1 : p.mix / 100;
    dry.gain.value = 1 - mix;
    wet.gain.value = (instance.type === "fuzz" ? p.level / 100 : mix) * (threshold < 1 ? 1.6 : .85) * supplyScale;
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
  } else if (["ladder","korgfilter","brute"].includes(instance.type)) {
    const dry = ctx.createGain();
    const wet = ctx.createGain();
    const drive = ctx.createWaveShaper();
    const filters = [];
    const mix = (p.mix ?? 100) / 100;
    const driveAmount = Number(p.drive ?? p.brute ?? 15);
    drive.curve = makeCurve(clamp(1 + driveAmount * .65, 1, 72), .92);
    drive.oversample = "4x";
    dry.gain.value = 1 - mix;
    wet.gain.value = mix;
    input.connect(dry); dry.connect(output);
    input.connect(drive);
    const filterCount = instance.type === "ladder" ? 4 : 1;
    let previous = drive;
    for (let index = 0; index < filterCount; index++) {
      const filter = ctx.createBiquadFilter();
      filter.type = instance.type === "ladder" ? "lowpass" : (p.mode || "lowpass");
      filter.frequency.value = clamp(Number(p.cutoff), 30, 18000);
      filter.Q.value = index === filterCount - 1 ? clamp(Number(p.resonance) / 8, .1, 14) : .707;
      previous.connect(filter);
      previous = filter;
      filters.push(filter);
    }
    previous.connect(wet); wet.connect(output);
    nodes.push(dry, wet, drive, ...filters);
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
    if (p.hardwareOnly) {
      const pulse = ctx.createOscillator();
      const pulseGain = ctx.createGain();
      pulse.type = "square";
      pulse.frequency.value = clamp(calculateModule(instance).chopRate, 0.5, 12000);
      pulseGain.gain.value = p.depth / 100 * 0.12 * supplyScale;
      pulse.connect(pulseGain); pulseGain.connect(output); pulse.start();
      nodes.push(pulse, pulseGain);
      return { input, output, nodes };
    }
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
  if (state.audioStarting) return;
  state.audioStarting = true;
  try {
    primeAudioFromGesture();
    await ensureAudio();
    state.audioOn = !state.audioOn;
    if (state.audioOn) {
      rebuildAudioGraph();
      playAudioConfirmation();
      await startSource();
      const status=$("#audio-device-status"); if(status)status.textContent="Audio ON · tap again to stop";
      announce("Audio started. If you heard the short tone, the phone audio engine is unlocked.");
    } else {
      stopSource();
      await audio.context.suspend();
      const status=$("#audio-device-status"); if(status)status.textContent="Audio stopped";
      announce("Audio stopped.");
    }
    syncAudioButtons();
  } catch (error) {
    announce(error.message || "Audio could not start in this browser.");
  } finally {
    state.audioStarting = false;
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
    const logoWave = $("#logo-wave");
    if (logoWave) {
      const samples=25;
      const points=Array.from({length:samples},(_,index)=>{
        const value=waveformData[Math.floor(index*(waveformData.length-1)/(samples-1))];
        return `${index?"L":"M"}${7+index*(50/(samples-1))} ${39+(value-128)/128*17}`;
      }).join(" ");
      logoWave.setAttribute("d",points);
      const rms=Math.sqrt(waveformData.reduce((sum,value)=>sum+Math.pow((value-128)/128,2),0)/waveformData.length);
      $(".brand-mark")?.classList.toggle("is-sounding",rms>.015);
    }
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
    $("#logo-wave")?.setAttribute("d","M7 39H57");
    $(".brand-mark")?.classList.remove("is-sounding");
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
  if (component.valueKey) {
    const control = preset.controls.find((item) => item.key === component.valueKey);
    const selected = control?.options?.find((option) => option.value === preset.values[component.valueKey]);
    return `${selected?.label || preset.values[component.valueKey]}${component.suffix || ""}`;
  }
  return component.value;
}

function inventoryMatch(component, preset) {
  const value = String(componentValue(component, preset));
  if (component.kind === "breadboard") return { className: "check-stock", label: "STEM list: 1 · quantity unverified", missing: false };
  if (component.kind === "electrolytic" && /^1\s*µF/.test(value)) return { className: "in-stock", label: "STEM stock: 20 · use stocked 50 V part", missing: false };
  if (component.kind === "electrolytic" && /^10\s*µF/.test(value)) return { className: "in-stock", label: "STEM stock: 40 at 25 V", missing: false };
  if (component.kind === "resistor" && /^1\s*kΩ/.test(value)) return { className: "in-stock", label: "STEM stock: 100 · 1 kΩ 1/4 W", missing: false };
  if (component.kind === "resistor" && /^4\.7\s*kΩ/.test(value)) return { className: "check-stock", label: "STEM list: 25 · rating unverified", missing: false };
  if (component.kind === "resistor" && /^47\s*kΩ/.test(value)) return { className: "check-stock", label: "STEM list: quantity unverified", missing: false };
  if (component.kind === "resistor") return { className: "check-stock", label: "STEM resistor assortment · verify value and quantity", missing: false };
  if (component.kind === "diode" && preset.values.diode === "schottky") return { className: "in-stock", label: "STEM stock: 30 · 1N5817", missing: false };
  if (component.kind === "diode") return { className: "add-part", label: "Add to STEM kit", missing: true };
  if (component.kind === "capacitor") return { className: "add-part", label: "Add film/ceramic value to kit", missing: true };
  return { className: "add-part", label: "Add to STEM kit", missing: true };
}

const RESISTOR_COLORS = {
  0: ["black", "#171717"], 1: ["brown", "#6f3b1f"], 2: ["red", "#c92b2b"], 3: ["orange", "#e97819"],
  4: ["yellow", "#e6c933"], 5: ["green", "#2d7d46"], 6: ["blue", "#2864af"], 7: ["violet", "#7d45a2"],
  8: ["gray", "#7b7f83"], 9: ["white", "#f4f4ef"], gold: ["gold", "#c49a32"], silver: ["silver", "#a8adb0"]
};

function resistanceOhms(value) {
  const match = String(value || "").replaceAll(",", "").match(/([0-9.]+)\s*(MΩ|kΩ|Ω|M|k)?/i);
  if (!match) return 10000;
  const multiplier = /m/i.test(match[2] || "") ? 1e6 : /k/i.test(match[2] || "") ? 1e3 : 1;
  return Math.max(0.1, Number(match[1]) * multiplier);
}

function resistorBands(value) {
  const ohms = resistanceOhms(value);
  let exponent = Math.floor(Math.log10(ohms)) - 2;
  let digits = Math.round(ohms / Math.pow(10, exponent));
  if (digits >= 1000) { digits = Math.round(digits / 10); exponent += 1; }
  digits = String(digits).padStart(3, "0").slice(0, 3).split("").map(Number);
  const multiplier = exponent >= 0 ? RESISTOR_COLORS[Math.min(9, exponent)] : exponent === -1 ? RESISTOR_COLORS.gold : RESISTOR_COLORS.silver;
  return [...digits.map((digit) => RESISTOR_COLORS[digit]), multiplier, RESISTOR_COLORS[1]];
}

function resistorBandMarkup(value, startX = 27, width = 5, gap = 7) {
  return resistorBands(value).map(([name, color], index) => `<rect class="resistor-band" x="${startX + index * gap}" y="15" width="${width}" height="20" rx="1" style="fill:${color}"><title>${name}</title></rect>`).join("");
}

function componentIcon(componentOrKind, preset = hardwarePreset()) {
  const component = typeof componentOrKind === "string" ? { kind: componentOrKind } : (componentOrKind || { kind: "dip8" });
  const kind = component.kind;
  const value = component.displayValue || (component.ref ? componentValue(component, preset) : "10 kΩ");
  const common = 'viewBox="0 0 82 50" aria-hidden="true"';
  if (kind === "resistor") return `<svg class="component-realistic" ${common}><path class="metal-lead" d="M3 25h18m40 0h18"/><rect class="resistor-body" x="19" y="13" width="44" height="24" rx="11"/>${resistorBandMarkup(value)}<text x="41" y="48" text-anchor="middle">${value}</text></svg>`;
  if (kind === "capacitor") return `<svg class="component-realistic" ${common}><path class="metal-lead" d="M29 34v13m24-13v13"/><rect class="film-cap" x="20" y="8" width="42" height="28" rx="3"/><text x="41" y="25" text-anchor="middle">${value.replace(/,.*/,"")}</text></svg>`;
  if (kind === "electrolytic") return `<svg class="component-realistic" ${common}><path class="metal-lead" d="M29 37v10m24-10v10"/><path class="electrolytic-body" d="M23 10q18-7 36 0v26q-18 7-36 0z"/><path class="electrolytic-stripe" d="M48 7h9v32h-9z"/><text x="31" y="27" text-anchor="middle">${value.replace(/,.*/,"")}</text><text x="53" y="20" text-anchor="middle">−</text><text x="20" y="10">+</text></svg>`;
  if (kind === "diode") return `<svg class="component-realistic" ${common}><path class="metal-lead" d="M4 25h23m29 0h22"/><rect class="diode-body" x="25" y="16" width="34" height="18" rx="7"/><rect class="diode-cathode" x="50" y="16" width="6" height="18"/><text x="41" y="48" text-anchor="middle">${value}</text></svg>`;
  if (kind === "pot") return `<svg class="component-realistic" ${common}><path class="pot-lugs" d="M24 35v12m17-12v12m17-12v12"/><rect class="pot-case" x="17" y="7" width="48" height="30" rx="4"/><circle class="pot-shaft" cx="41" cy="22" r="11"/><path class="pot-pointer" d="M41 22l7-7"/><text x="41" y="48" text-anchor="middle">POT</text></svg>`;
  if (kind === "jack") return `<svg ${common}><circle cx="41" cy="25" r="17"/><circle cx="41" cy="25" r="7"/><path d="M58 25h19"/><text x="5" y="47">JACK</text></svg>`;
  if (kind === "supply") return `<svg class="component-realistic" ${common}><rect class="supply-case" x="13" y="8" width="56" height="34" rx="4"/><path class="supply-terminals" d="M24 19h10m-5-5v10m17-5h10"/><text x="41" y="36" text-anchor="middle">${value}</text></svg>`;
  if (kind === "breadboard") return `<svg ${common}><rect x="4" y="6" width="74" height="37" rx="2"/><path d="M8 14h66M8 35h66M39 17v15m4-15v15" stroke-dasharray="2 2"/><text x="23" y="29">BB830</text></svg>`;
  const pins = kind === "dip14" ? 7 : 4;
  const chipLabel = component.name?.includes("555") ? "NE555P" : component.name?.includes("TL072") ? "TL072" : component.name?.includes("40106") ? "40106" : "IC";
  return `<svg class="component-realistic" ${common}><rect class="ic-real-body" x="17" y="8" width="48" height="34" rx="3"/><path class="ic-notch" d="M35 8q6 8 12 0"/>${Array.from({length:pins},(_,i)=>`<path class="ic-pin" d="M${21+i*(40/(pins-1))} 3v5m0 34v5"/>`).join("")}<circle class="pin-one" cx="23" cy="15" r="2"/><text class="ic-real-label" x="41" y="29" text-anchor="middle">${chipLabel}</text></svg>`;
}

function renderHardwareSelector() {
  const select = $("#hardware-preset");
  const presets = Object.values(window.HARDWARE_PRESETS);
  const categories = [...new Set(presets.map((preset) => preset.category || "Other"))];
  select.innerHTML = categories.map((category) => `<optgroup label="${category}">${presets.filter((preset) => (preset.category || "Other") === category).map((preset) => `<option value="${preset.id}"${preset.id === state.hardwarePreset ? " selected" : ""}>${preset.name}</option>`).join("")}</optgroup>`).join("");
  const preset = hardwarePreset();
  const supply = preset.controls.find((control) => control.key === "supply");
  $("#supply-select").innerHTML = supply.options.map((option) => `<option value="${option.value}"${Number(option.value) === Number(preset.values.supply) ? " selected" : ""}>${option.label}</option>`).join("");
  $("#download-guide").href = preset.guide;
}

function selectedHardwareComponent(preset = hardwarePreset()) {
  return preset.components[state.hardwareSelectedIndex]
    || preset.components.find((component) => component.valueKey === state.hardwareSelectedKey)
    || preset.components[0];
}

function updateUndoButtons() {
  $("#hardware-undo").disabled = state.hardwareHistory.length === 0;
  $("#hardware-redo").disabled = state.hardwareRedo.length === 0;
}

function recordHardwareSnapshot() {
  const snapshot = JSON.stringify(hardwarePreset().values);
  if (state.hardwareHistory.at(-1) !== snapshot) state.hardwareHistory.push(snapshot);
  if (state.hardwareHistory.length > 40) state.hardwareHistory.shift();
  state.hardwareRedo = [];
  updateUndoButtons();
}

function soundStageCategory(type) {
  if (type === "oscillator") return "Generator";
  if (["fuzz","overdrive","distortion"].includes(type)) return "Clipping";
  if (type === "delay") return "Time effect";
  if (type === "octave") return "Pitch effect";
  return "Modulation";
}

function soundChainPanel() {
  const stages = state.modules.map((instance, index) => {
    const definition = MODULES[instance.type];
    return `<div class="sound-stage" style="--stage-color:${definition.color}"><i></i><span><b>${index + 1}</b><strong>${definition.shortName}</strong><small>${instance.hardwareAdded ? "Added simulation stage" : "Preset source stage"}</small></span>${instance.hardwareAdded ? `<button type="button" data-remove-sound-stage="${instance.id}" aria-label="Remove ${definition.name}">×</button>` : ""}</div>`;
  }).join("");
  return `<section class="sound-chain-panel"><div><span>Behavioral sound chain</span><strong>${state.modules.length} active stage${state.modules.length === 1 ? "" : "s"}</strong></div><div class="sound-stage-list">${stages || `<p>No sound model loaded.</p>`}</div><button class="add-sound-stage" type="button" data-browse-sound-stages>Add a sound stage</button><p>Added stages change browser audio only. They do not alter the audited physical wiring.</p></section>`;
}

function renderHardwareControls() {
  const preset = hardwarePreset();
  const component = selectedHardwareComponent(preset);
  const control = component?.valueKey
    ? preset.controls.find((item) => item.key === component.valueKey)
    : preset.controls.find((item) => item.key === state.hardwareSelectedKey);
  const value = component ? componentValue(component, preset) : "";
  const editor = control ? `<div class="hardware-control selected-control">
      <div><label for="hardware-${control.key}"><span>${control.ref}</span>${control.label}</label><output id="hardware-value-${control.key}">${hardwareValueLabel(control, preset.values[control.key])}</output></div>
      ${control.type === "select"
        ? `<select id="hardware-${control.key}" data-hardware-key="${control.key}">${control.options.map((option) => `<option value="${option.value}"${option.value === preset.values[control.key] ? " selected" : ""}>${option.label}</option>`).join("")}</select>`
        : `<input id="hardware-${control.key}" type="range" min="${control.min}" max="${control.max}" step="${control.step}" value="${preset.values[control.key]}" data-hardware-key="${control.key}"><div class="engineering-options" aria-label="Common values">${engineeringChoices(control).map((option) => `<button type="button" data-inspector-choice="${option.value}"${String(option.value) === String(preset.values[control.key]) ? ` aria-pressed="true"` : ""}>${option.label}</button>`).join("")}</div>`}
      <p class="inspector-note">${control.unit === "%" ? "This changes the control position during the behavioral simulation." : "Choose a supported value. The drawing, calculation, BOM, and sound target stay synchronized."}</p>
      <button class="browse-replacements" type="button" data-browse-hardware="${state.hardwareSelectedIndex}">Browse illustrated replacements</button>
    </div>` : `<div class="locked-component"><strong>Fixed identity in this verified preset</strong><p>This part is still selectable and testable. Its package, polarity, or role is locked because changing it without a verified model could make the wiring or math incorrect.</p><button class="browse-replacements" type="button" data-test-selected-part>Test this part in circuit</button></div>`;
  $("#hardware-controls").innerHTML = `<div class="selected-part-summary">
      <div class="selected-part-icon">${componentIcon(component || "dip8", preset)}</div>
      <div><span>${component?.ref || "Preset"}</span><h3>${component?.name || preset.name}</h3><strong>${value}</strong><p>${component?.note || preset.summary}</p></div>
    </div>${editor}<div class="hardware-calculation">${hardwareCalculation(preset)}</div>${soundChainPanel()}`;
  $("#hardware-selection-status").textContent = component ? `${component.ref} selected · ${component.name}` : "Verified preset ready";
  updateUndoButtons();
}

function syncAudioButtons() {
  const headerButton = $("#audio-toggle");
  const hardwareButton = $("#hardware-audio-toggle");
  headerButton.classList.toggle("is-on", state.audioOn);
  headerButton.setAttribute("aria-pressed", String(state.audioOn));
  headerButton.querySelector("span:last-child").textContent = state.audioOn ? "Stop audio" : "Start audio";
  hardwareButton.classList.toggle("is-on", state.audioOn);
  hardwareButton.setAttribute("aria-pressed", String(state.audioOn));
  hardwareButton.textContent = state.audioOn ? "Stop simulation" : "Start simulation";
  $("#hardware-audio-status").textContent = state.audioOn ? "Behavioral sound simulation running" : "Behavioral sound model stopped";
}

function hardwareCalculation(preset) {
  const v = preset.values;
  if (preset.id === "dual555") {
    const f = 1 / (0.693 * ((v.r1 + 2 * v.r2) * 1000) * (v.c * 1e-9));
    const f2 = 1 / (0.693 * ((v.r1 + 2 * v.r2b) * 1000) * (v.c * 1e-9));
    const dutyA = ((v.r1 + v.r2) / (v.r1 + 2 * v.r2)) * 100;
    const dutyB = ((v.r1 + v.r2b) / (v.r1 + 2 * v.r2b)) * 100;
    return `<span>Calculated NE555 timing · ${v.supply} V supply</span><strong>Voice A ${f.toFixed(1)} Hz (${dutyA.toFixed(1)}% high) · Voice B ${f2.toFixed(1)} Hz (${dutyB.toFixed(1)}% high)</strong><code>T = 0.693(RA + 2RB)C; f = 1/T<br>fA = 1 / [0.693 × (${v.r1} kΩ + 2×${v.r2} kΩ) × ${v.c} nF]</code><p>The ideal frequency equation is nearly supply-independent because the thresholds track 1/3 and 2/3 VCC. Supply voltage mainly changes output swing; tolerance, leakage, and threshold variation shift physical pitch.</p>`;
  }
  if (preset.id === "opampFuzz") {
    const gain = v.rf / v.rin;
    const fc = 1 / (2 * Math.PI * 10000 * v.toneC * 1e-9);
    const clip = v.diode === "germanium" ? "about 0.3 V" : v.diode === "led" ? "about 1.8 V" : "about 0.7 V";
    return `<span>Calculated relationships · ${v.supply} V supply</span><strong>${gain.toFixed(1)}× gain · ${fc.toFixed(0)} Hz corner · ${(v.supply / 2).toFixed(1)} V bias</strong><code>|A| ≈ ${v.rf} kΩ / ${v.rin} kΩ; fc = 1/(2π×10 kΩ×${v.toneC} nF)</code><p>${v.diode} clipping model: ${clip}. Higher supply increases available op-amp headroom, but the TL072 is not rail-to-rail. Replace D1 and D2 together.</p>`;
  }
  const rate = 1 / (2.2 * v.clockR * 1000 * v.clockC * 1e-6);
  return `<span>Calculated RC estimate · ${v.supply} V supply</span><strong>${rate.toFixed(1)} Hz · approximately ${v.supply} V logic swing</strong><code>f ≈ 1 / (2.2 × ${v.clockR} kΩ × ${v.clockC} µF)</code><p>The 2.2 factor is an estimate. CD40106 thresholds vary with supply, device, temperature, and part tolerance, so physical rate will differ.</p>`;
}

function hardwareTestReport(preset = hardwarePreset()) {
  const v = preset.values;
  if (preset.id === "dual555") {
    const calc = (rb) => {
      const raOhm=v.r1*1000, rbOhm=rb*1000, cF=v.c*1e-9;
      const tHigh=0.693*(raOhm+rbOhm)*cF, tLow=0.693*rbOhm*cF, period=tHigh+tLow;
      return {f:1/period,duty:(tHigh/period)*100};
    };
    const a=calc(v.r2), b=calc(v.r2b);
    return {headline:"Dual NE555 calculated bench test",metrics:[["Supply",v.supply+" V DC"],["Voice A",a.f.toFixed(1)+" Hz"],["Voice B",b.f.toFixed(1)+" Hz"]],rows:[
      ["U1/U2 pin 8 to pin 1","DC volts","about "+v.supply+" V","Power and ground are present"],
      ["U1 timing node pins 2/6","Oscilloscope",(v.supply/3).toFixed(1)+"–"+(2*v.supply/3).toFixed(1)+" V ramp","Timing capacitor moves between about 1/3 and 2/3 VCC"],
      ["U1 pin 3","Oscilloscope","square wave near "+a.f.toFixed(1)+" Hz · "+a.duty.toFixed(1)+"% high","Voice A timing network"],
      ["U2 pin 3","Oscilloscope","square wave near "+b.f.toFixed(1)+" Hz · "+b.duty.toFixed(1)+"% high","Voice B timing network"],
      ["P1 / P2","Listen / scope","frequency changes independently","Potentiometers change RB in the astable equation"],
      ["P3 / output","AC volts / audio","level changes; oscillator frequency stays the same","Output level after the oscillator mix"]
    ]};
  }
  if (preset.id === "opampFuzz") {
    const gain=v.rf/v.rin, fc=1/(2*Math.PI*10000*v.toneC*1e-9);
    const clip=v.diode==="germanium"?0.3:v.diode==="led"?1.8:v.diode==="schottky"?0.35:0.7;
    return {headline:"TL072 fuzz calculated bench test",metrics:[["Supply",v.supply+" V DC"],["Bias",(v.supply/2).toFixed(2)+" V"],["Gain ratio",gain.toFixed(1)+"×"]],rows:[
      ["U1 pin 8 to pin 4","DC volts","about "+v.supply+" V","Op-amp supply present"],
      ["VBIAS / reference","DC volts","about "+(v.supply/2).toFixed(2)+" V","Single-supply signal reference"],
      ["Gain stage","Scope / ratio","ideal magnitude about "+gain.toFixed(1)+"× before clipping","Rf/Rin relationship"],
      ["D1/D2 clip region","Oscilloscope","simplified conduction near ±"+clip.toFixed(2)+" V","Actual current and device behavior shift this"],
      ["Tone node","Frequency sweep","corner near "+fc.toFixed(0)+" Hz","10 kΩ with selected tone capacitor"],
      ["Output level","AC volts / audio","level changes without changing calculated tone corner","P1 final level"]
    ]};
  }
  const rate=1/(2.2*v.clockR*1000*v.clockC*1e-6);
  return {headline:"40106 glitch clock calculated bench test",metrics:[["Supply",v.supply+" V DC"],["Clock estimate",rate.toFixed(1)+" Hz"],["Depth",v.depth+"%"]],rows:[
    ["CD40106 supply pins","DC volts","about "+v.supply+" V","Power is present"],
    ["RC timing node","Oscilloscope","charging/discharging waveform between Schmitt thresholds","Thresholds vary by device and supply"],
    ["Clock output","Oscilloscope","roughly "+rate.toFixed(1)+" Hz","RC estimate; physical value will vary"],
    ["Depth control","Listen / scope","more or less chopped signal","Behavioral mix control"],
    ["Output","Audio / scope","gated or stepped waveform","Confirm no harmful DC reaches external audio input"]
  ]};
}

function openCircuitTest() {
  const preset=hardwarePreset(), report=hardwareTestReport(preset), component=selectedHardwareComponent(preset);
  $("#circuit-test-title").textContent=preset.name+" · Test bench";
  $("#circuit-test-content").innerHTML=
    '<div class="test-bench-summary">'+report.metrics.map(([label,value])=>'<article><span>'+label+'</span><strong>'+value+'</strong></article>').join("")+'</div>'+
    '<p class="evidence-label">'+report.headline+'</p>'+
    '<div class="connection-table-wrap"><table class="test-grid"><thead><tr><th>Test point</th><th>Tool</th><th>Expected result</th><th>What it checks</th></tr></thead><tbody>'+
    report.rows.map((row)=>'<tr><td><strong>'+row[0]+'</strong></td><td>'+row[1]+'</td><td>'+row[2]+'</td><td>'+row[3]+'</td></tr>').join("")+
    '</tbody></table></div><div class="selected-part-test"><strong>Selected part: '+(component?.ref||"none")+' · '+(component?.name||"")+'</strong><p>'+(component?.note||"Select a component to inspect its role before testing.")+'</p></div>'+
    '<p class="test-boundary"><strong>Important:</strong> these are calculated or expected checkpoints, not measurements from your physical circuit. Disconnect power before rewiring. Use a current-limited DC supply and verify polarity, rail continuity, package orientation, and common ground before power-up.</p>';
  $("#circuit-test-dialog").showModal();
}

function hardwarePartSubcategory(component) {
  const names = {breadboard:"Boards",dip8:"Integrated circuits",dip14:"Integrated circuits",resistor:"Resistors",capacitor:"Capacitors",electrolytic:"Capacitors",pot:"Potentiometers",diode:"Diodes",jack:"Connectors",supply:"Power"};
  return names[component.kind] || "Other";
}

function deviceSubcategory(device) {
  const byId = {
    led:"Light output",button:"Switches",pot:"Analog controls",ldr:"Light sensors",tmp36:"Temperature",hcsr04:"Distance",dht22:"Environment",mpu6050:"Motion",
    ssd1306:"OLED displays",ws2812:"Addressable LEDs",buzzer:"Sound output","i2s-mic":"Sound input",sg90:"Servos","dc-motor":"DC motors",stepper28:"Stepper motors",relay:"Relays",
    mcp3008:"Analog conversion",sn74hc595:"Digital expansion",l293d:"Motor drivers",uln2003:"Load drivers",pca9685:"PWM expansion","level-shifter":"Logic translation",
    ne555p:"Timers",tl072cp:"Amplifiers",cd40106be:"Schmitt logic"
  };
  return byId[device.id] || device.category;
}

function catalogIllustration(item, type = "device") {
  if (type === "hardware") return `<div class="catalog-illustration component-choice-art">${componentIcon({kind:item.kind,displayValue:item.model,name:item.name},hardwarePreset())}</div>`;
  if (type === "circuit") {
    const code = item.id === "dual555" ? "555×2" : item.id === "opampFuzz" ? "TL072" : "40106";
    return `<div class="catalog-illustration circuit-art"><i></i><i></i><b>${code}</b><span>${item.category}</span></div>`;
  }
  if (type === "controller") {
    const code = item.id.includes("arduino") || item.id.includes("uno") ? "UNO" : item.id.includes("raspberry-pi") ? "PI" : item.id.includes("pico") ? "PICO" : item.id.includes("teensy") ? "T4" : item.id.includes("esp32") ? "ESP" : "µBIT";
    return `<div class="catalog-illustration board-art"><i></i><i></i><b>${code}</b><span></span></div>`;
  }
  const codes = {Basics:"R/C",Sensors:"SENSE",Displays:"DISPLAY",Sound:"AUDIO",Actuators:"MOTOR","Interface ICs":"IC","Driver ICs":"DRIVER","Interface Modules":"MODULE","Analog ICs":"ANALOG","Logic ICs":"LOGIC"};
  return `<div class="catalog-illustration device-art category-${item.category?.toLowerCase().replaceAll(" ","-") || "part"}"><i></i><b>${codes[item.category] || item.kind?.toUpperCase() || "PART"}</b><span>${item.id?.slice(0,6).toUpperCase() || ""}</span></div>`;
}

function catalogPickerItems() {
  if (state.catalogPickerMode === "circuit") return Object.values(window.HARDWARE_PRESETS).map((item) => ({...item,subcategory:item.id === "dual555" ? "555 timers" : item.id === "opampFuzz" ? "Op-amp clipping" : "Schmitt trigger",model:item.summary,note:`${item.components.length} listed parts · ${item.connections.length} audited nets`}));
  if (state.catalogPickerMode === "controller") return window.DEVICE_CONTROLLERS.map((item) => ({...item,category:"Controller boards",subcategory:item.maker,model:`${item.logic} V logic · ${item.supply}`}));
  if (state.catalogPickerMode === "device") return window.DEVICE_LIBRARY.map((item) => ({...item,subcategory:deviceSubcategory(item)}));
  if (state.catalogPickerMode === "sound") return Object.entries(MODULES).map(([id,item]) => ({id,name:item.name,model:item.description,category:"Sound stages",subcategory:soundStageCategory(id),note:`Controls: ${item.params.map((param) => param.label).slice(0,4).join(", ")}`,kind:"sound"}));
  if (state.catalogPickerMode === "hardware") {
    const preset = hardwarePreset();
    const component = preset.components[Number(state.catalogPickerTarget)];
    const control = preset.controls.find((item) => item.key === (component?.valueKey || state.hardwareSelectedKey));
    if (!component || !control) return [];
    return engineeringChoices(control).map((option) => ({id:String(option.value),value:option.value,name:component.name,model:option.label,category:hardwarePartSubcategory(component),subcategory:component.kind,kind:component.kind,note:choiceAvailability(control,option.value,preset.values[control.key]),controlKey:control.key}));
  }
  return [];
}

function renderCatalogPicker() {
  const items = catalogPickerItems();
  const categories = ["All", ...new Set(items.map((item) => item.category))];
  if (!categories.includes(state.catalogPickerCategory)) state.catalogPickerCategory = "All";
  const categoryItems = state.catalogPickerCategory === "All" ? items : items.filter((item) => item.category === state.catalogPickerCategory);
  const subcategories = ["All", ...new Set(categoryItems.map((item) => item.subcategory))];
  if (!subcategories.includes(state.catalogPickerSubcategory)) state.catalogPickerSubcategory = "All";
  $("#catalog-picker-category").innerHTML = categories.map((name) => `<option value="${name}"${name === state.catalogPickerCategory ? " selected" : ""}>${name}</option>`).join("");
  $("#catalog-picker-subcategory").innerHTML = subcategories.map((name) => `<option value="${name}"${name === state.catalogPickerSubcategory ? " selected" : ""}>${name}</option>`).join("");
  const search = state.catalogPickerSearch.trim().toLowerCase();
  const shown = categoryItems.filter((item) => (state.catalogPickerSubcategory === "All" || item.subcategory === state.catalogPickerSubcategory) && (!search || `${item.name} ${item.model || ""} ${item.category} ${item.subcategory} ${item.maker || ""}`.toLowerCase().includes(search)));
  const illustrationType = state.catalogPickerMode === "controller" ? "controller" : state.catalogPickerMode === "circuit" ? "circuit" : state.catalogPickerMode === "hardware" ? "hardware" : "device";
  $("#catalog-picker-results").innerHTML = shown.map((item) => `<article class="catalog-result">${catalogIllustration(item,illustrationType)}<div><span>${item.category} · ${item.subcategory}</span><h3>${item.name}</h3><p>${item.model || item.supply || ""}</p><small>${item.note || "Supported library item"}</small></div><button type="button" data-catalog-choice="${item.id}">${state.catalogPickerMode === "hardware" ? "Install" : "Choose"}</button></article>`).join("") || `<p class="empty-parts">No supported items match these filters.</p>`;
}

function openCatalogPicker(mode, target = "") {
  state.catalogPickerMode = mode;
  state.catalogPickerTarget = String(target);
  state.catalogPickerSearch = "";
  state.catalogPickerCategory = "All";
  state.catalogPickerSubcategory = "All";
  const titles = {circuit:["Verified circuit folders","Choose a sound circuit"],controller:["Board library","Choose a controller board"],device:["Device library","Choose a replacement device"],hardware:["Component library","Choose a supported component value"],sound:["Sound-stage library","Add a stage to the browser sound chain"]};
  $("#catalog-picker-eyebrow").textContent = titles[mode][0];
  $("#catalog-picker-title").textContent = titles[mode][1];
  $("#catalog-picker-help").textContent = mode === "circuit" ? "Folders contain only circuits with a labeled schematic, connection table, pinout references, calculations, and a behavioral sound model." : mode === "sound" ? "These stages immediately change browser audio. They are behavioral simulations and do not add unverified physical wiring." : mode === "hardware" ? "Only component values supported by this audited circuit location are installable." : "Choose from the supported library, then review the compatibility report before wiring.";
  $("#catalog-picker-search").value = "";
  renderCatalogPicker();
  $("#catalog-picker").showModal();
  $("#catalog-picker-search").focus();
}

function chooseCatalogItem(id) {
  if (state.catalogPickerMode === "circuit") {
    switchHardwareCircuit(id);
  } else if (state.catalogPickerMode === "controller") {
    state.plannerController = id;
    renderDevicePlanner();
  } else if (state.catalogPickerMode === "device") {
    const index = state.selectedDeviceIds.indexOf(state.catalogPickerTarget);
    if (index >= 0 && (!state.selectedDeviceIds.includes(id) || id === state.catalogPickerTarget)) state.selectedDeviceIds[index] = id;
    renderDevicePlanner();
  } else if (state.catalogPickerMode === "hardware") {
    const item = catalogPickerItems().find((option) => option.id === id);
    if (item) applyHardwareChoice(item.controlKey, item.value);
  } else if (state.catalogPickerMode === "sound") {
    addHardwareSoundStage(id);
  }
  $("#catalog-picker").close();
}

function switchHardwareCircuit(id) {
  if (!window.HARDWARE_PRESETS[id]) return;
  state.hardwarePreset = id;
  state.hardwareLoadedId = null;
  resetHardwareSelection();
  renderHardware();
  loadHardwareSound();
  showHelp("circuit", false);
  announce(`${hardwarePreset().name} build guide selected.`);
}

function renderIllustratedBom() {
  const preset = hardwarePreset();
  let total = 0;
  let missingTotal = 0;
  const filter = state.partsFilter.trim().toLowerCase();
  const subcategories = ["All", ...new Set(preset.components.map(hardwarePartSubcategory))];
  $("#parts-subcategory").innerHTML = subcategories.map((name) => `<option value="${name}"${name === state.hardwarePartSubcategory ? " selected" : ""}>${name}</option>`).join("");
  const items = preset.components.map((component, index) => {
    total += component.qty * component.cost;
    const stock = inventoryMatch(component, preset);
    const componentRefs = component.ref.split(",").map((item) => item.trim());
    const control = component.valueKey ? preset.controls.find((item) => item.key === component.valueKey) : preset.controls.find((item) => componentRefs.includes(item.ref));
    if (stock.missing) missingTotal += component.qty * component.cost;
    const searchText = `${component.ref} ${component.kind} ${component.name} ${componentValue(component, preset)}`.toLowerCase();
    if ((filter && !searchText.includes(filter)) || (state.hardwarePartSubcategory !== "All" && hardwarePartSubcategory(component) !== state.hardwarePartSubcategory)) return "";
    const selected = index === state.hardwareSelectedIndex;
    return `<article class="part-item${selected ? " is-selected" : ""}" role="button" tabindex="0" data-help-key="${component.kind}" data-component-index="${index}"${control ? ` data-component-key="${control.key}"` : ""} data-component-ref="${component.ref}" aria-label="Inspect ${component.ref}, ${component.name}, ${componentValue(component, preset)}">
      <div class="part-icon">${componentIcon(component, preset)}</div>
      <div><span>${component.ref} · qty ${component.qty}</span><strong>${component.name}</strong><p>${componentValue(component, preset)}</p><small>${hardwarePartSubcategory(component)} · ${control ? "editable" : "verified fixed part"}</small><span class="stock-badge ${stock.className}">${stock.label}</span>${control ? `<button class="part-change-button" type="button" data-hardware-change="${index}">Change</button>` : `<button class="part-change-button is-inspect" type="button" data-hardware-inspect="${index}">Inspect</button>`}</div>
    </article>`;
  });
  $("#illustrated-components").innerHTML = items.join("") || `<p class="empty-parts">No parts match “${state.partsFilter}”.</p>`;
  $("#hardware-cost").textContent = `$${total.toFixed(2)}`;
  $("#hardware-missing-cost").textContent = `$${missingTotal.toFixed(2)}`;
}

function hardwareValueLabel(control, value) {
  const option = control.options?.find((item) => item.value === value);
  if (option) return option.label;
  if (control.unit === "%") return `${Number(value)}% of potentiometer travel`;
  return `${Number(value).toLocaleString(undefined, { maximumFractionDigits: 3 })} ${control.unit || ""}`.trim();
}

function choiceAvailability(control, value, current) {
  if (String(value) === String(current)) return "Currently installed";
  if (control.key === "diode") return value === "schottky" ? "STEM stock · 1N5817" : "Additional part";
  if (control.key === "transistor") return "Additional part · verify E-B-C pins";
  if (control.unit === "%") return "Set the physical knob to this position";
  if (control.unit === "kΩ") {
    if (Number(value) === 1) return "STEM stock · 1 kΩ";
    if ([4.7, 47].includes(Number(value))) return "STEM list · quantity/rating check";
    return "STEM resistor assortment · verify";
  }
  return "Additional film capacitor value";
}

function engineeringChoices(control) {
  if (control.options) return control.options;
  const sets = {
    "kΩ": [1, 2.2, 4.7, 10, 22, 47, 68, 100, 220, 470, 500, 680, 1000],
    "nF": [1, 2.2, 4.7, 10, 22, 47, 68, 100, 150, 220],
    "µF": [0.01, 0.022, 0.047, 0.1, 0.22, 0.47, 1],
    "%": [0, 10, 25, 50, 75, 90, 100]
  };
  const values = (sets[control.unit] || [control.min, control.max]).filter((value) => value >= control.min && value <= control.max);
  if (!values.includes(Number(control.min))) values.unshift(Number(control.min));
  if (!values.includes(Number(control.max))) values.push(Number(control.max));
  return [...new Set(values)].map((value) => ({ value: String(value), label: hardwareValueLabel(control, value) }));
}

function hardwareComponentIndexForRef(ref, preset = hardwarePreset()) {
  const wanted = String(ref || "").split(",").map((item)=>item.trim()).filter(Boolean);
  return preset.components.findIndex((component)=>{
    const refs = String(component.ref || "").split(",").map((item)=>item.trim());
    return wanted.some((item)=>refs.includes(item)) || refs.some((item)=>wanted.includes(item));
  });
}

function interactiveSvgGroup(part, inner) {
  const index = hardwareComponentIndexForRef(part.ref);
  const component = index >= 0 ? hardwarePreset().components[index] : null;
  const key = part.valueKey || component?.valueKey || "";
  return `<g class="interactive-component${key && state.hardwareSelectedKey === key ? " is-selected" : ""}" data-help-key="${part.kind}" data-component-index="${index}"${key ? ` data-component-key="${key}"` : ""} data-component-ref="${part.ref}" role="button" tabindex="0" aria-label="Inspect ${part.ref}. Click, tap, or press Enter."><title>${part.ref}: inspect this component${key ? " and choose supported values" : ""}</title>${inner}</g>`;
}

function renderPotControls(preset) {
  const controls = preset.controls.filter((control) => /^P\d/.test(control.ref));
  if (!controls.length) return "";
  return `<div class="offboard-controls" aria-label="Interactive off-board potentiometers"><div><span>Off-board controls</span><strong>Click or tap a knob to set it and hear the result</strong></div>${controls.map((control) => {
    const value = preset.values[control.key];
    const turn = control.unit === "%" ? Number(value) : ((Number(value) - control.min) / (control.max - control.min)) * 100;
    const degrees = -135 + Math.max(0, Math.min(100, turn)) * 2.7;
    return `<button type="button" class="interactive-component physical-pot${state.hardwareSelectedKey === control.key ? " is-selected" : ""}" data-help-key="pot" data-component-key="${control.key}" data-component-ref="${control.ref}" aria-label="${control.ref} ${control.label}, ${hardwareValueLabel(control, value)}. Click, tap, or press Enter to inspect."><span class="physical-knob knob-${state.knobStyle}" style="--pot-turn:${degrees}deg" aria-hidden="true"><i></i></span><span><b>${control.ref}</b><strong>${control.label}</strong><small>${hardwareValueLabel(control, value)}</small></span></button>`;
  }).join("")}</div>`;
}

function potTurnPercent(control, value) {
  return control.unit === "%" ? Number(value) : ((Number(value) - control.min) / (control.max - control.min)) * 100;
}

function snappedControlValue(control, value) {
  const clamped = clamp(value, Number(control.min), Number(control.max));
  const step = Number(control.step) || 1;
  const snapped = Math.round((clamped - Number(control.min)) / step) * step + Number(control.min);
  return Number(snapped.toFixed(6));
}

function previewPotValue(key, value, target) {
  const preset = hardwarePreset();
  const control = preset.controls.find((item) => item.key === key);
  if (!control || control.type === "select") return;
  const next = snappedControlValue(control, value);
  preset.values[key] = next;
  const module = control.audio ? state.modules[control.audio.module] : null;
  if (module) module.params[control.audio.key] = next;
  const turn = potTurnPercent(control, next);
  target?.querySelector(".physical-knob")?.style.setProperty("--pot-turn", `${-135 + clamp(turn, 0, 100) * 2.7}deg`);
  const readout = target?.querySelector("small");
  if (readout) readout.textContent = hardwareValueLabel(control, next);
  const inspectorOutput = $(`#hardware-value-${key}`);
  if (inspectorOutput) inspectorOutput.textContent = hardwareValueLabel(control, next);
  const calculation = $(".hardware-calculation");
  if (calculation) calculation.innerHTML = hardwareCalculation(preset);
  if (!previewPotValue.audioFrame) previewPotValue.audioFrame = requestAnimationFrame(() => {
    previewPotValue.audioFrame = null;
    rebuildAudioGraph();
  });
}

function finishPotTurn() {
  const drag = state.knobDrag;
  if (!drag) return;
  state.knobDrag = null;
  if (!drag.moved) return;
  state.suppressKnobClickUntil = Date.now() + 450;
  renderHardwareControls();
  renderIllustratedBom();
  renderConstruction();
  rebuildAudioGraph();
  if (!state.audioOn) toggleAudio();
  const control = hardwarePreset().controls.find((item) => item.key === drag.key);
  announce(`${control.ref} turned to ${hardwareValueLabel(control, hardwarePreset().values[drag.key])}. Sound model updated.`);
}

function schematicHotspots(preset) {
  const maps = {
    dual555: [
      ["U1", "", 180, 140, 200, 195], ["U2", "", 605, 140, 200, 195],
      ["R1", "r1", 55, 155, 125, 48], ["P1", "r2", 55, 204, 130, 48], ["C1", "c", 350, 345, 105, 58],
      ["R3", "r1", 480, 155, 125, 48], ["P2", "r2b", 480, 204, 135, 48], ["C3", "c", 775, 345, 105, 58], ["P3", "mix", 675, 392, 235, 48]
    ],
    opampFuzz: [
      ["U1", "", 275, 220, 205, 225], ["R3", "rin", 245, 365, 120, 65], ["R4", "rf", 335, 245, 110, 65],
      ["D1,D2", "diode", 335, 300, 125, 55], ["C4", "toneC", 660, 397, 100, 65], ["P1", "level", 748, 345, 185, 55]
    ],
    glitchClock: [
      ["U1", "", 155, 140, 270, 225], ["P1", "clockR", 365, 115, 210, 70], ["C1", "clockC", 45, 320, 125, 90], ["P2", "depth", 670, 215, 240, 70]
    ]
  };
  return (maps[preset.id] || []).map(([ref,key,x,y,width,height]) => {
    const helpKey = /^R/.test(ref) ? "resistor" : /^P/.test(ref) ? "pot" : /^C/.test(ref) ? "capacitor" : /^D/.test(ref) ? "diode" : /^U/.test(ref) ? "dip8" : "circuit";
    const index = hardwareComponentIndexForRef(ref, preset);
    const selected = index === state.hardwareSelectedIndex || (key && state.hardwareSelectedKey === key);
    return `<g class="interactive-component${selected ? " is-selected" : ""}" data-help-key="${helpKey}" data-component-index="${index}"${key ? ` data-component-key="${key}"` : ""} data-component-ref="${ref}" role="button" tabindex="0" aria-label="Inspect ${ref}. Click, tap, or press Enter."><title>${ref}: inspect this part${key ? " and choose supported values" : ""}</title><rect class="component-hitbox" x="${x}" y="${y}" width="${width}" height="${height}" rx="5"/></g>`;
  }).join("");
}

function closeComponentMenu() {
  const menu = $("#component-menu");
  menu.hidden = true;
  menu.innerHTML = "";
}

function selectHardwarePart(index, key, ref) {
  const preset = hardwarePreset();
  let componentIndex = Number.isInteger(index) ? index : -1;
  if (componentIndex < 0 && key) componentIndex = preset.components.findIndex((component) => component.valueKey === key);
  if (componentIndex < 0 && ref) componentIndex = preset.components.findIndex((component) => component.ref.split(",").some((item) => ref.includes(item.trim())));
  if (componentIndex < 0) componentIndex = 0;
  const component = preset.components[componentIndex];
  state.hardwareSelectedIndex = componentIndex;
  state.hardwareSelectedKey = key || component.valueKey || "";
  state.hardwareSelectedRef = ref || component.ref;
  renderHardwareControls();
  renderIllustratedBom();
  renderConstruction();
}

function openComponentMenu(target, clientX, clientY) {
  selectHardwarePart(Number(target.dataset.componentIndex), target.dataset.componentKey, target.dataset.componentRef);
  closeComponentMenu();
}

async function applyHardwareChoice(key, rawValue) {
  const preset = hardwarePreset();
  const control = preset.controls.find((item) => item.key === key);
  if (!control) return;
  recordHardwareSnapshot();
  const value = control.type === "select" ? rawValue : Number(rawValue);
  preset.values[key] = value;
  const module = control.audio ? state.modules[control.audio.module] : null;
  if (module) module.params[control.audio.key] = value;
  state.modules.forEach((item) => { item.params.supply = preset.values.supply; });
  renderHardwareSelector();
  renderHardwareControls();
  renderIllustratedBom();
  renderConstruction();
  rebuildAudioGraph();
  renderChain();
  renderInspector();
  closeComponentMenu();
  if (!state.audioOn) await toggleAudio();
  announce(`${control.ref} changed to ${hardwareValueLabel(control, value)}. Sound model updated.`);
}

function schematicSvg(preset) {
  const v = preset.values;
  const header = `<svg class="technical-svg" viewBox="0 0 980 520" role="img" aria-label="${preset.name} labeled construction schematic"><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 10 5 0 10z" fill="currentColor"/></marker></defs><rect width="980" height="520" fill="#f7f8f3"/><text x="34" y="42" class="svg-title">${preset.name}</text><text x="34" y="66" class="svg-note">${v.supply} V DC · TOP VIEW PIN REFERENCES · NOT PHYSICALLY TESTED</text>`;
  if (preset.id === "dual555") return `${header}
    <path class="rail plus" d="M70 100H910"/><text x="72" y="92">+${v.supply} V</text><path class="rail ground" d="M70 455H910"/><text x="72" y="478">GND</text>
    <g transform="translate(185 145)"><rect class="ic-body" width="190" height="185"/><path d="M80 0q15 20 30 0" class="symbol"/><text x="95" y="90" text-anchor="middle" class="ic-name">U1 NE555P</text><text x="12" y="25">8 VCC</text><text x="12" y="165">1 GND</text><text x="125" y="25">4 RESET</text><text x="112" y="165">3 OUT</text><text x="12" y="58">7 DISCH</text><text x="12" y="126">2 TRIG</text><text x="116" y="126">6 THRES</text><text x="116" y="58">5 CONT</text></g>
    <g transform="translate(610 145)"><rect class="ic-body" width="190" height="185"/><path d="M80 0q15 20 30 0" class="symbol"/><text x="95" y="90" text-anchor="middle" class="ic-name">U2 NE555P</text><text x="12" y="25">8 VCC</text><text x="12" y="165">1 GND</text><text x="125" y="25">4 RESET</text><text x="112" y="165">3 OUT</text><text x="12" y="58">7 DISCH</text><text x="12" y="126">2 TRIG</text><text x="116" y="126">6 THRES</text><text x="116" y="58">5 CONT</text></g>
    <path class="wire" d="M220 145V100m120 45v-45M645 145v-45m120 45v-45M220 330v125M645 330v125"/>
    <path class="wire blue" d="M197 203H130v70h67m166 0h70v88H320m302-158h-67v70h67m166 0h70v88H745"/>
    <g class="component-label"><text x="78" y="188">R1 ${v.r1} kΩ</text><text x="76" y="226">P1 ${v.r2} kΩ</text><text x="370" y="382">C1 ${v.c} nF</text><text x="502" y="188">R3 ${v.r1} kΩ</text><text x="500" y="226">P2 ${v.r2b} kΩ</text><text x="796" y="382">C3 ${v.c} nF</text></g>
    <path class="wire signal" d="M297 310v75h125m266-75v75H562m-140 0h140"/><rect x="454" y="365" width="76" height="40" class="component-box"/><text x="492" y="390" text-anchor="middle">MIX R5/R6</text><path class="wire signal" d="M530 385h145v45h160"/><text x="700" y="420">P3 ${v.mix}% → C5 → OUTPUT</text>${schematicHotspots(preset)}</svg>`;
  if (preset.id === "opampFuzz") return `${header}
    <path class="rail plus" d="M50 95H930"/><text x="55" y="86">+${v.supply} V</text><path class="rail ground" d="M50 460H930"/><text x="55" y="483">GND</text>
    <path class="wire" d="M120 95v75m0 70v70m0 70v80"/><path class="resistor-symbol" d="M120 170l-10 7 20 12-20 12 20 12-10 7"/><path class="resistor-symbol" d="M120 310l-10 7 20 12-20 12 20 12-10 7"/><text x="138" y="198">R1 100 kΩ</text><text x="138" y="338">R2 100 kΩ</text><circle cx="120" cy="270" r="5"/><text x="140" y="276">VBIAS ≈ ${(v.supply/2).toFixed(1)} V</text>
    <path class="wire purple" d="M120 270h160"/><path class="opamp" d="M280 225v90l95-45z"/><text x="295" y="251">+ 5</text><text x="295" y="298">− 6</text><text x="333" y="274">U1B</text><path class="wire purple" d="M375 270h75v75h-145v-48"/><text x="385" y="257">7 VREF ≈ ${(v.supply/2).toFixed(1)} V</text>
    <path class="wire signal" d="M40 385h90"/><text x="42" y="375">INPUT</text><rect x="130" y="365" width="62" height="38" class="component-box"/><text x="161" y="389" text-anchor="middle">C2</text><path class="wire signal" d="M192 385h62"/><path class="resistor-symbol" d="M254 385l8-10 12 20 12-20 12 20 12-10h50"/><text x="260" y="420">R3 ${v.rin} kΩ</text>
    <path class="opamp" d="M360 335v100l110-50z"/><text x="376" y="365">− 2</text><text x="376" y="415">+ 3</text><text x="413" y="389">U1A</text><path class="wire purple" d="M360 410H280V270"/><path class="wire signal" d="M470 385h92"/>
    <path class="wire orange" d="M455 355v-72H330v72"/><path class="resistor-symbol" d="M355 283l8-10 12 20 12-20 12 20 12-10"/><text x="348" y="261">R4 ${v.rf} kΩ</text><path class="wire yellow" d="M350 320h84"/><path class="diode-symbol" d="M370 310v20l22-10zm22-10v40m20-30v20l-22-10zm-22-10v40"/><text x="350" y="345">D1/D2 ${v.diode} antiparallel</text>
    <rect x="562" y="365" width="95" height="40" class="component-box"/><text x="609" y="389" text-anchor="middle">R5 10 kΩ</text><path class="wire signal" d="M657 385h78"/><path class="wire" d="M705 385v75"/><text x="674" y="440">C4 ${v.toneC} nF</text><path class="wire signal" d="M735 385h195"/><text x="755" y="374">P1 ${v.level}% → C3 → OUTPUT</text>${schematicHotspots(preset)}</svg>`;
  return `${header}
    <path class="rail plus" d="M60 95H920"/><text x="65" y="86">+${v.supply} V</text><path class="rail ground" d="M60 445H920"/><text x="65" y="470">GND</text>
    <rect x="165" y="150" width="250" height="205" class="ic-body"/><text x="290" y="185" text-anchor="middle" class="ic-name">U1 CD40106BE · PDIP-14</text><path class="inverter" d="M240 225v80l95-40z"/><circle cx="346" cy="265" r="11" class="symbol"/><text x="205" y="270">1 A</text><text x="355" y="270">2 /A</text><text x="180" y="330">14 VDD → +${v.supply} V · 7 VSS → GND</text>
    <path class="wire blue" d="M357 265h145v-105H210v65"/><path class="resistor-symbol" d="M410 160l8-10 12 20 12-20 12 20 12-10"/><text x="382" y="138">R1 1 kΩ + P1 ${v.clockR} kΩ</text><path class="wire" d="M210 265H110v180"/><path d="M90 355h40m-40 14h40" class="symbol"/><text x="62" y="342">C1</text><text x="54" y="390">${v.clockC} µF</text>
    <path class="wire signal" d="M357 265h205"/><path class="resistor-symbol" d="M500 265l8-10 12 20 12-20 12 20 12-10"/><rect x="562" y="245" width="70" height="40" class="component-box"/><text x="597" y="270" text-anchor="middle">C2 1 µF</text><path class="wire signal" d="M632 265h270"/><text x="682" y="249">P2 ${v.depth}% → OUTPUT</text><text x="515" y="330">Unused inputs 3, 5, 9, 11, 13 → GND</text>${schematicHotspots(preset)}</svg>`;
}

function holePoint(hole) {
  const rail = hole[0] === "+" || hole[0] === "-";
  if (rail) return { x: 54 + (Number(hole.slice(1)) - 1) * 24, y: hole[0] === "+" ? 57 : 82 };
  const letter = hole[0].toUpperCase();
  const col = Number(hole.slice(1));
  const ys = { A:132, B:152, C:172, D:192, E:212, F:262, G:282, H:302, I:322, J:342 };
  return { x: 54 + (col - 1) * 24, y: ys[letter] };
}

function placementValueLabel(preset, part) {
  if (part.valueKey) {
    return hardwareValueLabel(
      preset.controls.find((item) => item.key === part.valueKey),
      preset.values[part.valueKey]
    );
  }
  if (part.label && part.label !== part.ref) return part.label;
  const component = preset.components.find((item) =>
    item.ref.split(",").map((ref) => ref.trim()).includes(part.ref)
  );
  return String(component?.value || part.label || "").replace(/,\s*.*/, "");
}

function breadboardSvg(preset) {
  let holes = "";
  for (let col = 1; col <= 30; col++) {
    const x = 54 + (col - 1) * 24;
    holes += `<text x="${x}" y="118" text-anchor="middle">${col}</text><circle cx="${x}" cy="57" r="3" class="rail-hole plus-hole"/><circle cx="${x}" cy="82" r="3" class="rail-hole ground-hole"/>`;
    for (const y of [132,152,172,192,212,262,282,302,322,342]) holes += `<circle cx="${x}" cy="${y}" r="3.2" class="board-hole"/>`;
  }
  const letters = Object.entries({A:132,B:152,C:172,D:192,E:212,F:262,G:282,H:302,I:322,J:342}).map(([l,y])=>`<text x="20" y="${y+4}">${l}</text>`).join("");
  const wires = preset.boardWires.map(([from,to,color],index) => { const a=holePoint(from), b=holePoint(to), path=`M${a.x} ${a.y} C${a.x} ${(a.y+b.y)/2} ${b.x} ${(a.y+b.y)/2} ${b.x} ${b.y}`; return `<g class="interactive-wire${state.selectedWireIndex === index ? " is-selected" : ""}" data-help-key="wire" data-wire-index="${index}" data-wire-ref="${from} → ${to}" role="button" tabindex="0" aria-label="Signal wire ${from} to ${to}. Click to add a sound stage."><title>${from} to ${to}: click to add a behavioral sound stage</title><path class="wire-hit" d="${path}"/><path class="board-wire ${color}" d="${path}"/><circle cx="${a.x}" cy="${a.y}" r="5" class="wire-end ${color}"/><circle cx="${b.x}" cy="${b.y}" r="5" class="wire-end ${color}"/></g>`; }).join("");
  const parts = preset.placements.map((part) => {
    if (part.kind.startsWith("dip")) {
      const pins = part.kind === "dip14" ? 7 : 4;
      const x = 54 + (part.col - 1) * 24 - 8;
      const width = (pins - 1) * 24 + 16;
      const pinLabels = Array.from({length:pins},(_,i)=>`<text x="${x+8+i*24}" y="253" text-anchor="middle">${i+1}</text><text x="${x+8+i*24}" y="228" text-anchor="middle">${pins*2-i}</text>`).join("");
      return interactiveSvgGroup(part, `<g><rect x="${x}" y="218" width="${width}" height="38" class="board-ic"/><path d="M${x} 229q13 8 0 16" class="symbol"/><circle cx="${x+10}" cy="226" r="3" class="board-pin-one"/><text x="${x+width/2}" y="244" text-anchor="middle" class="board-label">${part.ref} ${part.label}</text>${pinLabels}</g>`);
    }
    const a=holePoint(part.from), b=holePoint(part.to), mx=(a.x+b.x)/2, my=(a.y+b.y)/2;
    const value = placementValueLabel(preset, part);
    if (part.kind === "resistor") {
      const bands = resistorBands(value).map(([name,color],index)=>`<rect class="board-resistor-band" x="${mx-14+index*7}" y="${my-8}" width="4" height="16" style="fill:${color}"><title>${name}</title></rect>`).join("");
      return interactiveSvgGroup(part, `<g><path d="M${a.x} ${a.y}L${mx-22} ${my}m44 0L${b.x} ${b.y}" class="part-lead"/><rect x="${mx-22}" y="${my-8}" width="44" height="16" rx="6" class="board-resistor"/>${bands}<text x="${mx}" y="${my-12}" text-anchor="middle" class="board-label">${part.ref} ${value}</text></g>`);
    }
    if (part.kind === "diode") return interactiveSvgGroup(part, `<g><path d="M${a.x} ${a.y}L${mx-20} ${my}m40 0L${b.x} ${b.y}" class="part-lead"/><rect x="${mx-20}" y="${my-7}" width="40" height="14" class="board-diode"/><path d="M${mx+12} ${my-7}v14" class="diode-band"/><text x="${mx}" y="${my-12}" text-anchor="middle" class="board-label">${part.ref} ${value}</text></g>`);
    if (part.kind === "electrolytic") return interactiveSvgGroup(part, `<g><path d="M${a.x} ${a.y}L${mx-12} ${my}m24 0L${b.x} ${b.y}" class="part-lead"/><rect x="${mx-12}" y="${my-14}" width="24" height="28" rx="5" class="board-electrolytic"/><rect x="${mx+5}" y="${my-14}" width="5" height="28" class="board-electrolytic-stripe"/><text x="${mx-17}" y="${my-9}" class="board-polarity">+</text><text x="${mx}" y="${my-18}" text-anchor="middle" class="board-label">${part.ref} ${value}</text></g>`);
    return interactiveSvgGroup(part, `<g><path d="M${a.x} ${a.y}L${mx-13} ${my}m26 0L${b.x} ${b.y}" class="part-lead"/><rect x="${mx-13}" y="${my-12}" width="26" height="24" rx="3" class="board-film-cap"/><text x="${mx}" y="${my+3}" text-anchor="middle" class="board-component-value">${String(value).replace(/\s.*/,"")}</text><text x="${mx}" y="${my-17}" text-anchor="middle" class="board-label">${part.ref} ${value}</text></g>`);
  }).join("");
  return `<svg class="technical-svg breadboard-svg" viewBox="0 0 790 410" role="img" aria-label="${preset.name} breadboard placement, top view"><rect x="4" y="20" width="780" height="370" rx="8" class="breadboard-body"/><path d="M35 232H765" class="board-trench"/><path d="M35 57H765M35 82H765" class="board-rail"/><text x="20" y="61" class="plus-text">+</text><text x="20" y="86" class="minus-text">−</text>${letters}${holes}${wires}${parts}<text x="395" y="382" text-anchor="middle" class="svg-note">TOP VIEW · BB830-STYLE · VERIFY RAIL CONTINUITY · CONNECTION TABLE IS AUTHORITATIVE</text></svg>`;
}

function dynamicSupplyText(text, preset) {
  return String(text)
    .replaceAll("+9V", `+${preset.values.supply}V`)
    .replaceAll("9 V", `${preset.values.supply} V`)
    .replaceAll("4.5 V", `${(preset.values.supply / 2).toFixed(1)} V`);
}

function assemblyPhase(index, total) {
  const ratio = index / Math.max(1, total - 1);
  if (ratio < .18) return { name: "Prepare", icon: "01", check: "Power is disconnected; rails and exact part identities are confirmed." };
  if (ratio < .38) return { name: "Place", icon: "02", check: "Package notch, pin 1, component value, and polarity match the top-view drawing." };
  if (ratio < .76) return { name: "Wire", icon: "03", check: "Each endpoint matches one row in Connections; no lead shares an unintended hole." };
  if (ratio < .92) return { name: "Inspect", icon: "04", check: "Continuity and resistance checks agree with the unpowered circuit." };
  return { name: "Test", icon: "05", check: "Current limit is set, controls start low, and expected test points are known before power." };
}

function assemblyTutorial(preset) {
  const steps = preset.assembly;
  state.assemblyStep = clamp(state.assemblyStep, 0, steps.length - 1);
  const index = state.assemblyStep;
  const phase = assemblyPhase(index, steps.length);
  const completed = new Set(state.assemblyCompleted[preset.id] || []);
  const progress = Math.round((completed.size / steps.length) * 100);
  const step = dynamicSupplyText(steps[index], preset);
  const measurement = phase.name === "Test"
    ? `Expected first check: supply pins should measure about ${preset.values.supply.toFixed(1)} V relative to ground. Keep the output connected only to a powered speaker or high-impedance audio input.`
    : phase.name === "Inspect"
      ? "Meter mode: continuity with power disconnected. A beep means the two probes share a conductive path; compare that path with the Connections tab."
      : "Keep the supply disconnected. Complete only this step, then compare every endpoint with the breadboard and Connections views.";
  return `<div class="assembly-tutorial">
    <div class="assembly-progress"><div><span>Guided build · ${phase.name}</span><strong>${progress}% checked</strong></div><div class="assembly-progress-track"><i style="width:${progress}%"></i></div></div>
    <div class="assembly-tutorial-layout">
      <nav class="assembly-step-list" aria-label="Assembly steps">${steps.map((item,stepIndex)=>`<button type="button" data-assembly-step="${stepIndex}"${stepIndex === index ? ` aria-current="step"` : ""}${completed.has(stepIndex) ? ` class="is-complete"` : ""}><span>${String(stepIndex+1).padStart(2,"0")}</span><b>${assemblyPhase(stepIndex,steps.length).name}</b><i aria-hidden="true">${completed.has(stepIndex) ? "✓" : ""}</i></button>`).join("")}</nav>
      <article class="assembly-active-step">
        <div class="assembly-phase-visual" aria-hidden="true"><span>${phase.icon}</span><i></i><i></i><i></i></div>
        <p class="evidence-label">Step ${index + 1} of ${steps.length} · ${phase.name}</p>
        <h3>${step}</h3>
        <section><strong>Verify before continuing</strong><p>${phase.check}</p></section>
        <section><strong>Meter or observation checkpoint</strong><p>${measurement}</p></section>
        ${/^Wire|Place/.test(phase.name) ? `<aside><strong>Off-board knob wiring</strong><p>Identify lugs 1, 2 (wiper), and 3 from the exact potentiometer drawing. For a rheostat, tie the wiper to the specified outer lug. If soldering is required, an adult should tin the wire, crimp it through the lug, heat the joint briefly, apply only enough solder to flow, and let it cool without movement.</p></aside>` : ""}
        <div class="assembly-actions"><button type="button" data-assembly-previous${index === 0 ? " disabled" : ""}>← Previous</button><button type="button" class="assembly-check" data-assembly-complete>${completed.has(index) ? "Checked ✓" : "Mark checked"}</button><button type="button" data-assembly-next${index === steps.length - 1 ? " disabled" : ""}>Next →</button></div>
      </article>
    </div>
    <p class="assembly-source-note">Tutorial structure adapts the supplied circuit-bending construction reference: prepare, place controls, make one connection at a time, inspect joints and paths, then test cautiously. This app uses the preset's audited breadboard instructions and does not reproduce the book's project text.</p>
  </div>`;
}

function synthBoardSvg(item) {
  const count = item.blocks.length;
  const step = count > 1 ? 730 / (count - 1) : 0;
  const points = item.blocks.map((block,index)=>({block,x:85+index*step,y:index%2?215:145}));
  const traces = points.slice(0,-1).map((point,index)=>{const next=points[index+1];return `<path d="M${point.x+55} ${point.y}H${(point.x+next.x)/2}V${next.y}H${next.x-55}" class="synth-board-trace"/><circle cx="${(point.x+next.x)/2}" cy="${next.y}" r="4" class="synth-board-via"/>`;}).join("");
  const blocks = points.map((point,index)=>{
    const compact = point.block.replace(/\s*\/.*/,"");
    const shortLabel = compact.length > 15 ? `${compact.slice(0,14)}…` : compact;
    const pins = Array.from({length:4},(_,pin)=>`<path d="M${point.x-35+pin*23} ${point.y-38}v-10M${point.x-35+pin*23} ${point.y+38}v10" class="synth-board-pin"/>`).join("");
    return `<g class="synth-board-block"><title>${point.block}</title><rect x="${point.x-54}" y="${point.y-38}" width="108" height="76" rx="5"/><path d="M${point.x-10} ${point.y-38}q10 12 20 0" class="synth-board-notch"/>${pins}<text x="${point.x}" y="${point.y-4}" text-anchor="middle">${String(index+1).padStart(2,"0")}</text><text x="${point.x}" y="${point.y+15}" text-anchor="middle" class="synth-board-name">${shortLabel}</text></g>`;
  }).join("");
  const components = Array.from({length:18},(_,index)=>{const x=48+(index%9)*96,y=index<9?68:300;return index%3===0?`<g><path d="M${x-22} ${y}h10l5-7 10 14 10-14 5 7h10" class="synth-board-part"/><text x="${x}" y="${y-12}" text-anchor="middle">R${index+1}</text></g>`:`<g><path d="M${x-18} ${y}h14m8 0h14M${x-4} ${y-10}v20M${x+4} ${y-10}v20" class="synth-board-part"/><text x="${x}" y="${y-12}" text-anchor="middle">C${index+1}</text></g>`;}).join("");
  return `<svg class="technical-svg synth-board-svg" viewBox="0 0 900 370" role="img" aria-label="${item.name} educational functional circuit board"><rect x="8" y="8" width="884" height="354" rx="7" class="synth-board-pcb"/><path d="M30 38H870M30 334H870" class="synth-board-rail"/><text x="34" y="31">+V</text><text x="34" y="352">GND</text>${components}${traces}${blocks}<text x="450" y="345" text-anchor="middle" class="synth-board-caption">EDUCATIONAL FUNCTIONAL MAP · NOT A PCB LAYOUT OR CONSTRUCTION SCHEMATIC</text></svg>`;
}

function effectComponentKind(parameter) {
  const text=`${parameter.key} ${parameter.label}`.toLowerCase();
  if(parameter.type==="select"&&text.includes("diode")) return "diode";
  if(text.includes("capacitor")||/^c/.test(parameter.key)) return "capacitor";
  if(text.includes("resistor")||/^r/.test(parameter.key)) return "resistor";
  return "pot";
}

function effectCircuitDetail(item) {
  const definition=MODULES[item.moduleType];
  const params=state.effectCircuitValues[item.moduleType];
  const calculation=calculateModule({type:item.moduleType,params});
  const controls=definition.params.map((parameter,index)=>{
    const kind=effectComponentKind(parameter);
    const value=parameter.type==="select"?parameter.options.find((option)=>option.value===params[parameter.key])?.label||params[parameter.key]:formatValue(parameter,params[parameter.key]);
    const control=parameter.type==="select"
      ? `<select data-effect-circuit-param="${parameter.key}">${parameter.options.map((option)=>`<option value="${option.value}"${option.value===params[parameter.key]?" selected":""}>${option.label}</option>`).join("")}</select>`
      : `<input type="range" min="${parameter.min}" max="${parameter.max}" step="${parameter.step}" value="${params[parameter.key]}" data-effect-circuit-param="${parameter.key}"><output>${value}</output>`;
    return `<label class="effect-component-card"><span>${String(index+1).padStart(2,"0")} · ${parameter.label}</span>${componentIcon({kind,displayValue:value,name:parameter.label})}${control}<small>${parameter.role}</small></label>`;
  }).join("");
  return `<article class="synth-circuit-viewer effect-circuit-viewer"><header><div><span>${item.maker}</span><h3>${item.name}</h3></div><b>${item.status}</b></header><div class="synth-board-wrap">${synthBoardSvg(item)}</div><div class="synth-flow">${item.blocks.map((block,index)=>`<span>${block}${index<item.blocks.length-1?`<i>→</i>`:""}</span>`).join("")}</div><div class="effect-circuit-actions"><p>Change a component below to update the calculated relationship and the browser model. These behavioral study folders do not replace an audited physical netlist.</p><button type="button" data-add-effect-circuit="${item.moduleType}">Add this circuit to Studio</button></div><div class="effect-component-grid">${controls}</div><div class="calculation-box"><p class="evidence-label">Calculated relationship</p><h4>${calculation.title}</h4><p class="formula">${calculation.formula}</p><p>${calculation.substitution}</p><p><strong>${calculation.result}</strong></p><p>${calculation.why}</p></div></article>`;
}

function effectFolderPreview(item) {
  if(!item.moduleType) return "";
  const definition=MODULES[item.moduleType];
  const numeric=definition.params.filter((parameter)=>parameter.type!=="select").slice(0,2);
  return `<div class="folder-component-preview">${numeric.map((parameter)=>componentIcon({kind:effectComponentKind(parameter),displayValue:formatValue(parameter,state.effectCircuitValues[item.moduleType][parameter.key]),name:parameter.label})).join("")}</div>`;
}

function synthReferenceView() {
  const choices=[...EFFECT_CIRCUITS,...SYNTH_REFERENCES];
  const selected = choices.find((item)=>item.id===state.selectedSynthReference) || choices[0];
  const list=(items,label)=>`<span class="synth-list-heading">${label}</span>${items.map((item)=>`<button type="button" class="synth-reference-card${item.id===selected.id?" is-selected":""}" data-synth-reference="${item.id}" aria-pressed="${item.id===selected.id}">${effectFolderPreview(item)}<span>${item.maker}</span><strong>${item.name}</strong><small>${item.status}</small></button>`).join("")}`;
  const detail=selected.moduleType?effectCircuitDetail(selected):`<article class="synth-circuit-viewer"><header><div><span>${selected.maker}</span><h3>${selected.name}</h3></div><b>${selected.status}</b></header><div class="synth-board-wrap">${synthBoardSvg(selected)}</div><div class="synth-flow">${selected.blocks.map((block,index)=>`<span>${block}${index<selected.blocks.length-1?`<i>→</i>`:""}</span>`).join("")}</div><p>${selected.note}</p><a href="${selected.source}" target="_blank" rel="noopener noreferrer">View the exact official source ↗</a></article>`;
  return `<section id="construction-synths" class="construction-section workspace-view"><div class="graphic-heading"><div><p class="evidence-label">Clickable circuit explorer</p><h2>Effect and synth circuits</h2></div><span>Select a folder to display its circuit and parts</span></div><p class="synth-reference-boundary">Studio effect folders expose switchable behavioral components and calculations. Manufacturer references show documented signal flow and link the official source; they are not presented as construction-ready PCB layouts.</p><div class="synth-explorer"><nav class="synth-reference-list" aria-label="Effect and synth circuit choices">${list(EFFECT_CIRCUITS,"Studio effect circuits")}${list(SYNTH_REFERENCES,"Manufacturer references")}</nav>${detail}</div></section>`;
}

function renderConstruction() {
  const preset = hardwarePreset();
  const panel = $("#construction-panel");
  const pinouts = preset.pinouts.map((key) => {
    const item = window.HARDWARE_PINOUTS[key];
    return `<section class="pinout-section"><h3>${item.identity}</h3><p>${item.orientation}</p><div class="connection-table-wrap"><table class="connection-table pinout-table"><thead><tr><th>Pin</th><th>Name</th><th>Role in this component</th></tr></thead><tbody>${item.pins.map(([number,name,role])=>`<tr><td>${number}</td><td><strong>${name}</strong></td><td>${role}</td></tr>`).join("")}</tbody></table></div><a href="${item.source}" target="_blank" rel="noopener noreferrer">Open manufacturer source ↗</a></section>`;
  }).join("");
  const views = {
    breadboard: `<section id="construction-breadboard" class="construction-section workspace-view"><div class="graphic-heading"><div><p class="evidence-label">Physical layout</p><h2>${preset.name} breadboard</h2></div><span>Click any part to inspect it · editable values open the illustrated library</span><button class="inline-circuit-test" type="button" data-test-circuit>Test circuit</button></div><div class="canvas-zoom-surface">${breadboardSvg(preset)}${renderPotControls(preset)}</div><p class="graphic-caption"><strong>Main circuit-bending workflow:</strong> select a part, install a supported value, hear the behavioral result, then use Test circuit before building. Wire clicks can add behavioral sound stages; physical wiring stays locked to the audited preset.</p></section>`,
    schematic: `<section id="construction-schematic" class="construction-section workspace-view"><div class="graphic-heading"><div><p class="evidence-label">Electrical view</p><h2>${preset.name} schematic</h2></div><span>Click highlighted parts to inspect them; editable parts open substitutions</span><button class="inline-circuit-test" type="button" data-test-circuit>Test circuit</button></div><div class="canvas-zoom-surface">${schematicSvg(preset)}</div><p class="graphic-caption"><strong>Calculated and browser-simulated:</strong> values, formulas, BOM, and supported sound parameters stay synchronized. This is not a physically measured result.</p></section>`,
    connections: `<section id="construction-connections" class="construction-section workspace-view"><div class="graphic-heading"><div><p class="evidence-label">Authoritative netlist</p><h2>Wire-by-wire connections</h2></div><span>${preset.connections.length} audited nets</span></div><div class="connection-table-wrap"><table class="connection-table"><thead><tr><th>Net</th><th>Connection path</th><th>Wire</th><th>Check</th></tr></thead><tbody>${preset.connections.map((row)=>`<tr><td><strong>${dynamicSupplyText(row[0],preset)}</strong></td><td>${row.slice(1,-2).map((cell)=>dynamicSupplyText(cell,preset)).join(" → ")}</td><td><span class="wire-swatch ${row.at(-2)}"></span>${row.at(-2)}</td><td>${dynamicSupplyText(row.at(-1),preset)}</td></tr>`).join("")}</tbody></table></div></section>`,
    pinouts: `<section id="construction-pinouts" class="construction-section workspace-view"><div class="graphic-heading"><div><p class="evidence-label">Manufacturer sources</p><h2>Package orientation and pins</h2></div><span>Top view · confirm notch before power</span></div>${pinouts}</section>`,
    assembly: `<section id="construction-assembly" class="construction-section workspace-view"><div class="graphic-heading"><div><p class="evidence-label">Guided physical build</p><h2>Assemble with power disconnected</h2></div><span>Follow, verify, and check one step at a time</span></div>${assemblyTutorial(preset)}</section>`,
    synths: synthReferenceView()
  };
  panel.innerHTML = views[state.constructionView] || views.breadboard;
  panel.style.setProperty("--workspace-zoom", String(state.workspaceZoom / 100));
  $$("[data-construction]").forEach((button) => {
    const active = button.dataset.construction === state.constructionView;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
}

function renderHardwareSources() {
  const preset = hardwarePreset();
  $("#hardware-sources").innerHTML = `<strong>Pinout sources</strong>${preset.sources.map(([label,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`).join("")}`;
}

function renderHardware() {
  const preset = hardwarePreset();
  if (!preset.defaultValues) preset.defaultValues = { ...preset.values };
  renderHardwareSelector();
  renderHardwareControls();
  renderIllustratedBom();
  renderConstruction();
  renderHardwareSources();
  $(".hardware-status span:last-child").textContent = `${preset.values.supply} V DC · calculated + browser-simulated · not physically tested`;
}

function resetHardwareSelection() {
  const preset = hardwarePreset();
  const index = Math.max(0, preset.components.findIndex((component) => component.valueKey));
  const component = preset.components[index];
  state.hardwareSelectedIndex = index;
  state.hardwareSelectedKey = component?.valueKey || "";
  state.hardwareSelectedRef = component?.ref || "";
  state.hardwareHistory = [];
  state.hardwareRedo = [];
  state.assemblyStep = 0;
  state.partsFilter = "";
  $("#parts-search").value = "";
}

function restoreHardwareSnapshot(snapshot) {
  const preset = hardwarePreset();
  preset.values = JSON.parse(snapshot);
  preset.controls.forEach((control) => {
    const module = control.audio ? state.modules[control.audio.module] : null;
    if (module) module.params[control.audio.key] = preset.values[control.key];
  });
  state.modules.forEach((item) => { item.params.supply = preset.values.supply; });
  renderHardwareSelector();
  renderHardwareControls();
  renderIllustratedBom();
  renderConstruction();
  rebuildAudioGraph();
  renderChain();
  renderInspector();
  updateUndoButtons();
}

function undoHardwareChange() {
  if (!state.hardwareHistory.length) return;
  state.hardwareRedo.push(JSON.stringify(hardwarePreset().values));
  restoreHardwareSnapshot(state.hardwareHistory.pop());
  announce("Component change undone.");
}

function redoHardwareChange() {
  if (!state.hardwareRedo.length) return;
  state.hardwareHistory.push(JSON.stringify(hardwarePreset().values));
  restoreHardwareSnapshot(state.hardwareRedo.pop());
  announce("Component change restored.");
}

function loadHardwareSound() {
  const preset = hardwarePreset();
  state.modules = preset.chain.map((type) => ({ id: nextId++, type, bypassed: false, params: freshParams(type) }));
  preset.controls.forEach((control) => {
    const module = control.audio ? state.modules[control.audio.module] : null;
    if (module) module.params[control.audio.key] = preset.values[control.key];
  });
  state.modules.forEach((item) => { item.params.supply = preset.values.supply; });
  if (preset.id === "dual555") state.modules[0].params.voices = "dual";
  if (preset.id === "dual555" || preset.id === "glitchClock") state.modules[0].params.hardwareOnly = true;
  state.selectedId = state.modules[0]?.id ?? null;
  state.hardwareBaseCount = state.modules.length;
  state.hardwareLoadedId = preset.id;
  renderStudio();
  rebuildAudioGraph();
  announce(`${preset.name} sound model connected. Press Start sound, then change a component.`);
}

async function addHardwareSoundStage(type) {
  if (!MODULES[type]) return;
  const instance = {id:nextId++,type,bypassed:false,params:freshParams(type),hardwareAdded:true};
  state.modules.push(instance);
  state.selectedId = instance.id;
  rebuildAudioGraph();
  renderChain();
  renderInspector();
  renderHardwareControls();
  if (!state.audioOn) await toggleAudio();
  announce(`${MODULES[type].name} added to the behavioral sound chain.`);
}

function removeHardwareSoundStage(id) {
  const instance = state.modules.find((item) => item.id === id);
  if (!instance?.hardwareAdded) return;
  state.modules = state.modules.filter((item) => item.id !== id);
  state.selectedId = state.modules[0]?.id ?? null;
  rebuildAudioGraph();
  renderChain();
  renderInspector();
  renderHardwareControls();
  announce(`${MODULES[instance.type].name} removed from the behavioral sound chain.`);
}

function plannerController() {
  return window.DEVICE_CONTROLLERS.find((item) => item.id === state.plannerController) || window.DEVICE_CONTROLLERS[0];
}

function selectedPlannerDevices() {
  return state.selectedDeviceIds.map((id) => window.DEVICE_LIBRARY.find((item) => item.id === id)).filter(Boolean);
}

function deviceChecks(controller, devices) {
  const checks = [];
  const ids = new Set(devices.map((device) => device.id));
  if (!devices.length) return [{severity:"info",title:"Choose devices",text:"Add at least one sensor, output, chip, or module to generate a pre-build plan."}];
  devices.forEach((device) => {
    const analogBridge = controller.noAdc && device.interfaces.includes("analog") && ids.has("mcp3008");
    const supported = analogBridge || device.interfaces.some((name) => controller.interfaces.includes(name));
    if (!supported) checks.push({severity:"stop",title:`${device.name}: interface unavailable`,text:`${controller.name} does not expose a supported ${device.interfaces.join(" / ")} interface in this planner.`});
    if (controller.noAdc && device.interfaces.includes("analog") && !ids.has("mcp3008")) checks.push({severity:"stop",title:`${device.name}: ADC required`,text:`${controller.name} has no general-purpose analog input. Add the MCP3008 ADC or another verified converter.`});
    if (controller.logic === 3.3 && device.logic === 5) checks.push({severity:"stop",title:`${device.name}: 5 V signal risk`,text:`Protect ${controller.name}'s 3.3 V GPIO with an appropriate level shifter or divider. Never apply a 5 V output directly.`});
    if (controller.logic === 5 && device.logic === 3.3) checks.push({severity:"warn",title:`${device.name}: mixed logic levels`,text:"Confirm that the device input tolerates 5 V and that its 3.3 V output meets the controller's HIGH threshold; add translation when uncertain."});
    if (device.driver === "hbridge" && ![...ids].some((id) => window.DEVICE_LIBRARY.find((item) => item.id === id)?.driverFor === "hbridge")) checks.push({severity:"stop",title:`${device.name}: motor driver missing`,text:"Add a verified H-bridge such as L293D only if its voltage and current ratings exceed the motor's measured stall requirement."});
    if (device.driver === "uln2003" && !ids.has("uln2003")) checks.push({severity:"stop",title:`${device.name}: ULN2003 driver missing`,text:"Add the ULN2003A driver board or IC before connecting this stepper."});
    if (device.driver === "resistor") checks.push({severity:"warn",title:`${device.name}: current limiting`,text:"Calculate and install a series resistor from supply voltage, LED forward voltage, and target current."});
    if (device.externalPower) checks.push({severity:"warn",title:`${device.name}: external power`,text:"Use a supply sized for startup or stall current, add appropriate protection, and connect its ground to controller ground."});
    if (device.verify) checks.push({severity:"warn",title:`${device.name}: exact model required`,text:device.note});
  });
  const addresses = new Map();
  devices.filter((device) => device.address).forEach((device) => {
    if (addresses.has(device.address)) checks.push({severity:"warn",title:"Possible I²C address conflict",text:`${addresses.get(device.address)} and ${device.name} list ${device.address}. Verify actual address straps before wiring.`});
    addresses.set(device.address, device.name);
  });
  if (!checks.some((check) => check.severity === "stop")) checks.unshift({severity:"ready",title:"No blocking rule found",text:"This is a compatibility pre-check, not proof of a safe circuit. Verify every exact part, rating, pinout, and supply before assembly."});
  checks.push({severity:"info",title:"Shared reference",text:"All signal-connected supplies need a common ground unless a specifically designed isolation barrier is used."});
  return checks;
}

function suggestedDeviceConnection(controller, device, devices) {
  const ids = new Set(devices.map((item) => item.id));
  let iface = device.interfaces.find((name) => controller.interfaces.includes(name));
  if (controller.noAdc && device.interfaces.includes("analog") && ids.has("mcp3008")) iface = "spi";
  if (!iface) return {iface:"Unsupported",pins:"No compatible interface",support:"Choose a different controller or verified interface adapter."};
  let pins = controller.pins[iface] || `${iface.toUpperCase()} pins: select after datasheet review`;
  let support = device.note;
  if (device.id === "hcsr04" && controller.logic === 3.3) support = "TRIG from a GPIO; ECHO through a calculated divider or 5-to-3.3 V translator.";
  if (device.driver === "hbridge") support = "Controller PWM/direction → H-bridge inputs; H-bridge outputs → motor; separate motor supply; common ground.";
  if (device.driver === "uln2003") support = "Four controller outputs → ULN2003 inputs; driver outputs → stepper coils; external 5 V motor supply; common ground.";
  if (device.externalPower && !device.driver) support += " Use external load power and join grounds.";
  if (device.id === "mcp3008") support = "Power VDD and VREF at controller logic voltage; connect SPI plus AGND/DGND; analog sensors go to CH0–CH7.";
  return {iface:iface.toUpperCase(),pins,support};
}

function renderDevicePlanner() {
  const controller = plannerController();
  const devices = selectedPlannerDevices();
  $("#planner-controller").innerHTML = window.DEVICE_CONTROLLERS.map((item) => `<option value="${item.id}"${item.id === controller.id ? " selected" : ""}>${item.name} · ${item.logic} V logic</option>`).join("");
  $("#planner-library-count").textContent = `${window.DEVICE_CONTROLLERS.length} boards · ${window.DEVICE_LIBRARY.length} devices`;
  const categories = ["All", ...new Set(window.DEVICE_LIBRARY.map((item) => item.category))];
  $("#device-filters").innerHTML = categories.map((category) => `<button type="button" data-device-category="${category}"${state.deviceCategory === category ? ` aria-pressed="true"` : ""}>${category}</button>`).join("");
  const categoryDevices = state.deviceCategory === "All" ? window.DEVICE_LIBRARY : window.DEVICE_LIBRARY.filter((item) => item.category === state.deviceCategory);
  const subcategories = ["All", ...new Set(categoryDevices.map(deviceSubcategory))];
  if (!subcategories.includes(state.deviceSubcategory)) state.deviceSubcategory = "All";
  $("#device-subcategory").innerHTML = subcategories.map((name) => `<option value="${name}"${name === state.deviceSubcategory ? " selected" : ""}>${name}</option>`).join("");
  const search = state.deviceSearch.trim().toLowerCase();
  const shown = window.DEVICE_LIBRARY.filter((device) => (state.deviceCategory === "All" || device.category === state.deviceCategory) && (state.deviceSubcategory === "All" || deviceSubcategory(device) === state.deviceSubcategory) && (!search || `${device.name} ${device.model} ${device.category} ${deviceSubcategory(device)} ${device.interfaces.join(" ")}`.toLowerCase().includes(search)));
  $("#device-catalog").innerHTML = shown.map((device) => {
    const added = state.selectedDeviceIds.includes(device.id);
    return `<article class="device-card${added ? " is-added" : ""}">${catalogIllustration(device)}<div><span>${device.category} · ${deviceSubcategory(device)}</span><h3>${device.name}</h3><p>${device.model}</p></div><div class="device-tags"><span>${device.logic === "passive" || device.logic === "analog" || device.logic === "load" || device.logic === "unknown" ? device.logic : `${device.logic} V logic`}</span>${device.interfaces.map((name) => `<span>${name.toUpperCase()}</span>`).join("")}</div><button type="button" data-device-add="${device.id}"${added ? " disabled" : ""}>${added ? "Added" : "Add"}</button></article>`;
  }).join("") || `<p class="empty-parts">No supported devices match this filter.</p>`;
  $("#selected-devices").innerHTML = devices.length ? devices.map((device, index) => `<article class="selected-device" data-selected-device="${device.id}" tabindex="0" aria-label="${device.name}. Ctrl-click or use Change to replace."><span>${String(index + 1).padStart(2,"0")}</span>${catalogIllustration(device)}<div><h3>${device.name}</h3><p>${device.model} · ${device.supply || "Supply determined by circuit"}</p></div><button class="selected-change" type="button" data-device-change="${device.id}">Change</button><button type="button" data-device-remove="${device.id}" aria-label="Remove ${device.name}">×</button></article>`).join("") : `<div class="empty-build"><strong>No devices selected</strong><p>Choose parts from the supported library to build a compatibility and connection plan.</p></div>`;
  const rows = devices.map((device) => {
    const connection = suggestedDeviceConnection(controller, device, devices);
    return `<tr><td><strong>${device.name}</strong></td><td>${connection.iface}</td><td>${connection.pins}</td><td>${connection.support}</td></tr>`;
  }).join("");
  $("#connection-plan-content").innerHTML = devices.length ? `<div class="controller-summary"><span>Controller</span><strong>${controller.name}</strong><p>${controller.logic} V GPIO · ${controller.supply}</p><small>${controller.note}</small></div><div class="connection-table-wrap"><table class="connection-table"><thead><tr><th>Device</th><th>Interface</th><th>Example controller pins</th><th>Required support / connection</th></tr></thead><tbody>${rows}</tbody></table></div><p class="planner-disclaimer">Example pins are a starting assignment. Confirm conflicts with code, shields, boot pins, alternate functions, and the exact board pinout before construction.</p>` : `<p class="empty-parts">The connection plan appears after devices are added.</p>`;
  const checks = deviceChecks(controller, devices);
  const stopCount = checks.filter((check) => check.severity === "stop").length;
  $("#compatibility-report").innerHTML = `<div class="report-summary ${stopCount ? "has-stops" : "is-ready"}"><span>${stopCount ? "Do not wire yet" : "Ready for detailed design"}</span><strong>${stopCount ? `${stopCount} blocking item${stopCount === 1 ? "" : "s"}` : "Pre-check complete"}</strong></div>${checks.map((check) => `<article class="check-item ${check.severity}"><span>${check.severity}</span><strong>${check.title}</strong><p>${check.text}</p></article>`).join("")}<div class="planner-safety"><strong>Low-voltage boundary</strong><p>Use only 3.3–12 V DC student circuits. Motors, servos, batteries, pumps, and soldering require supervision. Do not connect household mains.</p></div>`;
}

function showView(viewId) {
  $$(".view").forEach((view) => { view.hidden = view.id !== viewId; view.classList.toggle("is-active", view.id === viewId); });
  $$(".tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === viewId));
  if (viewId === "build") renderBom();
  if (viewId === "hardware") renderHardware();
  if (viewId === "devices") renderDevicePlanner();
  if (window.location.hash !== `#${viewId}`) history.replaceState(null, "", `#${viewId}`);
  const heading = $(`#${viewId} h1`);
  if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const add = event.target.closest("[data-add]");
    if (add) return addModule(add.dataset.add);
    const nudge = event.target.closest("[data-module-nudge]");
    if (nudge) return nudgeModule(Number(nudge.dataset.moduleId), nudge.dataset.moduleNudge);
    const remove = event.target.closest("[data-remove]");
    if (remove) return removeModule(Number(remove.dataset.remove));
    const voiceAssign=event.target.closest("[data-assign-voice-param]");
    if(voiceAssign&&state.midiLearnMode) return assignMacroToVoice(voiceAssign.dataset.assignVoiceParam);
    const assign = event.target.closest("[data-assign-module]");
    if (assign && state.midiLearnMode) return assignMacroToParameter(Number(assign.dataset.assignModule),assign.dataset.assignParam);
    const select = event.target.closest("[data-select]");
    if (select) { state.selectedId = Number(select.dataset.select); renderChain(); renderInspector(); renderKaossPad(); return; }
    const bypass = event.target.closest("[data-bypass]");
    if (bypass) {
      const instance = state.modules.find((item) => item.id === Number(bypass.dataset.bypass));
      instance.bypassed = !instance.bypassed; renderStudio(); rebuildAudioGraph(); announce(instance.bypassed ? "Module bypassed." : "Module enabled."); return;
    }
    const move = event.target.closest("[data-move]");
    if (move) return moveModule(state.selectedId, Number(move.dataset.move));
    const tab = event.target.closest(".tab");
    if (tab) return showView(tab.dataset.view);
  });

  $("#midi-learn-toggle").addEventListener("click",()=>toggleMidiLearn());
  $("#arp-octave").addEventListener("input",(event)=>setArpOctave(event.target.value));
  setArpOctave(state.arpOctave);
  $("#arp-octave-down").addEventListener("click",()=>setArpOctave(state.arpOctave-1));
  $("#arp-octave-up").addEventListener("click",()=>setArpOctave(state.arpOctave+1));
  $("#global-octave").addEventListener("input",(event)=>setGlobalOctave(event.target.value));
  $("#kaoss-reset").addEventListener("click",()=>applyKaossPosition(.5,.5));
  const updateKaossFromPointer=(event)=>{
    const pad=$("#kaoss-pad"), rect=pad.getBoundingClientRect();
    applyKaossPosition((event.clientX-rect.left)/rect.width,1-(event.clientY-rect.top)/rect.height,false);
  };
  $("#kaoss-pad").addEventListener("pointerdown",(event)=>{event.currentTarget.setPointerCapture(event.pointerId);updateKaossFromPointer(event);});
  $("#kaoss-pad").addEventListener("pointermove",(event)=>{if(event.currentTarget.hasPointerCapture(event.pointerId))updateKaossFromPointer(event);});
  $("#kaoss-pad").addEventListener("keydown",(event)=>{
    const delta=.04; let x=state.kaossX,y=state.kaossY;
    if(event.key==="ArrowLeft")x-=delta; else if(event.key==="ArrowRight")x+=delta; else if(event.key==="ArrowDown")y-=delta; else if(event.key==="ArrowUp")y+=delta; else return;
    event.preventDefault();applyKaossPosition(x,y,false);
  });
  $("#macro-knobs").addEventListener("click",(event)=>{
    const select=event.target.closest("[data-macro-select]");
    if(!select) return;
    state.activeMacro=Number(select.dataset.macroSelect);
    if(!state.midiLearnMode) state.midiLearnMode=true;
    connectMidiLearn(); renderMacroPanel(); renderChain(); renderInspector();
  });
  $("#macro-knobs").addEventListener("input",(event)=>{
    const control=event.target.closest("[data-macro-value]");
    if(control) setMacroValue(Number(control.dataset.macroValue),control.value);
  });
  document.addEventListener("keydown",(event)=>{
    if(event.metaKey && event.key.toLowerCase()==="m") { event.preventDefault(); toggleMidiLearn(); }
  });

  $("#inspector-content").addEventListener("input", (event) => {
    if (event.target.matches("[data-param]")) updateSelectedParam(event.target.dataset.param, event.target.value);
  });
  $("#inspector-content").addEventListener("change", (event) => {
    if (event.target.matches("select[data-param]")) updateSelectedParam(event.target.dataset.param, event.target.value);
  });
  $("#audio-toggle").addEventListener("pointerdown", primeAudioFromGesture);
  $("#hardware-audio-toggle").addEventListener("pointerdown", primeAudioFromGesture);
  $("#sequencer-start").addEventListener("pointerdown", primeAudioFromGesture);
  $("#synth-keyboard").addEventListener("pointerdown", primeAudioFromGesture, {capture:true});
  $("#audio-toggle").addEventListener("click", toggleAudio);
  $("#hardware-audio-toggle").addEventListener("click", toggleAudio);
  $("#hardware-source-select").addEventListener("change", async (event) => {
    state.source = event.target.value;
    $("#source-select").value = state.source;
    if (state.audioOn) await startSource();
  });
  $("#master-volume").addEventListener("input", (event) => {
    const value = Number(event.target.value);
    $("#master-volume-value").textContent = `${value}%`;
    if (audio.master) audio.master.gain.setTargetAtTime(value / 100, audio.context.currentTime, .01);
  });
  $("#source-select").addEventListener("change", async (event) => {
    state.source = event.target.value;
    if (["demo", "tone", "microphone"].includes(state.source)) $("#hardware-source-select").value = state.source;
    $("#file-label").hidden = state.source !== "file";
    if (state.audioOn) await startSource();
  });
  $("#sequencer-start").addEventListener("click", startSequencerTransport);
  $("#sequencer-stop").addEventListener("click", stopSequencerTransport);
  $("#synth-profile").addEventListener("change", async (event) => {
    applySynthProfile(event.target.value);
    if (state.sequencerRunning) await startSource();
  });
  $("#synth-waveform").addEventListener("change", async (event) => { state.synthWaveform = event.target.value; if (state.sequencerRunning) await startSource(); });
  $("#voice-parameter-knobs").addEventListener("input",(event)=>{const control=event.target.closest("[data-voice-param]");if(control)updateVoiceParameter(control.dataset.voiceParam,control.value);});
  $("#arp-mode").addEventListener("change", (event) => { state.arpMode = event.target.value; });
  $("#midi-bpm").addEventListener("input", (event) => { state.midiBpm = clamp(Number(event.target.value)||120,30,300); syncTempoCoach(state.midiBpm); });
  $("#midi-bpm").addEventListener("change", async (event) => { setMidiTempo(event.target.value); if(state.sequencerRunning) await startSource(); });
  $(".tempo-presets [data-tempo-preset]").forEach((button)=>button.addEventListener("click",async()=>{
    const bpm=Number(button.dataset.tempoPreset);
    setMidiTempo(bpm);
    $(".tempo-presets button").forEach((item)=>item.classList.toggle("is-active",item===button));
    announce(`${button.dataset.tempoLabel} tempo selected: ${bpm} BPM.`);
    if(state.sequencerRunning) await startSource();
  }));
  const tempoKnob = $("#tempo-knob");
  let tempoDrag = null;
  tempoKnob?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    tempoDrag = { y: event.clientY, bpm: state.midiBpm };
    tempoKnob.setPointerCapture?.(event.pointerId);
  });
  tempoKnob?.addEventListener("pointermove", (event) => {
    if (!tempoDrag) return;
    setMidiTempo(tempoDrag.bpm + (tempoDrag.y - event.clientY) * .75);
  });
  const finishTempoDrag = async (event) => {
    if (!tempoDrag) return;
    tempoDrag = null;
    tempoKnob.releasePointerCapture?.(event.pointerId);
    if (state.sequencerRunning) await startSource();
  };
  tempoKnob?.addEventListener("pointerup", finishTempoDrag);
  tempoKnob?.addEventListener("pointercancel", finishTempoDrag);
  tempoKnob?.addEventListener("wheel", async (event) => {
    event.preventDefault();
    setMidiTempo(state.midiBpm + (event.deltaY < 0 ? 1 : -1));
    if (state.sequencerRunning) await startSource();
  }, { passive: false });
  tempoKnob?.addEventListener("keydown", async (event) => {
    const amount = event.shiftKey ? 5 : 1;
    if (!["ArrowUp","ArrowRight","ArrowDown","ArrowLeft","Home","End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") setMidiTempo(30);
    else if (event.key === "End") setMidiTempo(300);
    else setMidiTempo(state.midiBpm + (["ArrowUp","ArrowRight"].includes(event.key) ? amount : -amount));
    if (state.sequencerRunning) await startSource();
  });
  $("#step-division").addEventListener("change", async (event) => { state.stepDivision=Number(event.target.value); if(state.sequencerRunning) await startSource(); });
  $("#pattern-duration").addEventListener("change", (event) => { state.patternDuration=clamp(Number(event.target.value)||0,0,5); event.target.value=state.patternDuration; });
  $("#start-delay").addEventListener("change", (event) => { state.startDelay=event.target.value; });
  $$("[data-pattern-bar]").forEach((button)=>button.addEventListener("click",()=>{state.sequencerBar=Number(button.dataset.patternBar);renderSequencer();}));
  $("#arp-grid").addEventListener("click", (event) => {
    const cell=event.target.closest("[data-pattern-step]");
    if(!cell) return;
    const step=Number(cell.dataset.patternStep), note=Number(cell.dataset.patternNote);
    state.sequencePattern[step]=state.sequencePattern[step]===note?null:note;
    renderSequencer();
  });
  $("#apply-midi-pattern").addEventListener("click", applyMidiText);
  $("#clear-midi-pattern").addEventListener("click",()=>{state.sequencePattern=Array(32).fill(null);renderSequencer();announce("Two-bar MIDI pattern cleared.");});
  $("#synth-keyboard").addEventListener("pointerdown", (event) => {
    const key = event.target.closest("[data-keyboard-note]");
    if (!key) return;
    event.preventDefault();
    key.setPointerCapture?.(event.pointerId);
    startKeyboardNote(Number(key.dataset.keyboardNote));
  });
  const releasePointerKey = (event) => {
    const key = event.target.closest("[data-keyboard-note]");
    if (key) stopKeyboardNote(Number(key.dataset.keyboardNote));
  };
  $("#synth-keyboard").addEventListener("pointerup", releasePointerKey);
  $("#synth-keyboard").addEventListener("pointercancel", releasePointerKey);
  $("#synth-keyboard").addEventListener("keydown", (event) => {
    const key = event.target.closest("[data-keyboard-note]");
    if (!key || event.repeat || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    startKeyboardNote(Number(key.dataset.keyboardNote));
  });
  $("#synth-keyboard").addEventListener("keyup", (event) => {
    const key = event.target.closest("[data-keyboard-note]");
    if (!key || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    stopKeyboardNote(Number(key.dataset.keyboardNote));
  });
  $(".performance-switches").addEventListener("click", (event) => {
    const performance=event.target.closest("[data-performance]");
    const quick=event.target.closest("[data-quick-effect]");
    if(quick) return addModule(quick.dataset.quickEffect);
    if(!performance) return;
    const action=performance.dataset.performance;
    if(action==="randomize") return randomizePattern(false);
    if(action==="glitch") return randomizePattern(true);
    state.performance[action]=!state.performance[action];
    performance.setAttribute("aria-pressed",String(state.performance[action]));
    if(action==="mute" && audio.sequencerVoice && state.performance.mute) gateSynthNote(null, null, "mute");
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
    switchHardwareCircuit(event.target.value);
  });
  $("#browse-circuits").addEventListener("click", () => openCatalogPicker("circuit"));
  $("#test-current-circuit").addEventListener("click", openCircuitTest);
  $("#close-circuit-test").addEventListener("click", () => $("#circuit-test-dialog").close());
  $("#focus-parts-library").addEventListener("click", () => { $("#parts-search").focus(); $("#parts-search").scrollIntoView({behavior:"smooth",block:"center"}); });
  document.addEventListener("click", (event) => { if (event.target.closest("[data-test-circuit]")) openCircuitTest(); });
  $("#supply-select").addEventListener("change", (event) => applyHardwareChoice("supply", event.target.value));
  $("#knob-style").addEventListener("change", (event) => {
    state.knobStyle = event.target.value;
    renderConstruction();
    showHelp("pot", false);
    announce(`${event.target.selectedOptions[0].textContent} knob style selected. Electrical values are unchanged.`);
  });
  $("#open-engineering-help").addEventListener("click", () => showHelp("mixing"));
  $("#close-engineering-help").addEventListener("click", () => { $("#engineering-help").hidden = true; });
  $("#help-previous").addEventListener("click", () => { state.helpPage -= 1; renderEngineeringHelp(); });
  $("#help-next").addEventListener("click", () => { state.helpPage += 1; renderEngineeringHelp(); });
  $("#load-hardware-sound").addEventListener("click", () => {
    const preset = hardwarePreset();
    recordHardwareSnapshot();
    preset.values = { ...preset.defaultValues };
    renderHardware();
    loadHardwareSound();
    announce(`${preset.name} restored to its verified starting values.`);
  });
  $("#hardware-undo").addEventListener("click", undoHardwareChange);
  $("#hardware-redo").addEventListener("click", redoHardwareChange);
  $("#workspace-zoom").addEventListener("input", (event) => {
    state.workspaceZoom = Number(event.target.value);
    $("#workspace-zoom-value").textContent = `${state.workspaceZoom}%`;
    $("#construction-panel").style.setProperty("--workspace-zoom", String(state.workspaceZoom / 100));
  });
  $("#parts-search").addEventListener("input", (event) => {
    state.partsFilter = event.target.value;
    renderIllustratedBom();
  });
  $("#parts-subcategory").addEventListener("change", (event) => {
    state.hardwarePartSubcategory = event.target.value;
    renderIllustratedBom();
  });
  $("#illustrated-components").addEventListener("click", (event) => {
    const action = event.target.closest("[data-hardware-change],[data-hardware-inspect]");
    if (!action) return;
    event.stopPropagation();
    const index = Number(action.dataset.hardwareChange ?? action.dataset.hardwareInspect);
    const component = hardwarePreset().components[index];
    const control = component?.valueKey ? hardwarePreset().controls.find((item)=>item.key===component.valueKey) : null;
    selectHardwarePart(index, control?.key || "", component?.ref || "");
    if (action.hasAttribute("data-hardware-change") && control) openCatalogPicker("hardware", index);
    else renderHardwareControls();
  });
  $("#hardware-controls").addEventListener("click", (event) => {
    const testSelected = event.target.closest("[data-test-selected-part]");
    if (testSelected) return openCircuitTest();
    const addSound = event.target.closest("[data-browse-sound-stages]");
    if (addSound) return openCatalogPicker("sound");
    const removeSound = event.target.closest("[data-remove-sound-stage]");
    if (removeSound) return removeHardwareSoundStage(Number(removeSound.dataset.removeSoundStage));
    const browse = event.target.closest("[data-browse-hardware]");
    if (browse) return openCatalogPicker("hardware", browse.dataset.browseHardware);
    const choice = event.target.closest("[data-inspector-choice]");
    if (!choice) return;
    applyHardwareChoice(state.hardwareSelectedKey, choice.dataset.inspectorChoice);
  });
  $("#hardware-controls").addEventListener("input", (event) => {
    const input = event.target.closest("[data-hardware-key]");
    if (!input) return;
    const preset = hardwarePreset();
    const control = preset.controls.find((item) => item.key === input.dataset.hardwareKey);
    if (!input.dataset.historyRecorded) {
      recordHardwareSnapshot();
      input.dataset.historyRecorded = "true";
    }
    preset.values[control.key] = control.type === "select" ? input.value : Number(input.value);
    $(`#hardware-value-${control.key}`).textContent = hardwareValueLabel(control, preset.values[control.key]);
    if (state.hardwareLoadedId === preset.id) {
      const module = control.audio ? state.modules[control.audio.module] : null;
      if (module) module.params[control.audio.key] = control.type === "select" ? input.value : Number(input.value);
      state.modules.forEach((item) => { item.params.supply = preset.values.supply; });
      rebuildAudioGraph(); renderChain(); renderInspector();
    }
    renderHardwareSelector();
    renderIllustratedBom();
    $(".hardware-calculation").innerHTML = hardwareCalculation(preset);
    renderConstruction();
    if (!state.audioOn) toggleAudio();
  });
  $("#hardware-controls").addEventListener("change", (event) => {
    const input = event.target.closest("[data-hardware-key]");
    if (input) delete input.dataset.historyRecorded;
  });
  $(".construction-tabs").addEventListener("click", (event) => {
    const button = event.target.closest("[data-construction]");
    if (!button) return;
    state.constructionView = button.dataset.construction;
    renderConstruction();
  });
  $("#construction-panel").addEventListener("contextmenu", (event) => {
    const component = event.target.closest(".interactive-component");
    if (!component) return;
    event.preventDefault();
    openComponentMenu(component, event.clientX, event.clientY);
  });
  const openComponentMenuFromClick = (event) => {
    if (event.target.closest("a")) return;
    if (event.target.closest(".physical-pot") && Date.now() < state.suppressKnobClickUntil) {
      event.preventDefault();
      return;
    }
    const wire = event.target.closest(".interactive-wire");
    if (wire) {
      state.selectedWireIndex = Number(wire.dataset.wireIndex);
      $("#hardware-selection-status").textContent = `Wire ${wire.dataset.wireRef} selected · choose a behavioral sound stage`;
      renderConstruction();
      openCatalogPicker("sound", wire.dataset.wireIndex);
      return;
    }
    const component = event.target.closest(".interactive-component");
    if (!component) return;
    const rect = component.getBoundingClientRect();
    const x = event.clientX || rect.left + Math.min(rect.width, 30);
    const y = event.clientY || rect.top + Math.min(rect.height, 30);
    openComponentMenu(component, x, y);
    const selected = selectedHardwareComponent();
    const selectedControl = selected?.valueKey
      ? hardwarePreset().controls.find((item)=>item.key===selected.valueKey)
      : null;
    if (selectedControl) openCatalogPicker("hardware", state.hardwareSelectedIndex);
    else announce(`${selected?.ref || "Component"} selected. Inspect its identity, role, pinout, and test checkpoints in the right panel.`);
  };
  $("#construction-panel").addEventListener("click", openComponentMenuFromClick);
  $("#construction-panel").addEventListener("pointerdown", (event) => {
    const pot = event.target.closest(".physical-pot");
    if (!pot || event.button !== 0) return;
    const control = hardwarePreset().controls.find((item) => item.key === pot.dataset.componentKey);
    if (!control || control.type === "select") return;
    recordHardwareSnapshot();
    state.knobDrag = { key: control.key, startX: event.clientX, startY: event.clientY, startValue: Number(hardwarePreset().values[control.key]), pointerId: event.pointerId, target: pot, moved: false };
    pot.setPointerCapture?.(event.pointerId);
  });
  document.addEventListener("pointermove", (event) => {
    const drag = state.knobDrag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = drag.startY - event.clientY;
    const distance = dx + dy;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
    if (!drag.moved) return;
    event.preventDefault();
    const control = hardwarePreset().controls.find((item) => item.key === drag.key);
    const range = Number(control.max) - Number(control.min);
    previewPotValue(drag.key, drag.startValue + (distance / 180) * range, drag.target);
  });
  document.addEventListener("pointerup", (event) => {
    if (!state.knobDrag || event.pointerId !== state.knobDrag.pointerId) return;
    finishPotTurn();
  });
  document.addEventListener("pointercancel", (event) => {
    if (!state.knobDrag || event.pointerId !== state.knobDrag.pointerId) return;
    finishPotTurn();
  });
  $("#construction-panel").addEventListener("wheel", (event) => {
    const pot = event.target.closest(".physical-pot");
    if (!pot) return;
    event.preventDefault();
    const control = hardwarePreset().controls.find((item) => item.key === pot.dataset.componentKey);
    if (!control || control.type === "select") return;
    const increment = Math.max(Number(control.step) || 1, (Number(control.max) - Number(control.min)) / 50);
    const next = Number(hardwarePreset().values[control.key]) + (event.deltaY < 0 ? increment : -increment);
    applyHardwareChoice(control.key, snappedControlValue(control, next));
  }, { passive: false });
  $("#construction-panel").addEventListener("click", (event) => {
    const addEffect=event.target.closest("[data-add-effect-circuit]");
    if(addEffect){
      const type=addEffect.dataset.addEffectCircuit;
      const instance=addModule(type);
      instance.params={...state.effectCircuitValues[type]};
      renderStudio(); rebuildAudioGraph();
      announce(`${MODULES[type].name} circuit added to the Studio chain.`);
      return;
    }
    const synthReference = event.target.closest("[data-synth-reference]");
    if (synthReference) {
      state.selectedSynthReference = synthReference.dataset.synthReference;
      renderConstruction();
      const choice=[...EFFECT_CIRCUITS,...SYNTH_REFERENCES].find((item)=>item.id===state.selectedSynthReference);
      announce(`${choice?.name || "Circuit"} selected.`);
      return;
    }
    const step = event.target.closest("[data-assembly-step]");
    if (step) { state.assemblyStep = Number(step.dataset.assemblyStep); renderConstruction(); return; }
    if (event.target.closest("[data-assembly-previous]")) { state.assemblyStep -= 1; renderConstruction(); return; }
    if (event.target.closest("[data-assembly-next]")) { state.assemblyStep += 1; renderConstruction(); return; }
    if (event.target.closest("[data-assembly-complete]")) {
      const id = hardwarePreset().id;
      const completed = new Set(state.assemblyCompleted[id] || []);
      completed.has(state.assemblyStep) ? completed.delete(state.assemblyStep) : completed.add(state.assemblyStep);
      state.assemblyCompleted[id] = [...completed];
      renderConstruction();
    }
  });
  $("#construction-panel").addEventListener("change",(event)=>{
    const control=event.target.closest("[data-effect-circuit-param]");
    if(!control) return;
    const item=EFFECT_CIRCUITS.find((entry)=>entry.id===state.selectedSynthReference);
    if(!item) return;
    const parameter=MODULES[item.moduleType].params.find((entry)=>entry.key===control.dataset.effectCircuitParam);
    state.effectCircuitValues[item.moduleType][parameter.key]=parameter.type==="select"?control.value:Number(control.value);
    renderConstruction();
    announce(`${parameter.label} changed in the ${item.name} study circuit.`);
  });
  const revealContextHelp = (event) => {
    const target = event.target.closest("[data-help-key]");
    if (!target || !target.closest("#hardware")) return;
    showHelp(target.dataset.helpKey, state.helpTopic !== target.dataset.helpKey);
  };
  $("#hardware").addEventListener("pointerover", revealContextHelp);
  $("#hardware").addEventListener("focusin", revealContextHelp);
  $("#illustrated-components").addEventListener("click", (event) => {
    const component = event.target.closest("[data-component-index]");
    if (!component) return;
    const change = event.target.closest("[data-hardware-change]");
    selectHardwarePart(Number(component.dataset.componentIndex), component.dataset.componentKey, component.dataset.componentRef);
    if (change || event.ctrlKey || event.metaKey) openCatalogPicker("hardware", component.dataset.componentIndex);
  });
  $("#construction-panel").addEventListener("keydown", (event) => {
    const target = event.target.closest(".interactive-component, .interactive-wire");
    if (!target) return;
    if (target.matches(".physical-pot") && ["ArrowLeft","ArrowDown","ArrowRight","ArrowUp"].includes(event.key)) {
      event.preventDefault();
      const control = hardwarePreset().controls.find((item) => item.key === target.dataset.componentKey);
      const direction = ["ArrowRight","ArrowUp"].includes(event.key) ? 1 : -1;
      const increment = Math.max(Number(control.step) || 1, (Number(control.max) - Number(control.min)) / 100);
      return applyHardwareChoice(control.key, snappedControlValue(control, Number(hardwarePreset().values[control.key]) + direction * increment));
    }
    if (!["Enter", " ", "ContextMenu"].includes(event.key)) return;
    event.preventDefault();
    if (target.matches(".interactive-wire")) {
      state.selectedWireIndex = Number(target.dataset.wireIndex);
      renderConstruction();
      openCatalogPicker("sound", target.dataset.wireIndex);
    } else {
      const rect = target.getBoundingClientRect();
      openComponentMenu(target, rect.left + Math.min(rect.width, 30), rect.top + Math.min(rect.height, 30));
      openCatalogPicker("hardware", state.hardwareSelectedIndex);
    }
  });
  $("#illustrated-components").addEventListener("keydown", (event) => {
    const component = event.target.closest("[data-component-index]");
    if (!component || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    selectHardwarePart(Number(component.dataset.componentIndex), component.dataset.componentKey, component.dataset.componentRef);
  });
  $("#component-menu").addEventListener("click", (event) => {
    const choice = event.target.closest("[data-component-choice]");
    if (!choice) return;
    applyHardwareChoice(event.currentTarget.dataset.componentKey, choice.dataset.componentChoice);
  });
  document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest("#component-menu") && !event.target.closest(".interactive-component")) closeComponentMenu();
  });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeComponentMenu(); });
  $("#planner-controller").addEventListener("change", (event) => {
    state.plannerController = event.target.value;
    renderDevicePlanner();
  });
  $("#browse-controllers").addEventListener("click", () => openCatalogPicker("controller"));
  $("#device-search").addEventListener("input", (event) => {
    state.deviceSearch = event.target.value;
    renderDevicePlanner();
    $("#device-search").focus();
  });
  $("#device-filters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-device-category]");
    if (!button) return;
    state.deviceCategory = button.dataset.deviceCategory;
    state.deviceSubcategory = "All";
    renderDevicePlanner();
  });
  $("#device-subcategory").addEventListener("change", (event) => {
    state.deviceSubcategory = event.target.value;
    renderDevicePlanner();
  });
  $("#device-catalog").addEventListener("click", (event) => {
    const button = event.target.closest("[data-device-add]");
    if (!button || state.selectedDeviceIds.includes(button.dataset.deviceAdd)) return;
    state.selectedDeviceIds.push(button.dataset.deviceAdd);
    renderDevicePlanner();
    announce("Device added to the pre-build plan.");
  });
  $("#selected-devices").addEventListener("click", (event) => {
    const selected = event.target.closest("[data-selected-device]");
    const change = event.target.closest("[data-device-change]");
    const button = event.target.closest("[data-device-remove]");
    if (change || (selected && (event.ctrlKey || event.metaKey))) return openCatalogPicker("device", selected.dataset.selectedDevice);
    if (!button) return;
    state.selectedDeviceIds = state.selectedDeviceIds.filter((id) => id !== button.dataset.deviceRemove);
    renderDevicePlanner();
  });
  $("#planner-clear").addEventListener("click", () => {
    state.selectedDeviceIds = [];
    renderDevicePlanner();
    announce("Pre-build selection cleared.");
  });
  $("#selected-devices").addEventListener("keydown", (event) => {
    const selected = event.target.closest("[data-selected-device]");
    if (!selected || !["Enter"," "].includes(event.key)) return;
    event.preventDefault();
    openCatalogPicker("device", selected.dataset.selectedDevice);
  });
  $("#catalog-picker-close").addEventListener("click", () => $("#catalog-picker").close());
  $("#catalog-picker-search").addEventListener("input", (event) => {
    state.catalogPickerSearch = event.target.value;
    renderCatalogPicker();
    $("#catalog-picker-search").focus();
  });
  $("#catalog-picker-category").addEventListener("change", (event) => {
    state.catalogPickerCategory = event.target.value;
    state.catalogPickerSubcategory = "All";
    renderCatalogPicker();
  });
  $("#catalog-picker-subcategory").addEventListener("change", (event) => {
    state.catalogPickerSubcategory = event.target.value;
    renderCatalogPicker();
  });
  $("#catalog-picker-results").addEventListener("click", (event) => {
    const choice = event.target.closest("[data-catalog-choice]");
    if (choice) chooseCatalogItem(choice.dataset.catalogChoice);
  });
  let draggedModuleId = null;
  $("#signal-chain").addEventListener("keydown", (event) => {
    const module = event.target.closest("[data-select]");
    if (!module || event.target.closest("button") || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    state.selectedId = Number(module.dataset.select);
    renderChain();
    renderInspector();
  });
  $("#signal-chain").addEventListener("dragstart", (event) => {
    const module=event.target.closest("[data-select]");
    if(!module) return;
    draggedModuleId=Number(module.dataset.select);
    event.dataTransfer.effectAllowed="move";
  });
  $("#signal-chain").addEventListener("dragover", (event) => { if(event.target.closest("[data-select]")) event.preventDefault(); });
  $("#signal-chain").addEventListener("drop", (event) => {
    const target=event.target.closest("[data-select]");
    if(!target || draggedModuleId==null) return;
    event.preventDefault();
    const from=state.modules.findIndex((item)=>item.id===draggedModuleId);
    const to=state.modules.findIndex((item)=>item.id===Number(target.dataset.select));
    if(from>=0&&to>=0&&from!==to){const [item]=state.modules.splice(from,1);state.modules.splice(to,0,item);renderStudio();rebuildAudioGraph();announce("Module moved in the serial signal chain.");}
    draggedModuleId=null;
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
renderSynthKeyboard();
renderMacroPanel();
renderVoiceControls();
bindEvents();
renderSequencer();
syncTempoCoach();
renderHardware();
loadHardwareSound();
syncAudioButtons();
const initialView = window.location.hash.slice(1);
showView(["studio", "learn", "build", "hardware", "devices", "experiment"].includes(initialView) ? initialView : "hardware");
window.addEventListener("hashchange", () => {
  const view = window.location.hash.slice(1);
  if (["studio", "learn", "build", "hardware", "devices", "experiment"].includes(view)) showView(view);
});
drawScopes();
