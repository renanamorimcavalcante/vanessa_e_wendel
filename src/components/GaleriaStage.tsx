import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import FlowerGarden from "@/components/FlowerGarden";
import { COUPLE, GALLERY, MediaItem } from "@/config/wedding";

const GaleriaStage = () => {
  const [selected, setSelected] = useState<MediaItem | null>(null);

  return (
    <div className="min-h-screen py-20 px-4 md:px-10 relative overflow-hidden">
      <FlowerGarden />

      <div className="max-w-6xl mx-auto z-10 relative">
        <header className="text-center mb-16">
          <p className="font-script text-4xl md:text-5xl text-primary mb-2">
            {COUPLE.bride} &amp; {COUPLE.groom}
          </p>
          <h1 className="font-serif-display text-4xl md:text-6xl text-gradient-gold font-semibold mb-4">
            Nossos Momentos
          </h1>
          <p className="text-muted-foreground tracking-[0.3em] uppercase text-xs">Memórias de uma história de amor</p>
        </header>

        {GALLERY.length === 0 ? (
          <div className="glass-card max-w-md mx-auto p-10 text-center">
            <p className="font-serif-display italic text-2xl text-foreground/70 mb-2">Em breve</p>
            <p className="text-muted-foreground text-sm">As fotos do grande dia aparecerão aqui. ♡</p>
            <Link to="/" className="inline-block mt-6 text-xs text-primary underline underline-offset-2">
              ← Voltar ao convite
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {GALLERY.map((item) => (
              <motion.button
                key={item.id}
                layoutId={`media-${item.id}`}
                onClick={() => setSelected(item)}
                className="relative aspect-square overflow-hidden rounded-xl group border border-primary/20 bg-white/40 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={item.type === "image" ? item.url : item.thumbnail}
                  alt={item.description}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  {item.type === "video" ? (
                    <Play className="text-white w-10 h-10 drop-shadow-lg" />
                  ) : (
                    <ImageIcon className="text-white w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-[#F6FAFD]/95 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute top-5 right-5 text-primary hover:rotate-90 transition-transform p-2"
              onClick={() => setSelected(null)}
              aria-label="Fechar"
            >
              <X size={32} />
            </button>

            <motion.div
              layoutId={`media-${selected.id}`}
              className="max-w-5xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selected.type === "image" ? (
                <img
                  src={selected.url}
                  className="max-h-[70vh] w-auto rounded-lg shadow-2xl border-4 border-white"
                  alt={selected.description}
                  decoding="async"
                />
              ) : (
                <video
                  src={selected.url}
                  controls
                  autoPlay
                  className="max-h-[70vh] w-full rounded-lg shadow-2xl border-4 border-white bg-black"
                />
              )}
              <p className="mt-6 font-serif-display text-2xl text-foreground">{selected.description}</p>
              <div className="w-12 hairline mx-auto mt-4" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GaleriaStage;
