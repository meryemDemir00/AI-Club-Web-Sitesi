<?php
declare(strict_types=1);
require __DIR__ . '/functions.php';

$pageTitle = pageTitle('Üye Ol');
$activePage = 'uye-ol';
require __DIR__ . '/partials/header.php';
?>
<section class="hero">
    <div class="eyebrow">Üye Başvurusu</div>
    <h1>Topluluğumuza katılın.</h1>
    <p>Bilgilerinizi bırakın; başvurunuz güvenli şekilde veritabanına ve Excel uyumlu CSV dosyasına kaydedilsin.</p>
</section>

<section class="grid-2" style="margin-top: 24px;">
    <article class="panel">
        <h2 style="margin-top:0;">Başvuru Formu</h2>
        <form action="basvuru_kaydet.php" method="post" style="margin-top:18px;display:grid;gap:16px;">
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
            <div class="grid-2">
                <div class="field">
                    <label for="telefon">Telefon</label>
                    <input type="tel" id="telefon" name="telefon" required>
                </div>
                <div class="field">
                    <label for="bolum">Bölüm</label>
                    <input type="text" id="bolum" name="bolum" required>
                </div>
            </div>
            <div class="field">
                <label for="sinif">Sınıf</label>
                <select id="sinif" name="sinif" required>
                    <option value="">Seçiniz</option>
                    <option>Hazırlık</option>
                    <option>1. Sınıf</option>
                    <option>2. Sınıf</option>
                    <option>3. Sınıf</option>
                    <option>4. Sınıf</option>
                    <option>Yüksek Lisans</option>
                    <option>Mezun</option>
                </select>
            </div>
            <div class="field">
                <label>Ekipler</label>
                <div class="grid-2">
                    <?php foreach (['Üye Yönetimi', 'Sosyal Medya', 'Etkinlik', 'Sponsorluk'] as $ekip): ?>
                        <label class="card" style="padding:14px 16px;display:flex;align-items:center;gap:12px;">
                            <input type="checkbox" name="ekipler[]" value="<?php echo e($ekip); ?>" style="width:18px;height:18px;">
                            <span><?php echo e($ekip); ?></span>
                        </label>
                    <?php endforeach; ?>
                </div>
            </div>
            <button type="submit">Başvuruyu Gönder</button>
        </form>
    </article>
    <article class="panel">
        <h2 style="margin-top:0;">Süreç Nasıl İşliyor?</h2>
        <div style="display:grid;gap:16px;margin-top:18px;">
            <div class="card" style="padding:18px;"><strong>1. Başvuru alınır</strong><div class="helper">Form verileri güvenli şekilde doğrulanır.</div></div>
            <div class="card" style="padding:18px;"><strong>2. Çift kayıt yapılır</strong><div class="helper">MySQL ve `basvurular.csv` eş zamanlı güncellenir.</div></div>
            <div class="card" style="padding:18px;"><strong>3. Panelde izlenir</strong><div class="helper">Admin panelinden tüm başvurular listelenir.</div></div>
        </div>
    </article>
</section>
<?php require __DIR__ . '/partials/footer.php'; ?>
