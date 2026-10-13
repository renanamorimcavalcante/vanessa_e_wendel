# PROJECT.md — Convite de Casamento Vanessa & Wendel

> Documento mestre. Leia antes de mexer. Atualize o CHANGELOG a cada mudança relevante.

## 1. Identidade

| Campo | Valor |
|---|---|
| Pasta | `C:\Users\Renan Cavalcante\Documents\Projects\vanessa_wendel_convite` |
| Base | Fork de `sofia-s-dimensional-invite` (convite 15 anos Maria Sofia) |
| Noivos | Vanessa & Wendel |
| Data / locais / Pix | **Provisórios** — ver `// TODO` em `src/config/wedding.ts` |
| Gerenciador | npm (`package-lock.json`) |

## 2. Arquitetura

- **Fonte única de conteúdo:** `src/config/wedding.ts` → `COUPLE`, `WEDDING_DATE(_ISO)`, `CEREMONY`, `RECEPTION`, `CITY`, `PIX`, `GIFTS`, `GIFT_LIST_URL`, `STORY`, `GALLERY`, `COPY`, `API`, `VINCULOS`, `SECTIONS`.
- **Stages do `/` (ordem):** ParticleField → HeroStage → StoryStage → LookStage → GiftStage → InviteStage → FormStage → footer.
- **Rotas:** `/`, `/galeria`, `/cpanel`, `/listadeconvidados`, `/edit-guest/:id`, `*`.
- **Painel:** senha validada no servidor; guardada só em `sessionStorage` (`vw_cpanel_senha`).
- **Fotos da história:** `src/assets/img/familia/*.jpeg`, importadas no topo de `wedding.ts` (10-2.jpeg é print de celular — não usado). Caminho inexistente → placeholder automático.
- **Pix:** `src/lib/pix.ts` gera BR Code válido (CRC16) a partir da chave; QR via api.qrserver.com.

## 3. Design system — paleta "Azul & Verde Oliva" (enviada pelo Renan em 2026-10-10)

| Token | Hex | Uso |
|---|---|---|
| `--background` | #F6FAFD | fundo branco-azulado (com halos #ACD1F2 e #8D9F77) |
| `--foreground` / `--primary` | #395135 | verde oliva escuro — texto, botões |
| `--accent` | #7AA7D0 | azul — "&", detalhes, linhas |
| `--sky` | #ACD1F2 | azul claro |
| `--olive` | #8D9F77 | verde oliva médio (a imagem dizia "#750098", mas a cor da amostra é #8D9F77) |

Utilitários (`src/index.css`): `.glass-card`, `.glow-gold` (agora azul/oliva), `.glow-text`,
`.text-gradient-gold` (verde escuro → oliva → azul; nome mantido por compatibilidade),
`.hairline`, `.font-serif-display` (Cormorant Garamond), `.font-script` (Great Vibes). Corpo: Montserrat.
Flores decorativas: tons rosa recoloridos para azul (rosa azul, cerejeira azul).

## 3b. Seções opcionais

`SECTIONS` em `wedding.ts` liga/desliga stages. `LookStage` (traje) e `GiftStage` (presentes + Pix)
estão **desligados** e são carregados com `React.lazy` — desligados, o convidado não baixa nem o código
nem as fotos deles. Para religar: `dressCode: true` / `gifts: true`.

## 4. Backend

- `database/schema.sql` — DB `vanessa_wendel_convite`, tabela `confirmacoes`, view `vw_totais`.
- `backend/api/` — `_bootstrap.php` (CORS, PDO, auth), `rsvp.php`, `dashboard.php`, `update_convidado.php`, `config.example.php`, `.htaccess`.
- URL padrão: `https://renancavalcante.dev.br/wendelevanessa` (override com `VITE_API_BASE`).
- Testado ponta a ponta (MariaDB + php -S + Playwright) em 2026-10-09.

## 5. Pendências

1. Data, horário, igreja/espaço, endereços e links do Maps.
2. Nome da igreja e horários da cerimônia/recepção.
3. Revisar legendas das fotos (nomes dos filhos etc.) e criar `public/og-image.jpg`.
5. Dress code definitivo + inspirações em `src/assets/img/look/` (hoje são as da Sofia).
6. Publicar `backend/api` + criar `config.php` + rodar `schema.sql` no servidor.
7. Domínio final → `allowed_origins` no `config.php`.

## CHANGELOG

