/**
 * ─────────────────────────────────────────────────────────────────────
 *  CONFIGURAÇÃO CENTRAL DO CONVITE — Vanessa & Wendel
 * ─────────────────────────────────────────────────────────────────────
 *  Tudo que muda de um convite para outro mora AQUI: nomes, data,
 *  locais, Pix, frases, fotos, presentes e trajes.
 *  Os componentes só leem deste arquivo — não precisa caçar texto
 *  espalhado pelos stages.
 *
 *  ⚠️  Campos marcados com  // TODO  ainda são provisórios.
 * ─────────────────────────────────────────────────────────────────────
 */

import { Plane, CookingPot, BedDouble, Sofa, Zap, QrCode, type LucideIcon } from "lucide-react";

// Fotos do casal (src/assets/img/familia)
import foto1 from "@/assets/img/familia/1.jpeg";
import foto2 from "@/assets/img/familia/2.jpeg";
import foto3 from "@/assets/img/familia/3.jpeg";
import foto4 from "@/assets/img/familia/4.jpeg";
import foto5 from "@/assets/img/familia/5.jpeg";
import foto5a from "@/assets/img/familia/5-1.jpeg";
import foto5b from "@/assets/img/familia/5-2.jpeg";
import foto6 from "@/assets/img/familia/6.jpeg";
import foto7 from "@/assets/img/familia/7.jpeg";
import foto8 from "@/assets/img/familia/8.jpeg";
import foto9 from "@/assets/img/familia/9.jpeg";
import foto10 from "@/assets/img/familia/10.jpeg";
import foto10b from "@/assets/img/familia/10-2.jpeg";
import foto10c from "@/assets/img/familia/10-3.jpeg";
import fotoVicente from "@/assets/img/familia/vicent.jpeg";

// ── Seções visíveis ────────────────────────────────────────────────
/**
 * Liga/desliga seções do convite. Seções desligadas NÃO são baixadas pelo
 * convidado (carregamento sob demanda) — o código continua no projeto.
 */
export const SECTIONS = {
  story: true,
  dressCode: true, // "Sobre o Traje" (LookStage)
  gifts: true, // "Lista de Presentes" + "Presentear com Pix" (GiftStage)
  invite: true,
  rsvp: true,
};

// ── Casal ───────────────────────────────────────────────────────────
export const COUPLE = {
  bride: "Vanessa",
  groom: "Wendel",
  /** Iniciais usadas no monograma da capa */
  initials: { left: "V", right: "W" },
  /** Assinatura usada no rodapé dos cards */
  signature: "Com amor, Vanessa & Wendel ♡",
  /** Hashtag opcional para fotos dos convidados */
  hashtag: "#VanessaEWendel", // TODO confirmar
};

// ── Data ────────────────────────────────────────────────────────────
/** Formato ISO com fuso de São Luís (-03:00). Usado na contagem regressiva. */
export const WEDDING_DATE_ISO = "2026-11-20T16:00:00-03:00";

export const WEDDING_DATE = {
  day: "20",
  monthYear: "NOVEMBRO.26",
  weekday: "Sexta-feira",
  time: "às 16h",
  /** Prazo para confirmar presença (exibido no formulário) */
  rsvpDeadline: "10 de novembro de 2026", // TODO confirmar prazo
};

// ── Locais ──────────────────────────────────────────────────────────
export interface Venue {
  label: string;
  name: string;
  address: string;
  time: string;
  mapsUrl: string;
}

export const CEREMONY: Venue = {
  label: "Cerimônia",
  name: "Igreja São Francisco de Assis",
  address: "Rua Cinco, 1410 — Parque dos Sabiás · CEP 65064-330",
  time: "16h",
  mapsUrl: "https://maps.app.goo.gl/LJj6CKvVSzXr9qwA6",
};

export const RECEPTION: Venue | null = {
  label: "Recepção",
  name: "Romero Gastronomia",
  address: "Rua Mearim, lote 13 — Ponta do Farol · CEP 65075-835",
  time: "19h",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Romero Gastronomia, Rua Mearim, Ponta do Farol, São Luís - MA"),
};

export const CITY = "SÃO LUÍS | MA";

// ── Pix / Presentes ─────────────────────────────────────────────────
export const PIX = {
  key: "86988667285", // celular (DDD 86) — é o que o botão "Copiar" copia
  display: "(86) 98866-7285", // como a chave aparece na tela
  keyType: "Chave Celular",
  name: "Vanessa Karoline Cardoso Cavalcante",
  /** Código "Pix Copia e Cola" (opcional). Se vazio, é gerado a partir da chave. */
  copyPaste: "",
};

export interface Gift {
  /** Ícone de linha (lucide-react) — combina com o visual minimalista */
  icon: LucideIcon;
  title: string;
  description: string;
}

