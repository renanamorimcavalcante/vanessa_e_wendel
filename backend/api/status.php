<?php
/**
 * GET /status.php — diagnóstico rápido da instalação (não mostra senhas).
 * Abra no navegador: https://renancavalcante.dev.br/wendelevanessa/status.php
 * Depois que tudo estiver OK, pode apagar este arquivo do servidor.
 */
header('Content-Type: application/json; charset=utf-8');

$r = ['api' => 'ok', 'php' => PHP_VERSION, 'config' => false, 'banco' => null, 'tabela' => false, 'senha_painel' => false];

if (!is_file(__DIR__ . '/config.php')) {
    $r['erro'] = 'config.php não encontrado — renomeie config.example.php para config.php e preencha.';
    echo json_encode($r, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}
$CONFIG = require __DIR__ . '/config.php';
$r['config'] = true;
$r['senha_painel'] = (($CONFIG['admin_password'] ?? '') !== '' && ($CONFIG['admin_password'] ?? '') !== 'TROQUE_ESTA_SENHA')
    || ($CONFIG['admin_password_hash'] ?? '') !== '';

$raw = $CONFIG['db'] ?? [];
$c = [
    'host'     => (string) ($raw['host'] ?? 'localhost'),
    'port'     => (int) ($raw['port'] ?? 3306),
    'name'     => (string) ($raw['name'] ?? $raw['dbname'] ?? ''),
    'user'     => (string) ($raw['user'] ?? $raw['username'] ?? ''),
    'password' => (string) ($raw['password'] ?? $raw['pass'] ?? ''),
];
$r['senha_banco_preenchida'] = $c['password'] !== '' && $c['password'] !== 'SENHA_DO_BANCO';
$r['senha_banco_tamanho'] = strlen($c['password']); // ajuda a notar espaço sobrando (não mostra a senha)
$r['banco_configurado'] = ['host' => $c['host'], 'nome' => $c['name'], 'usuario' => $c['user']];

$pendentes = [];
if (in_array($c['user'], ['USUARIO_DO_BANCO', ''], true)) $pendentes[] = "db.user";
if (!$r['senha_banco_preenchida']) $pendentes[] = "db.password (a chave deve se chamar 'password' ou 'pass')";
if ($c['password'] !== trim($c['password'])) $pendentes[] = "db.password tem espaço no começo/fim";
if (($c['name'] ?? '') === 'vanessa_wendel_convite') $pendentes[] = "db.name (na HostGator o nome tem prefixo, ex.: renan675_convite)";
if (!$r['senha_painel']) $pendentes[] = "admin_password";
if ($pendentes) $r['falta_preencher_no_config'] = $pendentes;

try {
    $pdo = new PDO("mysql:host={$c['host']};port={$c['port']};dbname={$c['name']};charset=utf8mb4", $c['user'], $c['password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $r['banco'] = 'conectado';
    $r['tabela'] = (bool) $pdo->query("SHOW TABLES LIKE 'confirmacoes'")->fetchColumn();
    if ($r['tabela']) $r['confirmacoes'] = (int) $pdo->query('SELECT COUNT(*) FROM confirmacoes')->fetchColumn();
    else $r['erro'] = 'Tabela confirmacoes não existe — importe database/schema.sql no phpMyAdmin (clicando no banco antes).';
} catch (Throwable $e) {
    $r['banco'] = 'erro';
    $code = (int) ($e->errorInfo[1] ?? $e->getCode());
    $r['codigo_mysql'] = $code;
    $msgs = [
        1045 => 'Usuário ou senha do banco recusados — confira db.user/db.password e se o usuário foi ADICIONADO ao banco com todos os privilégios.',
        1044 => 'O usuário não tem acesso a esse banco (ou o nome do banco está errado) — confira db.name com prefixo e, no cPanel → Bancos de dados MySQL → "Adicionar usuário ao banco", marque TODOS OS PRIVILÉGIOS.',
        1049 => 'Banco não encontrado — confira db.name (com o prefixo, ex.: renan675_convite).',
        2002 => 'Servidor MySQL não encontrado — mantenha db.host como localhost.',
    ];
    $r['erro'] = $msgs[$code] ?? 'Não conectou ao MySQL (código ' . $code . ').';
}
if (!$r['senha_painel'] && empty($r['erro'])) $r['erro'] = "Defina 'admin_password' no config.php.";

echo json_encode($r, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
