import ToolShell from "@/components/tools/ToolShell";
import Glossary from "@/components/tools/glossary/Glossary";
import { GLOSSARY, TERM_COUNT } from "@/components/tools/glossary/terms";
import { CONTACT_MAILTO } from "@/components/pcb/pcbData";
import { pageMetadata } from "@/lib/pageMeta";
import { glossarySchema } from "@/lib/schema";
import { toolBySlug, toolCard } from "@/lib/tools";

const tool = toolBySlug("pcb-glossary");
export const metadata = pageMetadata({ title: tool.title, description: tool.description, path: tool.path, image: toolCard(tool.slug) });

export default function GlossaryPage() {
  return (
    <ToolShell
      tool={tool}
      schema={glossarySchema(tool, GLOSSARY.flatMap((g) => g.terms))}
      title={
        <>
          PCB terms in <em>plain English</em>
        </>
      }
      lede={`${TERM_COUNT} words you will hear on a hardware project, from Gerber files to NRE, each explained in a sentence or two for people who don't design boards. Every term has its own link, so you can send one to a colleague.`}
      cta={{
        title: "A question this doesn't answer?",
        body: "Ask. I'll explain anything about your project in plain words, before you commit to anything.",
        href: CONTACT_MAILTO,
        label: "Email me",
        secondary: { href: "/tools/pcb-design-brief", label: "Or plan your board" },
      }}
    >
      <Glossary />
    </ToolShell>
  );
}
