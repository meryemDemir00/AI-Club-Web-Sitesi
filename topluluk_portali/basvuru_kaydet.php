<?php
declare(strict_types=1);
require __DIR__ . '/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect('uye-ol.php');
}

if (!verifyCsrf($_POST['csrf_token'] ?? null)) {
    flash('error', 'Güvenlik doğrulaması başarısız oldu.');
    redirect('uye-ol.php');
}

$adSoyad = text($_POST['ad_soyad'] ?? '');
$eposta = filter_var(trim((string) ($_POST['eposta'] ?? '')), FILTER_SANITIZE_EMAIL);
$telefon = text($_POST['telefon'] ?? '');
$bolum = text($_POST['bolum'] ?? '');
$sinif = text($_POST['sinif'] ?? '');
$ekipler = $_POST['ekipler'] ?? [];

if ($adSoyad === '' || $telefon === '' || $bolum === '' || $sinif === '' || !$eposta || !filter_var($eposta, FILTER_VALIDATE_EMAIL)) {
    flash('error', 'Lütfen tüm alanları doğru şekilde doldurun.');
    redirect('uye-ol.php');
}

if (!is_array($ekipler)) {
    $ekipler = [];
}

$ekipler = array_values(array_filter(array_map(static fn($item) => text((string) $item), $ekipler)));
$ekiplerText = implode(', ', $ekipler);
$createdAt = date('Y-m-d H:i:s');

try {
    $insert = db()->prepare('
        INSERT INTO basvurular (ad_soyad, eposta, telefon, bolum, sinif, ekipler, created_at)
        VALUES (:ad_soyad, :eposta, :telefon, :bolum, :sinif, :ekipler, :created_at)
    ');
    $insert->execute([
        'ad_soyad' => $adSoyad,
        'eposta' => $eposta,
        'telefon' => $telefon,
        'bolum' => $bolum,
        'sinif' => $sinif,
        'ekipler' => $ekiplerText,
        'created_at' => $createdAt,
    ]);

    saveApplicationCsv([$adSoyad, $eposta, $telefon, $bolum, $sinif, $ekiplerText, $createdAt]);
    flash('success', 'Başvurunuz başarıyla alındı.');
} catch (Throwable $hata) {
    flash('error', 'Başvuru kaydedilemedi: ' . $hata->getMessage());
}

redirect('uye-ol.php');
