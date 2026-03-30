<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

const SITE_NAME = 'Koyu Yapay Zeka';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const UPLOAD_DIR = __DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR;
const UPLOAD_WEB_PATH = 'uploads/';
const CSV_BASVURU = __DIR__ . DIRECTORY_SEPARATOR . 'basvurular.csv';
const SMTP_HOST = 'smtp.ornek.com';
const SMTP_USER = 'kullanici@ornek.com';
const SMTP_PASS = 'smtp_sifreniz';
const SMTP_PORT = 587;
const SMTP_SECURE = 'tls';
const CONTACT_TARGET_EMAIL = 'info@koyuyapayzeka.com';

function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function text(?string $value): string
{
    $value = trim((string) $value);
    $value = strip_tags($value);
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

function urlValue(?string $value): string
{
    $value = trim((string) $value);
    if ($value === '') {
        return '';
    }

    $value = filter_var($value, FILTER_SANITIZE_URL);
    return filter_var($value, FILTER_VALIDATE_URL) ? $value : '';
}

function flash(string $type, string $message): void
{
    $_SESSION['flash'] = ['type' => $type, 'message' => $message];
}

function getFlash(): ?array
{
    if (!isset($_SESSION['flash'])) {
        return null;
    }

    $flash = $_SESSION['flash'];
    unset($_SESSION['flash']);
    return $flash;
}

function csrfToken(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['csrf_token'];
}

function verifyCsrf(?string $token): bool
{
    return is_string($token)
        && isset($_SESSION['csrf_token'])
        && hash_equals($_SESSION['csrf_token'], $token);
}

function redirect(string $path): void
{
    header('Location: ' . $path);
    exit;
}

function isAdmin(): bool
{
    return !empty($_SESSION['admin_logged_in']);
}

function requireAdmin(): void
{
    if (!isAdmin()) {
        flash('error', 'Bu sayfaya erişmek için giriş yapmalısınız.');
        redirect('login.php');
    }
}

function saveApplicationCsv(array $row): void
{
    $isNew = !file_exists(CSV_BASVURU) || filesize(CSV_BASVURU) === 0;
    $handle = fopen(CSV_BASVURU, 'ab');

    if ($handle === false) {
        throw new RuntimeException('CSV dosyası yazılamadı.');
    }

    if (!flock($handle, LOCK_EX)) {
        fclose($handle);
        throw new RuntimeException('CSV dosyası kilitlenemedi.');
    }

    try {
        if ($isNew) {
            fwrite($handle, "\xEF\xBB\xBF");
            fputcsv($handle, ['Ad Soyad', 'E-posta', 'Telefon', 'Bölüm', 'Sınıf', 'Ekipler', 'Tarih'], ';');
        }

        fputcsv($handle, $row, ';');
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

function uploadImage(array $file): string
{
    if (!is_dir(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0775, true);
    }

    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        throw new RuntimeException('Görsel yüklenirken hata oluştu.');
    }

    $extension = strtolower(pathinfo((string) $file['name'], PATHINFO_EXTENSION));
    $allowedExt = ['jpg', 'jpeg', 'png'];

    if (!in_array($extension, $allowedExt, true)) {
        throw new RuntimeException('Sadece JPG, JPEG ve PNG dosyaları yüklenebilir.');
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = $finfo ? finfo_file($finfo, (string) $file['tmp_name']) : '';
    if ($finfo) {
        finfo_close($finfo);
    }

    if (!in_array($mime, ['image/jpeg', 'image/png'], true)) {
        throw new RuntimeException('Yüklenen dosya geçerli bir görsel değil.');
    }

    $filename = bin2hex(random_bytes(16)) . '.' . $extension;
    $target = UPLOAD_DIR . $filename;

    if (!move_uploaded_file((string) $file['tmp_name'], $target)) {
        throw new RuntimeException('Görsel kaydedilemedi.');
    }

    return $filename;
}

function deleteImage(?string $filename): void
{
    $filename = trim((string) $filename);
    if ($filename === '') {
        return;
    }

    $path = UPLOAD_DIR . basename($filename);
    if (is_file($path)) {
        unlink($path);
    }
}

function pageTitle(string $title): string
{
    return $title . ' | ' . SITE_NAME;
}
