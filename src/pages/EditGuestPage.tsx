import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { VINCULOS } from "@/config/wedding";
import { Confirmacao, session, updateConvidado } from "@/lib/api";

const selectClass =
  "w-full bg-white/60 border border-border rounded-2xl px-4 py-3.5 text-sm outline-none focus:ring-2 ring-primary/20 transition-all";
const labelClass = "text-[10px] font-semibold text-primary uppercase tracking-widest block mb-2 ml-1";

const EditGuestPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const guest = useLocation().state as Confirmacao | undefined;

  const [vinculo, setVinculo] = useState<Confirmacao["vinculo"]>(guest?.vinculo ?? "");
  const [categoria, setCategoria] = useState<Confirmacao["categoria_etaria"]>(guest?.categoria_etaria ?? "");
  const [mesa, setMesa] = useState(guest?.mesa ?? "");
  const [obs, setObs] = useState(guest?.observacao_interna ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    const senha = session.get();
    if (!id || !senha) return navigate("/cpanel");
    setSaving(true);
    setError(null);
    try {
      const r = await updateConvidado(senha, {
        id: Number(id),
        vinculo,
        categoria_etaria: categoria,
        mesa: mesa || null,
        observacao_interna: obs || null,
      });
      if (r.success) navigate(-1);
      else setError(r.message ?? "Não foi possível salvar.");
    } catch {
      setError("Erro de conexão.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 md:p-10 w-full max-w-md">
        <h2 className="font-serif-display text-gradient-gold text-3xl font-semibold mb-1">Editar Convidado</h2>
        <p className="text-muted-foreground text-xs uppercase tracking-widest mb-8">
          {guest?.nomes_pessoas?.[0] || guest?.nome_ausente || `#${id}`}
        </p>

        <div className="space-y-5">
          <div>
            <label className={labelClass}>Vínculo</label>
            <select value={vinculo} onChange={(e) => setVinculo(e.target.value as Confirmacao["vinculo"])} className={selectClass}>
              <option value="">Selecione...</option>
              {VINCULOS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Categoria etária</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as Confirmacao["categoria_etaria"])}
              className={selectClass}
            >
              <option value="">Selecione...</option>
              <option value="Adulto">Adulto</option>
              <option value="Criança">Criança</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Mesa</label>
            <input value={mesa} onChange={(e) => setMesa(e.target.value)} placeholder="Ex: 12" className={selectClass} />
          </div>

          <div>
            <label className={labelClass}>Observação interna</label>
            <textarea value={obs} onChange={(e) => setObs(e.target.value)} rows={3} className={`${selectClass} resize-none`} />
          </div>

          {error && <p className="text-red-600 text-xs">{error}</p>}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3.5 rounded-full glass-card text-muted-foreground font-semibold text-[10px] uppercase tracking-widest"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-[10px] uppercase tracking-widest disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditGuestPage;
