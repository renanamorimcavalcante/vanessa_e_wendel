# Convite de Casamento — Vanessa & Wendel

Convite digital interativo, construído a partir do convite de 15 anos da Maria Sofia
(`sofia-s-dimensional-invite`). Mesma mecânica de *scroll storytelling* (parallax,
cards flutuantes, partículas), com tema, paleta e textos de casamento.

**Stack:** React 18 · Vite 5 · TypeScript · Tailwind 3 · framer-motion · shadcn/ui · react-router
**Backend:** PHP 8 + MySQL/MariaDB (pasta `backend/` + `database/`)

---

## Estrutura

```
vanessa_wendel_convite/
├── src/
│   ├── config/wedding.ts      ← TUDO que é personalizável (nomes, data, locais, Pix, frases, fotos)
│   ├── components/
│   │   ├── HeroStage.tsx      capa com monograma V&W
│   │   ├── StoryStage.tsx     nossa história (cards com carrossel de fotos)
│   │   ├── LookStage.tsx      traje / dress code
│   │   ├── GiftStage.tsx      lista de presentes + Pix (QR gerado automaticamente)
│   │   ├── InviteStage.tsx    data, contagem regressiva, cerimônia/recepção, agenda
│   │   ├── FormStage.tsx      RSVP → backend/api/rsvp.php
│   │   ├── GaleriaStage.tsx   página /galeria
│   │   ├── Monogram.tsx       monograma SVG do casal
│   │   ├── FlowerGarden.tsx · ParticleField.tsx
│   │   └── ui/                shadcn (não editar)
│   ├── pages/                 Index · CPanelPage (/cpanel) · GuestListPage · EditGuestPage · NotFound
│   ├── lib/api.ts             tipos + chamadas da API do painel
│   ├── lib/pix.ts             gera o "Pix Copia e Cola" (BR Code) a partir da chave
│   └── assets/decor/          flores e folhas (tons marfim/sálvia)
├── public/
│   ├── fotos/                 ← fotos do casal (ver LEIA-ME.txt)
├── database/
│   ├── schema.sql             cria o banco, tabela `confirmacoes` e view `vw_totais`
│   └── seed_exemplo.sql       dados fictícios para testar o painel
├── backend/api/               endpoints PHP (rsvp, dashboard, update_convidado)
└── skills/vanessa-wendel-invite/  contexto do projeto para o Claude (PROJECT.md)
```

## Rodando localmente

```bash
npm install
npm run dev        # http://localhost:8080
npm run build      # gera dist/ para deploy (Vercel)
```

## Personalização rápida

Abra **`src/config/wedding.ts`** e procure por `// TODO`:

| O quê | Onde |
|---|---|
| Data e horário | `WEDDING_DATE_ISO` e `WEDDING_DATE` |
| Igreja / espaço | `CEREMONY` e `RECEPTION` (use `null` se for o mesmo lugar) |
| Pix | `PIX` (o QR Code é gerado sozinho a partir da chave) |
| Frases | `STORY` (cards) e `COPY` (títulos e textos dos stages) |
| Dress code | `COPY.dressCode` + fotos em `src/assets/img/look/` |

**Fotos:** ficam em `src/assets/img/familia/` e são importadas no topo de
`wedding.ts`. Para trocar, salve a foto, importe e use no card do `STORY`.
Recomendado: JPG, 1400px no maior lado, qualidade ~82.

**Preview no WhatsApp:** salve uma foto 1200×630 como `public/og-image.jpg`.

## Banco de dados + API (HostGator · cPanel)

A API fica em **`renancavalcante.dev.br/wendelevanessa/`**.

1. **Banco** — cPanel → *Bancos de dados MySQL*:
   crie o banco (ex.: `renan675_convite`) e o usuário (ex.: `renan675_convite`),
   e em *Adicionar usuário ao banco* marque **TODOS OS PRIVILÉGIOS**.
2. **Tabelas** — cPanel → *phpMyAdmin* → clique no banco → aba **Importar** →
   `database/schema.sql` → Executar.
3. **Arquivos** — Gerenciador de arquivos → `renancavalcante.dev.br/wendelevanessa/` →
   **Carregar** `deploy/wendelevanessa_api.zip` → selecione o zip → **Extrair**.
4. **Config** — renomeie `config.example.php` para **`config.php`** → **Editar**:
   nome do banco, usuário e senha do passo 1 e `'admin_password'` (senha do /cpanel).
5. **Conferir** — abra `https://renancavalcante.dev.br/wendelevanessa/status.php`.
   Tudo certo quando aparecer `"banco": "conectado"` e `"tabela": true`.
6. **Painel** — `npm run dev` → http://localhost:8080/cpanel → entre com a senha.

Para usar outra URL de API, crie `.env` a partir de `.env.example` (`VITE_API_BASE=...`).

| Endpoint | Payload | Retorno |
|---|---|---|
| `POST rsvp.php` | `{confirmacao:"sim", qtdPessoas, nomesPessoas[], telefone, email?, restricaoAlimentar?, mensagem?}` ou `{confirmacao:"nao", nomeAusente, mensagem?}` | `{success, message?}` |
| `POST dashboard.php` | `{senha}` | `{success, totais, confirmacoes[]}` |
| `POST update_convidado.php` | `{senha, id, vinculo, categoria_etaria, mesa?, observacao_interna?}` | `{success}` |

Segurança incluída: senha com `password_hash`, queries preparadas (PDO), CORS por
lista de domínios, honeypot anti-bot e limite de envios por IP. `config.php` fica
fora do Git e bloqueado via `.htaccess`.

## Rotas

| Rota | Página |
|---|---|
| `/` | Convite |
| `/galeria` | Galeria de fotos/vídeos (lista em `GALLERY` no config) |
| `/cpanel` | Painel de confirmações (senha) |
| `/listadeconvidados` | Tabela completa + exportar CSV |
| `/edit-guest/:id` | Editar vínculo, categoria, mesa e observação |
