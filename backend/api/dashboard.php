<?php
/**
 * POST /dashboard.php — { senha }  →  { success, totais, confirmacoes[] }
 */
require __DIR__ . '/_bootstrap.php';

$in = input();
require_admin($in);

$totais = db()->query('SELECT * FROM vw_totais')->fetch() ?: [];
$rows = db()->query(
    'SELECT id, confirmacao, qtd_pessoas, nomes_pessoas, telefone, email, restricao_alimentar,
            mensagem, nome_ausente, categoria_etaria, vinculo, mesa, observacao_interna, criado_em
       FROM confirmacoes
      ORDER BY criado_em DESC, id DESC'
)->fetchAll();

foreach ($rows as &$r) {
    $r['id'] = (int) $r['id'];
    $r['qtd_pessoas'] = $r['qtd_pessoas'] !== null ? (int) $r['qtd_pessoas'] : null;
    $r['nomes_pessoas'] = $r['nomes_pessoas'] ? (json_decode($r['nomes_pessoas'], true) ?: []) : [];
}
unset($r);

respond([
    'success' => true,
    'totais' => array_map('intval', $totais),
    'confirmacoes' => $rows,
]);
