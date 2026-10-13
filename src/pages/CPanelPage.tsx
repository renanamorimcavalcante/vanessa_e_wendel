import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { COUPLE } from "@/config/wedding";
import { Confirmacao, DashboardData, fetchDashboard, session } from "@/lib/api";

const subtitle = `${COUPLE.bride} & ${COUPLE.groom} · Casamento`;

// ── Login ──────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin }: { onLogin: (data: DashboardData) => void }) => {
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!senha) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchDashboard(senha);
      if (!result.success) {
        setError(result.message ?? "Senha inválida.");
        return;
      }
      session.set(senha);
      onLogin(result);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-10 w-full max-w-sm mx-4 text-center"
      >
        <p className="font-script text-5xl text-primary mb-2">
          {COUPLE.initials.left}&amp;{COUPLE.initials.right}
        </p>
        <h1 className="font-serif-display text-gradient-gold text-3xl font-semibold mb-1">Painel</h1>
        <p className="text-muted-foreground text-[10px] tracking-widest uppercase mb-8">{subtitle}</p>

        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="Digite a senha"
          className="w-full bg-white/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 mb-4"
        />
        {error && <p className="text-red-600 text-xs mb-4">{error}</p>}
        <button
          onClick={handleLogin}
          disabled={loading || !senha}
          className="w-full px-6 py-3 rounded-full bg-primary font-semibold text-primary-foreground tracking-[0.25em] text-xs uppercase disabled:opacity-40"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </motion.div>
    </div>
  );
};

// ── Card de confirmação ────────────────────────────────────────────
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
    {children}
  </div>
);

const ConfirmacaoCard = ({ item }: { item: Confirmacao }) => {
  const [expanded, setExpanded] = useState(false);
  const isSim = item.confirmacao === "sim";
  const data = new Date(item.criado_em.replace(" ", "T")).toLocaleString("pt-BR");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-5 border-l-4 cursor-pointer ${isSim ? "!border-l-accent" : "!border-l-rose-300"}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">#{String(item.id).padStart(3, "0")}</span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                isSim ? "bg-secondary text-secondary-foreground" : "bg-rose-100 text-rose-700"
              }`}
            >
              {isSim ? "CONFIRMADO" : "AUSENTE"}
            </span>
            {item.vinculo && <span className="text-[10px] text-primary">{item.vinculo}</span>}
          </div>
          <p className="text-foreground font-semibold text-sm mt-1">
            {isSim ? item.nomes_pessoas?.[0] || "—" : item.nome_ausente || "—"}
          </p>
          {isSim && item.qtd_pessoas && (
            <p className="text-muted-foreground text-xs">
              {item.qtd_pessoas} {item.qtd_pessoas === 1 ? "pessoa" : "pessoas"}
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-muted-foreground text-[10px]">{data}</p>
          <p className="text-primary text-xs mt-1">{expanded ? "▲" : "▼"}</p>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-border flex flex-col gap-3 text-sm">
              {isSim && item.nomes_pessoas.length > 0 && (
                <Field label="Convidados">
                  <ul className="flex flex-col gap-1">
                    {item.nomes_pessoas.map((nome, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-primary text-xs">✦</span> {nome || "—"}
                      </li>
                    ))}
                  </ul>
                </Field>
              )}
              {item.telefone && (
                <Field label="WhatsApp">
                  <a
                    href={`https://wa.me/55${item.telefone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-primary hover:underline"
                  >
                    {item.telefone}
                  </a>
                </Field>
              )}
              {item.email && <Field label="E-mail">{item.email}</Field>}
              {item.restricao_alimentar && <Field label="Restrição alimentar">{item.restricao_alimentar}</Field>}
              {item.mensagem && (
                <Field label="Recado">
                  <p className="italic">"{item.mensagem}"</p>
                </Field>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Dashboard ──────────────────────────────────────────────────────
const DashboardScreen = ({ data, onLogout }: { data: DashboardData; onLogout: () => void }) => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState<"todos" | "sim" | "nao">("todos");
  const filtradas = data.confirmacoes.filter((c) => filtro === "todos" || c.confirmacao === filtro);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif-display text-gradient-gold text-3xl font-semibold">Painel</h1>
            <p className="text-muted-foreground text-[10px] tracking-widest uppercase">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/listadeconvidados")}
              className="px-4 py-2 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-primary text-primary-foreground"
            >
              Lista completa
            </button>
            <button onClick={onLogout} className="text-xs text-muted-foreground hover:text-primary underline underline-offset-2">
              Sair
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Respostas", value: data.totais.total_envios },
            { label: "Confirmados", value: data.totais.total_sim },
            { label: "Ausentes", value: data.totais.total_nao },
            { label: "Total pessoas", value: data.totais.total_pessoas },
          ].map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5 text-center"
            >
              <p className="font-serif-display text-4xl font-semibold text-foreground">{t.value}</p>
              <p className="text-muted-foreground text-[10px] uppercase tracking-widest mt-1">{t.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: "todos", label: "Todos" },
            { key: "sim", label: "Confirmados" },
            { key: "nao", label: "Ausentes" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key as typeof filtro)}
              className={`px-4 py-2 rounded-full text-[10px] font-semibold tracking-widest uppercase transition-all ${
                filtro === f.key ? "bg-primary text-primary-foreground" : "glass-card text-muted-foreground hover:text-primary"
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto text-muted-foreground text-xs self-center">
            {filtradas.length} {filtradas.length === 1 ? "registro" : "registros"}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {filtradas.length === 0 ? (
            <div className="glass-card p-10 text-center text-muted-foreground text-sm">Nenhum registro ainda.</div>
          ) : (
            filtradas.map((item) => <ConfirmacaoCard key={item.id} item={item} />)
          )}
        </div>

        <p className="text-muted-foreground text-xs mt-10 text-center tracking-wider">{COUPLE.signature}</p>
      </div>
    </div>
  );
};

// ── Página ─────────────────────────────────────────────────────────
const CPanelPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const saved = session.get();
    if (!saved) return;
    fetchDashboard(saved)
      .then((r) => (r.success ? setData(r) : session.clear()))
      .catch(() => {});
  }, []);

  if (!data) return <LoginScreen onLogin={setData} />;
  return (
    <DashboardScreen
      data={data}
      onLogout={() => {
        session.clear();
        setData(null);
      }}
    />
  );
};

export default CPanelPage;
