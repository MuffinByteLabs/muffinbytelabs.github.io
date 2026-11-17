import Hero from "@/components/pcb/Hero";
import ClientWork from "@/components/pcb/ClientWork";
import BoardsGallery from "@/components/pcb/BoardsGallery";
import Deliverables from "@/components/pcb/Deliverables";
import SpotTheFault from "@/components/pcb/SpotTheFault";
import Faq from "@/components/pcb/Faq";
import ContactCTA from "@/components/pcb/ContactCTA";
import { homeSchema, jsonLd } from "@/lib/schema";

/* The order answers a client's questions as they come up: who is this,
   has he done it for someone else, how good is the work up close, what do
   I get, what about price, time and files, how do I start. The mini game
   sits after the deliverables as an unnumbered aside: a minute of play
   for anyone curious, out of the way of anyone skimming. */
export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(homeSchema)} />
      <Hero />
      <ClientWork index="01" />
      <BoardsGallery index="02" />
      <Deliverables index="03" />
      <SpotTheFault />
      <Faq index="04" />
      <ContactCTA index="05" />
    </>
  );
}
