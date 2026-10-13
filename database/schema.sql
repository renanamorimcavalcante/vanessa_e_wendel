-- ─────────────────────────────────────────────────────────────────
--  Banco de dados — Convite de Casamento Vanessa & Wendel
--  MySQL 5.7+ / MariaDB 10.3+   ·   charset utf8mb4
--
--  Como usar (hospedagem / phpMyAdmin):
--    1. Crie o banco e o usuário no painel da hospedagem.
--    2. No phpMyAdmin, clique no banco criado → aba "Importar" → este arquivo.
--  (Em servidor próprio, descomente o CREATE DATABASE / USE abaixo.)
-- ─────────────────────────────────────────────────────────────────

SET NAMES utf8mb4;

-- CREATE DATABASE IF NOT EXISTS vanessa_wendel_convite
--   CHARACTER SET utf8mb4
--   COLLATE utf8mb4_unicode_ci;
-- USE vanessa_wendel_convite;

-- ── Confirmações de presença (RSVP) ──────────────────────────────
-- Mesma estrutura do convite da Sofia + restrição alimentar, mesa
-- e vínculos adaptados para casamento.
CREATE TABLE IF NOT EXISTS confirmacoes (
  id                  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  confirmacao         ENUM('sim','nao') NOT NULL,

  -- quando "sim"
  qtd_pessoas         TINYINT UNSIGNED NULL,
  nomes_pessoas       JSON NULL,                 -- ["Fulano", "Ciclana", ...]
  telefone            VARCHAR(20)  NULL,
  email               VARCHAR(160) NULL,
  restricao_alimentar VARCHAR(255) NULL,

  -- quando "nao"
  nome_ausente        VARCHAR(160) NULL,

  mensagem            TEXT NULL,

  -- campos de gestão (editados no /cpanel)
  categoria_etaria    ENUM('','Adulto','Criança') NOT NULL DEFAULT '',
  vinculo             ENUM('',
                           'Família da noiva','Família do noivo',
                           'Amigos da noiva','Amigos do noivo',
                           'Padrinhos','Trabalho','Outros') NOT NULL DEFAULT '',
  mesa                VARCHAR(20)  NULL,
  observacao_interna  TEXT NULL,

  ip                  VARCHAR(45)  NULL,
  user_agent          VARCHAR(255) NULL,
  criado_em           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em       DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY idx_confirmacao (confirmacao),
  KEY idx_telefone (telefone),
  KEY idx_criado_em (criado_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Visão de totais (usada pelo dashboard) ───────────────────────
CREATE OR REPLACE VIEW vw_totais AS
SELECT
  COUNT(*)                                                     AS total_envios,
  COALESCE(SUM(confirmacao = 'sim'), 0)                        AS total_sim,
  COALESCE(SUM(confirmacao = 'nao'), 0)                        AS total_nao,
  COALESCE(SUM(CASE WHEN confirmacao = 'sim' THEN qtd_pessoas ELSE 0 END), 0) AS total_pessoas
FROM confirmacoes;
