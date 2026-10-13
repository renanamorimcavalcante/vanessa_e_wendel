import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MapPin, CalendarPlus } from "lucide-react";
import {
  CEREMONY,
  CITY,
  COPY,
  COUPLE,
  RECEPTION,
  Venue,
  WEDDING_DATE,
  WEDDING_DATE_ISO,
} from "@/config/wedding";

const MagneticButton = ({ children }: { children: React.ReactNode }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: (e.clientX - rect.left - rect.width / 2) * 0.3,
      y: (e.clientY - rect.top - rect.height / 2) * 0.3,
    });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      onClick={() =>
        document.getElementById("form-confirmacao")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="relative px-10 py-4 rounded-full bg-primary font-semibold text-primary-foreground tracking-[0.25em] text-xs uppercase glow-gold transition-shadow hover:shadow-[0_0_50px_rgba(122,167,208,0.55)]"
    >
      {children}
    </motion.button>
  );
};

// ── Contagem regressiva ────────────────────────────────────────────
const useCountdown = (iso: string) => {
  const target = new Date(iso).getTime();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: diff === 0,
  };
};

const Countdown = () => {
  const { days, hours, minutes, seconds, done } = useCountdown(WEDDING_DATE_ISO);
  if (done) {
    return <p className="font-script text-3xl text-primary">Hoje é o grande dia!</p>;
  }
  const items = [
    { v: days, l: "dias" },
    { v: hours, l: "horas" },
    { v: minutes, l: "min" },
    { v: seconds, l: "seg" },
  ];
  return (
    <div className="grid grid-cols-4 gap-2 md:gap-3">
      {items.map(({ v, l }) => (
        <div key={l} className="rounded-xl bg-white/50 border border-border/70 py-3">
          <p className="font-serif-display text-2xl md:text-3xl font-semibold text-foreground tabular-nums">
            {String(v).padStart(2, "0")}
          </p>
          <p className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground">{l}</p>
        </div>
      ))}
    </div>
  );
};

// ── Link "adicionar à agenda" (Google Calendar) ───────────────────
const calendarUrl = () => {
  const start = new Date(WEDDING_DATE_ISO);
  const end = new Date(start.getTime() + 6 * 3_600_000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Casamento ${COUPLE.bride} & ${COUPLE.groom}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    location: `${CEREMONY.name} — ${CEREMONY.address}`,
    details: "Mal podemos esperar para celebrar com você! ♡",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const VenueBlock = ({ venue }: { venue: Venue }) => (
  <a
    href={venue.mapsUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex flex-col items-center gap-1 rounded-2xl px-4 py-5 hover:bg-white/40 transition-colors"
  >
    <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold">
      {venue.label} · {venue.time}
    </span>
    <span className="font-serif-display text-xl md:text-2xl text-foreground leading-snug">{venue.name}</span>
    <span className="text-muted-foreground text-xs">{venue.address}</span>
    <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-primary/70 underline underline-offset-2 group-hover:text-primary transition-colors">
      <MapPin className="w-3 h-3" /> Ver no mapa
    </span>
  </a>
);

const InviteStage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.15, 0.85, 1]);

  return (
    <section ref={ref} className="relative flex justify-center py-10 md:py-14">
      <motion.div
        style={{ scale, opacity }}
        className="glass-card glow-gold p-8 md:p-14 max-w-lg w-full mx-4 text-center"
      >
        <p className="text-muted-foreground text-[10px] tracking-[0.5em] uppercase mb-4">{COPY.inviteEyebrow}</p>

        <p className="font-serif-display italic text-foreground/75 text-base md:text-lg leading-relaxed mb-8">
          {COPY.inviteLine}
        </p>

        <p className="font-script text-4xl md:text-5xl text-foreground mb-6">
          {COUPLE.bride} <span className="text-accent">&amp;</span> {COUPLE.groom}
        </p>

        <h2 className="font-serif-display text-gradient-gold text-7xl md:text-8xl font-semibold leading-none">
          {WEDDING_DATE.day}
        </h2>
        <p className="text-foreground text-2xl md:text-3xl font-light tracking-[0.3em] mt-1">
          {WEDDING_DATE.monthYear}
        </p>
        <p className="text-primary text-[11px] font-semibold tracking-[0.3em] sm:tracking-[0.6em] uppercase mt-2 whitespace-nowrap">
          {WEDDING_DATE.weekday} · {WEDDING_DATE.time}
        </p>

        <div className="my-8">
          <Countdown />
        </div>

        <div className="my-6 flex items-center justify-center gap-4">
          <span className="flex-1 hairline" />
          <span className="text-accent text-xs">✦</span>
          <span className="flex-1 hairline" />
        </div>

        <p className="text-foreground/80 font-medium text-sm tracking-[0.35em] mb-2">{CITY}</p>

        <div className="flex flex-col gap-1 mb-6">
          <VenueBlock venue={CEREMONY} />
          {RECEPTION && <VenueBlock venue={RECEPTION} />}
        </div>

        <p className="font-serif-display italic text-foreground/70 text-base leading-relaxed mb-8 px-1">
          {COPY.inviteClosing}
        </p>

        <a
          href={calendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <CalendarPlus className="w-4 h-4" /> Adicionar à agenda
        </a>

        <div>
          <MagneticButton>Confirmar Presença</MagneticButton>
        </div>

        <p className="text-muted-foreground text-xs mt-8 tracking-wider">{COUPLE.signature}</p>
      </motion.div>
    </section>
  );
};

export default InviteStage;
