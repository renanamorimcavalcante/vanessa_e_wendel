import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { API, COPY, COUPLE, WEDDING_DATE } from "@/config/wedding";

type Confirmation = "yes" | "no" | null;

/** Máscara simples de telefone BR: (98) 99999-9999 */
const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const FormStage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  const [confirmation, setConfirmation] = useState<Confirmation>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [guestNames, setGuestNames] = useState<string[]>([""]);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dietary, setDietary] = useState("");
  const [message, setMessage] = useState("");
  const [absentName, setAbsentName] = useState("");
  const [website, setWebsite] = useState(""); // honeypot anti-spam (fica oculto)
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGuestCountChange = (count: number) => {
    setGuestCount(count);
    setGuestNames(Array.from({ length: count }, (_, i) => guestNames[i] ?? ""));
  };

  const handleGuestName = (index: number, value: string) => {
    const updated = [...guestNames];
    updated[index] = value;
    setGuestNames(updated);
  };

  const phoneDigits = phone.replace(/\D/g, "");
  const yesValid = phoneDigits.length >= 10 && (guestNames[0]?.trim().length ?? 0) > 1;
  const noValid = absentName.trim().length > 1;
  const canSubmit = confirmation === "yes" ? yesValid : confirmation === "no" ? noValid : false;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    const payload =
      confirmation === "yes"
        ? {
            confirmacao: "sim",
            qtdPessoas: guestCount,
            nomesPessoas: guestNames.map((n) => n.trim()),
            telefone: phone,
            email,
            restricaoAlimentar: dietary,
            mensagem: message,
            website,
          }
        : { confirmacao: "nao", nomeAusente: absentName.trim(), mensagem: message, website };

    try {
      const response = await fetch(API.rsvp, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        setError(result.message ?? "Erro ao enviar. Tente novamente.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white/60 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";
  const labelClass = "block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2";
  const optional = <span className="normal-case tracking-normal text-muted-foreground/60">(opcional)</span>;

  if (submitted) {
    return (
      <section id="form-confirmacao" className="relative min-h-screen flex items-center justify-center py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass-card glow-gold p-10 md:p-16 max-w-lg w-full mx-4 text-center"
        >
          <div className="font-script text-6xl text-accent mb-4">
            {confirmation === "yes" ? "Obrigado!" : "Até breve"}
          </div>
          <h3 className="font-serif-display text-gradient-gold text-3xl font-semibold mb-4">
            {confirmation === "yes" ? COPY.thanksYes : COPY.thanksNo}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {confirmation === "yes"
              ? "Sua presença foi confirmada. Guardamos um lugar especial para você."
              : "Obrigado pelo carinho. Sua mensagem já faz parte desse dia."}
          </p>
          <p className="text-primary text-xs mt-8 tracking-wider">{COUPLE.signature}</p>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="form-confirmacao" ref={ref} className="relative min-h-screen flex items-center justify-center py-32">
      <motion.div style={{ scale, opacity }} className="glass-card glow-gold p-8 md:p-14 max-w-lg w-full mx-4">
        <div className="text-center mb-10">
          <p className="text-muted-foreground text-[10px] tracking-[0.5em] uppercase mb-3">R.S.V.P.</p>
          <h2 className="font-serif-display text-gradient-gold text-4xl md:text-5xl font-semibold mb-4">
            {COPY.rsvpTitle}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{COPY.rsvpText}</p>
          <p className="mt-3 text-xs font-semibold text-primary tracking-wide">
            Por favor, confirme até {WEDDING_DATE.rsvpDeadline}.
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-8">
          {[
            { value: "yes", mark: "♡", text: COPY.rsvpYes },
            { value: "no", mark: "✉", text: COPY.rsvpNo },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setConfirmation(opt.value as Confirmation);
                setError(null);
              }}
              className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-300 text-sm leading-relaxed ${
                confirmation === opt.value
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-white/40 text-muted-foreground hover:border-primary/50"
              }`}
            >
              <span className="text-lg text-primary mt-0.5 shrink-0 w-5 text-center">{opt.mark}</span>
              <span>{opt.text}</span>
            </button>
          ))}
        </div>

        {/* honeypot — invisível para pessoas; bots costumam preencher */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="hidden"
          aria-hidden
        />

        {confirmation === "yes" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-6"
          >
            <div>
              <label className={labelClass}>Quantidade de pessoas</label>
              <select
                value={guestCount}
                onChange={(e) => handleGuestCountChange(Number(e.target.value))}
                className={inputClass}
              >
                {Array.from({ length: 6 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "pessoa" : "pessoas"}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-3">
              {guestCount > 1 && (
                <p className="text-xs text-muted-foreground">Liste o nome de todos os confirmados (adultos e crianças):</p>
              )}
              {guestNames.map((name, i) => (
                <div key={i}>
                  <label className={labelClass}>{i === 0 ? "Seu nome completo *" : `Acompanhante ${i}`}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleGuestName(i, e.target.value)}
                    placeholder={i === 0 ? "Nome e sobrenome" : `Nome do acompanhante ${i}`}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className={labelClass}>WhatsApp *</label>
              <input
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(maskPhone(e.target.value))}
                placeholder="(98) 99999-9999"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>E-mail {optional}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Restrição alimentar {optional}</label>
              <input
                type="text"
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                placeholder="Ex: vegetariano, sem lactose, alergia a camarão..."
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Recado para os noivos {optional}</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Deixe uma mensagem especial para ${COUPLE.bride} & ${COUPLE.groom}...`}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          </motion.div>
        )}

        {confirmation === "no" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-6"
          >
            <div>
              <label className={labelClass}>Nome completo / Família *</label>
              <input
                type="text"
                value={absentName}
                onChange={(e) => setAbsentName(e.target.value)}
                placeholder="Ex: Família Silva"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Recado para os noivos {optional}</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Deixe uma mensagem carinhosa..."
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        {confirmation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              disabled={loading || !canSubmit}
              className="px-10 py-4 rounded-full bg-primary font-semibold text-primary-foreground tracking-[0.25em] text-xs uppercase transition-all hover:shadow-[0_0_40px_rgba(122,167,208,0.55)] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Enviando...
                </>
              ) : (
                "Enviar Confirmação ✦"
              )}
            </button>
            {confirmation === "yes" && !yesValid && (
              <p className="text-xs text-muted-foreground mt-3">* Nome e WhatsApp são obrigatórios</p>
            )}
          </motion.div>
        )}

        <p className="text-muted-foreground text-xs mt-8 text-center tracking-wider">{COUPLE.signature}</p>
      </motion.div>
    </section>
  );
};

export default FormStage;
