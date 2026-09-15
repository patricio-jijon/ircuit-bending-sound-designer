#!/usr/bin/env python3
"""Generate the verified preset build guides bundled with the web app."""

from __future__ import annotations

import math
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    Flowable, KeepTogether, PageBreak, Paragraph, SimpleDocTemplate,
    Spacer, Table, TableStyle,
)

ROOT = Path(__file__).resolve().parent.parent
GUIDES = ROOT / "guides"
INK = colors.HexColor("#172018")
MUTED = colors.HexColor("#5B6357")
ACCENT = colors.HexColor("#8EAF13")
PALE = colors.HexColor("#EEF2E3")
LINE = colors.HexColor("#BBC2B3")
RED = colors.HexColor("#C43C35")
BLUE = colors.HexColor("#316BB2")
GREEN = colors.HexColor("#238159")


PINOUTS = {
    "NE555P": [
        (1, "GND", "Ground"), (2, "TRIGGER", "Timing trigger"),
        (3, "OUTPUT", "Timer output"), (4, "RESET", "Active-low reset"),
        (5, "CONTROL", "Threshold control"), (6, "THRESHOLD", "Timing threshold"),
        (7, "DISCHARGE", "Timing discharge"), (8, "VCC", "Positive supply"),
    ],
    "TL072CP": [
        (1, "1OUT", "Amplifier A output"), (2, "1IN-", "Amplifier A inverting input"),
        (3, "1IN+", "Amplifier A non-inverting input"), (4, "VCC-", "Ground in this build"),
        (5, "2IN+", "Amplifier B non-inverting input"), (6, "2IN-", "Amplifier B inverting input"),
        (7, "2OUT", "Amplifier B output"), (8, "VCC+", "+9 V supply"),
    ],
    "CD40106BE": [
        (1, "A", "Inverter A input"), (2, "G=/A", "Inverter A output"),
        (3, "B", "Unused input to ground"), (4, "H=/B", "Unused output"),
        (5, "C", "Unused input to ground"), (6, "I=/C", "Unused output"),
        (7, "VSS", "Ground"), (8, "J=/D", "Unused output"),
        (9, "D", "Unused input to ground"), (10, "K=/E", "Unused output"),
        (11, "E", "Unused input to ground"), (12, "L=/F", "Unused output"),
        (13, "F", "Unused input to ground"), (14, "VDD", "+9 V supply"),
    ],
}


