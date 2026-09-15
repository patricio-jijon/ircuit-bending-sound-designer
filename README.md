# Circuit Bending Sound Designer

An accessible, browser-based sound laboratory for exploring how component values influence oscillator, fuzz, overdrive, distortion, octave, delay, and glitch behaviors. Effects can be duplicated, reordered, bypassed, and combined while audio is running.

## Run locally

Open `index.html` in a current Chrome, Edge, Firefox, or Safari browser. The built-in riff, test oscillator, calculations, budgeting, CSV export, and STL export work without a server.

Microphone access is more dependable from a secure origin. For local microphone testing, run a small local server in this directory:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish with GitHub Pages

1. Create a GitHub repository and add these files at the repository root.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose the `main` branch and `/ (root)`, then save.

GitHub will provide the public URL after deployment completes.

## Included features

- Unlimited combinable instances of oscillator / dual NE555, fuzz, overdrive, distortion, octave, delay, and glitch modules
- Reordering, bypass, deletion, a demonstration preset, and input/output level control
- Built-in sound, test oscillator, local audio-file playback, and microphone/audio-interface input
- Real-time Web Audio processing, oscilloscope, and spectrum display
- Component controls with substituted formulas and plain-language explanations
- Quantity-aware concept BOM, editable USD estimates, Amazon US search links, and CSV export
- Dimension-based generic open-top enclosure STL export
- Hardware Lab with synchronized schematics, named breadboard holes, canonical connection tables, power-off assembly steps, component illustrations, and preset-specific Amazon searches
- Three physical-build presets: Dual 555 Drone, TL072 Diode Fuzz, and 40106 Glitch Clock
- Guided prediction, observation, and reflection activity
- Keyboard focus, semantic controls, responsive layouts, and reduced-motion support

## Important modeling notes

The sound is a real-time **digital behavioral simulation**. Formulas shown as calculated are circuit relationships; the waveform and spectrum are simulated browser audio. The app does not claim physical measurements or transistor-level simulation.

The bill of materials is a concept budget, not a construction-ready circuit. Amazon prices are not fetched automatically and can change. Verify part values, package, voltage and power ratings, pinouts, polarity, availability, and seller before buying or building.

The **Hardware Lab** is more specific than the freeform sound studio. Its three physical presets use named through-hole IC variants and manufacturer pinout sources. They are calculated and diagram-audited but have not been physically assembled or measured. Freeform octave, delay, and combined DSP chains remain simulation-only until separate hardware designs are validated.

The downloaded STL is a generic reference shell made from the entered dimensions. It has no connector or control cutouts. Measure exact physical components and verify manufacturer mechanical drawings before fabrication.

## Safety

Keep physical experiments between 3.3 V and 12 V DC. Disconnect power before changing a breadboard, check polarized components, avoid short circuits, and use a current-limited supply when practical. Microphone and uploaded-file audio stays in the browser and is not sent by this static app.

## Technical reference

- [Texas Instruments NE555 datasheet](https://www.ti.com/lit/ds/symlink/ne555.pdf)
- [Texas Instruments TL072 product and datasheet](https://www.ti.com/product/TL072)
- [Texas Instruments CD40106B datasheet](https://www.ti.com/lit/ds/symlink/cd40106b.pdf)

## Project structure

- `index.html` — accessible application structure
- `styles.css` — responsive visual system
- `app.js` — module definitions, audio graph, calculations, budget, and exports
- `hardware-data.js` — exact hardware preset inventories, connections, placements, assembly steps, and sources

No dependencies or build step are required.

## Learning objectives

After using the app, a student should be able to:

- explain that a component's circuit position determines its effect;
- predict how an RC timing network responds to resistance or capacitance changes;
- connect amplifier gain and clipping threshold to audible distortion;
- describe how full-wave rectification can emphasize an octave;
- describe how feedback changes the number and stability of delay repeats; and
- compare effect order while changing only one variable at a time.

## Student guide

1. Start at low listening volume and select **Start audio**.
2. Listen to the loaded grit preset, then bypass every module except the oscillator.
3. Select the oscillator and predict what increasing `R2` will do. Change it and compare the calculated frequency with what you hear.
4. Enable one fuzz. Compare germanium, silicon, and LED clipping models at the same resistor values.
5. Enable octave and distortion. Reverse their order and record the difference in the **Experiment** view.
6. Increase delay feedback gradually. Stop below self-oscillation when using speakers.
7. Open **Build & budget**, review quantities, and explain why every product's exact package and rating must be checked before buying.

## Teacher guide

A 45-minute lesson can use 5 minutes for hearing the preset, 10 minutes for the oscillator RC relationship, 10 minutes for clipping comparisons, 10 minutes for signal-order exploration, and 10 minutes for reflection. Ask students to make each prediction before moving a control and to distinguish a calculated value from simulated browser sound.

Useful discussion prompts:

- Why does doubling a timing capacitor lower oscillator frequency?
- Why does an octave effect respond more clearly to one note than to a chord?
- Why can two identical fuzz modules sound different when placed on opposite sides of an octave stage?
- Which BOM facts remain unknown until an exact physical schematic and enclosure are selected?

Expected qualitative observations: higher timing resistance or capacitance lowers the oscillator pitch; stronger gain creates more clipped harmonics; a larger low-pass capacitor darkens the sound; octave before distortion is usually clearer than octave after heavy distortion; increasing delay feedback produces more repeats.

## Verification checklist

- Run `npm test` for repository-level static checks.
- Check controls using keyboard-only navigation.
- Test at desktop and tablet widths without page-level horizontal scrolling.
- Confirm minimum, typical, maximum, and invalid enclosure dimensions.
- Confirm audio start/stop, source switching, bypass, remove, reorder, duplicate modules, CSV download, and STL download.
- Use headphones for microphone testing to reduce acoustic feedback.