## 2026-10-12 (noite) — Ajustes finos
- Monograma: V e W quase se tocando, "&" azul (#7AA7D0) por cima, centralizado (posições medidas com as fontes reais).
- Igreja: **Igreja São Francisco de Assis**. Rodapé: **RAC Soluções Digitais**.
- Cards da história mais próximos (space-y-10/14, parallax ±40); convite e formulário sem min-h-screen.
- Removido campo "Restrição alimentar" do RSVP (coluna continua no banco, vazia).
- Fotos: 2024 → `vicent.jpeg`; civil → 3, 4, 8, 9; família completa → 10-2, 10-3.
- Nomes dos filhos (`CHILDREN` em wedding.ts) em negrito azul (#5A8FC4) nos textos e legendas.
- Projeto no GitHub: renanamorimcavalcante/vanessa_e_wendel (privado) → Vercel (vanessaewendel.vercel.app).

**Pendências:** horário da recepção (18h30 provisório), prazo do RSVP (10/11 provisório),
`og-image.jpg` p/ preview no WhatsApp, domínio da Vercel em `allowed_origins` do config.php
no servidor, apagar `status.php` do servidor, pastas vazias de fotos por filho em src/assets/img/.

## 2026-10-12 — Data oficial + API publicada
- Casamento: **sexta-feira, 20/11/2026, 16h30** (Igreja). Prazo RSVP provisório: 10/11/2026.
- API publicada na HostGator em `renancavalcante.dev.br/wendelevanessa/` (banco e usuário no cPanel → Bancos de dados MySQL). `status.php` confirmou conexão + tabela.
- `_bootstrap.php` aceita `'pass'` ou `'password'` no config (padrão do Decola Tech).

## 2026-10-12 — Fotos de volta por momento + sem música + desempenho
- Revertido o "só 2 carrosséis": cada card da linha do tempo tem as fotos do seu momento (ver comentário acima de `STORY`). Card "Casamento na Igreja" só texto.
- Música removida: `MusicPlayer.tsx`, `public/audio/iris-piano.mp3` e `MUSIC` apagados.
- **Desempenho** (medido com CPU 4× mais lenta, scroll da página inteira): celular ~2 fps → ~54 fps; desktop → ~44 fps.
  - `ParticleField` reescrito: canvas do tamanho da tela (antes 6 telas), blur pré-renderizado em sprites, 26/18 partículas, pausa com aba oculta, respeita "reduzir movimento".
  - Decoração redimensionada ao tamanho de exibição + quantizada (≈3,3 MB → ≈0,5 MB); filtros CSS (saturate/blur/drop-shadow) embutidos nos PNGs.
  - Aura do monograma pré-desfocada (sem `blur()` CSS animado).
  - Fundo: `background-attachment: fixed` → camada `body::before` fixa.
  - `.glass-card` sem `backdrop-filter`.
  - Galeria e painel admin em lazy load; removidos React Query/Toaster/Tooltip não usados (JS inicial 503 KB → 326 KB).
- **Regra para manter leve:** não usar filtro CSS em imagens que se movem no scroll, nem `backdrop-filter` em cards animados.

## 2026-10-12 — Só 2 carrosséis na história (revertido)
- Carrossel 1 (card 2016 "O começo de tudo"): fotos do casal 1, 2, 3, 4.
- Carrossel 2 (card "A família completa"): família e filhos 5, 5-1, 5-2, 6, 7, 8, 9, 10, 10-3 (ordem numérica).
- Demais cards da linha do tempo só com texto. Legendas não citam nomes dos filhos.

## 2026-10-10 — História real do casal + endereços
- `STORY` virou linha do tempo com o texto do casal: 2016 namoro → 2019 Wendel Miguel → 2021 Maria Cecília → distância → 2024 Vicente → casamento civil (antes de Maria Celina) → família completa → casamento na Igreja.
- `StoryCard.year` (opcional) e cards só de texto (`photos: []`); abertura `STORY_INTRO`.
- Fotos 3 e 4 (civil) movidas para o card "Um compromisso para a vida".
- Igreja: Rua Cinco, 1410 — Parque dos Sabiás (maps LJj6CKvVSzXr9qwA6). Recepção: Romero Gastronomia, Rua Mearim, lote 13 — Ponta do Farol.
- `COPY.inviteClosing` exibido no card do convite.

## 2026-10-10 — Nova paleta + seções ocultas
- Paleta "Azul & Verde Oliva" (#ACD1F2, #7AA7D0, #8D9F77, #395135); flores rosa recoloridas para azul.
- Traje, Lista de Presentes e Pix ocultos via `SECTIONS` + lazy load.
- Local único (RECEPTION = null) com link do Maps https://maps.app.goo.gl/vL6BT6rtrkuQif4p7.
- Build trocado para `@vitejs/plugin-react` (SWC não carregava no Windows); removido lovable-tagger.

## 2026-10-09 — Criação do projeto
- Fork limpo do convite da Sofia (sem fotos, sem .git, sem node_modules).
- Config central `wedding.ts`; paleta marfim/oliva/champanhe/sálvia; fontes Cormorant + Great Vibes.
- Novos: `Monogram`, contagem regressiva, cerimônia + recepção, "Adicionar à agenda", restrição alimentar no RSVP, máscara de telefone, honeypot, Pix BR Code, export CSV, campo mesa.
- Backend PHP + schema MySQL criados e testados.
- História reescrita com as fotos reais: namoro → casamento civil → filho → filha → família → "renovar o sim" no altar.