PRESETS = {
    "dual-555-drone-build-guide.pdf": {
        "key": "dual555", "name": "Dual 555 Drone", "device": "NE555P", "accent": "#71A6C7",
        "purpose": "Build two independently adjustable square-wave oscillators and mix them into one line-level output.",
        "physics": "Each timer repeatedly charges and discharges a capacitor. Increasing timing resistance or capacitance increases charge time and lowers pitch. Two nearby frequencies create audible beating.",
        "formula": "tHIGH = 0.693(RA + RB)C; tLOW = 0.693(RB)C; f = 1/(tHIGH + tLOW)",
        "substitution": "RA = 10 kOhm, RB = 22 kOhm, C = 10 nF -> tHIGH = 0.222 ms, tLOW = 0.152 ms",
        "result": "Calculated frequency: 2672 Hz; duty cycle: 59.3%. Browser estimate: about 2667 Hz.",
        "parts": [
            ("BB1", "BB830-style solderless breadboard", "1"), ("U1, U2", "TI NE555P PDIP-8", "2"),
            ("R1, R3", "10 kOhm 1/4 W metal-film", "2"), ("P1, P2", "Bourns PTV09 100 kOhm linear", "2"),
            ("C1, C3", "10 nF film timing capacitor", "2"), ("C2, C4", "10 nF ceramic capacitor", "2"),
            ("R5, R6", "10 kOhm 1/4 W mixing resistor", "2"), ("P3", "Bourns PTV09 100 kOhm linear", "1"),
            ("C5", "1 uF 25 V electrolytic", "1"), ("C6", "100 nF ceramic bypass", "1"),
            ("J1", "6.35 mm mono output jack", "1"), ("PS1", "Regulated current-limited 9 V DC supply", "1"),
        ],
        "connections": [
            ("+9V", "+ rail", "U1 pin 8 and pin 4; U2 pin 8 and pin 4", "red"),
            ("GND", "- rail", "U1 pin 1; U2 pin 1; J1 sleeve", "black"),
            ("A timing", "U1 pin 2", "U1 pin 6; C1 to ground", "blue"),
            ("A charge", "+9 V through R1", "U1 pin 7; P1 from pin 7 to pins 2/6", "red/blue"),
            ("A control", "U1 pin 5", "C2 to ground", "black"),
            ("Voice A", "U1 pin 3", "R5 to MIX", "yellow"),
            ("B timing", "U2 pin 2", "U2 pin 6; C3 to ground", "blue"),
            ("B charge", "+9 V through R3", "U2 pin 7; P2 from pin 7 to pins 2/6", "red/blue"),
            ("B control", "U2 pin 5", "C4 to ground", "black"),
            ("Voice B", "U2 pin 3", "R6 to MIX", "orange"),
            ("Output", "R5/R6 junction", "P3 lug 3; wiper through C5 to J1 tip", "green"),
            ("Bypass", "+9 V", "C6 to ground close to U1/U2", "black"),
        ],
        "steps": [
            "With power disconnected, map the breadboard rails using continuity mode.",
            "Place U1 across the center trench at columns 10-13 and U2 at columns 20-23. Both notches face left.",
            "Connect each pin 1 to ground, each pin 8 to +9 V, and each pin 4 to +9 V.",
            "Build U1 timing: join pins 2 and 6; add R1 from +9 V to pin 7; add P1 from pin 7 to pins 2/6; add C1 from pins 2/6 to ground.",
            "Repeat the timing network for U2 using R3, P2, and C3.",
            "Connect C2 and C4 from each pin 5 to ground. Put C6 across the rails near the ICs.",
            "Connect U1 pin 3 through R5 and U2 pin 3 through R6. Join only the far resistor ends at MIX.",
            "Connect MIX to P3 lug 3, lug 1 to ground, and the wiper through C5 to J1 tip. C5 positive faces the wiper.",
            "Set P3 low, inspect every connection, then apply current-limited 9 V.",
        ],
        "expected": ["U1/U2 pin 8 to pin 1: about 9 V DC", "Pins 2/6: repeating ramp between about 3 V and 6 V", "Pins 3: pulse wave; frequency changes with P1/P2", "Output: mixed pulse tones into a powered audio input"],
        "sources": ["TI NE555 datasheet: https://www.ti.com/lit/ds/symlink/ne555.pdf", "Bourns PTV09 datasheet: https://www.bourns.com/docs/product-datasheets/PTV09.pdf"],
    },
    "tl072-diode-fuzz-build-guide.pdf": {
        "key": "fuzz", "name": "TL072 Diode Fuzz", "device": "TL072CP", "accent": "#C65E49",
        "purpose": "Build a single-supply op-amp gain stage with feedback diodes and a low-pass tone network.",
        "physics": "The op amp amplifies around a buffered 4.5 V reference. Antiparallel silicon diodes conduct on opposite waveform halves and limit feedback voltage, creating soft clipping and added harmonics.",
        "formula": "Inverting gain magnitude before clipping: |A| = Rf/Rin; tone corner: fc = 1/(2 pi Rtone Ctone)",
        "substitution": "Rf = 470 kOhm, Rin = 10 kOhm, Rtone = 10 kOhm, Ctone = 22 nF",
        "result": "Calculated unclipped gain: 47x. Calculated tone corner: 723 Hz. Diodes reduce practical closed-loop gain when conducting.",
        "parts": [
            ("BB1", "BB830-style solderless breadboard", "1"), ("U1", "TI TL072CP PDIP-8", "1"),
            ("R1, R2", "100 kOhm 1/4 W bias divider", "2"), ("R3", "10 kOhm 1/4 W input resistor", "1"),
            ("R4", "470 kOhm 1/4 W feedback resistor", "1"), ("D1, D2", "onsemi 1N4148 DO-35 diode", "2"),
            ("R5", "10 kOhm 1/4 W tone resistor", "1"), ("C4", "22 nF film tone capacitor", "1"),
            ("C1", "10 uF 25 V electrolytic", "1"), ("C2", "100 nF film input capacitor", "1"),
            ("C3", "1 uF 25 V electrolytic", "1"), ("C5", "100 nF ceramic bypass", "1"),
            ("P1", "Bourns PTV09 100 kOhm linear", "1"), ("J1, J2", "6.35 mm mono jack", "2"),
            ("PS1", "Regulated current-limited 9 V DC supply", "1"),
        ],
        "connections": [
            ("Power", "+9 V / ground", "U1 pin 8 / pin 4; C5 across supply", "red/black"),
            ("VBIAS", "+9 V through R1", "junction through R2 and C1 to ground", "purple"),
            ("VREF", "VBIAS to U1 pin 5", "U1 pins 6 and 7 joined; pin 7 to pin 3", "purple"),
            ("Input", "J1 tip through C2 and R3", "U1 pin 2; J1 sleeve to ground", "blue"),
            ("Feedback", "U1 pin 1 through R4", "U1 pin 2", "orange"),
            ("Clip +", "D1 anode at pin 1", "D1 cathode band at pin 2", "yellow"),
            ("Clip -", "D2 anode at pin 2", "D2 cathode band at pin 1", "yellow"),
            ("Tone", "U1 pin 1 through R5", "TONE; C4 from TONE to ground", "green"),
            ("Level", "TONE to P1 lug 3", "lug 1 ground; wiper through C3 to J2 tip", "green"),
            ("Ground", "J1 and J2 sleeves", "Shared ground rail", "black"),
        ],
        "steps": [
            "Disconnect power, verify rail continuity, and place U1 across the center trench at columns 12-15 with notch left.",
            "Connect U1 pin 8 to +9 V and pin 4 to ground. Add C5 close to these supply pins.",
            "Build VBIAS: R1 from +9 V to the junction, R2 from junction to ground, C1 positive to junction and negative to ground.",
            "Connect VBIAS to pin 5; join pins 6 and 7; connect pin 7 to pin 3. Pin 7 is buffered VREF.",
            "Connect J1 tip through C2 and R3 to pin 2. Connect J1 sleeve to ground.",
            "Connect R4 between pins 1 and 2. Add D1 and D2 antiparallel across R4; inspect both cathode bands.",
            "Connect pin 1 through R5 to TONE and C4 from TONE to ground.",
            "Connect TONE to P1 lug 3, lug 1 to ground, and the wiper through C3 to J2 tip. C3 positive faces P1.",
            "Set P1 low, inspect polarity and pin orientation, then apply current-limited 9 V.",
        ],
        "expected": ["U1 pin 8 to pin 4: about 9 V DC", "VBIAS and U1 pin 7: about 4.5 V DC", "U1 pin 1: audio centered near 4.5 V", "J2 after C3: near 0 V DC with clipped audio"],
        "sources": ["TI TL072: https://www.ti.com/product/TL072", "onsemi 1N4148: https://www.onsemi.com/pdf/datasheet/1n914-d.pdf", "Bourns PTV09: https://www.bourns.com/docs/product-datasheets/PTV09.pdf"],
    },
    "40106-glitch-clock-build-guide.pdf": {
        "key": "glitch", "name": "40106 Glitch Clock", "device": "CD40106BE", "accent": "#93A92C",
        "purpose": "Build an adjustable Schmitt-trigger RC oscillator with a protected line-level pulse output.",
        "physics": "The capacitor voltage crosses the inverter's two switching thresholds. Hysteresis flips the output at different rising and falling voltages, so the resistor charges the capacitor in alternating directions and creates oscillation.",
        "formula": "Classroom estimate: f = 1/(2.2 R C)",
        "substitution": "R = 47 kOhm, C = 0.1 uF",
        "result": "Calculated estimate: 96.7 Hz. Actual frequency depends strongly on CD40106 thresholds, supply, and tolerances.",
        "parts": [
            ("BB1", "BB830-style solderless breadboard", "1"), ("U1", "TI CD40106BE PDIP-14", "1"),
            ("P1", "Bourns PTV09 500 kOhm linear", "1"), ("R1", "1 kOhm 1/4 W minimum resistor", "1"),
            ("R2", "10 kOhm 1/4 W output resistor", "1"), ("C1", "0.1 uF film timing capacitor", "1"),
            ("C2", "1 uF 25 V electrolytic", "1"), ("C3", "100 nF ceramic bypass", "1"),
            ("P2", "Bourns PTV09 100 kOhm linear", "1"), ("J1", "6.35 mm mono output jack", "1"),
            ("PS1", "Regulated current-limited 9 V DC supply", "1"),
        ],
        "connections": [
            ("Power", "+9 V / ground", "U1 pin 14 / pin 7; C3 across supply", "red/black"),
            ("Clock", "U1 pin 2", "R1 + P1 back to U1 pin 1", "blue"),
            ("Timing", "U1 pin 1", "C1 to ground", "black"),
            ("Unused", "U1 pins 3, 5, 9, 11, 13", "Ground; leave unused outputs open", "black"),
            ("Output", "U1 pin 2 through R2", "C2 positive; C2 negative to P2 lug 3", "yellow/green"),
            ("Level", "P2 lug 1 to ground", "P2 wiper to J1 tip", "green"),
            ("Ground", "J1 sleeve", "Shared ground rail", "black"),
        ],
        "steps": [
            "Disconnect power, map the rails, and place U1 across the center trench at columns 10-16 with notch left.",
            "Connect U1 pin 14 to +9 V and pin 7 to ground. Put C3 close to those pins.",
            "Connect pin 2 through R1 and P1 back to pin 1. Tie P1 wiper to the used outer lug.",
            "Connect C1 from pin 1 to ground.",
            "Tie unused inputs pins 3, 5, 9, 11, and 13 to ground. Leave unused outputs open.",
            "Connect pin 2 through R2 and then C2 to P2 lug 3. C2 positive faces R2.",
            "Connect P2 lug 1 to ground, the wiper to J1 tip, and J1 sleeve to ground.",
            "Set P1 to high resistance and P2 low. Inspect pins 14 and 7, then apply current-limited 9 V.",
        ],
        "expected": ["U1 pin 14 to pin 7: about 9 V DC", "U1 pin 1: repeating capacitor ramp", "U1 pin 2: logic pulse alternating near the supply rails", "J1: AC-coupled pulse tone; rate changes with P1"],
        "sources": ["TI CD40106B: https://www.ti.com/lit/ds/symlink/cd40106b.pdf", "Bourns PTV09: https://www.bourns.com/docs/product-datasheets/PTV09.pdf"],
    },
}


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="CoverTitle", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=29, leading=31, textColor=INK, alignment=TA_LEFT, spaceAfter=14))
styles.add(ParagraphStyle(name="Deck", parent=styles["BodyText"], fontSize=12, leading=17, textColor=MUTED, spaceAfter=18))
styles.add(ParagraphStyle(name="H1x", parent=styles["Heading1"], fontName="Helvetica-Bold", fontSize=19, leading=22, textColor=INK, spaceAfter=10))
styles.add(ParagraphStyle(name="H2x", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=12, leading=15, textColor=INK, spaceBefore=8, spaceAfter=5))
styles.add(ParagraphStyle(name="Bodyx", parent=styles["BodyText"], fontSize=9, leading=13, textColor=INK, spaceAfter=7))
styles.add(ParagraphStyle(name="Smallx", parent=styles["BodyText"], fontSize=7.3, leading=9.5, textColor=MUTED))
styles.add(ParagraphStyle(name="Labelx", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=7, leading=9, textColor=ACCENT, spaceAfter=4))
styles.add(ParagraphStyle(name="CenterSmall", parent=styles["Smallx"], alignment=TA_CENTER))


