-- Dados de exemplo para testar o painel (/cpanel). NÃO rode em produção.
SET NAMES utf8mb4;
-- USE vanessa_wendel_convite;  (no phpMyAdmin, selecione o banco antes de importar)

INSERT INTO confirmacoes
  (confirmacao, qtd_pessoas, nomes_pessoas, telefone, email, restricao_alimentar, mensagem, vinculo, categoria_etaria)
VALUES
  ('sim', 2, JSON_ARRAY('Maria Teste', 'João Teste'), '(98) 99999-0001', 'maria@exemplo.com', 'Sem lactose',
   'Felicidades ao casal!', 'Família da noiva', 'Adulto'),
  ('sim', 1, JSON_ARRAY('Carlos Exemplo'), '(98) 99999-0002', NULL, NULL,
   'Estarei lá!', 'Amigos do noivo', 'Adulto');

INSERT INTO confirmacoes (confirmacao, nome_ausente, mensagem)
VALUES ('nao', 'Família Silva', 'Infelizmente estaremos viajando. Muitas felicidades!');
