<?php
$durum = $_GET['durum'] ?? '';
$mesaj = $_GET['mesaj'] ?? '';
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Üye Kayıt Formu</title>
    <style>
        :root {
            --bg: #05070a;
            --panel: #0d1117;
            --panel-border: #1f2937;
            --text: #f3f4f6;
            --muted: #9ca3af;
            --accent: #22c55e;
            --accent-hover: #16a34a;
            --danger: #ef4444;
            --input: #111827;
            --shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            background:
                radial-gradient(circle at top, rgba(34, 197, 94, 0.08), transparent 28%),
                linear-gradient(180deg, #06080c 0%, var(--bg) 100%);
            color: var(--text);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 32px 16px;
        }

        .wrapper {
            width: 100%;
            max-width: 1080px;
            display: grid;
            grid-template-columns: 1.05fr 1fr;
            gap: 28px;
        }

        .hero,
        .card {
            background: rgba(13, 17, 23, 0.92);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 26px;
            box-shadow: var(--shadow);
            backdrop-filter: blur(12px);
        }

        .hero {
            padding: 36px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
        }

        .hero::after {
            content: "";
            position: absolute;
            inset: auto -80px -120px auto;
            width: 260px;
            height: 260px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(34, 197, 94, 0.18), transparent 68%);
        }

        .eyebrow {
            color: #86efac;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            margin-bottom: 16px;
        }

        h1 {
            font-size: clamp(30px, 4vw, 48px);
            line-height: 1.08;
            margin: 0 0 16px;
        }

        .hero p {
            margin: 0;
            max-width: 520px;
            color: var(--muted);
            line-height: 1.7;
        }

        .feature-list {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
            margin-top: 36px;
        }

        .feature {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 18px;
            padding: 16px;
        }

        .feature strong {
            display: block;
            margin-bottom: 6px;
            font-size: 15px;
        }

        .feature span {
            color: var(--muted);
            font-size: 14px;
        }

        .card {
            padding: 32px;
        }

        .card h2 {
            margin: 0 0 8px;
            font-size: 28px;
        }

        .card .subtitle {
            margin: 0 0 24px;
            color: var(--muted);
            line-height: 1.6;
        }

        .alert {
            border-radius: 16px;
            padding: 14px 16px;
            margin-bottom: 20px;
            font-size: 14px;
            border: 1px solid transparent;
        }

        .alert.success {
            background: rgba(34, 197, 94, 0.14);
            border-color: rgba(34, 197, 94, 0.35);
            color: #bbf7d0;
        }

        .alert.error {
            background: rgba(239, 68, 68, 0.12);
            border-color: rgba(239, 68, 68, 0.28);
            color: #fecaca;
        }

        form {
            display: grid;
            gap: 18px;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
        }

        .field {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        label,
        .group-title {
            font-size: 14px;
            font-weight: 600;
            color: #e5e7eb;
        }

        input,
        select {
            width: 100%;
            border: 1px solid rgba(255, 255, 255, 0.08);
            background: var(--input);
            color: var(--text);
            border-radius: 14px;
            padding: 14px 15px;
            font-size: 15px;
            outline: none;
            transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }

        input:focus,
        select:focus {
            border-color: rgba(34, 197, 94, 0.7);
            box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.12);
        }

        .checkbox-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
        }

        .checkbox-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 16px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 16px;
        }

        .checkbox-card input[type="checkbox"] {
            width: 18px;
            height: 18px;
            margin: 0;
            accent-color: var(--accent);
        }

        .checkbox-card span {
            color: #d1d5db;
            font-size: 14px;
        }

        button {
            border: 0;
            border-radius: 16px;
            padding: 15px 18px;
            font-size: 15px;
            font-weight: 700;
            color: #04110a;
            background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
            box-shadow: 0 16px 30px rgba(34, 197, 94, 0.22);
        }

        button:hover {
            transform: translateY(-1px);
            filter: brightness(1.03);
            background: linear-gradient(135deg, #5bef8e 0%, var(--accent-hover) 100%);
        }

        .helper {
            margin: 8px 0 0;
            color: var(--muted);
            font-size: 13px;
            line-height: 1.6;
        }

        @media (max-width: 900px) {
            .wrapper,
            .grid,
            .checkbox-grid,
            .feature-list {
                grid-template-columns: 1fr;
            }

            .hero {
                padding: 28px;
            }

            .card {
                padding: 26px;
            }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <section class="hero">
            <div>
                <div class="eyebrow">Üye Kayıt Sistemi</div>
                <h1>Topluluğunuza yeni üyeleri zarif bir arayüzle ekleyin.</h1>
                <p>
                    Modern karanlık temalı bu form; üye bilgilerini düzenli şekilde toplar,
                    seçilen ekipleri kaydeder ve tüm verileri Excel ile açılabilir CSV dosyasına yazar.
                </p>
            </div>

            <div class="feature-list">
                <div class="feature">
                    <strong>Dark UI</strong>
                    <span>Koyu zemin, antrasit kartlar ve yumuşak vurgu tonları.</span>
                </div>
                <div class="feature">
                    <strong>CSV Kayıt</strong>
                    <span>Her gönderim `uyeler.csv` içine yeni satır olarak eklenir.</span>
                </div>
                <div class="feature">
                    <strong>Excel Uyumlu</strong>
                    <span>UTF-8 BOM sayesinde Türkçe karakterler bozulmaz.</span>
                </div>
                <div class="feature">
                    <strong>Ekip Seçimi</strong>
                    <span>Birden fazla ekip checkbox ile kolayca seçilebilir.</span>
                </div>
            </div>
        </section>

        <section class="card">
            <h2>Üye Başvuru Formu</h2>
            <p class="subtitle">Aşağıdaki alanları doldurarak yeni üyeyi sisteme kaydedebilirsiniz.</p>

            <?php if ($durum === 'basarili'): ?>
                <div class="alert success">Kayıt başarıyla tamamlandı. Yeni üye CSV dosyasına eklendi.</div>
            <?php elseif ($durum === 'hata'): ?>
                <div class="alert error"><?php echo htmlspecialchars($mesaj ?: 'Kayıt sırasında bir hata oluştu.', ENT_QUOTES, 'UTF-8'); ?></div>
            <?php endif; ?>

            <form action="kaydet.php" method="post">
                <div class="grid">
                    <div class="field">
                        <label for="ad_soyad">Ad Soyad</label>
                        <input type="text" id="ad_soyad" name="ad_soyad" placeholder="Örnek: Ayşe Yılmaz" required>
                    </div>
                    <div class="field">
                        <label for="eposta">E-posta</label>
                        <input type="email" id="eposta" name="eposta" placeholder="ornek@mail.com" required>
                    </div>
                </div>

                <div class="grid">
                    <div class="field">
                        <label for="telefon">Telefon</label>
                        <input type="tel" id="telefon" name="telefon" placeholder="05xx xxx xx xx" required>
                    </div>
                    <div class="field">
                        <label for="bolum">Bölüm</label>
                        <input type="text" id="bolum" name="bolum" placeholder="Örnek: Bilgisayar Mühendisliği" required>
                    </div>
                </div>

                <div class="field">
                    <label for="sinif">Sınıf</label>
                    <select id="sinif" name="sinif" required>
                        <option value="">Sınıf seçiniz</option>
                        <option value="Hazırlık">Hazırlık</option>
                        <option value="1. Sınıf">1. Sınıf</option>
                        <option value="2. Sınıf">2. Sınıf</option>
                        <option value="3. Sınıf">3. Sınıf</option>
                        <option value="4. Sınıf">4. Sınıf</option>
                        <option value="Yüksek Lisans">Yüksek Lisans</option>
                        <option value="Mezun">Mezun</option>
                    </select>
                </div>

                <div class="field">
                    <div class="group-title">Ekipler</div>
                    <div class="checkbox-grid">
                        <label class="checkbox-card">
                            <input type="checkbox" name="ekipler[]" value="Üye Yönetimi">
                            <span>Üye Yönetimi</span>
                        </label>
                        <label class="checkbox-card">
                            <input type="checkbox" name="ekipler[]" value="Sosyal Medya">
                            <span>Sosyal Medya</span>
                        </label>
                        <label class="checkbox-card">
                            <input type="checkbox" name="ekipler[]" value="Etkinlik">
                            <span>Etkinlik</span>
                        </label>
                        <label class="checkbox-card">
                            <input type="checkbox" name="ekipler[]" value="Sponsorluk">
                            <span>Sponsorluk</span>
                        </label>
                    </div>
                    <p class="helper">Birden fazla ekip seçilebilir. En az bir ekip seçmeniz önerilir.</p>
                </div>

                <button type="submit">Kaydı Tamamla</button>
            </form>
        </section>
    </div>
</body>
</html>