class CircuitGraphic(Flowable):
    def __init__(self, preset, kind="schematic", width=7.35*inch, height=3.15*inch):
        super().__init__(); self.preset=preset; self.kind=kind; self.width=width; self.height=height

    def draw(self):
        c=self.canv; p=self.preset; w=self.width; h=self.height
        c.setFillColor(colors.HexColor("#F7F8F3")); c.roundRect(0,0,w,h,5,fill=1,stroke=0)
        c.setStrokeColor(LINE); c.roundRect(0,0,w,h,5,fill=0,stroke=1)
        c.setFillColor(INK); c.setFont("Helvetica-Bold",11); c.drawString(14,h-20,p["name"] + (" - schematic" if self.kind=="schematic" else " - breadboard reference"))
        c.setFillColor(MUTED); c.setFont("Helvetica",6.5); c.drawRightString(w-14,h-19,"NOT PHYSICALLY TESTED")
        if self.kind == "breadboard": self._breadboard(c,w,h)
        elif p["key"] == "dual555": self._dual(c,w,h)
        elif p["key"] == "fuzz": self._fuzz(c,w,h)
        else: self._glitch(c,w,h)

    def _rails(self,c,w,h):
        c.setLineWidth(1.4); c.setStrokeColor(RED); c.line(28,h-43,w-28,h-43); c.setFillColor(RED); c.setFont("Helvetica-Bold",7); c.drawString(30,h-38,"+9 V")
        c.setStrokeColor(BLUE); c.line(28,25,w-28,25); c.setFillColor(BLUE); c.drawString(30,14,"GND")

    def _ic(self,c,x,y,label,pins="8"):
        c.setFillColor(colors.HexColor("#E1E6D9")); c.setStrokeColor(INK); c.rect(x,y,112,72,fill=1,stroke=1)
        c.setFillColor(INK); c.setFont("Helvetica-Bold",8); c.drawCentredString(x+56,y+39,label)
        c.setFont("Helvetica",5.8); c.drawCentredString(x+56,y+28,"PDIP-"+pins+" TOP VIEW")

    def _dual(self,c,w,h):
        self._rails(c,w,h); self._ic(c,88,76,"U1 NE555P"); self._ic(c,w-200,76,"U2 NE555P")
        c.setStrokeColor(INK); c.setLineWidth(1.1)
        for x in (144,w-144): c.line(x,148,x,h-43); c.line(x,76,x,25)
        c.setFont("Helvetica",5.6); c.setFillColor(INK)
        c.drawString(98,96,"R1 10k; P1 100k; C1 10n")
        c.drawString(w-190,96,"R3 10k; P2 100k; C3 10n")
        c.setStrokeColor(GREEN); c.line(200,98,w/2-38,62); c.line(w-200,98,w/2+38,62); c.rect(w/2-38,49,76,25,fill=0,stroke=1)
        c.drawCentredString(w/2,58,"R5/R6 MIX"); c.line(w/2+38,62,w-52,62); c.drawRightString(w-52,68,"P3 -> C5 -> OUT")

    def _fuzz(self,c,w,h):
        self._rails(c,w,h); self._ic(c,w/2-56,96,"U1 TL072CP")
        c.setStrokeColor(colors.HexColor("#7547A9")); c.line(75,h-43,75,25); c.setFillColor(INK); c.setFont("Helvetica",6.5); c.drawString(84,138,"R1 100k / R2 100k"); c.drawString(84,125,"U1B buffers VREF = 4.5 V")
        c.setStrokeColor(GREEN); c.line(34,72,w/2-56,112); c.line(w/2+56,112,w-34,72)
        c.setFillColor(INK); c.drawString(34,79,"IN -> C2 -> R3 10k -> pin 2"); c.drawRightString(w-34,79,"pin 1 -> R5/C4 -> P1/C3 -> OUT")
        c.setStrokeColor(colors.HexColor("#C86D1C")); c.line(w/2-32,96,w/2-32,57); c.line(w/2-32,57,w/2+32,57); c.line(w/2+32,57,w/2+32,96)
        c.setFillColor(INK); c.drawCentredString(w/2,45,"R4 470k feedback")
        c.drawCentredString(w/2,35,"D1/D2 1N4148 antiparallel")

    def _glitch(self,c,w,h):
        self._rails(c,w,h); self._ic(c,w/2-56,94,"U1 CD40106BE",pins="14")
        c.setFillColor(INK); c.setFont("Helvetica",6.5); c.drawString(42,134,"pin 14 -> +9 V"); c.drawString(42,120,"pin 7 -> GND")
        c.setStrokeColor(GREEN); c.line(w/2+56,130,w-35,130); c.drawRightString(w-35,137,"pin 2 -> R2 -> C2 -> P2 -> OUT")
        c.setStrokeColor(colors.HexColor("#2F75B8")); c.line(w/2+56,114,w-110,86); c.line(w-110,86,w/2-56,114); c.setFillColor(INK); c.drawCentredString(w/2,75,"pin 2 -> R1 + P1 -> pin 1; C1 from pin 1 to GND")
        c.drawCentredString(w/2,54,"Tie unused inputs 3, 5, 9, 11, 13 to GND")

    def _breadboard(self,c,w,h):
        bx,by,bw,bh=24,35,w-48,h-68
        c.setFillColor(colors.white); c.setStrokeColor(LINE); c.roundRect(bx,by,bw,bh,6,fill=1,stroke=1)
        c.setStrokeColor(RED); c.line(bx+15,by+bh-24,bx+bw-15,by+bh-24)
        c.setStrokeColor(BLUE); c.line(bx+15,by+16,bx+bw-15,by+16)
        c.setStrokeColor(LINE); c.setLineWidth(8); c.line(bx+15,by+bh/2,bx+bw-15,by+bh/2)
        cols=26
        for col in range(cols):
            x=bx+25+col*(bw-50)/(cols-1)
            for y in (by+36,by+50,by+64,by+78,by+bh-78,by+bh-64,by+bh-50,by+bh-36):
                c.setFillColor(colors.HexColor("#41463F")); c.circle(x,y,1.3,fill=1,stroke=0)
        icw = 92 if self.preset["device"] != "CD40106BE" else 138
        c.setFillColor(colors.HexColor("#252923")); c.roundRect(w/2-icw/2,by+bh/2-15,icw,30,3,fill=1,stroke=0)
        c.setFillColor(colors.white); c.setFont("Helvetica-Bold",7); c.drawCentredString(w/2,by+bh/2-2,self.preset["device"]+" NOTCH LEFT")
        c.setStrokeColor(GREEN); c.setLineWidth(2); c.line(bx+50,by+64,w/2-icw/2,by+bh/2-8); c.line(w/2+icw/2,by+bh/2+8,bx+bw-50,by+bh-64)
        c.setFillColor(MUTED); c.setFont("Helvetica",6); c.drawCentredString(w/2,10,"Top view. Use the connection table for exact named endpoints and verify rail continuity.")


