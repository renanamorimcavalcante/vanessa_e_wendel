<?php
/**
 * Infra comum dos endpoints: CORS, JSON, conexão PDO e autenticação.
 */
declare(strict_types=1);

$CONFIG = require __DIR__ . '/config.php';

// ── CORS ────────────────────────────────────────────────────────
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $CONFIG['allowed_origins'], true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Helpers ─────────────────────────────────────────────────────
function respond(array $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function fail(string $message, int $status = 400): void
{
    respond(['success' => false, 'message' => $message], $status);
}

function input(): array
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        fail('Método não permitido.', 405);
    }
    $data = json_decode(file_get_contents('php://input') ?: '', true);
    if (!is_array($data)) {
        fail('JSON inválido.');
    }
    return $data;
}

/** Texto limpo e com tamanho máximo (ou null se vazio). */
function str_or_null($value, int $max): ?string
{
    if (!is_string($value)) return null;
    $v = trim(strip_tags($value));
    return $v === '' ? null : mb_substr($v, 0, $max);
}

/**
 * Lê os dados do banco aceitando variações de nome das chaves
 * ('password' ou 'pass', 'name' ou 'dbname', 'user' ou 'username').
 */
function db_config(): array
{
    global $CONFIG;
    $c = $CONFIG['db'] ?? [];
    return [
        'host'     => (string) ($c['host'] ?? 'localhost'),
        'port'     => (int) ($c['port'] ?? 3306),
        'name'     => (string) ($c['name'] ?? $c['dbname'] ?? ''),
        'user'     => (string) ($c['user'] ?? $c['username'] ?? ''),
        'password' => (string) ($c['password'] ?? $c['pass'] ?? ''),
    ];
}

function db(): PDO
{
    static $pdo = null;
    global $CONFIG;
    if ($pdo === null) {
        $c = db_config();
        $dsn = "mysql:host={$c['host']};port={$c['port']};dbname={$c['name']};charset=utf8mb4";
        try {
            $pdo = new PDO($dsn, $c['user'], $c['password'], [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            error_log('[vw-api] DB: ' . $e->getMessage());
            fail('Serviço indisponível. Tente novamente em instantes.', 503);
        }
    }
    return $pdo;
}

/** Valida a senha do painel. Atraso fixo para dificultar força bruta. */
function require_admin(array $in): void
{
    global $CONFIG;
    $senha = is_string($in['senha'] ?? null) ? $in['senha'] : '';
    $plain = (string) ($CONFIG['admin_password'] ?? '');
    $hash  = (string) ($CONFIG['admin_password_hash'] ?? '');
    $ok = $senha !== '' && (
        ($hash !== '' && password_verify($senha, $hash)) ||
        ($hash === '' && $plain !== '' && $plain !== 'TROQUE_ESTA_SENHA' && hash_equals($plain, $senha))
    );
    if (!$ok) {
        usleep(600000);
        fail('Senha inválida.', 401);
    }
}

function client_ip(): string
{
    return substr($_SERVER['REMOTE_ADDR'] ?? '', 0, 45);
}
