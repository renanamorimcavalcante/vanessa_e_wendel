<?php
/**
 * Copie este arquivo para  config.php  (no servidor) e preencha.
 * O config.php NÃO deve ir para o Git (já está no .gitignore).
 */
return [
    'db' => [
        'host'     => 'localhost',
        'port'     => 3306,
        'name'     => 'vanessa_wendel_convite',
        'user'     => 'USUARIO_DO_BANCO',
        'password' => 'SENHA_DO_BANCO',
    ],

    /**
     * Senha do painel (/cpanel). Use UMA das duas opções:
     *  1) Mais simples: escreva a senha em 'admin_password' (este arquivo fica
     *     no servidor, bloqueado pelo .htaccess, e nunca vai para o Git).
     *  2) Mais seguro: deixe 'admin_password' vazio e cole em 'admin_password_hash'
     *     o resultado de:  php -r "echo password_hash('SuaSenha', PASSWORD_DEFAULT);"
     */
    'admin_password'      => 'TROQUE_ESTA_SENHA',
    'admin_password_hash' => '',

    /** Domínios que podem chamar a API (CORS). */
    'allowed_origins' => [
        'https://vanessaewendel.vercel.app',   // TODO domínio final do convite
        'https://renancavalcante.dev.br',
        'http://localhost:8080',
        'http://127.0.0.1:8080',
    ],

    /** Limite simples anti-spam: máx. de envios por IP a cada 10 min. */
    'rate_limit_per_10min' => 10,
];
