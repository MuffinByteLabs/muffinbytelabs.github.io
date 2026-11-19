import ToolShell from "@/components/tools/ToolShell";
import PinPlanner from "@/components/tools/esp32/PinPlanner";
import { CONTACT_MAILTO } from "@/components/pcb/pcbData";
import { pageMetadata } from "@/lib/pageMeta";
import { toolSchema } from "@/lib/schema";
import { toolBySlug, toolCard } from "@/lib/tools";

const tool = toolBySlug("esp32-s3-pinout");
export const metadata = pageMetadata({ title: tool.title, description: tool.description, path: tool.path, image: toolCard(tool.slug) });

export default function Esp32PinoutPage() {
  return (
    <ToolShell
      tool={tool}
      schema={toolSchema(tool)}
      title={
        <>
          ESP32-S3 <em>pin planner</em>
        </>
      }
      lede="The ESP32-S3-WROOM-1 and -1U modules, pin by pin. Tell it which module you have and what your design uses, and every pad turns green, amber or red: free, usable with a catch, or already taken. Click a pin for the reason, and name the ones you use into a plan you can copy."
      cta={{
        title: "ESP32-S3 boards, designed and reviewed.",
        body: "My own plant monitor is an ESP32-S3 board, published in full, and I design ESP32 and STM32 boards for clients. If yours is next, or you want the pinout checked before it is ordered, send it over.",
        href: CONTACT_MAILTO,
        label: "Start a project",
        secondary: { href: "/#pcb-1", label: "See my ESP32-S3 board" },
      }}
      about={
        <div className="tl-prose">
          <h2>How to read it</h2>
          <ul>
            <li>
              <b>Green, free:</b> a plain GPIO in your setup. Some still carry a note, such as the short pulse many pins give at power-up.
            </li>
            <li>
              <b>Amber, use with care:</b> usable, but with a role at reset or a default job, such as a strapping pin or the UART0 console.
            </li>
            <li>
              <b>Red, taken:</b> spent on something your setup already uses: USB, octal PSRAM, a JTAG probe or the 32&nbsp;kHz crystal.
            </li>
          </ul>

          <h2>The pins that catch people out</h2>
          <ul>
            <li>
              <b>Strapping pins, GPIO0, 3, 45 and 46.</b> The chip reads them at reset. GPIO0 and GPIO46 both low start the download mode
              instead of your code; GPIO45 high selects 1.8&nbsp;V for the flash, and a module with 3.3&nbsp;V flash then won&rsquo;t boot.
              GPIO3 only matters if an eFuse makes it select the JTAG source. Anything wired to these must sit at the right level during reset.
            </li>
            <li>
              <b>USB, GPIO19 and 20.</b> Native USB, which most boards use for flashing and the serial console. Taking them as GPIOs turns USB
              off.
            </li>
            <li>
              <b>Octal PSRAM, GPIO35–37.</b> On R8 and R16V modules they are wired to the PSRAM inside the module and are not yours to use.
            </li>
            <li>
              <b>ADC2 and Wi-Fi.</b> ADC2 (GPIO11–20) is shared with the Wi-Fi radio, so a reading can fail while Wi-Fi is on. Put analog
              inputs on ADC1, GPIO1–10.
            </li>
            <li>
              <b>Power-up pulses.</b> GPIO1–20 are driven for about 60&nbsp;µs while the chip powers up. Harmless for most signals, but not
              for a relay, a motor or a MOSFET gate that must never twitch: give those a pin from the &ldquo;quiet at power-up&rdquo; list.
            </li>
            <li>
              <b>UART0, GPIO43 and 44.</b> The default console and flashing port; TX prints boot messages at every reset. Free if you flash
              and log over USB.
            </li>
          </ul>

          <h2>Pins you won&rsquo;t find on the module</h2>
          <p>
            GPIO22–25 don&rsquo;t exist on the ESP32-S3, and GPIO26–34 aren&rsquo;t brought out to the module&rsquo;s pads: inside it, 26–32
            run the flash. On a bare chip, treat GPIO26–32 as the flash&rsquo;s, and GPIO33–37 as the octal memory&rsquo;s when you fit one.
          </p>

          <h2>Sources</h2>
          <p>
            Espressif&rsquo;s ESP32-S3-WROOM-1 &amp; WROOM-1U datasheet v1.8 (pin definitions and boot configuration), the ESP32-S3 Hardware
            Design Guidelines, and the ESP-IDF documentation for the ESP32-S3. Espressif revises these: for a design going to production,
            check the latest datasheet for your exact part number.
          </p>
        </div>
      }
    >
      <PinPlanner />
    </ToolShell>
  );
}
