import { API, VINCULOS } from "@/config/wedding";

/** Espelha a tabela `confirmacoes` (database/schema.sql). */
export type Vinculo = "" | (typeof VINCULOS)[number];

export type Confirmacao = {
  id: number;
  confirmacao: "sim" | "nao";
  qtd_pessoas: number | null;
  nomes_pessoas: string[];
  telefone: string | null;
  email: string | null;
  restricao_alimentar: string | null;
  mensagem: string | null;
  nome_ausente: string | null;
  categoria_etaria: "" | "Adulto" | "Criança";
  vinculo: Vinculo;
  mesa: string | null;
  observacao_interna: string | null;
  criado_em: string;
};

export type Totais = {
  total_envios: number;
  total_sim: number;
  total_nao: number;
  total_pessoas: number;
};

export type DashboardData = { totais: Totais; confirmacoes: Confirmacao[] };

const SENHA_KEY = "vw_cpanel_senha";

export const session = {
  get: () => {
    try {
      return sessionStorage.getItem(SENHA_KEY);
    } catch {
      return null;
    }
  },
  set: (senha: string) => {
    try {
      sessionStorage.setItem(SENHA_KEY, senha);
    } catch {
      /* ignore */
    }
  },
  clear: () => {
    try {
      sessionStorage.removeItem(SENHA_KEY);
    } catch {
      /* ignore */
    }
  },
};

/** nomes_pessoas pode vir como string JSON do MySQL — normaliza para array. */
export const normalize = (c: Confirmacao): Confirmacao => ({
  ...c,
  nomes_pessoas:
    typeof c.nomes_pessoas === "string"
      ? (() => {
          try {
            return JSON.parse(c.nomes_pessoas as unknown as string) ?? [];
          } catch {
            return [];
          }
        })()
      : c.nomes_pessoas ?? [],
});

const post = async <T>(url: string, body: unknown): Promise<T & { success: boolean; message?: string }> => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({ success: false, message: "Resposta inválida do servidor." }));
  if (!res.ok && json.success !== false) json.success = false;
  return json;
};

export const fetchDashboard = async (senha: string) => {
  const r = await post<DashboardData>(API.dashboard, { senha });
  if (r.success) r.confirmacoes = (r.confirmacoes ?? []).map(normalize);
  return r;
};

export const updateConvidado = (
  senha: string,
  data: Pick<Confirmacao, "id" | "vinculo" | "categoria_etaria" | "mesa" | "observacao_interna">,
) => post<object>(API.updateGuest, { senha, ...data });
