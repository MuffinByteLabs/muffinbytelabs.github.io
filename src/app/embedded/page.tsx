import Hero from "@/components/Hero";
import About from "@/components/About";
import ChipPinout from "@/components/ChipPinout";
import Projects from "@/components/Projects";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";

export const metadata = {
  title: "Embedded Systems | MuffinManLabs",
  description:
    "Embedded systems & firmware — C, bare metal, RTOS, STM32. The side of the bench behind the boards.",
};

function SectionDivider() {
  return (
    <div className="max-w-4xl mx-auto px-8">
      <div className="terminal-divider" />
    </div>
  );
}

export default function EmbeddedPage() {
  return (
    <>
      <Hero />
      <SectionDivider />
      <About />
      <SectionDivider />
      <ChipPinout />
      <SectionDivider />
      <Projects />
      <SectionDivider />
      <Blog />
      <SectionDivider />
      <Contact />
    </>
  );
}
