<?php
/**
 * POST /update_convidado.php
 * { senha, id, vinculo, categoria_etaria, mesa?, observacao_interna? } → { success }
 */
require __DIR__ . '/_bootstrap.php';

$in = input();
require_admin($in);

$VINCULOS = ['', 'Família da noiva', 'Família do noivo', 'Amigos da noiva', 'Amigos do noivo', 'Padrinhos', 'Trabalho', 'Outros'];
$CATEGORIAS = ['', 'Adulto', 'Criança'];

$id = (int) ($in['id'] ?? 0);
$vinculo = (string) ($in['vinculo'] ?? '');
$categoria = (string) ($in['categoria_etaria'] ?? '');

if ($id < 1) fail('ID inválido.');
if (!in_array($vinculo, $VINCULOS, true)) fail('Vínculo inválido.');
if (!in_array($categoria, $CATEGORIAS, true)) fail('Categoria inválida.');

$stmt = db()->prepare(
    'UPDATE confirmacoes
        SET vinculo = ?, categoria_etaria = ?, mesa = ?, observacao_interna = ?
      WHERE id = ?'
);
$stmt->execute([
    $vinculo,
    $categoria,
    str_or_null($in['mesa'] ?? null, 20),
    str_or_null($in['observacao_interna'] ?? null, 2000),
    $id,
]);

respond(['success' => true]);
