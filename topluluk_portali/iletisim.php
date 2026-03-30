<?php
declare(strict_types=1);
require __DIR__ . '/functions.php';

$pageTitle = pageTitle('İletişim');
$activePage = 'iletisim';
require __DIR__ . '/partials/header.php';
?>
<section class="hero">
    <div class="eyebrow">İletişim</div>
    <h1>Bize mesaj gönderin.</h1>
    <p>Sorularınızı, iş birliği taleplerinizi veya önerilerinizi güvenli SMTP sistemi üzerinden bize iletin.</p>
</section>

<section class="panel" style="margin-top:24px;">
    <h2 style="margin-top:0;">Mesaj Formu</h2>
    <form action="iletisim_gonder.php" method="post" style="margin-top:18px;display:grid;gap:16px;">
        <input type="hidden" name="csrf_token" value="<?php echo e(csrfToken()); ?>">
        <div class="grid-2">
            <div class="field">
                <label for="ad_soyad">Ad Soyad</label>
                <input type="text" id="ad_soyad" name="ad_soyad" required>
            </div>
            <div class="field">
                <label for="eposta">E-posta</label>
                <input type="email" id="eposta" name="eposta" required>
            </div>
        </div>
        <div class="field">
            <label for="konu">Konu</label>
            <input type="text" id="konu" name="konu" required>
        </div>
        <div class="field">
            <label for="mesaj">Mesaj</label>
            <textarea id="mesaj" name="mesaj" required></textarea>
        </div>
        <button type="submit">Mesajı Gönder</button>
    </form>
</section>

<section class="grid-2" style="margin-top:24px;">
    <article class="panel">
        <h2 style="margin-top:0;">Sosyal Medya</h2>
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:18px;">
            <?php foreach (['instagram' => '#', 'linkedin-in' => '#', 'x-twitter' => '#', 'youtube' => '#'] as $icon => $link): ?>
                <a href="<?php echo e($link); ?>" class="card" style="width:56px;height:56px;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;">
                    <i class="fa-brands fa-<?php echo e($icon); ?>"></i>
                </a>
            <?php endforeach; ?>
        </div>
    </article>
    <article class="panel">
        <h2 style="margin-top:0;">E-posta Adresi</h2>
        <div class="card" style="padding:18px;margin-top:18px;display:flex;align-items:center;gap:12px;">
            <i class="fa-solid fa-envelope" style="color:#7dd3fc;"></i>
            <strong>info@koyuyapayzeka.com</strong>
        </div>
    </article>
</section>
<?php require __DIR__ . '/partials/footer.php'; ?>
