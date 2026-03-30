<?php
declare(strict_types=1);
require __DIR__ . '/functions.php';

$pageTitle = pageTitle('Etkinlikler');
$activePage = 'etkinlikler';
$etkinlikler = [];

try {
    $stmt = db()->query("SELECT * FROM etkinlikler WHERE durum = 'aktif' ORDER BY etkinlik_tarihi ASC");
    $etkinlikler = $stmt->fetchAll();
} catch (Throwable $hata) {
}

require __DIR__ . '/partials/header.php';
?>
<section class="hero">
    <div class="eyebrow">Etkinlikler</div>
    <h1>Katılımı yüksek, detayları güçlü etkinlik deneyimi.</h1>
    <p>Etkinlik kartlarından detayları açın; modal içinde açıklama, Google Haritalar konumu ve doluluk oranını tek bakışta görün.</p>
</section>

<section class="grid-3" style="margin-top:28px;">
    <?php foreach ($etkinlikler as $etkinlik): ?>
        <?php
        $kapasite = max(1, (int) $etkinlik['kapasite']);
        $katilimci = max(0, (int) $etkinlik['katilimci_sayisi']);
        $oran = min(100, (int) round(($katilimci / $kapasite) * 100));
        ?>
        <article class="panel">
            <div style="display:flex;justify-content:space-between;gap:14px;align-items:flex-start;">
                <div>
                    <h2 style="margin:0 0 10px;"><?php echo e($etkinlik['baslik']); ?></h2>
                    <div class="helper"><?php echo e($etkinlik['kisa_aciklama']); ?></div>
                </div>
                <span class="card" style="padding:8px 12px;color:#7dd3fc;"><?php echo e(date('d.m.Y', strtotime((string) $etkinlik['etkinlik_tarihi']))); ?></span>
            </div>
            <div style="margin-top:18px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;" class="helper">
                    <span>Doluluk Oranı</span>
                    <span>%<?php echo e((string) $oran); ?></span>
                </div>
                <div style="height:12px;background:#0b1220;border-radius:999px;overflow:hidden;border:1px solid rgba(255,255,255,.06);">
                    <div style="height:100%;width:<?php echo e((string) $oran); ?>%;background:linear-gradient(90deg,#1d9bf0,#007bff);"></div>
                </div>
            </div>
            <button
                type="button"
                class="open-modal"
                data-title="<?php echo e($etkinlik['baslik']); ?>"
                data-description="<?php echo e($etkinlik['detay']); ?>"
                data-location="<?php echo e($etkinlik['konum']); ?>"
                data-date="<?php echo e(date('d.m.Y H:i', strtotime((string) $etkinlik['etkinlik_tarihi']))); ?>"
                data-map="<?php echo e($etkinlik['harita_embed']); ?>"
                style="margin-top:18px;"
            >Detayları Görüntüle</button>
        </article>
    <?php endforeach; ?>
    <?php if (!$etkinlikler): ?>
        <div class="panel helper">Aktif etkinlik bulunmuyor.</div>
    <?php endif; ?>
</section>

<div id="eventModal" style="position:fixed;inset:0;background:rgba(0,0,0,.72);display:none;align-items:center;justify-content:center;padding:18px;z-index:90;">
    <div class="panel" style="width:min(980px,100%);max-height:90vh;overflow:auto;position:relative;">
        <button type="button" id="closeModal" class="button secondary" style="position:absolute;right:18px;top:18px;">Kapat</button>
        <div class="grid-2" style="margin-top:30px;">
            <div>
                <div class="eyebrow">Etkinlik Detayı</div>
                <h2 id="modalTitle" style="margin:0 0 12px;"></h2>
                <div class="helper" id="modalDate"></div>
                <div class="helper" id="modalLocation" style="margin-top:8px;"></div>
                <p id="modalDescription" style="line-height:1.8;"></p>
            </div>
            <div class="card" style="overflow:hidden;min-height:340px;">
                <iframe id="modalMap" src="" style="border:0;width:100%;height:100%;min-height:340px;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </div>
    </div>
</div>

<script>
const modal = document.getElementById('eventModal');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalLocation = document.getElementById('modalLocation');
const modalDescription = document.getElementById('modalDescription');
const modalMap = document.getElementById('modalMap');

document.querySelectorAll('.open-modal').forEach((button) => {
    button.addEventListener('click', () => {
        modalTitle.textContent = button.dataset.title || '';
        modalDate.textContent = button.dataset.date || '';
        modalLocation.textContent = button.dataset.location || '';
        modalDescription.textContent = button.dataset.description || '';
        modalMap.src = button.dataset.map || '';
        modal.style.display = 'flex';
    });
});

document.getElementById('closeModal').addEventListener('click', () => {
    modal.style.display = 'none';
    modalMap.src = '';
});

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        modalMap.src = '';
    }
});
</script>
<?php require __DIR__ . '/partials/footer.php'; ?>