def P(text, style="Bodyx"):
    return Paragraph(text, styles[style])


def table(data, widths, header=True, font=7.2):
    converted=[]
    for r,row in enumerate(data):
        converted.append([Paragraph(str(cell), ParagraphStyle(name=f"cell{r}{i}", parent=styles["Smallx"], fontName="Helvetica-Bold" if header and r==0 else "Helvetica", fontSize=font, leading=font+2, textColor=colors.white if header and r==0 else INK)) for i,cell in enumerate(row)])
    t=Table(converted,colWidths=widths,repeatRows=1 if header else 0,hAlign="LEFT")
    commands=[("VALIGN",(0,0),(-1,-1),"TOP"),("GRID",(0,0),(-1,-1),.35,LINE),("LEFTPADDING",(0,0),(-1,-1),5),("RIGHTPADDING",(0,0),(-1,-1),5),("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4)]
    if header: commands += [("BACKGROUND",(0,0),(-1,0),INK)]
    for r in range(1 if header else 0,len(data)):
        if r%2==0: commands.append(("BACKGROUND",(0,r),(-1,r),colors.HexColor("#F4F6F0")))
    t.setStyle(TableStyle(commands)); return t


def page_decor(canvas, doc):
    canvas.saveState(); w,h=letter
    canvas.setFillColor(INK); canvas.rect(0,h-18, w,18,fill=1,stroke=0)
    canvas.setFillColor(MUTED); canvas.setFont("Helvetica",7); canvas.drawString(doc.leftMargin,20,"Circuit Bending Sound Designer - educational 9 V DC build guide")
    canvas.drawRightString(w-doc.rightMargin,20,f"Page {doc.page}"); canvas.restoreState()


def make_guide(filename, p):
    out=GUIDES/filename
    doc=SimpleDocTemplate(str(out),pagesize=letter,rightMargin=.55*inch,leftMargin=.55*inch,topMargin=.48*inch,bottomMargin=.45*inch,title=p["name"]+" Build Guide",author="Circuit Bending Sound Designer")
    story=[]
    story += [Spacer(1,.65*inch), P("CIRCUIT BENDING SOUND DESIGNER","Labelx"), P(p["name"],"CoverTitle"), P(p["purpose"],"Deck")]
    status=Table([[P("EVIDENCE STATUS","Labelx"),P("Calculated circuit relationships + browser-simulated audio. Construction layout is diagram-audited but NOT physically tested.","Bodyx")]],colWidths=[1.25*inch,5.75*inch])
    status.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),PALE),("BOX",(0,0),(-1,-1),1,ACCENT),("VALIGN",(0,0),(-1,-1),"TOP"),("PADDING",(0,0),(-1,-1),10)])); story += [status,Spacer(1,18)]
    story += [P("1. Project purpose","H1x"),P(p["purpose"]),P("How it works","H2x"),P(p["physics"]),P("Calculated relationship","H2x"),P("<b>Formula:</b> "+p["formula"]),P("<b>Substitution:</b> "+p["substitution"]),P("<b>Result:</b> "+p["result"])]
    story += [Spacer(1,10),P("Safety boundary","H2x"),P("Use only a regulated, current-limited 9 V DC supply. Disconnect power before moving parts. Check IC orientation, diode bands, electrolytic polarity, and rail continuity. Connect the output only to a powered speaker, amplifier, or audio-interface input - never directly to a bare low-impedance speaker.")]
    story += [PageBreak(),P("2. Required components","H1x"),table([["Ref","Exact component / value","Qty"]]+p["parts"],[.75*inch,5.65*inch,.5*inch])]
    story += [Spacer(1,14),P("Pinout verification","H2x"),P(f"{p['device']} package view: TOP VIEW. In the supplied horizontal breadboard layout the notch faces left; DIP numbering proceeds counterclockwise.","Smallx"),table([["Pin","Name","Role"]]+PINOUTS[p["device"]],[.55*inch,1.15*inch,5.2*inch])]
    story += [PageBreak(),P("3. Labeled schematic","H1x"),CircuitGraphic(p,"schematic"),Spacer(1,10),P("4. Canonical connections","H1x"),table([["Net","From","To","Wire"]]+p["connections"],[.8*inch,1.65*inch,3.75*inch,.7*inch],font=6.8)]
    story += [PageBreak(),P("5. Breadboard reference","H1x"),CircuitGraphic(p,"breadboard"),Spacer(1,12),P("Breadboard orientation","H2x"),P("This drawing is a top-view placement reference. The connection table is authoritative for every electrical net. Typical breadboards connect A-E in each numbered row and F-J separately across the center trench; power-rail continuity varies by product and must be measured with power removed.")]
    story += [PageBreak(),P("6. Power-off assembly","H1x")]
    for i,step in enumerate(p["steps"],1): story.append(KeepTogether([P(f"<b>{i:02d}</b>  {step}"),Spacer(1,2)]))
    story += [Spacer(1,8),P("7. Test procedure and expected results","H1x"),P("Start with the supply current limit low and the output level down. Use a multimeter in DC-voltage mode with the black probe on the ground rail. Confirm the power and bias readings before connecting audio. Expected readings below are predictions, not measurements."),table([["Checkpoint","Calculated / expected observation"]]+[(str(i+1),x) for i,x in enumerate(p["expected"])],[.8*inch,6.1*inch])]
    story += [PageBreak(),P("8. Troubleshooting","H1x"),P("1. Remove power. Confirm +9 V and ground are not shorted using resistance or continuity mode."),P("2. Confirm the IC notch direction and locate pin 1 again. A mirrored package is the most serious common wiring error."),P("3. Check every polarized capacitor and every diode band against the connection table."),P("4. Measure the supply at the IC pins. If it is missing, repair power wiring before testing signals."),P("5. Compare one net at a time with the canonical table. Do not change several wires at once."),P("6. If DC checks pass but sound is missing, trace from output toward input with a powered audio probe or oscilloscope under instructor supervision."),P("7. Component tolerances change pitch, cutoff, gain, and bias. A difference from the browser model is not automatically a fault."),P("Sources","H1x")]
    for source in p["sources"]: story.append(P(source,"Smallx"))
    story += [Spacer(1,12),P("Wire audit statement","H2x"),P("The connection table, schematic labels, and breadboard IC orientation were reconciled for this guide. Off-board potentiometers and jacks are identified by terminal name in the table. No physical build or measurement was performed; complete a continuity and power-rail audit before first power-up.")]
    doc.build(story,onFirstPage=page_decor,onLaterPages=page_decor)
    return out


def main():
    GUIDES.mkdir(parents=True,exist_ok=True)
    for filename,preset in PRESETS.items():
        print(make_guide(filename,preset))


if __name__ == "__main__":
    main()
