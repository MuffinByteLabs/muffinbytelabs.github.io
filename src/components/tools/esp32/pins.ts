/* ════════════════════════════════════════════════════════════════════════
   The ESP32-S3-WROOM-1 / -1U module, pin by pin, and what each pin is safe
   for in a given setup.

   Sources, all Espressif:
     · ESP32-S3-WROOM-1 & WROOM-1U datasheet v1.8: Table 3-1 Pin
       Definitions (every function string below), Figure 3-1 Pin Layout,
       Chapter 4 Boot Configurations (the strapping pins).
     · ESP32-S3 Hardware Design Guidelines: power-up glitches on GPIO1–20,
       ADC1 recommended, the RC delay on EN, deep-sleep (RTC) GPIOs.
     · ESP-IDF docs for ESP32-S3: ADC2 is shared with Wi-Fi, so a read can
       time out while Wi-Fi is running; GPIO19/20 carry USB-JTAG by default;
       GPIO33–37 belong to octal PSRAM when it is fitted.

   No imports, so this file can be checked on its own with node.
   ════════════════════════════════════════════════════════════════════════ */

export type Side = "left" | "bottom" | "right" | "center";

export type ModulePin = {
  /** the module's pad number, 1–41 */
  pad: number;
  /** the datasheet's pin name */
  name: string;
  gpio?: number;
  side: Side;
  /** fixed functions from Table 3-1, in its order */
  fn: string[];
};

const g = (pad: number, name: string, gpio: number, side: Side, fn: string[]): ModulePin => ({ pad, name, gpio, side, fn });

