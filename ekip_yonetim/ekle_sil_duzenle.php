<?php
declare(strict_types=1);

require __DIR__ . '/db_baglan.php';
adminKontrolEt();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    yonlendir('admin.php');
}

if (!csrfDogrula($_POST['csrf_token'] ?? null)) {
    flash('error', 'Güvenlik doğrulaması başarısız oldu. Lütfen tekrar deneyin.');
    yonlendir('admin.php');
}

if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0775, true);
}

function yuklenenFotografiKaydet(array $dosya): string
{
    if (($dosya['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        throw new RuntimeException('Fotoğraf yükleme sırasında bir hata oluştu.');
    }

    $orijinalAd = (string) ($dosya['name'] ?? '');
    $geciciYol = (string) ($dosya['tmp_name'] ?? '');
    $uzanti = strtolower(pathinfo($orijinalAd, PATHINFO_EXTENSION));
    $izinliUzantilar = ['jpg', 'jpeg', 'png'];

    if (!in_array($uzanti, $izinliUzantilar, true)) {
        throw new RuntimeException('Sadece JPG, JPEG ve PNG dosyaları yüklenebilir.');
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = $finfo ? finfo_file($finfo, $geciciYol) : '';
    if ($finfo) {
        finfo_close($finfo);
    }

    if (!in_array($mime, ['image/jpeg', 'image/png'], true)) {
        throw new RuntimeException('Yüklenen dosya geçerli bir görsel değil.');
    }

    $yeniAd = bin2hex(random_bytes(16)) . '.' . $uzanti;
    $hedefYol = UPLOAD_DIR . $yeniAd;

    if (!move_uploaded_file($geciciYol, $hedefYol)) {
        throw new RuntimeException('Fotoğraf sunucuya kaydedilemedi.');
    }

    return $yeniAd;
}

function eskiFotografiSil(?string $dosyaAdi): void
{
    $dosyaAdi = trim((string) $dosyaAdi);
    if ($dosyaAdi === '') {
        return;
    }

    $tamYol = UPLOAD_DIR . basename($dosyaAdi);
    if (is_file($tamYol)) {
        unlink($tamYol);
    }
}

$islem = (string) ($_POST['islem'] ?? '');
$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT) ?: null;

try {
    if ($islem === 'ekle') {
        $adSoyad = temizMetin($_POST['ad_soyad'] ?? '');
        $gorev = temizMetin($_POST['gorev'] ?? '');
        $instagram = temizUrl($_POST['instagram'] ?? '');
        $linkedin = temizUrl($_POST['linkedin'] ?? '');
        $twitter = temizUrl($_POST['twitter'] ?? '');

        if ($adSoyad === '' || $gorev === '') {
            throw new RuntimeException('Ad soyad ve görev alanları zorunludur.');
        }

        if (empty($_FILES['fotograf']['name'])) {
            throw new RuntimeException('Yeni üye eklerken fotoğraf yüklemek zorunludur.');
        }

        $fotograf = yuklenenFotografiKaydet($_FILES['fotograf']);

        $sorgu = db()->prepare(
            'INSERT INTO ekip_uyeleri (ad_soyad, gorev, fotograf, instagram, linkedin, twitter)
             VALUES (:ad_soyad, :gorev, :fotograf, :instagram, :linkedin, :twitter)'
        );
        $sorgu->execute([
            'ad_soyad' => $adSoyad,
            'gorev' => $gorev,
            'fotograf' => $fotograf,
            'instagram' => $instagram ?: null,
            'linkedin' => $linkedin ?: null,
            'twitter' => $twitter ?: null,
        ]);

        flash('success', 'Yeni ekip üyesi başarıyla eklendi.');
        yonlendir('admin.php');
    }

    if ($islem === 'guncelle') {
        if (!$id) {
            throw new RuntimeException('Güncellenecek üye bulunamadı.');
        }

        $sorgu = db()->prepare('SELECT * FROM ekip_uyeleri WHERE id = :id');
        $sorgu->execute(['id' => $id]);
        $mevcutUye = $sorgu->fetch();
        if (!$mevcutUye) {
            throw new RuntimeException('Üye kaydı bulunamadı.');
        }

        $adSoyad = temizMetin($_POST['ad_soyad'] ?? '');
        $gorev = temizMetin($_POST['gorev'] ?? '');
        $instagram = temizUrl($_POST['instagram'] ?? '');
        $linkedin = temizUrl($_POST['linkedin'] ?? '');
        $twitter = temizUrl($_POST['twitter'] ?? '');

        if ($adSoyad === '' || $gorev === '') {
            throw new RuntimeException('Ad soyad ve görev alanları zorunludur.');
        }

        $fotograf = $mevcutUye['fotograf'];
        if (!empty($_FILES['fotograf']['name'])) {
            $fotograf = yuklenenFotografiKaydet($_FILES['fotograf']);
            eskiFotografiSil($mevcutUye['fotograf']);
        }

        $guncelle = db()->prepare(
            'UPDATE ekip_uyeleri
             SET ad_soyad = :ad_soyad, gorev = :gorev, fotograf = :fotograf,
                 instagram = :instagram, linkedin = :linkedin, twitter = :twitter
             WHERE id = :id'
        );
        $guncelle->execute([
            'id' => $id,
            'ad_soyad' => $adSoyad,
            'gorev' => $gorev,
            'fotograf' => $fotograf,
            'instagram' => $instagram ?: null,
            'linkedin' => $linkedin ?: null,
            'twitter' => $twitter ?: null,
        ]);

        flash('success', 'Ekip üyesi başarıyla güncellendi.');
        yonlendir('admin.php');
    }

    if ($islem === 'sil') {
        if (!$id) {
            throw new RuntimeException('Silinecek üye bulunamadı.');
        }

        $sorgu = db()->prepare('SELECT fotograf FROM ekip_uyeleri WHERE id = :id');
        $sorgu->execute(['id' => $id]);
        $uye = $sorgu->fetch();
        if (!$uye) {
            throw new RuntimeException('Silinecek kayıt bulunamadı.');
        }

        $sil = db()->prepare('DELETE FROM ekip_uyeleri WHERE id = :id');
        $sil->execute(['id' => $id]);
        eskiFotografiSil($uye['fotograf']);

        flash('success', 'Ekip üyesi sistemden silindi.');
        yonlendir('admin.php');
    }

    throw new RuntimeException('Geçersiz işlem isteği.');
} catch (Throwable $hata) {
    flash('error', $hata->getMessage());
    if ($islem === 'guncelle' && $id) {
        yonlendir('admin.php?duzenle=' . $id);
    }
    yonlendir('admin.php');
}
