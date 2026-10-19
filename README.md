# Circuit Bending Sound Designer

A browser sound studio and guided physical-computing workbench. Build a tone, change a component, and compare the predicted relationship with a behavioral audio preview.

## Run

Open `index.html`, or run `python3 -m http.server 8000` and visit `http://localhost:8000/#studio`. Use localhost or HTTPS for microphone and Web MIDI. There are no production dependencies or build step.

## Studio

- Eight macro knobs, Command+M learn mode, MIDI CC assignment, explicit Clear controls, and MIDI note input.
- Two editable 16-step bars, a chromatic light grid, per-step −2…+2 octave offsets, arpeggiator −3…+3 and global −3…+3 octave controls.
- Pattern, Up, Down, Random and Glitch modes; gate length, swing, count-in, duration and 1/8–1/32 rates.
- Repeat loops the selected 1/2/4/8/16/32-step phrase. Freeze holds the last note; Mute closes the envelope. These do not capture or loop recorded microphone audio.
- Select the chain oscillators, an individual oscillator, a named synth voice, guitar rhythmic gating, or guitar-pitch-driven synth notes. Component-pitch mode treats C3 as the untransposed RC oscillator frequency. Voice mode follows equal-tempered MIDI pitch.
- Guitar pitch tracking expects a clear single note around 65–1400 Hz. It drives a generated synth voice; it does not pitch-shift the original guitar recording. Gate mode chops the original incoming audio through the effect chain.
- Chorus, flanger and four-stage phaser behavioral effects, plus the existing fuzz, distortion, overdrive, octave, delay, glitch and filter models.
- Dancers and four beat lights follow the sequencer clock. Stop ends their movement. A reduced-motion preference disables dancer movement.
- Presets / My Circuits stores sounds and chip designs in this browser. Save, load, rename, duplicate, delete, export and import. Audio files and microphone recordings are not stored in a preset. Export backups before clearing browser data.

## Physical circuit workbench

`circuit-engine.js` is the authoritative netlist and placement generator. Its data drives the breadboard, complete net-label schematic, parts list, exact-hole connection table, assembly checklist and circuit preview settings. `combination-ui.js` renders the plan and exposes supported substitutions.

Twelve guided designs:

1. Single 555 tone.
2. Single 555 HIGH/MUTE teaching circuit (a new documented design, not a reconstruction of the unavailable reference PDF).
3. Two 555s mixed through isolation resistors.
4. Two 555s: audio timer with a slow RESET gate.
5. Three 555s: carrier, RESET gating and resistively limited CONTROL modulation.
6. NE556 dual-timer tone pair with its exact PDIP-14 pinout.
7. CD40106 single RC tone.
8. CD40106 three-voice cluster.
9. CD4093 enabled RC tone.
10. NE555 + CD40106 pitch modulation.
11. TL072 biased diode distortion.
12. CD40106 + SN74HC164 + SN74HC86 + NE555 pseudorandom pitch. This design is **5 V only**. Clear the shift register using its reset switch, then release it. Its inverted-feedback sequence repeats after 255 states.

The BB400 view has 30 × 10 terminal holes, separate A–E/F–J strips, a center trench, and four 25-point supply rails. Top rails use `+`/`−`; bottom rails use `b+`/`b−`. Rail bridges are explicit. Every component, chip leg and jumper endpoint has its own physical hole. Pin 1 is marked and all chip notches face left on the breadboard; schematic package views use notch-up physical pin order. Matching schematic net names are electrical connections.

Potentiometers use terminal 1 and terminal 2 (wiper), with terminal 3 tied to the wiper as a rheostat. Electrolytic terminal 1 is positive; diode terminal 2 is the cathode. Output plans include AC coupling and attenuation for a high-impedance powered input. Disconnect power before editing.

The original three Circuit Builder selections also use the generated physical plan. Export current build guide generates a printable HTML document from the current netlist. The PDFs retained in `guides/` are archived historical documents and may not match the new placement.

### Model boundary

Connection checks verify named nets, pin power, supported supplies, endpoint occupancy and strip continuity. These circuits have **not been physically assembled or measured**. Browser audio is an approximation: component tolerance, oscillator thresholds, duty cycle, bias, loading, diode characteristics and supply headroom affect actual results. Schmitt frequency is estimated using nominal 1/3 and 2/3 supply thresholds, rather than asserted to be exact.

Manufacturer reference folders distinguish functional architecture from authentic schematics. PDF sources can be opened inside the reference viewer where the source allows embedding. The app does not invent manufacturer PCB traces.

CD4046 VCO/PLL, CD4017 sequencers, CD4040 dividers, LM13700 OTA, PT2399 and BBD delay hardware are capability studies with primary datasheet links; complete physical templates are not provided for those parts yet. Browser chorus/flanger/phaser models do not claim to implement a verified physical design. Beating tones are not a true chorus delay. Pseudorandom sequences are not true noise.

## Verification and deployment

Install test dependencies with `npm ci`, then run `npm test`.

The checks include:
- Complete DOM startup and actual DOM control events using jsdom.
- Audio graph/envelope calls using an instrumented Web Audio test double. This verifies scheduling and routing logic, not audible fidelity or a real audio device.
- 2,025 envelope combinations including 300 BPM at 1/32 notes.
- Guitar pitch detection against generated single-tone samples and silence.
- All twelve generated plans, correct DIP hole mapping, RC scaling, explicit supply limits, and rejection of disconnected/shorted placement mutations.
- Preset save/recall, repeat/mute, both guitar input paths and modulation effects.

The Pages deployment job depends on passing tests and uploads only public application files. A deployment success is not physical validation or a listening test. Real microphone interfaces, external MIDI hardware, and physical builds need separate testing.
