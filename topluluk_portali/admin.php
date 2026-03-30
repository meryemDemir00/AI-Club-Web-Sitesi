<?php
declare(strict_types=1);
require __DIR__ . '/functions.php';
requireAdmin();

if (isset($_GET['logout'])) {
    session_unset();
    session_destroy();
    session_start();
    flash('success', 'Güvenli şekilde çıkış yapıldı.');
    redirect('login.php');
}

$teamMembers = [];
$events = [];
$applications = [];
$editingMember = null;
$editingEvent = null;

try {
    $teamMembers = db()->query('SELECT * FROM ekip_uyeleri ORDER BY id DESC')->fetchAll();
    $events = db()->query('SELECT * FROM etkinlikler ORDER BY etkinlik_tarihi DESC, id DESC')->fetchAll();
    $applications = db()->query('SELECT * FROM basvurular ORDER BY created_at DESC, id DESC')->fetchAll();

    $editMemberId = filter_input(INPUT_GET, 'edit_member', FILTER_VALIDATE_INT);
    if ($editMemberId) {
        $stmt = db()->prepare('SELECT * FROM ekip_uyeleri WHERE id = :id');
        $stmt->execute(['id' => $editMemberId]);
        $editingMember = $stmt->fetch() ?: null;
    }

    $editEventId = filter_input(INPUT_GET, 'edit_event', FILTER_VALIDATE_INT);
    if ($editEventId) {
        $stmt = db()->prepare('SELECT * FROM etkinlikler WHERE id = :id');
        $stmt->execute(['id' => $editEventId]);
        $editingEvent = $stmt->fetch() ?: null;
    }
} catch (Throwable $hata) {
    flash('error', 'Panel verileri yüklenemedi: ' . $hata->getMessage());
    redirect('login.php');
}

$pageTitle = pageTitle('Admin Paneli');
$activePage = 'admin';
require __DIR__ . '/partials/header.php';
?>
<section class="hero">
    <div class="eyebrow">Dashboard</div>
    <h1>Topluluk yönetimini tek panelden sürdürün.</h1>
    <p>Ekip üyelerini yönetin, etkinlikleri aktif veya pasif yapın ve gelen başvuruları merkezi olarak takip edin.</p>
</section>

<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:18px;">
    <a class="button secondary" href="index.php">Siteyi Gör</a>
    <a class="button secondary" href="admin.php?logout=1">Çıkış Yap</a>
</div>

<section class="grid-2" style="margin-top:28px;align-items:start;">
    <article class="panel">
        <h2 style="margin-top:0;"><?php echo $editingMember ? 'Ekip Üyesini Güncelle' : 'Yeni Ekip Üyesi'; ?></h2>
        <form action="admin_actions.php" method="post" enctype="multipart/form-data" style="display:grid;gap:14px;margin-top:18px;">
            <input type="hidden" name="csrf_token" value="<?php echo e(csrfToken()); ?>">
            <input type="hidden" name="action" value="<?php echo $editingMember ? 'update_member' : 'create_member'; ?>">
            <input type="hidden" name="id" value="<?php echo e((string) ($editingMember['id'] ?? '')); ?>">
            <div class="field"><label>Ad Soyad</label><input type="text" name="ad_soyad" value="<?php echo e((string) ($editingMember['ad_soyad'] ?? '')); ?>" required></div>
            <div class="field"><label>Görev / Unvan</label><input type="text" name="gorev" value="<?php echo e((string) ($editingMember['gorev'] ?? '')); ?>" required></div>
            <div class="field"><label>Fotoğraf</label><input type="file" name="fotograf" accept=".jpg,.jpeg,.png" <?php echo $editingMember ? '' : 'required'; ?>></div>
            <div class="field"><label>Instagram</label><input type="url" name="instagram" value="<?php echo e((string) ($editingMember['instagram'] ?? '')); ?>"></div>
            <div class="field"><label>LinkedIn</label><input type="url" name="linkedin" value="<?php echo e((string) ($editingMember['linkedin'] ?? '')); ?>"></div>
            <div class="field"><label>X / Twitter</label><input type="url" name="twitter" value="<?php echo e((string) ($editingMember['twitter'] ?? '')); ?>"></div>
            <button type="submit"><?php echo $editingMember ? 'Üyeyi Güncelle' : 'Üyeyi Kaydet'; ?></button>
        </form>
    </article>

    <article class="panel">
        <h2 style="margin-top:0;"><?php echo $editingEvent ? 'Etkinliği Güncelle' : 'Yeni Etkinlik'; ?></h2>
        <form action="admin_actions.php" method="post" style="display:grid;gap:14px;margin-top:18px;">
            <input type="hidden" name="csrf_token" value="<?php echo e(csrfToken()); ?>">
            <input type="hidden" name="action" value="<?php echo $editingEvent ? 'update_event' : 'create_event'; ?>">
            <input type="hidden" name="id" value="<?php echo e((string) ($editingEvent['id'] ?? '')); ?>">
            <div class="field"><label>Başlık</label><input type="text" name="baslik" value="<?php echo e((string) ($editingEvent['baslik'] ?? '')); ?>" required></div>
            <div class="field"><label>Kısa Açıklama</label><input type="text" name="kisa_aciklama" value="<?php echo e((string) ($editingEvent['kisa_aciklama'] ?? '')); ?>" required></div>
            <div class="field"><label>Detay</label><textarea name="detay" required><?php echo e((string) ($editingEvent['detay'] ?? '')); ?></textarea></div>
            <div class="grid-2">
                <div class="field"><label>Tarih</label><input type="datetime-local" name="etkinlik_tarihi" value="<?php echo !empty($editingEvent['etkinlik_tarihi']) ? e(date('Y-m-d\TH:i', strtotime((string) $editingEvent['etkinlik_tarihi']))) : ''; ?>" required></div>
                <div class="field"><label>Konum</label><input type="text" name="konum" value="<?php echo e((string) ($editingEvent['konum'] ?? '')); ?>" required></div>
            </div>
            <div class="grid-2">
                <div class="field"><label>Kapasite</label><input type="number" min="1" name="kapasite" value="<?php echo e((string) ($editingEvent['kapasite'] ?? '50')); ?>" required></div>
                <div class="field"><label>Katılımcı Sayısı</label><input type="number" min="0" name="katilimci_sayisi" value="<?php echo e((string) ($editingEvent['katilimci_sayisi'] ?? '0')); ?>" required></div>
            </div>
            <div class="field"><label>Google Haritalar Embed URL</label><input type="url" name="harita_embed" value="<?php echo e((string) ($editingEvent['harita_embed'] ?? '')); ?>" required></div>
            <button type="submit"><?php echo $editingEvent ? 'Etkinliği Güncelle' : 'Etkinliği Kaydet'; ?></button>
        </form>
    </article>