export const GIFTS: Gift[] = [
  { icon: Plane, title: "Lua de Mel", description: "Cotas para a nossa viagem" },
  { icon: CookingPot, title: "Cozinha", description: "Panelas, louças e utensílios" },
  { icon: BedDouble, title: "Cama & Banho", description: "Jogos de cama e toalhas" },
  { icon: Sofa, title: "Casa Nova", description: "Decoração e organização" },
  { icon: Zap, title: "Eletros", description: "Pequenos eletrodomésticos" },
  { icon: QrCode, title: "Pix", description: "Para sua comodidade" },
];

/** Mostrar os cards de sugestões (GIFTS)? false = só o Pix aparece. */
export const SHOW_GIFT_SUGGESTIONS = false;

/** Link para lista de presentes externa (loja). Deixe "" para esconder. */
export const GIFT_LIST_URL = ""; // TODO

// ── História (StoryStage) ───────────────────────────────────────────
/**
 * Fotos do casal: src/assets/img/familia/ (importadas no topo do arquivo).
 * Para trocar/adicionar: salve a foto na pasta, importe no topo e use no card.
 * Se um caminho não existir (ex.: "/fotos/x.jpg"), o card mostra um placeholder.
 */
export interface StoryPhoto {
  src: string;
  caption: string;
  position?: string;
}

export interface StoryCard {
  /** Ano/marcador exibido acima do título (opcional) */
  year?: string;
  phrase: string;
  /** Texto do card (pode ser um parágrafo) */
  subtext: string;
  /** Sem fotos → card só de texto */
  photos: StoryPhoto[];
  offsetX: number;
  rotate: number;
  speed: number;
}

/** Nomes dos filhos — aparecem em negrito e azul nos textos e legendas da história. */
export const CHILDREN = ["Wendel Miguel", "Maria Cecília", "Vicente", "Maria Celina"];

/** Abertura da seção "Nossa história" */
export const STORY_INTRO = {
  title: "Nossa história",
  subtitle: "Um amor que cresceu com a gente.",
  text: "Tudo começou em 2016, quando a paixão nos ensinou a caminhar juntos rumo a um futuro de amor. Construímos algo forte e saudável.",
};

/**
 * Linha do tempo (texto enviado pelo casal em 2026-10-10).
 * Cada card tem as fotos do seu momento. Para trocar uma foto de lugar,
 * basta mover a linha `{ src: fotoX, ... }` para o card certo.
 *   fotos 1, 2      → 2016 namoro
 *   fotos 5, 5-1, 5-2 → 2019 Wendel Miguel
 *   fotos 6, 7      → 2021 Maria Cecília
 *   foto 10         → distância
 *   vicent.jpeg     → 2024 Vicente
 *   fotos 3, 4, 8, 9 → casamento civil / Maria Celina
 *   fotos 10-2, 10-3 → família completa
 */
export const STORY: StoryCard[] = [
  {
    year: "2016",
    phrase: "O começo de tudo",
    subtext:
      "Começamos a namorar e descobrimos que queríamos viver muito mais do que momentos: queríamos construir uma vida juntos.",
    photos: [
      { src: foto1, caption: "Flores, um beijo e a certeza de que era você" },
      { src: foto2, caption: "Os primeiros mergulhos juntos" },
    ],
    offsetX: -120,
    rotate: -5,
    speed: 0.8,
  },
  {
    year: "2019",
    phrase: "Nosso primeiro grande presente",
    subtext:
      "Recebemos o maior presente das nossas vidas: o nascimento do nosso primeiro filho, Wendel Miguel.",
    photos: [
      { src: foto5, caption: "Bem-vindo, Wendel Miguel" },
      { src: foto5a, caption: "Cada descoberta, uma festa", position: "center 30%" },
      { src: foto5b, caption: "Nós três", position: "center 25%" },
    ],
    offsetX: -80,
    rotate: -2,
    speed: 0.6,
  },
  {
    year: "2021",
    phrase: "Novos caminhos, novos sonhos",
    subtext:
      "Em meio a uma mudança de estado, nossa família cresceu mais uma vez com a chegada da nossa princesa, Maria Cecília.",
    photos: [
      { src: foto6, caption: "Esperando por ela" },
      { src: foto7, caption: "Ela chegou" },
    ],
    offsetX: 80,
    rotate: 2,
    speed: 0.7,
  },
  {
    phrase: "Entre distância e saudade",
    subtext:
      "O trabalho nos fez enfrentar períodos de distância, mas nunca foi capaz de afastar nossos corações. Mesmo longe, seguimos unidos pelo amor e pela família.",
    photos: [
      { src: foto10, caption: "Mesmo longe, sempre juntos" },
    ],
    offsetX: 120,
    rotate: 3,
    speed: 0.9,
  },
  {
    year: "2024",
    phrase: "Mais um motivo para agradecer",
    subtext:
      "A chegada do nosso Vicente tornou nossa história ainda mais completa. E, enfim, conseguimos estar juntos por completo, sem distância nenhuma.",
    photos: [
      { src: fotoVicente, caption: "Nosso Vicente", position: "center 25%" },
    ],
    offsetX: -100,
    rotate: -3,
    speed: 1.1,
  },
  {
    phrase: "Um compromisso para a vida",
    subtext:
      "Antes da chegada da nossa Maria Celina, dissemos “sim” um ao outro no casamento civil e demos mais um passo importante na nossa caminhada.",
    photos: [
      { src: foto3, caption: "Alianças no dedo", position: "center 30%" },
      { src: foto4, caption: "O nosso sim no civil", position: "center 35%" },
      { src: foto8, caption: "Pequenina e cheia de graça" },
      { src: foto9, caption: "O sorriso mais lindo da casa", position: "center 30%" },
    ],
    offsetX: 140,
    rotate: 3,
    speed: 1.2,
  },
  {
    phrase: "A família completa",
    subtext:
      "Hoje, com nossos quatro filhos e uma história construída com amor, coragem, renúncias e muitas bênçãos, chegou o momento de realizar mais um grande sonho.",
    photos: [
      { src: foto10b, caption: "Todos juntos, a família completa", position: "center 35%" },
      { src: foto10c, caption: "A nossa maior bênção", position: "center 60%" },
    ],
    offsetX: -80,
    rotate: -2,
    speed: 0.6,
  },
  {
    phrase: "Nosso casamento na Igreja",
    subtext:
      "Queremos celebrar o nosso amor e renovar a promessa de caminhar juntos por toda a vida.",
    photos: [],
    offsetX: 100,
    rotate: 2,
    speed: 1.0,
  },
];

