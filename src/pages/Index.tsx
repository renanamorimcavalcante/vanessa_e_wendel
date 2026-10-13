import { lazy, Suspense } from "react";
import ParticleField from "@/components/ParticleField";
import HeroStage from "@/components/HeroStage";
import StoryStage from "@/components/StoryStage";
import InviteStage from "@/components/InviteStage";
import FormStage from "@/components/FormStage";
import { COUPLE, SECTIONS } from "@/config/wedding";

/**
 * Seções opcionais carregadas sob demanda: se estiverem desligadas em
 * SECTIONS (config/wedding.ts), nem o código nem as imagens delas são
 * baixados pelo convidado.
 */
const LookStage = lazy(() => import("@/components/LookStage"));
const GiftStage = lazy(() => import("@/components/GiftStage"));

/**
 * Ordem dos stages (mesma narrativa do convite da Sofia):
 * Capa → História → [Traje] → [Presentes] → Convite (data/local) → RSVP
 */
const Index = () => (
  <div className="relative min-h-screen overflow-x-hidden">
    <ParticleField />
    <main className="relative z-10">
      <HeroStage />
      {SECTIONS.story && <StoryStage />}
      <Suspense fallback={null}>
        {SECTIONS.dressCode && <LookStage />}
        {SECTIONS.gifts && <GiftStage />}
      </Suspense>
      {SECTIONS.invite && <InviteStage />}
      {SECTIONS.rsvp && <FormStage />}

      <footer className="py-12 border-t border-border/50 text-center">
        <p className="font-script text-3xl text-accent mb-3">
          {COUPLE.bride} &amp; {COUPLE.groom}
        </p>
        <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-1">
          Treix © {new Date().getFullYear()} — Todos os direitos reservados
        </p>
        <p className="text-muted-foreground/70 text-[9px] tracking-widest uppercase">
          ® — <span className="text-primary">Renan Cavalcante</span>
        </p>
      </footer>
    </main>
  </div>
);

export default Index;