</section>

<section class="panel" style="margin-top:24px;">
    <h2 style="margin-top:0;">Ekip Yönetimi</h2>
    <div style="overflow:auto;margin-top:18px;">
        <table style="width:100%;border-collapse:collapse;">
            <thead>
                <tr>
                    <th style="text-align:left;padding:12px;">Fotoğraf</th>
                    <th style="text-align:left;padding:12px;">Ad Soyad</th>
                    <th style="text-align:left;padding:12px;">Görev</th>
                    <th style="text-align:left;padding:12px;">İşlem</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($teamMembers as $member): ?>
                    <tr>
                        <td style="padding:12px;"><img src="<?php echo e(UPLOAD_WEB_PATH . $member['fotograf']); ?>" alt="" style="width:68px;height:68px;object-fit:cover;border-radius:16px;"></td>
                        <td style="padding:12px;"><?php echo e($member['ad_soyad']); ?></td>
                        <td style="padding:12px;"><?php echo e($member['gorev']); ?></td>
                        <td style="padding:12px;">
                            <div style="display:flex;gap:10px;flex-wrap:wrap;">
                                <a class="button secondary" href="admin.php?edit_member=<?php echo e((string) $member['id']); ?>">Düzenle</a>
                                <form action="admin_actions.php" method="post">
                                    <input type="hidden" name="csrf_token" value="<?php echo e(csrfToken()); ?>">
                                    <input type="hidden" name="action" value="delete_member">
                                    <input type="hidden" name="id" value="<?php echo e((string) $member['id']); ?>">
                                    <button type="submit">Sil</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</section>

<section class="panel" style="margin-top:24px;">
    <h2 style="margin-top:0;">Etkinlik Yönetimi</h2>
    <div style="overflow:auto;margin-top:18px;">
        <table style="width:100%;border-collapse:collapse;">
            <thead>
                <tr>
                    <th style="text-align:left;padding:12px;">Başlık</th>
                    <th style="text-align:left;padding:12px;">Tarih</th>
                    <th style="text-align:left;padding:12px;">Durum</th>
                    <th style="text-align:left;padding:12px;">İşlem</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($events as $event): ?>
                    <tr>
                        <td style="padding:12px;"><?php echo e($event['baslik']); ?></td>
                        <td style="padding:12px;"><?php echo e(date('d.m.Y H:i', strtotime((string) $event['etkinlik_tarihi']))); ?></td>
                        <td style="padding:12px;"><span class="card" style="padding:8px 12px;display:inline-flex;"><?php echo e(ucfirst((string) $event['durum'])); ?></span></td>
                        <td style="padding:12px;">
                            <div style="display:flex;gap:10px;flex-wrap:wrap;">
                                <a class="button secondary" href="admin.php?edit_event=<?php echo e((string) $event['id']); ?>">Düzenle</a>
                                <form action="admin_actions.php" method="post">
                                    <input type="hidden" name="csrf_token" value="<?php echo e(csrfToken()); ?>">
                                    <input type="hidden" name="action" value="toggle_event">
                                    <input type="hidden" name="id" value="<?php echo e((string) $event['id']); ?>">
                                    <button type="submit"><?php echo $event['durum'] === 'aktif' ? 'Pasif Yap' : 'Aktif Yap'; ?></button>
                                </form>
                            </div>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</section>

<section class="panel" style="margin-top:24px;">
    <h2 style="margin-top:0;">Başvuru İzleme</h2>
    <div style="overflow:auto;margin-top:18px;">
        <table style="width:100%;border-collapse:collapse;">
            <thead>
                <tr>
                    <th style="text-align:left;padding:12px;">Ad Soyad</th>
                    <th style="text-align:left;padding:12px;">E-posta</th>
                    <th style="text-align:left;padding:12px;">Telefon</th>
                    <th style="text-align:left;padding:12px;">Bölüm</th>
                    <th style="text-align:left;padding:12px;">Sınıf</th>
                    <th style="text-align:left;padding:12px;">Ekipler</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($applications as $application): ?>
                    <tr>
                        <td style="padding:12px;"><?php echo e($application['ad_soyad']); ?></td>
                        <td style="padding:12px;"><?php echo e($application['eposta']); ?></td>
                        <td style="padding:12px;"><?php echo e($application['telefon']); ?></td>
                        <td style="padding:12px;"><?php echo e($application['bolum']); ?></td>
                        <td style="padding:12px;"><?php echo e($application['sinif']); ?></td>
                        <td style="padding:12px;"><?php echo e($application['ekipler']); ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</section>
<?php require __DIR__ . '/partials/footer.php'; ?>
