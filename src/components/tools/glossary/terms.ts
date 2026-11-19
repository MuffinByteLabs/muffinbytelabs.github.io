/* ════════════════════════════════════════════════════════════════════════
   The glossary: the words a product team hears on a hardware project, in
   plain English. One or two sentences each, written for someone who has
   never designed a board, and accurate enough that an engineer reading
   over their shoulder would nod.

   Each term's `id` is its anchor (/tools/pcb-glossary#gerber-files), so
   links into the glossary keep working if the order changes.
   ════════════════════════════════════════════════════════════════════════ */

export type Term = { id: string; term: string; also?: string; def: string };
export type TermGroup = { id: string; title: string; lede: string; terms: Term[] };

export const GLOSSARY: TermGroup[] = [
  {
    id: "files",
    title: "The files you get",
    lede: "What a finished design is made of, and who uses each file.",
    terms: [
      { id: "gerber-files", term: "Gerber files", def: "The drawings a factory makes your board from: one file per layer, for the copper, the solder mask, the silkscreen and the board's outline. It is the industry's standard format, so any board factory can read it." },
      { id: "drill-file", term: "Drill file", also: "Excellon", def: "The list of every hole in the board, with its position, its size and whether it is plated. It travels with the Gerber files." },
      { id: "bom", term: "BOM", also: "bill of materials", def: "The parts list: every component on the board with its value, package, quantity and an orderable part number. The assembler buys parts from it, so a vague BOM means wrong parts." },
      { id: "cpl", term: "CPL", also: "pick-and-place or centroid file", def: "Where each part sits: its position, rotation and which side of the board it is on. The assembly machine reads it to place every part." },
      { id: "schematic", term: "Schematic", def: "The circuit diagram: every part and what it connects to. It is the document an engineer reads to understand, debug or change the board." },
      { id: "fab-drawing", term: "Fabrication drawing", also: "fab notes", def: "A drawing of the board's outline, thickness, layer stack-up, finish and anything unusual the factory must know, such as controlled impedance or a special material." },
      { id: "source-files", term: "Source files", also: "project files", def: "The editable design itself, in the software it was made in. Without them, the next change starts from scratch, so make sure you receive them." },
      { id: "step-model", term: "3D model", also: "STEP file", def: "A 3D model of the assembled board, for checking that it fits your enclosure and its connectors line up with the openings." },
    ],
  },
  {
    id: "board",
    title: "The board itself",
    lede: "What you are looking at when you hold a circuit board.",
    terms: [
      { id: "pcb-pcba", term: "PCB and PCBA", def: "A PCB is the bare board. A PCBA, a printed circuit board assembly, is the same board with its parts soldered on." },
      { id: "layers", term: "Layers", also: "layer count", def: "A board has two, four, six or more layers of copper stacked inside it. More layers make dense or fast designs easier and quieter, at a higher price per board." },
      { id: "stack-up", term: "Stack-up", def: "The order and thickness of the copper and insulating layers. It sets the board's total thickness and, for fast signals, their impedance." },
      { id: "copper-weight", term: "Copper weight", also: "oz", def: "How thick the copper is, given in ounces per square foot. 1 oz, about 35 µm, is standard; 2 oz carries more current and costs more." },
      { id: "trace", term: "Trace", def: "A copper \"wire\" on the board. Its width is chosen for the current it carries and, for fast signals, for its impedance." },
      { id: "via", term: "Via", def: "A small plated hole that connects copper on one layer to copper on another." },
      { id: "pad", term: "Pad", def: "Exposed copper where a component's pin is soldered." },
      { id: "footprint", term: "Footprint", def: "The pattern of pads a part needs on the board. A footprint that doesn't match the real part is one of the most common reasons a board comes back unusable." },
      { id: "solder-mask", term: "Solder mask", def: "The coloured coating, often green, that covers the copper except where parts are soldered. It prevents shorts and protects the copper." },
      { id: "silkscreen", term: "Silkscreen", def: "The printed text and outlines on the board: part labels, polarity marks, logos." },
      { id: "surface-finish", term: "Surface finish", also: "HASL, ENIG", def: "The coating on exposed copper so it solders well and doesn't tarnish. HASL, a layer of solder, is the cheapest; ENIG, gold over nickel, is flat and lasts longer, which small fine-pitch parts need." },
      { id: "ground-plane", term: "Ground plane", def: "A large area of copper connected to ground. It gives every signal a short way back to its source, which cuts noise and interference." },
      { id: "thermal-via", term: "Thermal vias", def: "A group of vias under a hot part that carries its heat into the board's other layers, so the part runs cooler." },
    ],
  },
  {
    id: "design",
    title: "Design words",
    lede: "What the engineer means in a design review or a status update.",
    terms: [
      { id: "schematic-capture", term: "Schematic capture", def: "Drawing the circuit: choosing the parts and how they connect. It comes before the layout." },
      { id: "layout", term: "Layout", also: "routing", def: "Placing the parts on the board and drawing the copper connections between them." },
      { id: "drc", term: "DRC", also: "design rule check", def: "An automatic check that the layout stays within the factory's limits: trace widths, gaps, hole sizes. A clean DRC is the minimum, not proof the board works." },
      { id: "erc", term: "ERC", also: "electrical rule check", def: "An automatic check of the schematic for mistakes such as unconnected pins or two outputs driving the same wire." },
      { id: "dfm", term: "DFM", also: "design for manufacturing", def: "Designing so the factory can build the board reliably and cheaply, with nothing at the edge of what its machines can do." },
      { id: "dfa", term: "DFA", also: "design for assembly", def: "The same idea for soldering the parts on: spacing, orientation and markings that make assembly reliable." },
      { id: "decoupling", term: "Decoupling capacitor", def: "A small capacitor right next to a chip's power pin. It supplies quick bursts of current so the chip's supply stays steady." },
      { id: "impedance", term: "Controlled impedance", def: "Making a fast signal's traces a precise width and distance from ground so the signal arrives clean. USB, Ethernet and HDMI need it, and the factory has to build to it." },
      { id: "differential-pair", term: "Differential pair", def: "Two traces that carry one signal as opposite voltages, routed side by side. USB, Ethernet, CAN and RS-485 all use them." },
      { id: "creepage-clearance", term: "Creepage and clearance", def: "The minimum distance between conductors at different voltages: across the board's surface (creepage) and through the air (clearance). Around mains and other high voltages they are a safety requirement." },
      { id: "emc", term: "EMC and EMI", def: "Electromagnetic compatibility: whether a device stays electrically quiet (EMI is the interference it gives off) and keeps working next to other electronics. Certification tests measure it." },
      { id: "esd", term: "ESD protection", def: "Small parts at the connectors that absorb static shocks from people and cables before they reach the chips." },
    ],
  },
  {
    id: "making",
    title: "Making and testing",
    lede: "From files to boards in your hand.",
    terms: [
      { id: "fab", term: "Fab", also: "board house", def: "The factory that makes the bare boards from the Gerber and drill files." },
      { id: "assembly", term: "Assembly", also: "SMT", def: "Soldering the parts onto the board, mostly by machine. Surface-mount (SMT) parts sit on the surface; through-hole parts have legs that go through the board." },
      { id: "turnkey", term: "Turnkey and consigned assembly", def: "Turnkey: the assembler buys the parts for you. Consigned: you buy them and ship them to the assembler." },
      { id: "panelization", term: "Panelization", def: "Putting several boards on one larger panel so they are made and assembled together, then snapped or cut apart." },
      { id: "fiducial", term: "Fiducial", def: "A small copper dot the assembly machine's camera uses to line the board up before it places parts." },
      { id: "test-point", term: "Test point", def: "A pad placed so a probe or a test fixture can touch a signal, for testing or programming the board." },
      { id: "bring-up", term: "Bring-up", def: "Powering a new board for the first time and checking it step by step: power first, then the chips, then the firmware." },
      { id: "revision", term: "Revision", also: "Rev A, Rev B", def: "Each version of a board. Rev A is the first; whatever testing finds goes into Rev B." },
      { id: "prototype", term: "Prototype and production run", def: "A prototype run is a handful of boards to prove the design works. A production run is the volume order, placed once it does." },
    ],
  },
  {
    id: "money",
    title: "Money and timing",
    lede: "The words in quotes and schedules.",
    terms: [
      { id: "nre", term: "NRE", also: "non-recurring engineering", def: "One-time costs: the design work itself, tooling, test fixtures. You pay them once, not per board." },
      { id: "unit-cost", term: "Unit cost", def: "What each finished board costs: its share of the bare board, the parts and the assembly. It falls as the quantity grows." },
      { id: "moq", term: "MOQ", also: "minimum order quantity", def: "The smallest quantity a supplier will sell, for boards or for a part." },
      { id: "lead-time", term: "Lead time", def: "How long until you have it. For a part, how long until it ships; for boards, the time to make, assemble and deliver them." },
      { id: "lifecycle", term: "Lifecycle status", also: "EOL, NRND", def: "Whether a part is still made. NRND means \"not recommended for new designs\"; EOL, end of life, means it is going away. Designing one in is a future redesign." },
      { id: "certification", term: "Certification", also: "CE, FCC, UL", def: "Tests a product must pass before it can be sold: CE marking for Europe, FCC rules for the United States (radio and interference), and UL listing, a safety certification many retailers ask for." },
    ],
  },
];

export const TERM_COUNT = GLOSSARY.reduce((n, g) => n + g.terms.length, 0);
