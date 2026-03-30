<?php
declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/*
MySQL örnek tablo:

CREATE TABLE ekip_uyeleri (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad_soyad VARCHAR(150) NOT NULL,
    gorev VARCHAR(150) NOT NULL,
    fotograf VARCHAR(255) NOT NULL,
    instagram VARCHAR(255) DEFAULT NULL,
    linkedin VARCHAR(255) DEFAULT NULL,
    twitter VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/

const DB_HOST = 'localhost';
const DB_NAME = 'ekip_yonetim';
const DB_USER = 'root';
const DB_PASS = '';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const UPLOAD_DIR = __DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR;
const UPLOAD_WEB_PATH = 'uploads/';

function db(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';

    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

function e(string $deger): string
{
    return htmlspecialchars($deger, ENT_QUOTES, 'UTF-8');
}

function temizMetin(?string $deger): string
{
    $deger = trim((string) $deger);
    $deger = strip_tags($deger);
    return htmlspecialchars($deger, ENT_QUOTES, 'UTF-8');
}

function temizUrl(?string $deger): string
{
    $deger = trim((string) $deger);

    if ($deger === '') {
        return '';
    }

    $deger = filter_var($deger, FILTER_SANITIZE_URL);

    return filter_var($deger, FILTER_VALIDATE_URL) ? $deger : '';
}

function flash(string $tip, string $mesaj): void
{
    $_SESSION['flash'] = [
        'tip' => $tip,
        'mesaj' => $mesaj,
    ];
}

function flashAl(): ?array
{
    if (!isset($_SESSION['flash'])) {
        return null;
    }

    $veri = $_SESSION['flash'];
    unset($_SESSION['flash']);

    return $veri;
}

function adminGirisliMi(): bool
{
    return !empty($_SESSION['admin_logged_in']);
}

function adminKontrolEt(): void
{
    if (!adminGirisliMi()) {
        flash('error', 'Bu sayfayı görüntülemek için giriş yapmalısınız.');
        header('Location: login.php');
        exit;
    }
}

function csrfToken(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['csrf_token'];
}

function csrfDogrula(?string $token): bool
{
    if (!isset($_SESSION['csrf_token']) || !is_string($token)) {
        return false;
    }

    return hash_equals($_SESSION['csrf_token'], $token);
}

function yonlendir(string $hedef): void
{
    header('Location: ' . $hedef);
    exit;
}
