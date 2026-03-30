<?php
declare(strict_types=1);
require __DIR__ . '/functions.php';

$pageTitle = pageTitle('Ekibimiz');
$activePage = 'ekibimiz';
$uyeler = [];

try {
    $uyeler = db()->query('SELECT * FROM ekip_uyeleri ORDER BY id DESC')->fetchAll();
} catch (Throwable $hata) {
}

require __DIR__ . '/partials/header.php';
?>
<section class="hero">
    <div class="eyebrow">Ekibimiz</div>
    <h1>Neon dokunuşlarla öne çıkan güçlü ekip vitrini.</h1>
    <p>Her kart, hover anında parlak mavi ışık etkisiyle canlanır ve takım kimliğini daha güçlü bir şekilde yansıtır.</p>
</section>

<section class="grid-3" style="margin-top:28px;">
    <?php foreach ($uyeler as $uye): ?>
        <article class="card" style="overflow:hidden;transition:transform .25s ease, box-shadow .25s ease, border-color .25s ease;">
            <img src="<?php echo e(UPLOAD_WEB_PATH . $uye['fotograf']); ?>" alt="<?php echo e($uye['ad_soyad']); ?>" style="width:100%;aspect-ratio:1/1.08;object-fit:cover;display:block;">
            <div style="padding:20px;">
                <h2 style="margin:0 0 8px;font-size:24px;"><?php echo e($uye['ad_soyad']); ?></h2>
                <div style="color:#7dd3fc;margin-bottom:16px;"><?php echo e($uye['gorev']); ?></div>
                <div style="display:flex;gap:10px;">
                    <?php if (!empty($uye['instagram'])): ?><a href="<?php echo e($uye['instagram']); ?>" target="_blank" rel="noopener noreferrer" class="card" style="width:42px;height:42px;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;"><i class="fa-brands fa-instagram"></i></a><?php endif; ?>
                    <?php if (!empty($uye['linkedin'])): ?><a href="<?php echo e($uye['linkedin']); ?>" target="_blank" rel="noopener noreferrer" class="card" style="width:42px;height:42px;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;"><i class="fa-brands fa-linkedin-in"></i></a><?php endif; ?>
                    <?php if (!empty($uye['twitter'])): ?><a href="<?php echo e($uye['twitter']); ?>" target="_blank" rel="noopener noreferrer" class="card" style="width:42px;height:42px;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;"><i class="fa-brands fa-x-twitter"></i></a><?php endif; ?>
                </div>
            </div>
        </article>
    <?php endforeach; ?>
    <?php if (!$uyeler): ?>
        <div class="panel helper">Henüz ekip üyesi bulunmuyor.</div>
    <?php endif; ?>
</section>

<style>
    article.card:hover {
        transform: translateY(-8px);
        border-color: rgba(0,123,255,0.72) !important;
        box-shadow: 0 0 0 1px rgba(0,123,255,0.18), 0 0 30px rgba(0,123,255,0.24), 0 24px 60px rgba(0,0,0,0.42) !important;
    }
</style>
<?php require __DIR__ . '/partials/footer.php'; ?>
