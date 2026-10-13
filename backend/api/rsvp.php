<?php
/**
 * POST /rsvp.php — grava uma confirmação de presença.
 *
 * Sim: { confirmacao:"sim", qtdPessoas, nomesPessoas[], telefone, email?, restricaoAlimentar?, mensagem? }
 * Não: { confirmacao:"nao", nomeAusente, mensagem? }
 * Resposta: { success: bool, message?: string }
 */
require __DIR__ . '/_bootstrap.php';

$in = input();

// honeypot: campo oculto "website" preenchido = bot. Finge sucesso.
if (!empty($in['website'])) {
    respond(['success' => true]);
}

// rate limit simples por IP
$ip = client_ip();
$stmt = db()->prepare('SELECT COUNT(*) FROM confirmacoes WHERE ip = ? AND criado_em > (NOW() - INTERVAL 10 MINUTE)');
$stmt->execute([$ip]);
if ((int) $stmt->fetchColumn() >= (int) $CONFIG['rate_limit_per_10min']) {
    fail('Muitas tentativas. Aguarde alguns minutos.', 429);
}

$ua = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255);
$mensagem = str_or_null($in['mensagem'] ?? null, 2000);

if (($in['confirmacao'] ?? '') === 'sim') {
    $qtd = (int) ($in['qtdPessoas'] ?? 0);
    if ($qtd < 1 || $qtd > 10) fail('Quantidade de pessoas inválida.');

    $nomes = array_values(array_filter(array_map(
        fn($n) => str_or_null($n, 160),
        is_array($in['nomesPessoas'] ?? null) ? $in['nomesPessoas'] : []
    )));
    if (count($nomes) === 0) fail('Informe pelo menos o seu nome.');

    $telefone = str_or_null($in['telefone'] ?? null, 20);
    if (!$telefone || strlen(preg_replace('/\D/', '', $telefone)) < 10) fail('Informe um WhatsApp válido.');

    $email = str_or_null($in['email'] ?? null, 160);
    if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) fail('E-mail inválido.');

    $stmt = db()->prepare(
        'INSERT INTO confirmacoes
           (confirmacao, qtd_pessoas, nomes_pessoas, telefone, email, restricao_alimentar, mensagem, ip, user_agent)
         VALUES ("sim", ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $qtd,
        json_encode($nomes, JSON_UNESCAPED_UNICODE),
        $telefone,
        $email,
        str_or_null($in['restricaoAlimentar'] ?? null, 255),
        $mensagem,
        $ip,
        $ua,
    ]);
    respond(['success' => true]);
}

if (($in['confirmacao'] ?? '') === 'nao') {
    $nome = str_or_null($in['nomeAusente'] ?? null, 160);
    if (!$nome) fail('Informe seu nome.');

    $stmt = db()->prepare(
        'INSERT INTO confirmacoes (confirmacao, nome_ausente, mensagem, ip, user_agent)
         VALUES ("nao", ?, ?, ?, ?)'
    );
    $stmt->execute([$nome, $mensagem, $ip, $ua]);
    respond(['success' => true]);
}

fail('Confirmação inválida.');
