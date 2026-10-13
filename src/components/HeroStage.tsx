import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Monogram from "./Monogram";
import FlowerGarden from "./FlowerGarden";
import poeira from "../assets/decor/poeira-rosa.png";
import { COUPLE, COPY, WEDDING_DATE } from "@/config/wedding";

const HeroStage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 2.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.5, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      <FlowerGarden />

      <motion.div
        style={{ scale, opacity, y }}
        className="text-center z-10 flex flex-col items-center px-4 h-full justify-center"
      >
        {/* Frase de abertura */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-serif-display italic text-foreground/70 text-base sm:text-lg md:text-xl max-w-md mb-[3vh] leading-relaxed"
        >
          {COPY.heroTagline}
        </motion.p>

        {/* Monograma com aura */}
        <div className="relative">
          <motion.img
            src={poeira}
            alt=""
            aria-hidden
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full scale-150 opacity-30 pointer-events-none will-change-transform"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
            className="w-[220px] md:w-[34vh] lg:w-[38vh] max-w-[380px] relative z-10"
            
          >
            <Monogram className="w-full h-auto" />
          </motion.div>
        </div>

        {/* Nomes */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="font-script text-foreground text-5xl md:text-7xl lg:text-8xl mt-[2vh] leading-none glow-text"
        >
          {COUPLE.bride} <span className="text-accent">&amp;</span> {COUPLE.groom}
        </motion.h1>

        {/* Subtítulo + data */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 1 }}
          className="mt-[3vh] flex items-center justify-center gap-3 md:gap-6"
        >
          <span className="w-8 md:w-20 hairline" />
          <span className="text-primary text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.45em] uppercase font-medium flex flex-col sm:flex-row sm:gap-2 items-center">
            <span>{COPY.heroSubtitle}</span>
            <span className="hidden sm:inline">·</span>
            <span>{WEDDING_DATE.day}.{WEDDING_DATE.monthYear}</span>
          </span>
          <span className="w-8 md:w-20 hairline" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.9, duration: 1 }}
          className="mt-[5vh] text-foreground text-[11px] md:text-xs tracking-[0.4em] uppercase"
        >
          {COPY.heroHint}
        </motion.p>
      </motion.div>
    </section>
  );
};

export default HeroStage;
