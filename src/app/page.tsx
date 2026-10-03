import Hero from "@/components/pcb/Hero";
import BoardsGallery from "@/components/pcb/BoardsGallery";
import Deliverables from "@/components/pcb/Deliverables";
import ContactCTA from "@/components/pcb/ContactCTA";
import { homeSchema, jsonLd } from "@/lib/schema";

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(homeSchema)} />
      <Hero />
      <BoardsGallery />
      <Deliverables />
      <ContactCTA index="03" />
    </>
  );
}
