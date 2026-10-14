import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { COPY } from "@/config/wedding";

// Inspirações de traje (troque à vontade em src/assets/img/look/)
import look1 from "../assets/img/look/look_1.jpg";
import look2 from "../assets/img/look/look_2.jpg";
import look3 from "../assets/img/look/look_3.jpg";
import look4 from "../assets/img/look/look_4.jpg";
import look5 from "../assets/img/look/look_5.jpg";
import look6 from "../assets/img/look/look_6.jpg";
import look7 from "../assets/img/look/look_7.jpg";

const LOOKS = {
  feminino: [
    { id: 7, url: look7, label: "Sugestão Feminina" },
    { id: 5,url: look5, label: "Sugestão Feminina" },
    { id: 3, url: look3, label: "Sugestão Feminina" },
  ],
  masculino: [
    { id: 2, url: look2, label: "Sugestão Masculina" },
    { id: 4, url: look4, label: "Sugestão Masculina" },
    { id: 1, url: look1, label: "Sugestão Masculina" },
  ],
};

const LookStage = () => {
  const [gender, setGender] = useState<"feminino" | "masculino">("feminino");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Trocar de gênero reseta o índice para 0
  const handleGenderChange = (newGender: "feminino" | "masculino") => {
    setGender(newGender);
    setCurrentIndex(0);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % LOOKS[gender].length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + LOOKS[gender].length) % LOOKS[gender].length);
  };

  const currentLook = LOOKS[gender][currentIndex];

  return (
    <section className="relative flex justify-center py-10 md:py-14 px-4">
      <div className="w-full max-w-lg"> {/* Max-w menor para focar em uma foto só */}
        
        {/* Cabeçalho */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`glass-card text-center px-6 py-10 md:px-10 ${COPY.dressShowLooks ? "mb-8" : ""}`}
        >
          <p className="text-[11px] tracking-[0.4em] uppercase text-foreground/60 mb-3">
            {COPY.dressTitle}
          </p>
          <h2 className="font-serif-display text-gradient-gold text-5xl md:text-6xl font-semibold leading-tight">
            {COPY.dressCode}
          </h2>
          <div className="mx-auto my-6 h-px w-20 bg-gradient-to-r from-transparent via-[#7AA7D0] to-transparent" />
          {COPY.dressTips.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm max-w-md mx-auto mb-7">
              {COPY.dressTips.map((t) => (
                <div key={t.who}>
                  <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#5A8FC4] mb-1.5">{t.who}</p>
                  <p className="text-foreground/75 leading-relaxed">{t.tip}</p>
                </div>
              ))}
            </div>
          )}
          <p className="text-foreground/60 text-sm italic">{COPY.dressText}</p>
        </motion.div>

        {COPY.dressShowLooks && (
          <>
        {/* Seleção de Gênero */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => handleGenderChange("masculino")}
            className={`px-6 py-2 rounded-full text-xs font-semibold tracking-[0.25em] uppercase transition-all duration-300 border ${
              gender === "masculino"
                ? "bg-primary text-primary-foreground border-primary shadow-lg"
                : "bg-white/40 text-muted-foreground border-border"
            }`}
          >
            Masculino
          </button>
          <button
            onClick={() => handleGenderChange("feminino")}
            className={`px-6 py-2 rounded-full text-xs font-semibold tracking-[0.25em] uppercase transition-all duration-300 border ${
              gender === "feminino"
                ? "bg-primary text-primary-foreground border-primary shadow-lg"
                : "bg-white/40 text-muted-foreground border-border"
            }`}
          >
            Feminino
          </button>
        </div>

        {/* Carrossel Centralizado (Estilo StoryStage) */}
        <div className="relative group">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${gender}-${currentIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="glass-card !p-3 !bg-white/30 overflow-hidden"
            >
              <img
                src={currentLook.url}
                alt={currentLook.label}
                loading="lazy"
                decoding="async"
                className="w-full h-[440px] md:h-[500px] object-contain rounded-xl"
              />
              
              <div className="mt-4 pb-2 text-center">
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary/80">
                  {currentLook.label}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Botões de Navegação */}
          {LOOKS[gender].length > 1 && (
            <>
              <button
                onClick={prevImage}
                aria-label="Anterior"
                className="absolute left-1 sm:left-[-20px] top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-primary" />
              </button>

              <button
                onClick={nextImage}
                aria-label="Próxima"
                className="absolute right-1 sm:right-[-20px] top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-primary" />
              </button>
            </>
          )}

          {/* Indicadores (Bolinhas) */}
          <div className="flex justify-center gap-2 mt-6">
            {LOOKS[gender].map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "bg-primary w-6" : "bg-primary/20 w-1.5"
                }`}
              />
            ))}
          </div>
        </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LookStage;