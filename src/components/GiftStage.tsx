import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { COPY, COUPLE, GIFTS, GIFT_LIST_URL, PIX, SHOW_GIFT_SUGGESTIONS } from "@/config/wedding";
import { buildPixPayload } from "@/lib/pix";

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // fallback para dispositivos sem Clipboard API
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }
};

const GiftStage = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const opacity = useTransform(scrollYProgress, [0, 0.35], [0.2, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  const [copied, setCopied] = useState<"key" | "code" | null>(null);
  const [showPix, setShowPix] = useState(false);

  const pixCode = useMemo(() => PIX.copyPaste || buildPixPayload(PIX.key, PIX.name), []);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    pixCode,
  )}&bgcolor=ffffff&color=2E3326&qzone=2`;

  const handleCopy = async (what: "key" | "code") => {
    await copyText(what === "key" ? PIX.key : pixCode);
    setCopied(what);
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <section ref={ref} className="relative flex justify-center py-10 md:py-14">
      <motion.div style={{ scale, opacity }} className={`w-full mx-4 ${SHOW_GIFT_SUGGESTIONS ? "max-w-2xl" : "max-w-lg"}`}>
        {/* Cabeçalho (só quando há sugestões; sem elas, título e texto vão no card do Pix) */}
        {SHOW_GIFT_SUGGESTIONS && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass-card p-8 md:p-10 text-center mb-12 max-w-md mx-auto"
        >
          <h2 className="font-serif-display text-gradient-gold text-4xl md:text-5xl font-semibold mb-4">
            {COPY.giftTitle}
          </h2>
          <p className="text-foreground/70 text-sm leading-relaxed">{COPY.giftText}</p>
          <div className="mt-6 w-10 hairline mx-auto" />
        </motion.div>
        )}

        {/* Sugestões */}
        {SHOW_GIFT_SUGGESTIONS && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {GIFTS.map((gift, i) => (
            <motion.div
              key={gift.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="glass-card !bg-white/70 p-5 text-center"
            >
              <gift.icon className="w-6 h-6 mx-auto mb-3 text-primary" strokeWidth={1.25} />
              <h3 className="font-serif-display text-foreground font-semibold text-lg leading-tight mb-1">
                {gift.title}
              </h3>
              <p className="text-muted-foreground text-xs">{gift.description}</p>
            </motion.div>
          ))}
        </div>
        )}

        {GIFT_LIST_URL && (
          <div className="text-center mb-12">
            <a
              href={GIFT_LIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-full border border-primary/40 text-primary text-xs font-semibold tracking-[0.25em] uppercase hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Ver lista completa
            </a>
          </div>
        )}

        {/* Pix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card glow-gold !bg-white/75 p-8 md:p-10 text-center"
        >
          {SHOW_GIFT_SUGGESTIONS ? (
            <>
              <h3 className="font-serif-display text-gradient-gold text-3xl font-semibold mb-1">Presentear com Pix</h3>
              <p className="text-muted-foreground text-xs mb-6">Transfira com segurança diretamente para o casal</p>
            </>
          ) : (
            <>
              <h2 className="font-serif-display text-gradient-gold text-4xl md:text-5xl font-semibold mb-4">
                {COPY.giftTitle}
              </h2>
              <p className="text-foreground/70 text-sm leading-relaxed max-w-md mx-auto mb-6">{COPY.giftText}</p>
              <div className="w-10 hairline mx-auto mb-6" />
            </>
          )}

          <button
            onClick={() => setShowPix(!showPix)}
            className="text-xs text-primary/80 underline underline-offset-2 hover:text-primary transition-colors mb-6 block mx-auto"
          >
            {showPix ? "Ocultar QR Code ▲" : "Ver QR Code ▼"}
          </button>

          {showPix && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-3 mb-6"
            >
              <div className="p-3 bg-white rounded-2xl shadow-md">
                <img src={qrUrl} alt="QR Code Pix" width={200} height={200} className="rounded-xl" />
              </div>
              <button
                onClick={() => handleCopy("code")}
                className="text-[11px] text-muted-foreground hover:text-primary underline underline-offset-2"
              >
                {copied === "code" ? "✓ Código copiado!" : "Copiar Pix Copia e Cola"}
              </button>
            </motion.div>
          )}

          <div className="bg-white/60 border border-border rounded-xl px-5 py-4 mb-4 flex items-center justify-between gap-3">
            <div className="text-left min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">{PIX.keyType}</p>
              <p className="text-foreground font-semibold text-sm tracking-wider truncate">{PIX.display || PIX.key}</p>
              <p className="text-muted-foreground text-[10px] mt-0.5">{PIX.name}</p>
            </div>
            <button
              onClick={() => handleCopy("key")}
              className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-semibold tracking-widest uppercase transition-all ${
                copied === "key"
                  ? "bg-secondary text-secondary-foreground border border-accent/40"
                  : "bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(169,135,76,0.4)]"
              }`}
            >
              {copied === "key" ? "✓ Copiado" : "Copiar"}
            </button>
          </div>

          <p className="text-muted-foreground text-[10px] tracking-wide">Abra seu banco → Pix → Pagar → Cole a chave</p>
        </motion.div>

        <p className="text-muted-foreground text-xs mt-8 text-center tracking-wider">{COUPLE.signature}</p>
      </motion.div>
    </section>
  );
};

export default GiftStage;