export const PINS: ModulePin[] = [
  { pad: 1, name: "GND", side: "left", fn: [] },
  { pad: 2, name: "3V3", side: "left", fn: [] },
  { pad: 3, name: "EN", side: "left", fn: [] },
  g(4, "IO4", 4, "left", ["RTC_GPIO4", "GPIO4", "TOUCH4", "ADC1_CH3"]),
  g(5, "IO5", 5, "left", ["RTC_GPIO5", "GPIO5", "TOUCH5", "ADC1_CH4"]),
  g(6, "IO6", 6, "left", ["RTC_GPIO6", "GPIO6", "TOUCH6", "ADC1_CH5"]),
  g(7, "IO7", 7, "left", ["RTC_GPIO7", "GPIO7", "TOUCH7", "ADC1_CH6"]),
  g(8, "IO15", 15, "left", ["RTC_GPIO15", "GPIO15", "U0RTS", "ADC2_CH4", "XTAL_32K_P"]),
  g(9, "IO16", 16, "left", ["RTC_GPIO16", "GPIO16", "U0CTS", "ADC2_CH5", "XTAL_32K_N"]),
  g(10, "IO17", 17, "left", ["RTC_GPIO17", "GPIO17", "U1TXD", "ADC2_CH6"]),
  g(11, "IO18", 18, "left", ["RTC_GPIO18", "GPIO18", "U1RXD", "ADC2_CH7", "CLK_OUT3"]),
  g(12, "IO8", 8, "left", ["RTC_GPIO8", "GPIO8", "TOUCH8", "ADC1_CH7", "SUBSPICS1"]),
  g(13, "IO19", 19, "left", ["RTC_GPIO19", "GPIO19", "U1RTS", "ADC2_CH8", "CLK_OUT2", "USB_D-"]),
  g(14, "IO20", 20, "left", ["RTC_GPIO20", "GPIO20", "U1CTS", "ADC2_CH9", "CLK_OUT1", "USB_D+"]),
  g(15, "IO3", 3, "bottom", ["RTC_GPIO3", "GPIO3", "TOUCH3", "ADC1_CH2"]),
  g(16, "IO46", 46, "bottom", ["GPIO46"]),
  g(17, "IO9", 9, "bottom", ["RTC_GPIO9", "GPIO9", "TOUCH9", "ADC1_CH8", "FSPIHD", "SUBSPIHD"]),
  g(18, "IO10", 10, "bottom", ["RTC_GPIO10", "GPIO10", "TOUCH10", "ADC1_CH9", "FSPICS0", "FSPIIO4", "SUBSPICS0"]),
  g(19, "IO11", 11, "bottom", ["RTC_GPIO11", "GPIO11", "TOUCH11", "ADC2_CH0", "FSPID", "FSPIIO5", "SUBSPID"]),
  g(20, "IO12", 12, "bottom", ["RTC_GPIO12", "GPIO12", "TOUCH12", "ADC2_CH1", "FSPICLK", "FSPIIO6", "SUBSPICLK"]),
  g(21, "IO13", 13, "bottom", ["RTC_GPIO13", "GPIO13", "TOUCH13", "ADC2_CH2", "FSPIQ", "FSPIIO7", "SUBSPIQ"]),
  g(22, "IO14", 14, "bottom", ["RTC_GPIO14", "GPIO14", "TOUCH14", "ADC2_CH3", "FSPIWP", "FSPIDQS", "SUBSPIWP"]),
  g(23, "IO21", 21, "bottom", ["RTC_GPIO21", "GPIO21"]),
  g(24, "IO47", 47, "bottom", ["SPICLK_P_DIFF", "GPIO47", "SUBSPICLK_P_DIFF"]),
  g(25, "IO48", 48, "bottom", ["SPICLK_N_DIFF", "GPIO48", "SUBSPICLK_N_DIFF"]),
  g(26, "IO45", 45, "bottom", ["GPIO45"]),
  g(27, "IO0", 0, "right", ["RTC_GPIO0", "GPIO0"]),
  g(28, "IO35", 35, "right", ["SPIIO6", "GPIO35", "FSPID", "SUBSPID"]),
  g(29, "IO36", 36, "right", ["SPIIO7", "GPIO36", "FSPICLK", "SUBSPICLK"]),
  g(30, "IO37", 37, "right", ["SPIDQS", "GPIO37", "FSPIQ", "SUBSPIQ"]),
  g(31, "IO38", 38, "right", ["GPIO38", "FSPIWP", "SUBSPIWP"]),
  g(32, "IO39", 39, "right", ["MTCK", "GPIO39", "CLK_OUT3", "SUBSPICS1"]),
  g(33, "IO40", 40, "right", ["MTDO", "GPIO40", "CLK_OUT2"]),
  g(34, "IO41", 41, "right", ["MTDI", "GPIO41", "CLK_OUT1"]),
  g(35, "IO42", 42, "right", ["MTMS", "GPIO42"]),
  g(36, "RXD0", 44, "right", ["U0RXD", "GPIO44", "CLK_OUT2"]),
  g(37, "TXD0", 43, "right", ["U0TXD", "GPIO43", "CLK_OUT1"]),
  g(38, "IO2", 2, "right", ["RTC_GPIO2", "GPIO2", "TOUCH2", "ADC1_CH1"]),
  g(39, "IO1", 1, "right", ["RTC_GPIO1", "GPIO1", "TOUCH1", "ADC1_CH0"]),
  { pad: 40, name: "GND", side: "right", fn: [] },
  { pad: 41, name: "EPAD", side: "center", fn: [] },
];

export type Psram = "none" | "octal" | "octal18";

export type Setup = {
  /** "none" covers no PSRAM and quad PSRAM (N4, N8, N16, H4, R2 parts) */
  psram: Psram;
  /** native USB (USB-Serial-JTAG or USB-OTG) on GPIO19/20 */
  usb: boolean;
  /** UART0 as the console and flashing port on GPIO43/44 */
  uart0: boolean;
  /** an external JTAG probe on GPIO39–42 */
  jtag: boolean;
  wifi: boolean;
  /** a 32.768 kHz crystal on GPIO15/16 */
  xtal32k: boolean;
};

