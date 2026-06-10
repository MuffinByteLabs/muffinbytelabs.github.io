import PCBHero from "@/components/pcb/PCBHero";
import Deliverable from "@/components/pcb/Deliverable";
import BoardsGallery from "@/components/pcb/BoardsGallery";
import ProcessRail from "@/components/pcb/ProcessRail";
import CapabilityMatrix from "@/components/pcb/CapabilityMatrix";
import EmbeddedHeader from "@/components/pcb/EmbeddedHeader";
import SubmitToFab from "@/components/pcb/SubmitToFab";

function SectionDivider() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <div className="terminal-divider" />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <PCBHero />
      <SectionDivider />
      <Deliverable />
      <SectionDivider />
      <BoardsGallery />
      <SectionDivider />
      <ProcessRail />
      <SectionDivider />
      <CapabilityMatrix />
      <SectionDivider />
      <EmbeddedHeader />
      <SectionDivider />
      <SubmitToFab />
    </>
  );
}
