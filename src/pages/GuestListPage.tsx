import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { COUPLE } from "@/config/wedding";
import { Confirmacao, fetchDashboard, session } from "@/lib/api";

const vinculoStyle = (v: string) => {
  const s = v.toLowerCase();
  if (s.includes("noiva")) return "bg-rose-50 text-rose-700 border-rose-100";
  if (s.includes("noivo")) return "bg-secondary text-secondary-foreground border-accent/30";
  if (s === "padrinhos") return "bg-primary/10 text-primary border-primary/20";
  return "bg-muted text-muted-foreground border-border";
};

/** Exporta a lista em CSV (abre direto no Excel). */
const exportCsv = (rows: Confirmacao[]) => {
  const header = ["ID", "Status", "Responsável", "Acompanhantes", "Qtd", "WhatsApp", "E-mail", "Vínculo", "Categoria", "Mesa", "Restrição", "Recado"];
  const lines = rows.map((r) =>
    [
      r.id,
      r.confirmacao === "sim" ? "Confirmado" : "Ausente",
      r.nomes_pessoas?.[0] || r.nome_ausente || "",
      r.nomes_pessoas.slice(1).join(" | "),
      r.qtd_pessoas ?? 0,
      r.telefone ?? "",
      r.email ?? "",
      r.vinculo,
      r.categoria_etaria,
      r.mesa ?? "",
      r.restricao_alimentar ?? "",
      r.mensagem ?? "",
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(";"),
  );
  const blob = new Blob(["﻿" + [header.join(";"), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "convidados-vanessa-wendel.csv";
  a.click();
  URL.revokeObjectURL(a.href);
};

const GuestListPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Confirmacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const senha = session.get();
    if (!senha) {
      navigate("/cpanel");
      return;
    }
    fetchDashboard(senha)
      .then((r) => (r.success ? setData(r.confirmacoes) : navigate("/cpanel")))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [navigate]);

  const filtradas = useMemo(() => {
    const q = query.toLowerCase();
    return data.filter((item) =>
      [...item.nomes_pessoas, item.nome_ausente ?? "", item.vinculo, item.mesa ?? ""].join(" ").toLowerCase().includes(q),
    );
  }, [data, query]);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4">
          <div>
            <h1 className="font-serif-display text-gradient-gold text-4xl font-semibold leading-none">Lista de Convidados</h1>
            <p className="text-muted-foreground text-[10px] tracking-widest uppercase mt-2">
              {COUPLE.bride} &amp; {COUPLE.groom}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => exportCsv(filtradas)}
              className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-[10px] uppercase tracking-widest"
            >
              Exportar CSV
            </button>
            <button
              onClick={() => navigate("/cpanel")}
              className="px-6 py-3 rounded-full glass-card text-primary font-semibold text-[10px] uppercase tracking-widest"
            >
              ← Voltar
            </button>
          </div>
        </div>

        <div className="glass-card mb-8 p-2">
          <input
            placeholder="Pesquisar por nome, vínculo ou mesa..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/60 rounded-2xl px-6 py-4 text-sm outline-none focus:bg-white transition-all"
          />
        </div>

        <div className="glass-card overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5 text-primary text-[10px] font-semibold uppercase tracking-widest border-b border-border/50">
                <th className="p-4">ID</th>
                <th className="p-4">Responsável</th>
                <th className="p-4">Acompanhantes</th>
                <th className="p-4">Vínculo</th>
                <th className="p-4">Mesa</th>
                <th className="p-4">WhatsApp</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-16 text-center text-primary animate-pulse">
                    Carregando...
                  </td>
                </tr>
              ) : filtradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-16 text-center text-muted-foreground">
                    Nenhum convidado encontrado.
                  </td>
                </tr>
              ) : (
                filtradas.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/edit-guest/${item.id}`, { state: item })}
                    className="border-b border-border/30 hover:bg-white/60 cursor-pointer transition-colors"
                  >
                    <td className="p-4 text-muted-foreground font-mono text-xs">#{String(item.id).padStart(3, "0")}</td>
                    <td className="p-4 font-semibold">{item.nomes_pessoas?.[0] || item.nome_ausente}</td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {item.nomes_pessoas.length > 1 ? item.nomes_pessoas.slice(1).join(", ") : "—"}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-semibold uppercase border ${vinculoStyle(item.vinculo)}`}>
                        {item.vinculo || "Não definido"}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{item.mesa || "—"}</td>
                    <td className="p-4 text-muted-foreground">{item.telefone || "—"}</td>
                    <td className="p-4 text-center">{item.confirmacao === "sim" ? "✅" : "❌"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GuestListPage;
