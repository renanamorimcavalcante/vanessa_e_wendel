import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { CHILDREN, STORY, STORY_INTRO, StoryCard, StoryPhoto } from "@/config/wedding";

/** Destaca os nomes dos filhos (negrito + azul) dentro de um texto. */
const NAME_RE = new RegExp(`(${CHILDREN.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
const withNames = (text: string) =>
  text.split(NAME_RE).map((part, i) =>
    CHILDREN.includes(part) ? (
      <strong key={i} className="font-bold not-italic whitespace-nowrap text-[#5A8FC4]">
        {part}
      </strong>
    ) : (
      part
    ),
  );

/**
 * Foto com fallback: enquanto o arquivo não existir em public/fotos,
 * mostra um placeholder elegante com o nome do arquivo esperado.
 */
const Photo = ({ photo }: { photo: StoryPhoto }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-secondary/70 via-background to-muted text-center px-6">
        <Heart className="w-6 h-6 text-primary/60" strokeWidth={1.25} />
        <p className="font-serif-display italic text-foreground/60 text-lg leading-snug">
          Espaço para foto
        </p>
        <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
          public{photo.src}
        </p>
      </div>
    );
  }

  return (
    <img
      src={photo.src}
      alt={photo.caption}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="w-full h-full object-cover"
      style={{ objectPosition: photo.position || "center" }}
    />
  );
};

const ImageCarousel = ({ photos }: { photos: StoryPhoto[] }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const current = photos[index];

  const go = (dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + photos.length) % photos.length);
  };

  return (
    <div className="space-y-3">
      <div className="relative w-full rounded-lg overflow-hidden bg-muted/30" style={{ height: 300 }}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.4 } }}
            className="absolute inset-0"
          >
            <Photo photo={current} />
          </motion.div>
        </AnimatePresence>

        {photos.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/60 hover:bg-white/85 transition-colors"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-5 h-5 text-foreground/70" />
            </button>
            <button
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/60 hover:bg-white/85 transition-colors"
              aria-label="Próxima foto"
            >
              <ChevronRight className="w-5 h-5 text-foreground/70" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {photos.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${i === index ? "bg-white w-6" : "bg-white/60 w-1.5"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <motion.p
        key={index}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center font-serif-display italic text-base text-muted-foreground"
      >
        {withNames(current.caption)}
      </motion.p>
    </div>
  );
};

const FloatingCard = ({ year, phrase, subtext, photos, offsetX, rotate, speed }: StoryCard) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const y = useTransform(scrollYProgress, [0, 1], [40 * speed, -40 * speed]);
  const x = useTransform(scrollYProgress, [0, 0.5, 1], [offsetX * 0.5, 0, -offsetX * 0.5]);
  const rotateZ = useTransform(scrollYProgress, [0, 1], [rotate, -rotate]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.92]);

  const textOnly = photos.length === 0;

  return (
    <motion.div
      ref={ref}
      style={{ y, x, rotateZ, opacity, scale }}
      className={`glass-card p-6 md:p-8 max-w-sm mx-4 sm:mx-auto ${textOnly ? "text-center py-10 md:py-12" : ""}`}
    >
      {!textOnly && (
        <div className="mb-6">
          <ImageCarousel photos={photos} />
        </div>
      )}
      {year && (
        <p className="text-accent text-[11px] font-semibold tracking-[0.45em] mb-2">{year}</p>
      )}
      <p className="font-serif-display text-gradient-gold text-2xl md:text-3xl font-semibold leading-tight mb-3">
        {phrase}
      </p>
      <p className={`text-foreground/70 text-sm leading-relaxed ${textOnly ? "font-serif-display italic text-base md:text-lg" : ""}`}>
        {withNames(subtext)}
      </p>
      <div className={`mt-5 w-10 hairline ${textOnly ? "mx-auto" : ""}`} />
    </motion.div>
  );
};

const StoryIntro = () => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.9, ease: "easeOut" }}
    className="text-center max-w-lg mx-auto px-6"
  >
    <p className="text-accent text-[10px] tracking-[0.5em] uppercase mb-3">{STORY_INTRO.title}</p>
    <h2 className="font-script text-5xl md:text-6xl text-foreground mb-4">{STORY_INTRO.subtitle}</h2>
    <p className="font-serif-display italic text-foreground/70 text-lg leading-relaxed">{STORY_INTRO.text}</p>
    <div className="mt-6 w-16 hairline mx-auto" />
  </motion.div>
);

const StoryStage = () => (
  <section className="relative pt-24 pb-10 space-y-10 md:space-y-14">
    <StoryIntro />
    {STORY.map((card, i) => (
      <FloatingCard key={i} {...card} />
    ))}
  </section>
);

export default StoryStage;