export const DEFAULT_SETUP: Setup = { psram: "none", usb: true, uart0: true, jtag: false, wifi: true, xtal32k: false };

export type Level = "free" | "care" | "taken" | "power";
export type Note = { tone: "taken" | "warn" | "info"; text: string };
export type Assessment = { level: Level; headline: string; notes: Note[] };

export const STRAPPING = [0, 3, 45, 46];
const adcOf = (p: ModulePin) => p.fn.find((f) => f.startsWith("ADC"));
const touchOf = (p: ModulePin) => p.fn.find((f) => f.startsWith("TOUCH"));

/** GPIOs that are driven for ~60 µs during power-up (Hardware Design Guidelines) */
export const glitches = (gpio: number) => gpio >= 1 && gpio <= 20;

export function assess(p: ModulePin, s: Setup): Assessment {
  if (p.gpio === undefined) {
    if (p.name === "GND") return { level: "power", headline: "Ground.", notes: [] };
    if (p.name === "EPAD")
      return {
        level: "power",
        headline: "The ground pad under the module.",
        notes: [{ tone: "info", text: "Solder it to a ground pour, with vias down to the ground plane." }],
      };
    if (p.name === "3V3")
      return {
        level: "power",
        headline: "The module's supply: 3.0 to 3.6 V.",
        notes: [{ tone: "info", text: "Put the decoupling capacitors right at this pin, not across the board." }],
      };
    return {
      level: "power",
      headline: "Chip enable. High runs the chip; low holds it in reset.",
      notes: [
        { tone: "warn", text: "Never leave it floating." },
        { tone: "info", text: "Espressif suggests an RC delay, usually 10 kΩ to 3V3 and 1 µF to ground, so the chip starts only after the supply has settled." },
      ],
    };
  }

  const n = p.gpio;
  const taken: Note[] = [];
  const warn: Note[] = [];
  const info: Note[] = [];

  // ── pins this setup has already spent ────────────────────────────────
  if ((s.psram === "octal" || s.psram === "octal18") && n >= 35 && n <= 37)
    taken.push({ tone: "taken", text: "Wired to the octal PSRAM inside R8 and R16V modules: not available." });
  if (s.usb && (n === 19 || n === 20))
    taken.push({ tone: "taken", text: `Native USB ${n === 19 ? "D−" : "D+"}. Using it as a GPIO turns USB off.` });
  if (s.jtag && n >= 39 && n <= 42)
    taken.push({ tone: "taken", text: `JTAG ${["MTCK", "MTDO", "MTDI", "MTMS"][n - 39]}, for your external probe.` });
  if (s.xtal32k && (n === 15 || n === 16))
    taken.push({ tone: "taken", text: `The 32.768 kHz crystal (${n === 15 ? "XTAL_32K_P" : "XTAL_32K_N"}).` });

  // ── strapping pins ───────────────────────────────────────────────────
  if (n === 0)
    warn.push({ tone: "warn", text: "Strapping pin: boot mode. Held low at reset (with GPIO46 low), the chip starts in download mode instead of running your code. It has a weak pull-up and is usually the BOOT button. Don't put a large capacitor on it." });
  if (n === 46)
    warn.push({ tone: "warn", text: "Strapping pin: boot mode and boot messages. It has a weak pull-down; keep it low during reset, because download mode needs GPIO0 and GPIO46 both low." });
  if (n === 45)
    warn.push({ tone: "warn", text: "Strapping pin: the flash voltage. Low at reset (its weak pull-down) selects 3.3 V. Pulled high, it selects 1.8 V and a module with 3.3 V flash won't boot. Use it only for signals that are low or floating during reset." });
  if (n === 3)
    warn.push({ tone: "warn", text: "Strapping pin for the JTAG source, but only if an eFuse selects it, which it doesn't by default, so it is free in most designs. It floats at reset, with no pull switched on: give it a defined level, with a resistor or its internal pull." });

  // ── shared or default roles ──────────────────────────────────────────
  if (n === 43 || n === 44) {
    if (s.uart0)
      warn.push({ tone: "warn", text: `UART0 ${n === 43 ? "TX" : "RX"}: the default console and flashing port.${n === 43 ? " TX prints boot messages at every reset." : ""} Free if you flash and log over USB instead.` });
    else info.push({ tone: "info", text: `UART0's default ${n === 43 ? "TX" : "RX"} pin, free while you flash and log over USB.` });
  }
  if ((n === 47 || n === 48) && s.psram === "octal18")
    warn.push({ tone: "warn", text: "Runs at 1.8 V on R16V modules, not 3.3 V: it shares the octal PSRAM's power domain." });
  if (!s.usb && (n === 19 || n === 20)) info.push({ tone: "info", text: `USB ${n === 19 ? "D−" : "D+"}, free while native USB is off.` });
  if (!s.jtag && n >= 39 && n <= 42) info.push({ tone: "info", text: "A JTAG pin, but JTAG runs over USB by default, so it is free." });
  if (!s.xtal32k && (n === 15 || n === 16)) info.push({ tone: "info", text: "Can take a 32.768 kHz crystal for an accurate sleep clock." });

  // ── what it can do ───────────────────────────────────────────────────
  const adc = adcOf(p);
  if (adc?.startsWith("ADC1")) info.push({ tone: "info", text: `Analog input ${adc}: works while Wi-Fi is on.` });
  if (adc?.startsWith("ADC2"))
    (s.wifi ? warn : info).push(
      s.wifi
        ? { tone: "warn", text: `Analog input ${adc} is shared with Wi-Fi: readings can fail while Wi-Fi is on. For analog, use an ADC1 pin (GPIO1–10). Digital use is fine.` }
        : { tone: "info", text: `Analog input ${adc}.` }
    );
  const touch = touchOf(p);
  if (touch) info.push({ tone: "info", text: `Capacitive touch input ${touch}.` });
  if (glitches(n))
    warn.push({ tone: "warn", text: `Driven for about 60 µs while the chip powers up${n === 19 || n === 20 ? ", including two short high pulses" : ""}. Avoid it for anything that must not twitch at power-on, such as relay, motor or MOSFET drives, or check the pulse against your circuit.` });
  if (n <= 21) info.push({ tone: "info", text: "An RTC GPIO: it can stay active in deep sleep and wake the chip." });

  const level: Level = taken.length ? "taken" : STRAPPING.includes(n) || warn.some((w) => !w.text.startsWith("Driven") && !w.text.startsWith("Analog")) ? "care" : "free";
  const headline =
    level === "taken"
      ? "Not available in this setup."
      : level === "care"
        ? "Usable, with a catch."
        : glitches(n)
          ? "Free to use, with a power-up pulse to keep in mind."
          : "Free to use.";

  return { level, headline, notes: [...taken, ...warn, ...info] };
}

/** pins that stay quiet at power-up and carry no strapping or default role */
export function isQuiet(p: ModulePin, s: Setup) {
  if (p.gpio === undefined) return false;
  const a = assess(p, s);
  return a.level === "free" && !glitches(p.gpio) && !STRAPPING.includes(p.gpio) && p.gpio !== 43 && p.gpio !== 44;
}

export function isAnalogWithWifi(p: ModulePin, s: Setup) {
  return !!adcOf(p)?.startsWith("ADC1") && assess(p, s).level !== "taken";
}

export function isTouch(p: ModulePin, s: Setup) {
  return !!touchOf(p) && assess(p, s).level !== "taken";
}

export const PSRAM_LABEL: Record<Psram, string> = {
  none: "No PSRAM, or quad PSRAM (N4, N8, N16, H4, R2)",
  octal: "Octal PSRAM, 8 MB (R8)",
  octal18: "Octal PSRAM, 16 MB at 1.8 V (R16V)",
};
