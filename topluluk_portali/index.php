<?php
declare(strict_types=1);
require __DIR__ . '/functions.php';

$pageTitle = pageTitle('Topluluk Yönetim Portalı');
$activePage = 'home';

$uyeler = [];
$etkinlikler = [];

try {
    $uyeler = db()->query('SELECT * FROM ekip_uyeleri ORDER BY id DESC LIMIT 3')->fetchAll();
    $etkinlikler = db()->query("SELECT * FROM etkinlikler WHERE durum = 'aktif' ORDER BY etkinlik_tarihi ASC LIMIT 3")->fetchAll();
} catch (Throwable $hata) {
}

require __DIR__ . '/partials/header.php';
?>
<section class="hero">
    <div class="eyebrow">Merkezi Portal</div>
    <h1>Topluluğunuzu tek merkezden yönetin, büyütün ve görünür kılın.</h1>
    <p>Üye başvuruları, iletişim talepleri, ekip vitrini ve etkinlik akışını modern bir karanlık temada bir araya getiren bütünleşik yönetim sistemi.</p>
</section>

<section class="grid-3" style="margin-top: 28px;">
    <article class="panel">
        <h2>Üye Başvuruları</h2>
        <p class="helper">Başvuruları hem MySQL veritabanına hem de Excel uyumlu CSV dosyasına kaydedin.</p>
        <a class="button" href="uye-ol.php">Üye Ol Sayfası</a>
    </article>
    <article class="panel">
        <h2>İletişim Merkezi</h2>
        <p class="helper">PHPMailer tabanlı SMTP sistemi ile mesajları doğrudan e-posta kutunuza alın.</p>
        <a class="button" href="iletisim.php">İletişim Sayfası</a>
    </article>
    <article class="panel">
        <h2>Admin Dashboard</h2>
        <p class="helper">Ekip üyelerini, etkinlik durumlarını ve başvuru listesini tek panelden yönetin.</p>
        <a class="button" href="login.php">Panele Git</a>
    </article>
</section>

<section style="margin-top: 34px;" class="grid-2">
    <article class="panel">
        <h2 style="margin-top:0;">Öne Çıkan Ekip</h2>
        <div class="grid-3" style="margin-top:18px;">
            <?php foreach ($uyeler as $uye): ?>
                <div class="card" style="overflow:hidden;">
                    <img src="<?php echo e(UPLOAD_WEB_PATH . $uye['fotograf']); ?>" alt="<?php echo e($uye['ad_soyad']); ?>" style="width:100%;aspect-ratio:1/1.1;object-fit:cover;display:block;">
                    <div style="padding:16px;">
                        <strong style="display:block;font-size:20px;"><?php echo e($uye['ad_soyad']); ?></strong>
                        <span class="helper"><?php echo e($uye['gorev']); ?></span>
                    </div>
                </div>
            <?php endforeach; ?>
            <?php if (!$uyeler): ?>
                <div class="helper">Henüz ekip üyesi eklenmemiş.</div>
            <?php endif; ?>
        </div>
    </article>
    <article class="panel">
        <h2 style="margin-top:0;">Yaklaşan Etkinlikler</h2>
        <div style="display:grid;gap:16px;margin-top:18px;">
            <?php foreach ($etkinlikler as $etkinlik): ?>
                <div class="card" style="padding:18px;">
                    <strong style="display:block;font-size:20px;"><?php echo e($etkinlik['baslik']); ?></strong>
                    <div class="helper" style="margin-top:8px;"><?php echo e($etkinlik['kisa_aciklama']); ?></div>
                    <div style="margin-top:12px;color:#7dd3fc;"><?php echo e(date('d.m.Y H:i', strtotime((string) $etkinlik['etkinlik_tarihi']))); ?></div>
                </div>
            <?php endforeach; ?>
            <?php if (!$etkinlikler): ?>
                <div class="helper">Aktif etkinlik bulunmuyor.</div>
            <?php endif; ?>
        </div>
    </article>
</section>
<?php require __DIR__ . '/partials/footer.php'; ?>
