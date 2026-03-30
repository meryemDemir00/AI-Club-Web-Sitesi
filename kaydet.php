<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
}

function geriYonlendir(string $durum, string $mesaj = ''): void
{
    $hedef = 'index.php?durum=' . urlencode($durum);

    if ($mesaj !== '') {
        $hedef .= '&mesaj=' . urlencode($mesaj);
    }

    header('Location: ' . $hedef);
    exit;
}

// Giriş verilerini temizleyip kayıt için güvenli hale getiriyoruz.
$adSoyad = trim($_POST['ad_soyad'] ?? '');
$eposta = trim($_POST['eposta'] ?? '');
$telefon = trim($_POST['telefon'] ?? '');
$bolum = trim($_POST['bolum'] ?? '');
$sinif = trim($_POST['sinif'] ?? '');
$ekipler = $_POST['ekipler'] ?? [];

if (
    $adSoyad === '' ||
    $eposta === '' ||
    $telefon === '' ||
    $bolum === '' ||
    $sinif === ''
) {
    geriYonlendir('hata', 'Lütfen zorunlu alanların tamamını doldurun.');
}

if (!filter_var($eposta, FILTER_VALIDATE_EMAIL)) {
    geriYonlendir('hata', 'Lütfen geçerli bir e-posta adresi girin.');
}

if (!is_array($ekipler)) {
    $ekipler = [];
}

$ekipler = array_map(
    static fn($ekip) => trim((string) $ekip),
    $ekipler
);
$ekipler = array_filter($ekipler, static fn($ekip) => $ekip !== '');

$csvDosyasi = __DIR__ . DIRECTORY_SEPARATOR . 'uyeler.csv';
$dosyaYeniMi = !file_exists($csvDosyasi) || filesize($csvDosyasi) === 0;
$dosya = fopen($csvDosyasi, 'ab');

if ($dosya === false) {
    geriYonlendir('hata', 'CSV dosyası oluşturulamadı veya yazılamadı.');
}

if (!flock($dosya, LOCK_EX)) {
    fclose($dosya);
    geriYonlendir('hata', 'Dosya kilidi alınamadı. Lütfen tekrar deneyin.');
}

try {
    if ($dosyaYeniMi) {
        // Excel'in UTF-8 karakterleri doğru algılaması için BOM eklenir.
        fwrite($dosya, "\xEF\xBB\xBF");
        fputcsv($dosya, ['Ad Soyad', 'E-posta', 'Telefon', 'Bölüm', 'Sınıf', 'Ekipler'], ';');
    }

    $kayitSatiri = [
        $adSoyad,
        $eposta,
        $telefon,
        $bolum,
        $sinif,
        implode(', ', $ekipler),
    ];

    if (fputcsv($dosya, $kayitSatiri, ';') === false) {
        throw new RuntimeException('Veriler CSV dosyasına yazılamadı.');
    }
} catch (Throwable $hata) {
    flock($dosya, LOCK_UN);
    fclose($dosya);
    geriYonlendir('hata', $hata->getMessage());
}

flock($dosya, LOCK_UN);
fclose($dosya);

geriYonlendir('basarili');