// ── Galeria (/galeria) ──────────────────────────────────────────────
export interface MediaItem {
  id: number;
  type: "image" | "video";
  url: string;
  thumbnail?: string; // só para vídeos
  description: string;
}

/**
 * Fotos/vídeos da galeria pública. Podem ser locais (public/fotos/galeria/…)
 * ou remotos (ex.: https://renancavalcante.dev.br/api/vanessa-wendel/midia/…).
 * Enquanto a lista estiver vazia, a página mostra "Em breve".
 */
export const GALLERY: MediaItem[] = [
  // { id: 1, type: "image", url: "/fotos/galeria/01.jpg", description: "Pré-wedding" },
  // { id: 2, type: "video", url: "/fotos/galeria/save-the-date.mp4", thumbnail: "/fotos/galeria/thumb.jpg", description: "Save the date" },
];

// ── Copy dos stages ─────────────────────────────────────────────────
export const COPY = {
  heroTagline: "Um amor que cresceu com a gente — e agora será celebrado diante do altar",
  heroSubtitle: "Vamos nos casar",
  heroHint: "Deslize para descobrir ↓",
  inviteEyebrow: "O nosso grande dia",
  inviteLine:
    "Com a família completa e o coração cheio de gratidão, convidamos você para celebrar conosco o nosso casamento na Igreja.",
  inviteClosing:
    "A nossa história começou, cresceu com cada desafio e floresceu com a chegada dos nossos filhos. Agora, diante de Deus e das pessoas que amamos, viveremos um novo capítulo: o nosso casamento religioso. Será uma alegria ter você conosco neste momento tão especial.",
  giftTitle: "Presentear o casal",
  giftText:
    "Ficamos muito felizes com a sua presença! Mas, se desejar presentear o casal, deixamos nosso Pix com carinho.",
  dressTitle: "Sobre o Traje",
  /** Mostrar o carrossel de inspirações (fotos em src/assets/img/look)? */
  dressShowLooks: false,
  dressCode: "Esporte Fino", // TODO
  dressText: "Pedimos, com carinho, que o branco fique reservado à noiva.",
  /** Dicas rápidas do traje. Ex.: { who: "Para elas", tip: "Vestido midi ou longo..." } */
  dressTips: [] as { who: string; tip: string }[], // vazio = sem dicas "Para elas / Para eles"
  rsvpTitle: "Confirme sua presença",
  rsvpText: "Será uma alegria imensa ter você conosco nesse dia tão especial.",
  rsvpYes: "Sim! Estarei lá para celebrar com vocês!",
  rsvpNo: "Não poderei comparecer, mas desejo toda a felicidade ao casal",
  thanksYes: "Que alegria! Mal podemos esperar para celebrar com você!",
  thanksNo: "Que pena! Sentiremos sua falta.",
};

// ── API / Banco de dados ────────────────────────────────────────────
/**
 * Base da API PHP: conteúdo de backend/api publicado em
 * HostGator → renancavalcante.dev.br/wendelevanessa/
 * Pode ser sobrescrita pela variável VITE_API_BASE no arquivo .env.
 */
export const API_BASE: string =
  import.meta.env.VITE_API_BASE ?? "https://renancavalcante.dev.br/wendelevanessa";

export const API = {
  rsvp: `${API_BASE}/rsvp.php`,
  dashboard: `${API_BASE}/dashboard.php`,
  updateGuest: `${API_BASE}/update_convidado.php`,
};

/** Opções de vínculo usadas no painel (/cpanel) — espelham o ENUM do banco. */
export const VINCULOS = [
  "Família da noiva",
  "Família do noivo",
  "Amigos da noiva",
  "Amigos do noivo",
  "Padrinhos",
  "Trabalho",
  "Outros",
] as const;
