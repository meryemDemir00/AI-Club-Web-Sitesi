<?php
declare(strict_types=1);
require __DIR__ . '/functions.php';
requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect('admin.php');
}

if (!verifyCsrf($_POST['csrf_token'] ?? null)) {
    flash('error', 'Güvenlik doğrulaması başarısız oldu.');
    redirect('admin.php');
}

$action = (string) ($_POST['action'] ?? '');
$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT) ?: null;

try {
    if ($action === 'create_member' || $action === 'update_member') {
        $adSoyad = text($_POST['ad_soyad'] ?? '');
        $gorev = text($_POST['gorev'] ?? '');
        $instagram = urlValue($_POST['instagram'] ?? '');
        $linkedin = urlValue($_POST['linkedin'] ?? '');
        $twitter = urlValue($_POST['twitter'] ?? '');

        if ($adSoyad === '' || $gorev === '') {
            throw new RuntimeException('Ekip üyesi bilgileri eksik.');
        }

        if ($action === 'create_member') {
            $fotograf = uploadImage($_FILES['fotograf'] ?? []);
            $stmt = db()->prepare('INSERT INTO ekip_uyeleri (ad_soyad, gorev, fotograf, instagram, linkedin, twitter) VALUES (:ad_soyad, :gorev, :fotograf, :instagram, :linkedin, :twitter)');
            $stmt->execute([
                'ad_soyad' => $adSoyad,
                'gorev' => $gorev,
                'fotograf' => $fotograf,
                'instagram' => $instagram ?: null,
                'linkedin' => $linkedin ?: null,
                'twitter' => $twitter ?: null,
            ]);
            flash('success', 'Ekip üyesi eklendi.');
            redirect('admin.php');
        }

        if (!$id) {
            throw new RuntimeException('Güncellenecek ekip üyesi bulunamadı.');
        }

        $stmt = db()->prepare('SELECT fotograf FROM ekip_uyeleri WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $current = $stmt->fetch();
        if (!$current) {
            throw new RuntimeException('Üye kaydı bulunamadı.');
        }

        $fotograf = $current['fotograf'];
        if (!empty($_FILES['fotograf']['name'])) {
            $fotograf = uploadImage($_FILES['fotograf']);
            deleteImage($current['fotograf']);
        }

        $stmt = db()->prepare('UPDATE ekip_uyeleri SET ad_soyad = :ad_soyad, gorev = :gorev, fotograf = :fotograf, instagram = :instagram, linkedin = :linkedin, twitter = :twitter WHERE id = :id');
        $stmt->execute([
            'id' => $id,
            'ad_soyad' => $adSoyad,
            'gorev' => $gorev,
            'fotograf' => $fotograf,
            'instagram' => $instagram ?: null,
            'linkedin' => $linkedin ?: null,
            'twitter' => $twitter ?: null,
        ]);
        flash('success', 'Ekip üyesi güncellendi.');
        redirect('admin.php');
    }

    if ($action === 'delete_member') {
        if (!$id) {
            throw new RuntimeException('Silinecek üye bulunamadı.');
        }

        $stmt = db()->prepare('SELECT fotograf FROM ekip_uyeleri WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $current = $stmt->fetch();
        if (!$current) {
            throw new RuntimeException('Silinecek üye bulunamadı.');
        }

        db()->prepare('DELETE FROM ekip_uyeleri WHERE id = :id')->execute(['id' => $id]);
        deleteImage($current['fotograf']);
        flash('success', 'Ekip üyesi silindi.');
        redirect('admin.php');
    }

    if ($action === 'create_event' || $action === 'update_event') {
        $baslik = text($_POST['baslik'] ?? '');
        $kisa = text($_POST['kisa_aciklama'] ?? '');
        $detay = text($_POST['detay'] ?? '');
        $tarih = trim((string) ($_POST['etkinlik_tarihi'] ?? ''));
        $konum = text($_POST['konum'] ?? '');
        $kapasite = max(1, (int) ($_POST['kapasite'] ?? 1));
        $katilimci = max(0, (int) ($_POST['katilimci_sayisi'] ?? 0));
        $harita = urlValue($_POST['harita_embed'] ?? '');

        if ($baslik === '' || $kisa === '' || $detay === '' || $tarih === '' || $konum === '' || $harita === '') {
            throw new RuntimeException('Etkinlik alanları eksik.');
        }

        if ($action === 'create_event') {
            $stmt = db()->prepare('INSERT INTO etkinlikler (baslik, kisa_aciklama, detay, etkinlik_tarihi, konum, harita_embed, kapasite, katilimci_sayisi, durum) VALUES (:baslik, :kisa, :detay, :tarih, :konum, :harita, :kapasite, :katilimci, :durum)');
            $stmt->execute([
                'baslik' => $baslik,
                'kisa' => $kisa,
                'detay' => $detay,
                'tarih' => date('Y-m-d H:i:s', strtotime($tarih)),
                'konum' => $konum,
                'harita' => $harita,
                'kapasite' => $kapasite,
                'katilimci' => $katilimci,
                'durum' => 'aktif',
            ]);
            flash('success', 'Etkinlik oluşturuldu.');
            redirect('admin.php');
        }

        if (!$id) {
            throw new RuntimeException('Güncellenecek etkinlik bulunamadı.');
        }

        $stmt = db()->prepare('UPDATE etkinlikler SET baslik = :baslik, kisa_aciklama = :kisa, detay = :detay, etkinlik_tarihi = :tarih, konum = :konum, harita_embed = :harita, kapasite = :kapasite, katilimci_sayisi = :katilimci WHERE id = :id');
        $stmt->execute([
            'id' => $id,
            'baslik' => $baslik,
            'kisa' => $kisa,
            'detay' => $detay,
            'tarih' => date('Y-m-d H:i:s', strtotime($tarih)),
            'konum' => $konum,
            'harita' => $harita,
            'kapasite' => $kapasite,
            'katilimci' => $katilimci,
        ]);
        flash('success', 'Etkinlik güncellendi.');
        redirect('admin.php');
    }

    if ($action === 'toggle_event') {
        if (!$id) {
            throw new RuntimeException('Etkinlik bulunamadı.');
        }

        $stmt = db()->prepare('SELECT durum FROM etkinlikler WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $event = $stmt->fetch();
        if (!$event) {
            throw new RuntimeException('Etkinlik kaydı bulunamadı.');
        }

        $newStatus = $event['durum'] === 'aktif' ? 'pasif' : 'aktif';
        db()->prepare('UPDATE etkinlikler SET durum = :durum WHERE id = :id')->execute(['durum' => $newStatus, 'id' => $id]);
        flash('success', 'Etkinlik durumu güncellendi.');
        redirect('admin.php');
    }

    throw new RuntimeException('Geçersiz işlem.');
} catch (Throwable $hata) {
    flash('error', $hata->getMessage());
    redirect('admin.php');
}
